import React, { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';

interface ProductImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackClassName?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt = '',
  fallbackSrc = 'https://via.placeholder.com/400x500/efeeeb/775a19?text=LUXEJEWELS',
  fallbackClassName = 'w-full aspect-[4/5] bg-surface-variant flex items-center justify-center',
  className = '',
  ...props
}) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={fallbackClassName}>
        <span className="material-symbols-outlined text-4xl text-on-surface-variant">image</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default ProductImage;
