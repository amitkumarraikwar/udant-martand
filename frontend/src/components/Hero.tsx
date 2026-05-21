'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-main">
        <motion.div 
          className="hero-fig"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ position: 'relative' }}
        >
          <img 
            src="/assets/bengal_hindi_200_years.png" 
            alt="200 Years of Hindi in Bengal" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="fig-texture"></div>
          <div className="fig-inner" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <span className="fig-label">HERITAGE SPECIAL · ऐतिहासिक विशेष</span>
            <div style={{ width: '80%', height: '1px', background: 'var(--border3)', opacity: 0.5 }}></div>
            <span className="fig-label" style={{ opacity: 0.5 }}>FILE: UM-1826-2026</span>
          </div>
        </motion.div>

        <div className="hero-cat">Heritage · विरासत</div>
        <h1 className="hero-h1">
          <a href="/news/bengal-hindi-200-years">200 सालों का सफ़र: जब बंगाल ने दिया पहला हिंदी अख़बार, और आज बंगाल में गूंजती है हिंदी</a>
        </h1>
        <p className="hero-deck hindi">
          30 मई 1826 को कलकत्ता की सड़कों से शुरू हुआ 'उदन्त मार्तण्ड' का सफर, आज दो सदी बाद बंगाल की सांस्कृतिक रगों में हिंदी बनकर दौड़ रहा है।
        </p>
        <div className="art-meta">
          <span className="by">By Editorial Board</span>
          <span className="sep">|</span>
          <span>30 May 2026</span>
          <span className="sep">|</span>
          <span className="hindi">5 मिनट पठन</span>
        </div>
      </div>

      <aside className="hero-side">
        <div className="side-head">Most Popular</div>
        {[
          { num: '01', title: 'The Silent Crisis: Why Rural Banking is Failing Small Farmers', cat: 'Economy' },
          { num: '02', title: 'Interview: The Physicist Searching for Dark Matter in a Gold Mine', cat: 'Science' },
          { num: '03', title: 'Reclaiming the Commons: Bangalore’s New Urban Forest Movement', cat: 'Environment' },
          { num: '04', title: 'The Death of the Monsoon? Predicting the Unpredictable', cat: 'Climate' }
        ].map((item, i) => (
          <div key={i} className="side-item">
            <div className="side-num">{item.num}</div>
            <h3><a href="#">{item.title}</a></h3>
            <div className="side-meta">{item.cat} · 5 min read</div>
          </div>
        ))}
      </aside>
    </section>
  );
}
