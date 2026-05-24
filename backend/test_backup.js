import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import User from './src/models/User.js';
import News from './src/models/News.js';
import Newspaper from './src/models/Newspaper.js';
import Page from './src/models/Page.js';
import { exportData, importData } from './src/controllers/backupController.js';

dotenv.config();

// Helper to simulate Express req/res cycle
const makeMockRes = () => {
  const res = {
    statusCode: 200,
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(obj) {
      this.data = obj;
      return this;
    }
  };
  return res;
};

async function runTests() {
  await connectDB();
  console.log('Connected to Database.');

  // 1. Export plain backup
  console.log('\n--- Test 1: Plain Export ---');
  const exportReqPlain = { body: { encrypt: false } };
  const exportResPlain = makeMockRes();
  await exportData(exportReqPlain, exportResPlain);

  if (exportResPlain.statusCode !== 200 || !exportResPlain.data.success) {
    throw new Error(`Plain export failed: ${JSON.stringify(exportResPlain.data)}`);
  }
  const plainBackup = exportResPlain.data.backup;
  console.log('Plain export succeeded. Encrypted status:', plainBackup.encrypted);

  // 2. Export encrypted backup
  console.log('\n--- Test 2: Encrypted Export ---');
  const password = 'test-secret-password';
  const exportReqEncrypted = { body: { encrypt: true, password } };
  const exportResEncrypted = makeMockRes();
  await exportData(exportReqEncrypted, exportResEncrypted);

  if (exportResEncrypted.statusCode !== 200 || !exportResEncrypted.data.success) {
    throw new Error(`Encrypted export failed: ${JSON.stringify(exportResEncrypted.data)}`);
  }
  const encryptedBackup = exportResEncrypted.data.backup;
  console.log('Encrypted export succeeded. Encrypted status:', encryptedBackup.encrypted);

  // 3. Test Decryption Failure with wrong password
  console.log('\n--- Test 3: Import Decryption Failure ---');
  const importReqFail = { 
    body: { 
      backup: encryptedBackup, 
      password: 'wrong-password-123',
      mode: 'merge'
    } 
  };
  const importResFail = makeMockRes();
  await importData(importReqFail, importResFail);

  if (importResFail.statusCode === 200) {
    throw new Error('Expected import decryption to fail, but it succeeded.');
  }
  console.log('Successfully caught decryption failure as expected:', importResFail.data.error);

  // 4. Test Decryption Success and Import in Merge Mode
  console.log('\n--- Test 4: Decrypt & Import (Merge Mode) ---');
  const importReqSuccess = {
    body: {
      backup: encryptedBackup,
      password: password,
      mode: 'merge'
    }
  };
  const importResSuccess = makeMockRes();
  await importData(importReqSuccess, importResSuccess);

  if (importResSuccess.statusCode !== 200 || !importResSuccess.data.success) {
    throw new Error(`Encrypted import failed: ${JSON.stringify(importResSuccess.data)}`);
  }
  console.log('Encrypted import succeeded. Stats:', JSON.stringify(importResSuccess.data.stats));

  // Verify that subsequent merge update counts as updated
  console.log('\n--- Test 5: Merge Second Run (Verify Updated counts) ---');
  const importReqMerge2 = {
    body: {
      backup: plainBackup,
      mode: 'merge'
    }
  };
  const importResMerge2 = makeMockRes();
  await importData(importReqMerge2, importResMerge2);

  if (importResMerge2.statusCode !== 200 || !importResMerge2.data.success) {
    throw new Error(`Merge second run failed: ${JSON.stringify(importResMerge2.data)}`);
  }
  console.log('Merge second run stats:', JSON.stringify(importResMerge2.data.stats));
  
  // Verify that we have some updated items
  const stats = importResMerge2.data.stats;
  const totalUpdated = stats.news.updated + stats.newspapers.updated + stats.pages.updated + stats.users.updated;
  if (totalUpdated === 0) {
    console.warn('Warning: No documents were updated on the merge run. Make sure your DB isn\'t completely empty.');
  } else {
    console.log(`Success: Correctly tracked ${totalUpdated} updated records during merge.`);
  }

  // 6. Test Import in Overwrite Mode
  console.log('\n--- Test 6: Overwrite Import ---');
  const importReqOverwrite = {
    body: {
      backup: plainBackup,
      mode: 'overwrite'
    }
  };
  const importResOverwrite = makeMockRes();
  await importData(importReqOverwrite, importResOverwrite);

  if (importResOverwrite.statusCode !== 200 || !importResOverwrite.data.success) {
    throw new Error(`Overwrite import failed: ${JSON.stringify(importResOverwrite.data)}`);
  }
  console.log('Overwrite import succeeded. Stats:', JSON.stringify(importResOverwrite.data.stats));

  console.log('\n======================================');
  console.log('ALL INTEGRATION TESTS PASSED SUCCESSFULLY!');
  console.log('======================================');

  await mongoose.disconnect();
}

runTests().catch(async (err) => {
  console.error('\nTest execution failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
