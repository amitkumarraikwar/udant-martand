import mongoose from 'mongoose';
import News from './src/models/News.js';

mongoose.connect('mongodb://localhost:27017/udant-martand')
  .then(async () => {
    await News.updateOne(
      { title: "200 सालों का सफ़र: जब बंगाल ने दिया पहला हिंदी अख़बार, और आज बंगाल में गूंजती है हिंदी" },
      { $set: { slug: "bengal-hindi-200-years" } }
    );
    console.log('Slug fixed');
    process.exit(0);
  })
