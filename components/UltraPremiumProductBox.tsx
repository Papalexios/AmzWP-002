import React, { useState, useRef, useEffect } from 'react';
import { ProductDetails, FAQItem } from '../types';

interface UltraPremiumProductBoxProps {
  product: ProductDetails;
  affiliateTag?: string;
  variant?: 'full' | 'compact';
}

export const UltraPremiumProductBox: React.FC<UltraPremiumProductBoxProps> = ({
  product,
  affiliateTag = 'amzwp-20',
  variant = 'full'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showSpecs, setShowSpecs] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const amazonLink = `https://www.amazon.com/dp/${product.asin}?tag=${affiliateTag}`;
  const stars = Math.min(5, Math.max(0, product.rating || 4.5));
  const fullStars = Math.floor(stars);
  const hasHalfStar = stars - fullStars >= 0.5;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  const priceNum = parseFloat((product.price || '0').replace(/[^0-9.]/g, ''));
  const brandName = product.brand || product.title?.split(' ')[0] || 'Premium';
  const categoryName = product.category || 'Electronics';

  const faqs = product.faqs && product.faqs.length > 0 ? product.faqs : [
    { question: `Is the ${product.title?.substring(0, 40)} worth the price?`, answer: `Based on ${product.reviewCount?.toLocaleString() || '1,000'}+ customer reviews with a ${product.rating?.toFixed(1) || '4.5'}-star rating, this ${brandName} product delivers exceptional value. Customers particularly praise its quality and performance.` },
    { question: `What makes this ${brandName} product stand out?`, answer: product.verdict || `This ${categoryName} features premium build quality and has been verified by thousands of satisfied customers. ${product.prime ? 'Includes FREE Prime shipping.' : ''}` },
    { question: `Does the ${product.title?.substring(0, 30)} come with warranty?`, answer: `Yes! Backed by Amazon's A-to-Z guarantee plus ${brandName}'s manufacturer warranty. Easy returns within 30 days if you're not completely satisfied.` }
  ];

  const pros = product.pros && product.pros.length > 0 ? product.pros : [
    `${product.rating >= 4.5 ? 'Top-rated' : 'Highly rated'} with ${stars.toFixed(1)}★ average`,
    `${product.reviewCount?.toLocaleString() || '1,000'}+ verified reviews`,
    product.prime ? 'FREE Prime 2-day shipping' : 'Fast shipping available',
    `Trusted ${brandName} quality`
  ];

  const cons = product.cons && product.cons.length > 0 ? product.cons : [
    priceNum > 100 ? 'Premium pricing' : 'Limited premium features',
    'High demand may affect availability'
  ];

  const bestFor = product.bestFor && product.bestFor.length > 0 ? product.bestFor : [
    `${categoryName} enthusiasts`,
    `${brandName} brand loyalists`,
    'Quality-conscious buyers'
  ];

  const specs = product.specs || {
    'Brand': brandName,
    'Rating': `${stars.toFixed(1)} out of 5 stars`,
    'Reviews': `${product.reviewCount?.toLocaleString() || '1,000'}+`,
    'Shipping': product.prime ? 'Prime 2-Day' : 'Standard'
  };

  return (
    <div className="ultra-product-wrapper">
      <div
        ref={cardRef}
        className={`ultra-product-card ${isHovered ? 'hovered' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0.5, y: 0.5 }); }}
        style={{
          '--mouse-x': mousePos.x,
          '--mouse-y': mousePos.y,
        } as React.CSSProperties}
      >
        <div className="card-glow" />
        <div className="card-border" />
        
        <div className="card-header">
          <div className="badge-row">
            <span className="badge badge-verified">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              Amazon Verified
            </span>
            {product.prime && (
              <span className="badge badge-prime">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 10h-2V8h2v2zm0 4h-2v-2h2v2zm0 4h-2v-2h2v2zM5 18h6V6H5v12zm8-12v12h6V6h-6z"/></svg>
                PRIME
              </span>
            )}
            <span className="badge badge-rating">
              ★ {stars.toFixed(1)}
            </span>
          </div>
          <div className="product-brand">{brandName.toUpperCase()}</div>
        </div>

        <div className="product-main">
          <div className="image-section">
            <div className="image-spotlight" />
            <div className="image-ring-outer" />
            <div className="image-ring-inner" />
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="product-image"
                style={{
                  transform: isHovered
                    ? `translate(${(mousePos.x - 0.5) * 15}px, ${(mousePos.y - 0.5) * 15}px) scale(1.05)`
                    : 'translate(0, 0) scale(1)',
                }}
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%231a1a2e" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23666" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
            ) : (
              <div className="product-image no-image">No Image</div>
            )}
            
            <div className="floating-stats">
              <div className="stat-orb stat-rating">
                <span className="stat-value">{stars.toFixed(1)}</span>
                <span className="stat-label">Rating</span>
              </div>
              <div className="stat-orb stat-reviews">
                <span className="stat-value">{(product.reviewCount || 0) >= 1000 ? `${Math.round((product.reviewCount || 0) / 1000)}K` : product.reviewCount || 0}</span>
                <span className="stat-label">Reviews</span>
              </div>
            </div>
          </div>

          <div className="content-section">
            <h2 className="product-title">{product.title}</h2>
            
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`star ${i < fullStars ? 'filled' : i === fullStars && hasHalfStar ? 'half' : ''}`}>★</span>
              ))}
              <span className="review-count">({product.reviewCount?.toLocaleString() || 0} reviews)</span>
            </div>

            <div className="verdict-box">
              <div className="verdict-header">
                <span className="verdict-icon">🎯</span>
                <span className="verdict-label">Expert Verdict</span>
              </div>
              <p className="verdict-text">{product.verdict || `Top-rated ${categoryName} from ${brandName} with excellent customer satisfaction.`}</p>
            </div>

            <div className="pros-cons-grid">
              <div className="pros-section">
                <div className="section-title">
                  <span className="icon-circle green">✓</span>
                  Why We Love It
                </div>
                <ul className="feature-list">
                  {pros.slice(0, 4).map((pro, i) => (
                    <li key={i}><span className="bullet green">+</span>{pro}</li>
                  ))}
                </ul>
              </div>
              <div className="cons-section">
                <div className="section-title">
                  <span className="icon-circle amber">!</span>
                  Consider This
                </div>
                <ul className="feature-list">
                  {cons.slice(0, 2).map((con, i) => (
                    <li key={i}><span className="bullet amber">–</span>{con}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="best-for-section">
              <div className="section-title">
                <span className="icon-circle blue">★</span>
                Best For
              </div>
              <div className="best-for-tags">
                {bestFor.slice(0, 3).map((item, i) => (
                  <span key={i} className="best-for-tag">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="specs-toggle" onClick={() => setShowSpecs(!showSpecs)}>
          <span>{showSpecs ? '▲ Hide' : '▼ View'} Specifications</span>
        </div>
        
        {showSpecs && (
          <div className="specs-grid">
            {Object.entries(specs).slice(0, 6).map(([key, value]) => (
              <div key={key} className="spec-item">
                <span className="spec-label">{key}</span>
                <span className="spec-value">{value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="faq-section">
          <div className="faq-header">
            <span className="faq-icon">❓</span>
            <span className="faq-title">Common Questions About This {categoryName}</span>
          </div>
          <div className="faq-list">
            {faqs.slice(0, 3).map((faq, i) => (
              <div key={i} className={`faq-item ${activeFaq === i ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                  <span className="faq-q">Q:</span>
                  <span className="faq-text">{faq.question}</span>
                  <span className="faq-toggle">{activeFaq === i ? '−' : '+'}</span>
                </div>
                {activeFaq === i && (
                  <div className="faq-answer">
                    <span className="faq-a">A:</span>
                    <span>{faq.answer}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="action-section">
          <div className="price-block">
            <span className="price-label">Today's Price</span>
            <div className="price-main">
              <span className="currency">$</span>
              <span className="amount">{(product.price || '$0').replace(/[^0-9.]/g, '')}</span>
            </div>
            <span className="price-note">Free returns within 30 days</span>
          </div>
          
          <a href={amazonLink} target="_blank" rel="nofollow sponsored noopener" className="cta-button">
            <span className="cta-bg" />
            <span className="cta-shine" />
            <span className="cta-content">
              <span>Check Price on Amazon</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </a>
        </div>

        <div className="trust-footer">
          <div className="trust-item">
            <span className="trust-icon">🛡️</span>
            <span>A-to-Z Guarantee</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🚚</span>
            <span>{product.prime ? 'Prime 2-Day' : 'Fast Shipping'}</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">↩️</span>
            <span>Easy Returns</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🔒</span>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      <style>{`
        .ultra-product-wrapper {
          --accent: #6366f1;
          --accent-2: #a855f7;
          --success: #22c55e;
          --warning: #f59e0b;
          --info: #3b82f6;
          
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          max-width: 900px;
          margin: 3rem auto;
          padding: 1rem;
        }

        .ultra-product-card {
          position: relative;
          background: linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 100%);
          border-radius: 28px;
          overflow: hidden;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        .ultra-product-card.hovered {
          transform: translateY(-4px);
          box-shadow: 0 40px 80px -20px rgba(99, 102, 241, 0.25);
        }

        .card-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            600px circle at calc(var(--mouse-x) * 100%) calc(var(--mouse-y) * 100%),
            rgba(99, 102, 241, 0.12) 0%,
            transparent 40%
          );
          pointer-events: none;
          transition: opacity 0.3s;
          opacity: 0;
        }

        .ultra-product-card.hovered .card-glow {
          opacity: 1;
        }

        .card-border {
          position: absolute;
          inset: 0;
          border-radius: 28px;
          padding: 1.5px;
          background: linear-gradient(145deg, rgba(99, 102, 241, 0.4), rgba(168, 85, 247, 0.2), rgba(99, 102, 241, 0.1));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        .card-header {
          padding: 1.5rem 2rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .badge-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge-verified {
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .badge-prime {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(234, 88, 12, 0.2));
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.4);
          animation: primePulse 2s ease-in-out infinite;
        }

        @keyframes primePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
          50% { box-shadow: 0 0 15px 2px rgba(245, 158, 11, 0.2); }
        }

        .badge-rating {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
          color: #a5b4fc;
          border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .product-brand {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 3px;
          color: rgba(255, 255, 255, 0.5);
        }

        .product-main {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          padding: 0 2rem 2rem;
        }

        @media (max-width: 768px) {
          .product-main {
            grid-template-columns: 1fr;
          }
        }

        .image-section {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 280px;
          padding: 2rem;
        }

        .image-spotlight {
          position: absolute;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
          filter: blur(30px);
          animation: spotlightPulse 4s ease-in-out infinite;
        }

        @keyframes spotlightPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        .image-ring-outer, .image-ring-inner {
          position: absolute;
          border-radius: 50%;
          border: 1px dashed rgba(99, 102, 241, 0.2);
        }

        .image-ring-outer {
          width: 90%;
          height: 90%;
          animation: ringRotate 40s linear infinite;
        }

        .image-ring-inner {
          width: 70%;
          height: 70%;
          animation: ringRotate 30s linear infinite reverse;
        }

        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .product-image {
          position: relative;
          z-index: 5;
          max-width: 200px;
          max-height: 200px;
          object-fit: contain;
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.4));
          transition: transform 0.3s ease;
        }

        .product-image.no-image {
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          color: rgba(255, 255, 255, 0.3);
          font-size: 14px;
        }

        .floating-stats {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .stat-orb {
          position: absolute;
          width: 60px;
          height: 60px;
          background: linear-gradient(145deg, rgba(30, 30, 50, 0.95), rgba(20, 20, 40, 0.95));
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          animation: orbFloat 5s ease-in-out infinite;
        }

        .stat-rating { top: 0; right: 0; animation-delay: 0s; }
        .stat-reviews { bottom: 0; left: 0; animation-delay: -2.5s; }

        @keyframes orbFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .stat-value {
          font-size: 16px;
          font-weight: 900;
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: 8px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .content-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .product-title {
          font-size: 1.5rem;
          font-weight: 800;
          line-height: 1.3;
          color: #fff;
          margin: 0;
        }

        .stars-row {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .star {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.15);
        }

        .star.filled {
          color: #fbbf24;
        }

        .star.half {
          background: linear-gradient(90deg, #fbbf24 50%, rgba(255, 255, 255, 0.15) 50%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .review-count {
          margin-left: 8px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
        }

        .verdict-box {
          background: linear-gradient(145deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.05));
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 16px;
          padding: 1rem 1.25rem;
        }

        .verdict-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .verdict-icon {
          font-size: 16px;
        }

        .verdict-label {
          font-size: 11px;
          font-weight: 700;
          color: #a5b4fc;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .verdict-text {
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.75);
          margin: 0;
        }

        .pros-cons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 500px) {
          .pros-cons-grid {
            grid-template-columns: 1fr;
          }
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 10px;
        }

        .icon-circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: bold;
        }

        .icon-circle.green { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
        .icon-circle.amber { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
        .icon-circle.blue { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }

        .feature-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .feature-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 6px;
          line-height: 1.4;
        }

        .bullet {
          flex-shrink: 0;
          font-weight: 700;
        }

        .bullet.green { color: #4ade80; }
        .bullet.amber { color: #fbbf24; }

        .best-for-section {
          padding-top: 0.5rem;
        }

        .best-for-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .best-for-tag {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #93c5fd;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
        }

        .specs-toggle {
          text-align: center;
          padding: 1rem;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
          font-weight: 600;
          transition: color 0.2s;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .specs-toggle:hover {
          color: rgba(255, 255, 255, 0.8);
        }

        .specs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1px;
          background: rgba(255, 255, 255, 0.05);
          margin: 0 2rem;
          border-radius: 12px;
          overflow: hidden;
        }

        .spec-item {
          background: rgba(15, 15, 26, 0.8);
          padding: 1rem;
          text-align: center;
        }

        .spec-label {
          display: block;
          font-size: 10px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .spec-value {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
        }

        .faq-section {
          padding: 1.5rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .faq-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1rem;
        }

        .faq-icon {
          font-size: 18px;
        }

        .faq-title {
          font-size: 14px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .faq-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .faq-item:hover, .faq-item.active {
          border-color: rgba(99, 102, 241, 0.3);
        }

        .faq-question {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 1rem 1.25rem;
          cursor: pointer;
          user-select: none;
        }

        .faq-q, .faq-a {
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
        }

        .faq-q {
          background: rgba(99, 102, 241, 0.2);
          color: #a5b4fc;
        }

        .faq-a {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
        }

        .faq-text {
          flex: 1;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
        }

        .faq-toggle {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 300;
        }

        .faq-answer {
          display: flex;
          gap: 10px;
          padding: 0 1.25rem 1rem;
        }

        .faq-answer span:last-child {
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.65);
        }

        .action-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          padding: 1.5rem 2rem;
          background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.3));
          flex-wrap: wrap;
        }

        .price-block {
          display: flex;
          flex-direction: column;
        }

        .price-label {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .price-main {
          display: flex;
          align-items: flex-start;
        }

        .currency {
          font-size: 20px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 6px;
        }

        .amount {
          font-size: 42px;
          font-weight: 900;
          color: #fff;
          line-height: 1;
        }

        .price-note {
          font-size: 11px;
          color: rgba(34, 197, 94, 0.9);
          margin-top: 4px;
        }

        .cta-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 18px 36px;
          border-radius: 14px;
          text-decoration: none;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -10px rgba(245, 158, 11, 0.4);
        }

        .cta-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          z-index: 0;
        }

        .cta-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
          transform: translateX(-100%);
          z-index: 1;
        }

        .cta-button:hover .cta-shine {
          animation: ctaShine 0.6s ease;
        }

        @keyframes ctaShine {
          to { transform: translateX(100%); }
        }

        .cta-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 800;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .trust-footer {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          padding: 1.25rem 2rem;
          background: rgba(0, 0, 0, 0.2);
          flex-wrap: wrap;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
        }

        .trust-icon {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default UltraPremiumProductBox;
