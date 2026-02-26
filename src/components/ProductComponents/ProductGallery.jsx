import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import gsap from 'gsap';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Main gallery container
const GalleryContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
  maxWidth: '100%',
  margin: '0',
  [theme.breakpoints.down('md')]: {
    gap: '8px',
  }
}));

// Main image container - clean design
const MainImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 10',
  backgroundColor: '#f6f2ef',
  overflow: 'hidden',
  borderRadius: '8px',
  [theme.breakpoints.down('md')]: {
    aspectRatio: '4 / 3',
    borderRadius: '0',
    backgroundColor: '#f6f2ef',
  }
}));

const MainImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  opacity: 0,
  transition: 'opacity 0.4s ease',
  '&.visible': {
    opacity: 1,
  },
  [theme.breakpoints.down('md')]: {
    objectFit: 'cover',
  }
}));

// Minimal navigation arrows
const NavButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: 'rgba(11, 11, 11, 0.6)',
  padding: '8px',
  zIndex: 2,
  transition: 'all 0.2s ease',
  '& svg': {
    fontSize: '20px',
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: 'rgba(11, 11, 11, 0.9)',
  },
  '&.prev': {
    left: '12px',
  },
  '&.next': {
    right: '12px',
  },
  [theme.breakpoints.down('md')]: {
    display: 'none',
  }
}));

// Progress bar for auto-play
const ProgressContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '3px',
  backgroundColor: 'rgba(11, 11, 11, 0.1)',
  zIndex: 3,
  [theme.breakpoints.down('md')]: {
    height: '2px',
  }
}));

const ProgressBar = styled(Box)(({ theme }) => ({
  height: '100%',
  backgroundColor: '#d61f1f',
  transition: 'width 0.1s linear',
}));

// Image counter - minimal style
const ImageCounter = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '16px',
  right: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '999px',
  padding: '4px 12px',
  fontFamily: '"Geist Mono", "SF Mono", monospace',
  fontSize: '11px',
  color: 'rgba(11, 11, 11, 0.7)',
  letterSpacing: '0.05em',
  zIndex: 2,
  [theme.breakpoints.down('md')]: {
    bottom: '12px',
    right: '12px',
    fontSize: '10px',
    padding: '3px 8px',
  }
}));

// Thumbnails container
const ThumbnailsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '8px',
  padding: '0',
  [theme.breakpoints.down('md')]: {
    gap: '8px',
    justifyContent: 'space-between',
  }
}));

const Thumbnail = styled(Box)(({ theme, active }) => ({
  flex: '0 0 100px',
  height: '70px',
  backgroundColor: '#f6f2ef',
  overflow: 'hidden',
  cursor: 'pointer',
  border: active ? '2px solid #d61f1f' : '2px solid rgba(11, 11, 11, 0.08)',
  borderRadius: '4px',
  opacity: active ? 1 : 0.7,
  transition: 'all 0.2s ease',
  position: 'relative',
  '&:hover': {
    opacity: 1,
    borderColor: active ? '#d61f1f' : 'rgba(11, 11, 11, 0.2)',
  },
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  [theme.breakpoints.down('md')]: {
    flex: '1 1 0',
    minWidth: '0',
    height: '60px',
    borderRadius: '4px',
  }
}));

const ProductGallery = ({ images = [], productTitle }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const mainImageRef = useRef(null);
  const containerRef = useRef(null);
  const thumbnailsRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Default image if none provided
  const galleryImages = images.length > 0 ? images : [
    { src: '/images/placeholder.jpg', alt: productTitle }
  ];

  // Auto-play functionality
  const SLIDE_DURATION = 5000; // 5 seconds per slide
  const PROGRESS_INTERVAL = 50; // Update progress every 50ms

  useEffect(() => {
    if (galleryImages.length > 1 && !isPaused) {
      // Reset progress when index changes
      setProgress(0);

      // Start progress animation
      let currentProgress = 0;
      progressIntervalRef.current = setInterval(() => {
        currentProgress += (100 / (SLIDE_DURATION / PROGRESS_INTERVAL));
        if (currentProgress >= 100) {
          currentProgress = 0;
          const newIndex = activeIndex === galleryImages.length - 1 ? 0 : activeIndex + 1;
          setActiveIndex(newIndex);
        }
        setProgress(currentProgress);
      }, PROGRESS_INTERVAL);

      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    } else {
      setProgress(0);
    }
  }, [activeIndex, isPaused, galleryImages.length]);

  // Animate image change
  useEffect(() => {
    if (mainImageRef.current) {
      gsap.fromTo(mainImageRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [activeIndex]);

  const handleThumbnailClick = (index) => {
    if (index !== activeIndex) {
      setProgress(0);
      gsap.to(mainImageRef.current, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          setActiveIndex(index);
        }
      });
    }
  };

  const handlePrevious = () => {
    const newIndex = activeIndex === 0 ? galleryImages.length - 1 : activeIndex - 1;
    handleThumbnailClick(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex === galleryImages.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    setProgress(0);
  };

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Auto-scroll thumbnails to show active (removed scrollIntoView to prevent page jump)
  useEffect(() => {
    // Intentionally left empty or removed the scrollIntoView logic
    // since we only show max 4 thumbnails and it causes page jumps.
  }, [activeIndex, galleryImages.length]);

  // Show only first 4 thumbnails
  const displayThumbnails = galleryImages.slice(0, 4);

  return (
    <GalleryContainer ref={containerRef}>
      <MainImageContainer
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <MainImage
          ref={mainImageRef}
          src={galleryImages[activeIndex].src}
          alt={galleryImages[activeIndex].alt || productTitle}
          className="visible"
          loading="lazy"
        />

        {galleryImages.length > 1 && (
          <>
            <NavButton className="prev" onClick={handlePrevious}>
              <ChevronLeftIcon />
            </NavButton>
            <NavButton className="next" onClick={handleNext}>
              <ChevronRightIcon />
            </NavButton>
            <ImageCounter>
              {activeIndex + 1} / {galleryImages.length}
            </ImageCounter>
            <ProgressContainer>
              <ProgressBar style={{ width: `${progress}%` }} />
            </ProgressContainer>
          </>
        )}
      </MainImageContainer>

      {/* Thumbnails - show only first 4 */}
      {displayThumbnails.length > 1 && (
        <ThumbnailsContainer ref={thumbnailsRef}>
          {displayThumbnails.map((image, index) => (
            <Thumbnail
              key={index}
              active={index === activeIndex}
              onClick={() => handleThumbnailClick(index)}
              className="thumbnail-item"
            >
              <img
                src={image.src}
                alt={image.alt || `${productTitle} - Vista ${index + 1}`}
                loading="lazy"
              />
            </Thumbnail>
          ))}
        </ThumbnailsContainer>
      )}
    </GalleryContainer>
  );
};

export default ProductGallery;