import News from '../models/News.js';
import Newspaper from '../models/Newspaper.js';
import Page from '../models/Page.js';
import User from '../models/User.js';
import crypto from 'crypto';

// Helper function to encrypt text using AES-256-CBC
const encryptData = (dataString, password) => {
  const salt = crypto.randomBytes(16);
  // Derive 256-bit key from password
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(dataString, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    encrypted: true,
    salt: salt.toString('hex'),
    iv: iv.toString('hex'),
    ciphertext: encrypted
  };
};

// Helper function to decrypt text using AES-256-CBC
const decryptData = (encryptedObj, password) => {
  try {
    const salt = Buffer.from(encryptedObj.salt, 'hex');
    const iv = Buffer.from(encryptedObj.iv, 'hex');
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedObj.ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  } catch (error) {
    throw new Error('Failed to decrypt: Invalid password or tampered data.');
  }
};

// @desc    Export news, newspapers, pages, and users data
// @route   POST /api/backup/export
// @access  Private (Admin only)
export const exportData = async (req, res) => {
  try {
    const { password, encrypt } = req.body;

    // Fetch all records
    const news = await News.find({});
    const newspapers = await Newspaper.find({});
    const pages = await Page.find({});
    const users = await User.find({}).select('+password');

    const backupPayload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: {
        news,
        newspapers,
        pages,
        users
      }
    };

    const payloadString = JSON.stringify(backupPayload);

    if (encrypt && password) {
      if (password.length < 6) {
        return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
      }
      const encryptedBackup = encryptData(payloadString, password);
      encryptedBackup.exportedAt = backupPayload.exportedAt;
      return res.status(200).json({ success: true, backup: encryptedBackup });
    }

    // Return plain backup (still requires authenticated Admin session)
    return res.status(200).json({ 
      success: true, 
      backup: {
        encrypted: false,
        ...backupPayload
      } 
    });
  } catch (error) {
    console.error('Export Error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error during export' });
  }
};

// @desc    Import news, newspapers, pages, and users data
// @route   POST /api/backup/import
// @access  Private (Admin only)
export const importData = async (req, res) => {
  try {
    const { backup, password, mode } = req.body; // mode can be 'overwrite' or 'merge'

    if (!backup) {
      return res.status(400).json({ success: false, error: 'No backup data provided' });
    }

    // Ensure we are working with plain JS objects, resolving any Mongoose instance issues in tests/mocks
    const cleanBackupInput = JSON.parse(JSON.stringify(backup));

    let parsedBackup;

    // Handle decryption if encrypted
    if (cleanBackupInput.encrypted) {
      if (!password) {
        return res.status(400).json({ success: false, error: 'Password is required to decrypt this backup file' });
      }
      try {
        parsedBackup = decryptData(cleanBackupInput, password);
      } catch (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
    } else {
      parsedBackup = cleanBackupInput;
    }

    // Validate backup structure
    if (!parsedBackup.data || !parsedBackup.data.news || !parsedBackup.data.newspapers || !parsedBackup.data.pages) {
      return res.status(400).json({ success: false, error: 'Invalid backup file structure' });
    }

    const { news, newspapers, pages, users } = parsedBackup.data;

    let importStats = {
      news: { inserted: 0, updated: 0 },
      newspapers: { inserted: 0, updated: 0 },
      pages: { inserted: 0, updated: 0 },
      users: { inserted: 0, updated: 0 }
    };

    if (mode === 'overwrite') {
      // OVERWRITE MODE: Clear collections and insert new data
      
      // News
      await News.deleteMany({});
      if (news && news.length > 0) {
        await News.insertMany(news);
        importStats.news.inserted = news.length;
      }

      // Newspapers
      await Newspaper.deleteMany({});
      if (newspapers && newspapers.length > 0) {
        await Newspaper.insertMany(newspapers);
        importStats.newspapers.inserted = newspapers.length;
      }

      // Pages
      await Page.deleteMany({});
      if (pages && pages.length > 0) {
        await Page.insertMany(pages);
        importStats.pages.inserted = pages.length;
      }

      // Users
      if (users && users.length > 0) {
        await User.deleteMany({});
        await User.insertMany(users);
        importStats.users.inserted = users.length;
      }

    } else {
      // MERGE MODE: Insert or update matching documents

      // News: Upsert by _id or Title
      if (news && news.length > 0) {
        for (const item of news) {
          const query = item._id ? { _id: item._id } : { title: item.title, category: item.category };
          const updateData = { ...item };
          delete updateData._id;

          const result = await News.findOneAndUpdate(query, updateData, {
            upsert: true,
            returnDocument: 'after',
            includeResultMetadata: true
          });

          if (result.lastErrorObject?.updatedExisting) {
            importStats.news.updated++;
          } else {
            importStats.news.inserted++;
          }
        }
      }

      // Newspapers: Upsert by _id or Title + issueDate
      if (newspapers && newspapers.length > 0) {
        for (const item of newspapers) {
          const query = item._id ? { _id: item._id } : { title: item.title, issueDate: item.issueDate };
          const updateData = { ...item };
          delete updateData._id;

          const result = await Newspaper.findOneAndUpdate(query, updateData, {
            upsert: true,
            returnDocument: 'after',
            includeResultMetadata: true
          });

          if (result.lastErrorObject?.updatedExisting) {
            importStats.newspapers.updated++;
          } else {
            importStats.newspapers.inserted++;
          }
        }
      }

      // Pages: Upsert by slug
      if (pages && pages.length > 0) {
        for (const item of pages) {
          const query = item.slug ? { slug: item.slug } : { title: item.title };
          const updateData = { ...item };
          delete updateData._id;

          const result = await Page.findOneAndUpdate(query, updateData, {
            upsert: true,
            returnDocument: 'after',
            includeResultMetadata: true
          });

          if (result.lastErrorObject?.updatedExisting) {
            importStats.pages.updated++;
          } else {
            importStats.pages.inserted++;
          }
        }
      }

      // Users: Upsert by _id or email
      if (users && users.length > 0) {
        for (const item of users) {
          const query = item._id ? { _id: item._id } : { email: item.email };
          const updateData = { ...item };
          delete updateData._id;

          const result = await User.findOneAndUpdate(query, updateData, {
            upsert: true,
            returnDocument: 'after',
            includeResultMetadata: true
          });

          if (result.lastErrorObject?.updatedExisting) {
            importStats.users.updated++;
          } else {
            importStats.users.inserted++;
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `Database imported successfully using '${mode}' mode.`,
      stats: importStats
    });
  } catch (error) {
    console.error('Import Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal Server Error during import' });
  }
};
