'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchOverlay from '@/components/SearchOverlay';

export default function ArticlePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Header onSearchOpen={() => setIsSearchOpen(true)} />
      
      <main className="wrap" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
        <article style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="sec-head" style={{ marginBottom: '2rem' }}>
            <span className="sec-tag">Heritage · विरासत</span>
            <div className="sec-line"></div>
            <span className="sec-aside">30 MAY 2026</span>
          </div>

          <h1 className="serif" style={{ fontSize: '3rem', lineHeight: '1.2', marginBottom: '1.5rem', fontFamily: 'var(--hindi), serif' }}>
            200 सालों का सफ़र: जब बंगाल ने दिया पहला हिंदी अख़बार, और आज बंगाल में गूंजती है हिंदी
          </h1>
          
          <p className="lora hindi" style={{ fontSize: '1.5rem', opacity: 0.8, marginBottom: '3rem', fontFamily: 'var(--hindi), serif' }}>
            30 मई 1826 को कलकत्ता की सड़कों से शुरू हुआ 'उदन्त मार्तण्ड' का सफर, आज दो सदी बाद बंगाल की सांस्कृतिक रगों में हिंदी बनकर दौड़ रहा है।
          </p>

          <div style={{ position: 'relative', width: '100%', height: '500px', marginBottom: '3rem' }}>
            <img 
              src="/assets/bengal_hindi_200_years.png" 
              alt="200 Years of Hindi in Bengal" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div className="content lora hindi" style={{ fontSize: '1.2rem', lineHeight: '1.8', fontFamily: 'var(--hindi), serif' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              इतिहास के पन्ने जब भी पलटे जाते हैं, तो कुछ कहानियाँ समय के साथ और भी गहरी और प्रासंगिक हो जाती हैं। आज से ठीक 200 साल पहले, 30 मई 1826 को कलकत्ता (अब कोलकाता) के बड़ा बाज़ार इलाके से एक ऐसी क्रांति की शुरुआत हुई थी, जिसने पूरे भारत की भाषाई दिशा तय कर दी। यहीं से प्रकाशित हुआ था भारत का पहला हिंदी समाचार पत्र— <strong>'उदन्त मार्तण्ड' (Udant Martand)</strong>।
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              पंडित जुगल किशोर शुक्ल जी के अदम्य साहस और दूरदृष्टि का ही परिणाम था कि गैर-हिंदी भाषी राज्य बंगाल की धरती से हिंदी पत्रकारिता का सूर्योदय हुआ। उस दौर में, जब संसाधन सीमित थे और चुनौतियाँ अपार, 'उदन्त मार्तण्ड' ने एक ऐसा बीज बोया, जिसकी छांव आज पूरा देश महसूस कर रहा है।
            </p>

            <h2 className="serif" style={{ fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem', fontFamily: 'var(--hindi), serif' }}>
              200 साल बाद: जब बंगाल हो गया हिंदी मय
            </h2>

            <p style={{ marginBottom: '1.5rem' }}>
              आज, 2026 में, जब हम इस ऐतिहासिक अख़बार की 200वीं वर्षगांठ मना रहे हैं, तो एक सुखद बदलाव देखने को मिलता है। 200 साल पहले जिस बंगाल ने हिंदी पत्रकारिता को अपनी ज़मीन दी थी, आज वही बंगाल हिंदी को अपने दिल में बसा चुका है।
            </p>

            <p style={{ marginBottom: '1.5rem' }}>
              कोलकाता की सड़कों पर आज बांग्ला की मिठास के साथ-साथ हिंदी की गूंज भी आम हो गई है। व्यापार, शिक्षा, कला और रोज़मर्रा की ज़िंदगी में हिंदी और बांग्ला का यह अनूठा संगम देखने को मिलता है। हावड़ा ब्रिज से लेकर कॉलेज स्ट्रीट तक, आपको ऐसे हज़ारों लोग मिल जाएंगे जिनकी मातृभाषा भले ही बांग्ला हो, लेकिन वे हिंदी को उतने ही अपनेपन और अधिकार के साथ बोलते हैं।
            </p>

            <p style={{ marginBottom: '1.5rem' }}>
              आज बंगाल के सिनेमा, साहित्य और युवा संस्कृति में हिंदी का प्रभाव साफ झलकता है। यह सिर्फ प्रवासन (migration) का नतीजा नहीं है, बल्कि दो महान संस्कृतियों के बीच एक सेतु के निर्माण का परिणाम है।
            </p>

            <blockquote style={{ fontSize: '1.5rem', fontStyle: 'italic', borderLeft: '4px solid var(--ink)', paddingLeft: '2rem', margin: '3rem 0', opacity: 0.9 }}>
              "भाषाएँ कभी सीमाओं में नहीं बंधतीं; वे दिलों को जोड़ती हैं और सदियों तक जीवित रहती हैं।"
            </blockquote>

            <h2 className="serif" style={{ fontSize: '2rem', marginTop: '3rem', marginBottom: '1.5rem', fontFamily: 'var(--hindi), serif' }}>
              विरासत को सलाम
            </h2>

            <p style={{ marginBottom: '1.5rem' }}>
              'उदन्त मार्तण्ड' का शाब्दिक अर्थ है "उगता हुआ सूर्य"। 200 साल पहले कलकत्ता से उगे उस सूर्य ने न सिर्फ हिंदी भाषा को एक नई पहचान दी, बल्कि भारत की भाषाई एकता का एक ऐसा उदाहरण पेश किया जो आज भी कायम है।
            </p>

            <p style={{ marginBottom: '1.5rem' }}>
              आज जब हम पीछे मुड़कर देखते हैं, तो गर्व होता है कि 200 साल पहले एक हिंदी अख़बार बंगाल आया था, और आज 200 साल बाद, बंगाल खुद ही कहीं न कहीं हिंदी के रंग में रंग गया है। 
            </p>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
