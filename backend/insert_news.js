import mongoose from 'mongoose';
import News from './src/models/News.js';

mongoose.connect('mongodb://localhost:27017/udant-martand')
  .then(async () => {
    console.log('Connected to DB');
    const existing = await News.findOne({ slug: 'bengal-hindi-200-years' });
    if (existing) {
      console.log('Article already exists:', existing);
      process.exit(0);
    }

    const content = `<p style="margin-bottom: 1.5rem;">
  इतिहास के पन्ने जब भी पलटे जाते हैं, तो कुछ कहानियाँ समय के साथ और भी गहरी और प्रासंगिक हो जाती हैं। आज से ठीक 200 साल पहले, 30 मई 1826 को कलकत्ता (अब कोलकाता) के बड़ा बाज़ार इलाके से एक ऐसी क्रांति की शुरुआत हुई थी, जिसने पूरे भारत की भाषाई दिशा तय कर दी। यहीं से प्रकाशित हुआ था भारत का पहला हिंदी समाचार पत्र— <strong>'उदन्त मार्तण्ड' (Udant Martand)</strong>।
</p>
<p style="margin-bottom: 1.5rem;">
  पंडित जुगल किशोर शुक्ल जी के अदम्य साहस और दूरदृष्टि का ही परिणाम था कि गैर-हिंदी भाषी राज्य बंगाल की धरती से हिंदी पत्रकारिता का सूर्योदय हुआ। उस दौर में, जब संसाधन सीमित थे और चुनौतियाँ अपार, 'उदन्त मार्तण्ड' ने एक ऐसा बीज बोया, जिसकी छांव आज पूरा देश महसूस कर रहा है।
</p>

<h2 class="serif" style="font-size: 2rem; margin-top: 3rem; margin-bottom: 1.5rem; font-family: var(--hindi), serif;">
  200 साल बाद: जब बंगाल हो गया हिंदी मय
</h2>

<p style="margin-bottom: 1.5rem;">
  आज, 2026 में, जब हम इस ऐतिहासिक अख़बार की 200वीं वर्षगांठ मना रहे हैं, तो एक सुखद बदलाव देखने को मिलता है। 200 साल पहले जिस बंगाल ने हिंदी पत्रकारिता को अपनी ज़मीन दी थी, आज वही बंगाल हिंदी को अपने दिल में बसा चुका है।
</p>

<p style="margin-bottom: 1.5rem;">
  कोलकाता की सड़कों पर आज बांग्ला की मिठास के साथ-साथ हिंदी की गूंज भी आम हो गई है। व्यापार, शिक्षा, कला और रोज़मर्रा की ज़िंदगी में हिंदी और बांग्ला का यह अनूठा संगम देखने को मिलता है। हावड़ा ब्रिज से लेकर कॉलेज स्ट्रीट तक, आपको ऐसे हज़ारों लोग मिल जाएंगे जिनकी मातृभाषा भले ही बांग्ला हो, लेकिन वे हिंदी को उतने ही अपनेपन और अधिकार के साथ बोलते हैं।
</p>

<p style="margin-bottom: 1.5rem;">
  आज बंगाल के सिनेमा, साहित्य और युवा संस्कृति में हिंदी का प्रभाव साफ झलकता है। यह सिर्फ प्रवासन (migration) का नतीजा नहीं है, बल्कि दो महान संस्कृतियों के बीच एक सेतु के निर्माण का परिणाम है।
</p>

<blockquote style="font-size: 1.5rem; font-style: italic; border-left: 4px solid var(--ink); padding-left: 2rem; margin: 3rem 0; opacity: 0.9;">
  "भाषाएँ कभी सीमाओं में नहीं बंधतीं; वे दिलों को जोड़ती हैं और सदियों तक जीवित रहती हैं।"
</blockquote>

<h2 class="serif" style="font-size: 2rem; margin-top: 3rem; margin-bottom: 1.5rem; font-family: var(--hindi), serif;">
  विरासत को सलाम
</h2>

<p style="margin-bottom: 1.5rem;">
  'उदन्त मार्तण्ड' का शाब्दिक अर्थ है "उगता हुआ सूर्य"। 200 साल पहले कलकत्ता से उगे उस सूर्य ने न सिर्फ हिंदी भाषा को एक नई पहचान दी, बल्कि भारत की भाषाई एकता का एक ऐसा उदाहरण पेश किया जो आज भी कायम है।
</p>

<p style="margin-bottom: 1.5rem;">
  आज जब हम पीछे मुड़कर देखते हैं, तो गर्व होता है कि 200 साल पहले एक हिंदी अख़बार बंगाल आया था, और आज 200 साल बाद, बंगाल खुद ही कहीं न कहीं हिंदी के रंग में रंग गया है। 
</p>`;

    const newArticle = new News({
      title: "200 सालों का सफ़र: जब बंगाल ने दिया पहला हिंदी अख़बार, और आज बंगाल में गूंजती है हिंदी",
      slug: "bengal-hindi-200-years",
      excerpt: "30 मई 1826 को कलकत्ता की सड़कों से शुरू हुआ 'उदन्त मार्तण्ड' का सफर, आज दो सदी बाद बंगाल की सांस्कृतिक रगों में हिंदी बनकर दौड़ रहा है।",
      content: content,
      category: "Heritage · विरासत",
      author: "Udant Martand Staff",
      imageUrl: "/assets/bengal_hindi_200_years.png",
      createdAt: new Date("2026-05-30")
    });

    await newArticle.save();
    console.log('Article inserted successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
