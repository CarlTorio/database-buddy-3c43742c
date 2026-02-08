import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import productCellPowerTrio from "@/assets/product-cell-power-trio.png";
import productCrj from "@/assets/product-crj.png";
import productNabPeptides from "@/assets/product-nab-peptides.png";
import productHciCmd from "@/assets/product-hci-cmd.png";
import productCbf from "@/assets/product-cbf.png";
import productCbj from "@/assets/product-cbj.png";

const products = [
  {
    name: "Cell Power Trio Plus+",
    tagline: "Detoxify. Nourish. Activate.",
    image: productCellPowerTrio,
    link: "https://1hcibizonline.com/cell-power-trio/",
  },
  {
    name: "CRJ (Cell Rejuvenate Juice)",
    tagline: "Healthy Life Starts from the Guts",
    image: productCrj,
    link: "https://1hcibizonline.com/crj-cell-rejuvenate-juice/",
  },
  {
    name: "NAB Peptides",
    tagline: "Absorption. Regeneration. Renewal.",
    image: productNabPeptides,
    link: "https://1hcibizonline.com/nab-peptides/",
  },
  {
    name: "HCI CMD (Cell Mineral Drops)",
    tagline: "Essential Minerals for Cellular Health",
    image: productHciCmd,
    link: "https://1hcibizonline.com/cell-mineral-drops/",
  },
  {
    name: "CBF (Cell Bio Food)",
    tagline: "Nourish Your Body Naturally",
    image: productCbf,
    link: "https://1hcibizonline.com/cell-bio-food/",
  },
  {
    name: "CBJ (Cell Bio Juice)",
    tagline: "Natural Wellness in Every Sip",
    image: productCbj,
    link: "https://1hcibizonline.com/cell-bio-juice/",
  },
];

const ProductsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <section id="products" className="py-10 md:py-14 bg-background scroll-mt-24" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-8 max-w-2xl mx-auto"
        >
          <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-2 md:mb-3">
            Health Supplements
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base leading-relaxed px-2">
            Premium HCIBiz food supplements for your daily wellness
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6 max-w-4xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-2"
            >
              <div className="aspect-square overflow-hidden bg-muted/30">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-display text-sm md:text-base font-semibold text-foreground mb-1">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm mb-2">
                  {product.tagline}
                </p>
                <a 
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-xs md:text-sm font-medium hover:underline transition-colors"
                >
                  Learn More
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
