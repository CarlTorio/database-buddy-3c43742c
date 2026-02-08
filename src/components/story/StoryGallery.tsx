import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Import gallery images
import graduationToga from "@/assets/story/graduation-toga.png";
import graduationDiploma from "@/assets/story/graduation-diploma.png";
import spineModel from "@/assets/story/spine-model.png";
import awardPlaque from "@/assets/story/award-plaque.png";
import certificateAppreciation from "@/assets/story/certificate-appreciation.png";
import groupPhoto from "@/assets/story/group-photo.png";
import gallery7 from "@/assets/story/gallery-7.png";
import gallery8 from "@/assets/story/gallery-8.png";
import gallery9 from "@/assets/story/gallery-9.png";
import gallery10 from "@/assets/story/gallery-10.png";
import gallery11 from "@/assets/story/gallery-11.png";
import gallery12 from "@/assets/story/gallery-12.png";

const galleryImages = [
  { src: graduationToga, alt: "Dr. Esperanza in graduation toga - Doctor of Humanities" },
  { src: graduationDiploma, alt: "Dr. Esperanza holding diploma at graduation ceremony" },
  { src: spineModel, alt: "Dr. Esperanza with spine model and ear acupuncture model" },
  { src: awardPlaque, alt: "Excellence in Holistic Healing Award plaque" },
  { src: certificateAppreciation, alt: "Certificate of Appreciation" },
  { src: groupPhoto, alt: "Group photo from Auriculo Asian Manual Therapy event" },
  { src: gallery7, alt: "Dr. Esperanza award ceremony" },
  { src: gallery8, alt: "Dr. Esperanza at wellness event" },
  { src: gallery9, alt: "Dr. Esperanza recognition" },
  { src: gallery10, alt: "Dr. Esperanza with fellow practitioners" },
  { src: gallery11, alt: "Dr. Esperanza healing practice" },
  { src: gallery12, alt: "Dr. Esperanza at wellness event" },
];

const StoryGallery = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === galleryImages.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
  };

  return (
    <section className="py-12 md:py-20 bg-cream/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-[2px] gradient-accent" />
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                Gallery
              </h2>
              <div className="w-12 h-[2px] gradient-accent" />
            </div>
            <p className="text-muted-foreground">
              Moments from Dr. Esperanza's journey in holistic healing
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Previous button */}
            <button
              className="absolute left-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            {/* Image */}
            <motion.img
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              src={galleryImages[selectedIndex].src}
              alt={galleryImages[selectedIndex].alt}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next button */}
            <button
              className="absolute right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {selectedIndex + 1} / {galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default StoryGallery;
