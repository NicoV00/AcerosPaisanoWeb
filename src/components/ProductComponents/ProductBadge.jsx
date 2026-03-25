import React from 'react';
import './ProductBadge.css';

const ProductBadge = ({ text = 'NUEVO', variant = 'default' }) => {
  return (
    <div className={`product-badge ${variant}`}>
      <span className="badge-text">{text}</span>
    </div>
  );
};

export default ProductBadge;