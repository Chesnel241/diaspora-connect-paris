import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Type for dynamically imported images
type ImageModule = { default: string };

const EventsCarousel = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Dynamically import all images from the events folder
  useEffect(() => {
    const loadImages = async () => {
      try {
        // Import all images from events folder using Vite's glob import
        const imageModules = import.meta.glob<ImageModule>('/src/assets/events/*.{png,jpg,jpeg,webp,gif,PNG,JPG,JPEG,WEBP,GIF}', { eager: true });

        const loadedImages = Object.values(imageModules).map((module) => module.default);

        if (loadedImages.length > 0) {
          setImages(loadedImages);
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Error loading event images:', error);
      }
    };

    loadImages();
  }, []);

  // Auto-advance carousel
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(nextSlide, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, [images.length, nextSlide]);

  // Don't render if no images
  if (!isLoaded || images.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="mb-20"
    >
      {/* Carousel Container */}
      <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-2xl">
        {/* Gradient Overlay for depth effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent z-10 pointer-events-none" />

        {/* Main Image Display */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] bg-navy/10">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`Événement ${currentIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />
          </AnimatePresence>
        </div>

        {/* Progress Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentIndex
                    ? 'w-8 bg-gold'
                    : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Aller à l'image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Side Navigation Arrows (visible on hover) */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:opacity-100 hover:bg-white/20 transition-all duration-300"
              aria-label="Image précédente"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:opacity-100 hover:bg-white/20 transition-all duration-300"
              aria-label="Image suivante"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Decorative line */}
      <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto mt-8" />
    </motion.div>
  );
};

export default EventsCarousel;
