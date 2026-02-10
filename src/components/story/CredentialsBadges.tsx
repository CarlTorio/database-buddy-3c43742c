import { motion } from "framer-motion";
import { Award, GraduationCap, BadgeCheck, Users, ShieldCheck } from "lucide-react";

const credentials = [
  {
    icon: GraduationCap,
    title: "Doctor of Humanities (Honorary)",
    source: "Watchman Ministry of Academics",
  },
  {
    icon: Award,
    title: "Excellence in Holistic Healing Award",
    source: "The Great Hashem Corporation",
    highlight: true,
  },
  {
    icon: BadgeCheck,
    title: "Naturopath Practitioner (NAND)",
    source: "Professional Certification",
  },
  {
    icon: ShieldCheck,
    title: "Auriculo Chiro Manual Therapy Practitioner",
    source: "Asian Manual International Inc.",
  },
  {
    icon: Award,
    title: "Certificate of Appreciation",
    source: "Asian Manual Therapy Int. 2025",
  },
  {
    icon: Users,
    title: "Asian Manual Therapy International Inc. Member",
    source: "Professional Membership",
  },
  {
    icon: Users,
    title: "PANMED Member",
    source: "Professional Membership",
  },
  {
    icon: Users,
    title: "NAB International Member",
    source: "Nutrition Advisory Board",
  },
  {
    icon: BadgeCheck,
    title: "HCIBiz CMD North Fairview Authorized Dealer",
    source: "Health Code International",
  },
];

const CredentialsBadges = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
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
                Credentials & Affiliations
              </h2>
              <div className="w-12 h-[2px] gradient-accent" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {credentials.map((credential, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative p-5 rounded-xl border transition-all hover:shadow-lg ${
                  credential.highlight
                    ? "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 shadow-md"
                    : "bg-card border-border hover:border-accent/50"
                }`}
              >
                {credential.highlight && (
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                    2025
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2.5 rounded-lg ${
                      credential.highlight
                        ? "bg-primary/20 text-primary"
                        : "bg-accent/10 text-accent"
                    }`}
                  >
                    <credential.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-sm md:text-base leading-tight ${
                        credential.highlight ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {credential.title}
                    </h3>
                    <p
                      className={`text-xs md:text-sm mt-1 ${
                        credential.highlight ? "text-primary/80" : "text-muted-foreground"
                      }`}
                    >
                      {credential.source}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CredentialsBadges;
