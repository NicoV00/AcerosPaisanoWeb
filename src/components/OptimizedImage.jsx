import React, { useRef, useEffect, useState, forwardRef } from 'react';

export const OptimizedImage = forwardRef(({
  src,
  alt,
  srcSet,
  sizes,
  className,
  style,
  priority = false,
  onLoad,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiLz48L3N2Zz4=',
  ...props
}, forwardedRef) => {
  const internalRef = useRef(null);
  const imgRef = forwardedRef || internalRef;
  const [imageSrc, setImageSrc] = useState(priority ? src : placeholder);
  const [imageLoaded, setImageLoaded] = useState(priority);

  useEffect(() => {
    if (priority) {
      setImageSrc(src);
      return;
    }

    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Preload image
          const tempImg = new Image();
          tempImg.src = src;
          if (srcSet) tempImg.srcset = srcSet;

          tempImg.onload = () => {
            setImageSrc(src);
            setImageLoaded(true);
            if (onLoad) onLoad();
          };

          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0
      }
    );

    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  }, [src, srcSet, priority, onLoad]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      srcSet={imageLoaded && srcSet ? srcSet : undefined}
      sizes={sizes}
      className={className}
      style={{
        ...style,
        transition: 'opacity 0.3s ease',
        opacity: imageLoaded ? 1 : 0.7
      }}
      loading={priority ? "eager" : "lazy"}
      {...props}
    />
  );
});