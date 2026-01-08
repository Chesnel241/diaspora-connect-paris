import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple lightbox modal
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl border-4 border-gold animate-fadeIn"
        onClick={e => e.stopPropagation()}
      />
      <button
        className="absolute top-6 right-8 text-white text-3xl font-bold bg-black/40 rounded-full px-3 py-1 hover:bg-black/70 transition"
        onClick={onClose}
        aria-label="Fermer"
      >
        ×
      </button>
    </div>
  );
}

// Type for dynamically imported images
type ImageModule = { default: string };

const EventsCarousel = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lightbox, setLightbox] = useState<{src: string, alt: string} | null>(null);

  // Dynamically import all images from the events folder
  useEffect(() => {
    const loadImages = async () => {
      try {
        // Import all images from events folder using Vite's glob import
        const imageModules = import.meta.glob<ImageModule>('/src/assets/events/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP,gif,GIF}', { eager: true });

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
      <div className="relative w-full max-w-6xl mx-auto rounded-2xl shadow-2xl bg-navy/10 p-2 md:p-8">
        <div
          className="columns-1 sm:columns-2 md:columns-2 lg:columns-3 gap-4 [column-fill:_balance]"
        >
          {images.map((src, idx) => (
            <motion.div
              key={src}
              className="mb-4 break-inside-avoid relative group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              onClick={() => setLightbox({ src, alt: `Événement ${idx + 1}` })}
            >
              <img
                src={src}
                alt={`Événement ${idx + 1}`}
                className="w-full rounded-2xl object-cover shadow-lg transition-transform duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:z-10"
                style={{ maxHeight: '420px', minHeight: '220px', aspectRatio: '16/10', background: '#0a1930' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-2xl" />
            </motion.div>
          ))}
        </div>
        {lightbox && (
          <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />
        )}
      </div>
      <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto mt-8" />
    </motion.div>
  );
};

export default EventsCarousel;
