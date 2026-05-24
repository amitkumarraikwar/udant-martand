'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchOverlay from '@/components/SearchOverlay';

interface DocArticle {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
  author?: string;
}

export default function DocumentaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [doc, setDoc] = useState<DocArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (!params?.slug) return;

    const fetchDoc = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/news/slug/${params.slug}`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        setDoc(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [params?.slug]);

  if (loading) {
    return (
      <div>
        <Header onSearchOpen={() => setIsSearchOpen(true)} />
        <main className="wrap" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
          <article style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Skeleton */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  height: i === 0 ? '60px' : i === 1 ? '200px' : '20px',
                  marginBottom: '1.5rem',
                  background: 'var(--bg-paper)',
                  opacity: 0.12,
                  borderRadius: '4px',
                  width: i === 2 ? '60%' : '100%',
                }}
              />
            ))}
          </article>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div>
        <Header onSearchOpen={() => setIsSearchOpen(true)} />
        <main className="wrap" style={{ marginTop: '4rem', marginBottom: '4rem', textAlign: 'center' }}>
          <h1 className="serif" style={{ fontSize: '6rem', opacity: 0.15, marginBottom: '1rem' }}>404</h1>
          <p className="lora" style={{ fontSize: '1.2rem', opacity: 0.6, marginBottom: '2rem' }}>
            This documentary could not be found.
          </p>
          <Link href="/documentaries" style={{ borderBottom: '1px solid var(--ink)', paddingBottom: '2px', fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            ← Back to Documentaries
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const publishDate = new Date(doc.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Header onSearchOpen={() => setIsSearchOpen(true)} />

      <main className="wrap" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ maxWidth: '800px', margin: '0 auto' }}
        >
          {/* Meta header */}
          <div className="sec-head" style={{ marginBottom: '2rem' }}>
            <span className="sec-tag">{doc.category}</span>
            <div className="sec-line" />
            <span className="sec-aside">{publishDate}</span>
          </div>

          {/* Title */}
          <h1
            className="serif"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: '1.25', marginBottom: '1.5rem' }}
          >
            {doc.title}
          </h1>

          {/* Excerpt / lead */}
          <p
            className="lora"
            style={{ fontSize: '1.25rem', opacity: 0.75, marginBottom: '2.5rem', lineHeight: '1.7', fontStyle: 'italic' }}
          >
            {doc.excerpt}
          </p>

          {/* Hero image with play overlay style */}
          {doc.imageUrl && (
            <div style={{ position: 'relative', width: '100%', height: '480px', marginBottom: '3rem', overflow: 'hidden' }}>
              <img
                src={doc.imageUrl}
                alt={doc.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="fig-texture" />
              <div className="play" style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80px',
                height: '80px',
                background: 'rgba(0,0,0,0.4)',
                border: '2px solid var(--border)',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.3s ease',
              }}>
                <div style={{
                  width: 0,
                  height: 0,
                  borderTop: '12px solid transparent',
                  borderBottom: '12px solid transparent',
                  borderLeft: '20px solid var(--ink)',
                  marginLeft: '6px'
                }} />
              </div>
            </div>
          )}

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', opacity: 0.4 }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--ink)' }} />
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              {doc.author || 'Udant Martand Productions'}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--ink)' }} />
          </div>

          {/* Article body */}
          <div
            className="lora"
            style={{ fontSize: '1.15rem', lineHeight: '1.85', letterSpacing: '0.01em' }}
            dangerouslySetInnerHTML={{ __html: doc.content.replace(/\n/g, '<br/>') }}
          />

          {/* Back link */}
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--ink)', opacity: 0.5 }}>
            <Link
              href="/documentaries"
              style={{
                fontSize: '0.8rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderBottom: '1px solid var(--ink)',
                paddingBottom: '2px',
              }}
            >
              ← All Documentaries
            </Link>
          </div>
        </motion.article>
      </main>

      <Footer />
    </div>
  );
}
