/**
 * One-time migration: backfill `slug` on all existing News documents.
 * Run with:  node migrate-slugs.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB:', process.env.MONGO_URI);

  const collection = mongoose.connection.collection('news');
  const articles = await collection.find({ slug: { $exists: false } }).toArray();

  console.log(`📄 Found ${articles.length} articles without slugs`);

  const usedSlugs = new Set();

  for (const article of articles) {
    let baseSlug = generateSlug(article.title);
    let slug = baseSlug;
    let counter = 1;

    // Avoid duplicates within this migration run
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    // Also check DB for pre-existing slugs
    while (await collection.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    usedSlugs.add(slug);
    await collection.updateOne({ _id: article._id }, { $set: { slug } });
    console.log(`  ✓ "${article.title}" → /${slug}`);
  }

  console.log('\n🎉 Migration complete!');
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
