import React, { useState } from 'react';
import { ProductDetails, ComparisonData } from '../types';

interface UltraComparisonTableProps {
  products: ProductDetails[];
  title?: string;
  affiliateTag?: string;
}

export const UltraComparisonTable: React.FC<UltraComparisonTableProps> = ({
  products,
  title = 'Head-to-Head Comparison',
  affiliateTag = 'amzwp-20'
}) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  
  if (!products || products.length < 2) return null;

  const sortedProducts = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  const winner = sortedProducts[0];

  const parsePrice = (price: string) => {
    return parseFloat((price || '0').replace(/[^0-9.]/g, '')) || 0;
  };

  const getWinnerForSpec = (specKey: string) => {
    if (specKey === 'price') {
      const lowest = sortedProducts.reduce((min, p) => 
        parsePrice(p.price) < parsePrice(min.price) ? p : min
      );
      return lowest.id;
    }
    if (specKey === 'rating') {
      return sortedProducts.reduce((best, p) => 
        (p.rating || 0) > (best.rating || 0) ? p : best
      ).id;
    }
    if (specKey === 'reviews') {
      return sortedProducts.reduce((best, p) => 
        (p.reviewCount || 0) > (best.reviewCount || 0) ? p : best
      ).id;
    }
    return null;
  };

  const comparisonSpecs = [
    { key: 'rating', label: 'Customer Rating', icon: '⭐' },
    { key: 'reviews', label: 'Total Reviews', icon: '💬' },
    { key: 'price', label: 'Current Price', icon: '💰' },
    { key: 'prime', label: 'Prime Eligible', icon: '🚀' },
    { key: 'brand', label: 'Brand', icon: '🏷️' }
  ];

  const getSpecValue = (product: ProductDetails, specKey: string) => {
    switch (specKey) {
      case 'rating':
        return product.rating ? `${product.rating.toFixed(1)} / 5.0` : 'N/A';
      case 'reviews':
        return product.reviewCount ? product.reviewCount.toLocaleString() : 'N/A';
      case 'price':
        return product.price || 'N/A';
      case 'prime':
        return product.prime ? '✓ Yes' : '✗ No';
      case 'brand':
        return product.brand || product.title?.split(' ')[0] || 'N/A';
      default:
        return product.specs?.[specKey] || 'N/A';
    }
  };

  return (
    <div className="ultra-comparison-wrapper">
      <div className="comparison-card">
        <div className="comparison-glow" />
        
        <div className="comparison-header">
          <div className="header-badge">
            <span className="badge-icon">⚔️</span>
            <span className="badge-text">COMPARISON</span>
          </div>
          <h2 className="comparison-title">{title}</h2>
          <p className="comparison-subtitle">
            Analyzing {sortedProducts.length} products based on ratings, reviews, and value
          </p>
        </div>

        <div className="products-row">
          {sortedProducts.map((product, idx) => (
            <div
              key={product.id}
              className={`product-column ${hoveredProduct === product.id ? 'hovered' : ''} ${product.id === winner.id ? 'winner' : ''}`}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {product.id === winner.id && (
                <div className="winner-badge">
                  <span className="crown">👑</span>
                  <span>BEST CHOICE</span>
                </div>
              )}
              
              {idx === 1 && sortedProducts.length === 2 && (
                <div className="runner-up-badge">
                  <span>🥈</span>
                  <span>RUNNER UP</span>
                </div>
              )}

              {idx > 0 && sortedProducts.length > 2 && (
                <div className="rank-badge">#{idx + 1}</div>
              )}

              <div className="product-image-wrapper">
                <div className="image-glow" />
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} className="product-img" />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>

              <h3 className="product-name">{product.title}</h3>

              <div className="product-rating">
                <span className="stars">{'★'.repeat(Math.round(product.rating || 0))}</span>
                <span className="rating-value">{(product.rating || 0).toFixed(1)}</span>
              </div>

              <div className="product-price">{product.price || 'Check Price'}</div>

              <a
                href={`https://www.amazon.com/dp/${product.asin}?tag=${affiliateTag}`}
                target="_blank"
                rel="nofollow sponsored noopener"
                className={`cta-btn ${product.id === winner.id ? 'winner-btn' : ''}`}
              >
                <span>{product.id === winner.id ? 'Get Best Deal' : 'View on Amazon'}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          ))}
        </div>

        <div className="specs-section">
          <div className="specs-header">
            <span className="specs-icon">📊</span>
            <span className="specs-title">Detailed Comparison</span>
          </div>

          <div className="specs-table">
            <div className="specs-row header-row">
              <div className="spec-label-cell">Feature</div>
              {sortedProducts.map(p => (
                <div key={p.id} className="spec-value-cell header-cell">
                  {p.brand || p.title?.split(' ').slice(0, 2).join(' ')}
                </div>
              ))}
            </div>

            {comparisonSpecs.map(spec => {
              const specWinner = getWinnerForSpec(spec.key);
              return (
                <div key={spec.key} className="specs-row">
                  <div className="spec-label-cell">
                    <span className="spec-icon">{spec.icon}</span>
                    <span>{spec.label}</span>
                  </div>
                  {sortedProducts.map(p => (
                    <div 
                      key={p.id} 
                      className={`spec-value-cell ${specWinner === p.id ? 'best' : ''}`}
                    >
                      <span className="spec-value">{getSpecValue(p, spec.key)}</span>
                      {specWinner === p.id && <span className="best-badge">Best</span>}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div className="verdict-section">
          <div className="verdict-card">
            <div className="verdict-icon-wrapper">
              <span className="verdict-icon">🏆</span>
            </div>
            <div className="verdict-content">
              <h4 className="verdict-title">Our Recommendation</h4>
              <p className="verdict-text">
                Based on our analysis, the <strong>{winner.title?.substring(0, 50)}</strong> stands out with 
                {winner.rating && ` a ${winner.rating.toFixed(1)}-star rating`}
                {winner.reviewCount && ` from ${winner.reviewCount.toLocaleString()} reviews`}.
                {winner.prime && ' Plus, it qualifies for FREE Prime shipping!'}
              </p>
              <a
                href={`https://www.amazon.com/dp/${winner.asin}?tag=${affiliateTag}`}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="verdict-cta"
              >
                Check Current Price →
              </a>
            </div>
          </div>
        </div>

        <div className="trust-bar">
          <span className="trust-item">🔒 Secure Links</span>
          <span className="trust-item">✓ Updated Daily</span>
          <span className="trust-item">📦 Amazon Verified</span>
        </div>
      </div>

      <style>{`
        .ultra-comparison-wrapper {
          --accent: #6366f1;
          --accent-2: #a855f7;
          --gold: #f59e0b;
          --success: #22c55e;
          
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          max-width: 1100px;
          margin: 3rem auto;
          padding: 1rem;
        }

        .comparison-card {
          position: relative;
          background: linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 100%);
          border-radius: 28px;
          overflow: hidden;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .comparison-glow {
          position: absolute;
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
          width: 500px;
          height: 300px;
          background: radial-gradient(ellipse, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .comparison-header {
          text-align: center;
          padding: 2.5rem 2rem 1.5rem;
          position: relative;
        }

        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99, 102, 241, 0.15);
          border: 1px solid rgba(99, 102, 241, 0.3);
          padding: 8px 16px;
          border-radius: 100px;
          margin-bottom: 1rem;
        }

        .badge-icon {
          font-size: 14px;
        }

        .badge-text {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          color: #a5b4fc;
        }

        .comparison-title {
          font-size: 2rem;
          font-weight: 900;
          color: #fff;
          margin: 0 0 0.5rem;
          line-height: 1.2;
        }

        .comparison-subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }

        .products-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1px;
          background: rgba(255, 255, 255, 0.05);
          margin: 0 2rem;
          border-radius: 20px;
          overflow: hidden;
        }

        .product-column {
          position: relative;
          background: rgba(15, 15, 26, 0.9);
          padding: 2rem 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          transition: background 0.3s, transform 0.3s;
        }

        .product-column.hovered {
          background: rgba(99, 102, 241, 0.08);
        }

        .product-column.winner {
          background: linear-gradient(180deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 15, 26, 0.9) 100%);
        }

        .winner-badge {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          padding: 8px 16px;
          border-radius: 0 0 12px 12px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #fff;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
        }

        .crown {
          font-size: 12px;
          animation: crownBounce 2s ease-in-out infinite;
        }

        @keyframes crownBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .runner-up-badge {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(148, 163, 184, 0.2);
          border: 1px solid rgba(148, 163, 184, 0.3);
          padding: 6px 12px;
          border-radius: 0 0 10px 10px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #94a3b8;
        }

        .rank-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 28px;
          height: 28px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.5);
        }

        .product-image-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
          filter: blur(20px);
        }

        .product-img {
          position: relative;
          max-width: 100px;
          max-height: 100px;
          object-fit: contain;
          filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
          transition: transform 0.3s;
        }

        .product-column:hover .product-img {
          transform: scale(1.05);
        }

        .no-image {
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.3);
          font-size: 12px;
        }

        .product-name {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 40px;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stars {
          color: #fbbf24;
          font-size: 14px;
        }

        .rating-value {
          font-size: 14px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.8);
        }

        .product-price {
          font-size: 22px;
          font-weight: 900;
          color: #fff;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.2s;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .cta-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .winner-btn {
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          border: none;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        }

        .winner-btn:hover {
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        }

        .specs-section {
          padding: 2rem;
        }

        .specs-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1.5rem;
        }

        .specs-icon {
          font-size: 20px;
        }

        .specs-title {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
        }

        .specs-table {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .specs-row {
          display: grid;
          grid-template-columns: 180px repeat(${sortedProducts.length}, 1fr);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .specs-row:last-child {
          border-bottom: none;
        }

        .specs-row.header-row {
          background: rgba(99, 102, 241, 0.1);
        }

        .spec-label-cell {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 1rem 1.25rem;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.02);
        }

        .spec-icon {
          font-size: 14px;
        }

        .spec-value-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 1rem;
          text-align: center;
          position: relative;
        }

        .spec-value-cell.header-cell {
          font-size: 11px;
          font-weight: 700;
          color: #a5b4fc;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .spec-value-cell.best {
          background: rgba(34, 197, 94, 0.1);
        }

        .spec-value {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }

        .best-badge {
          font-size: 9px;
          font-weight: 700;
          color: #4ade80;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .verdict-section {
          padding: 0 2rem 2rem;
        }

        .verdict-card {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(234, 88, 12, 0.05));
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
        }

        .verdict-icon-wrapper {
          flex-shrink: 0;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #f59e0b, #ea580c);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
        }

        .verdict-icon {
          font-size: 24px;
        }

        .verdict-content {
          flex: 1;
        }

        .verdict-title {
          font-size: 16px;
          font-weight: 800;
          color: #fbbf24;
          margin: 0 0 8px;
        }

        .verdict-text {
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.75);
          margin: 0 0 1rem;
        }

        .verdict-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #fbbf24;
          text-decoration: none;
          transition: color 0.2s;
        }

        .verdict-cta:hover {
          color: #fcd34d;
        }

        .trust-bar {
          display: flex;
          justify-content: center;
          gap: 2rem;
          padding: 1.25rem;
          background: rgba(0, 0, 0, 0.2);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          flex-wrap: wrap;
        }

        .trust-item {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        @media (max-width: 768px) {
          .specs-row {
            grid-template-columns: 1fr;
          }

          .spec-label-cell {
            background: rgba(99, 102, 241, 0.1);
            font-weight: 700;
          }

          .verdict-card {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default UltraComparisonTable;
