import { motion } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Linkedin,
  Twitter,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Team() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.15 },
  };

  const leadership = [
    {
      name: "Olajide Gbenga Omoroga",
      role: "Managing Director",
      image: "/managing_director.png",
      bio: "An experienced leader with a passion for financial inclusion and economic empowerment in Nigeria. Driving Tife Trust Global towards a future of transparent and accessible finance.",
      email: "md@tifetrustglobal.com",
      linkedin: "#",
      twitter: "#",
    },
  ];

  const staff = [
    {
      name: "Genesis Nyot",
      role: "Social Media Manager / HR Personnel",
      image: "/genesis_nyot.jpg",
      bio: "Crafting our digital narrative and nurturing our most valuable asset—our people. Bridging the gap between our brand and the community while ensuring our team's growth and wellbeing.",
      email: "genesis.nyot@tifetrustglobal.com",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "David Nuriel",
      role: "Business Development Officer",
      image: "/david_nuriel.jpg",
      bio: "Strategically expanding our reach and identifying new opportunities to serve our clients better. David's focus is on building lasting partnerships and driving sustainable growth.",
      email: "david.nuriel@tifetrustglobal.com",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Favour Ugochi Egbuchulam",
      role: "Sales Executive",
      image: "/favour_ugochiegbuchulam.jpg",
      bio: "Driving sales growth and building strong client relationships. Dedicated to delivering exceptional service and expanding our market presence.",
      email: "favour.ugochiegbuchulam@tifetrustglobal.com",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Oluwaseun Peter Akinoladimeji",
      role: "Client Service Officer",
      image: "/oluwaseun_peter_akinoladimeji.jpg",
      bio: "Committed to delivering exceptional client support and ensuring satisfaction. Dedicated to building lasting relationships and providing seamless service experiences.",
      email: "oluwaseun.peter@tifetrustglobal.com",
      linkedin: "#",
      twitter: "#",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden border-b">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[160px]" />
          <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px]" />
          <div className="absolute inset-0 bg-grid-white opacity-10" />
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="max-w-4xl text-center mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-bold text-primary uppercase tracking-[0.4em] mb-8"
            >
              Excellence in Leadership
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8"
            >
              OUR <span className="text-primary italic font-serif">TEAM</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light"
            >
              A synergy of vision, strategy, and community. Meet the people
              behind the trust.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 relative border-b border-white/5">
        <div className="container px-4 md:px-6 mx-auto">
          {leadership.map((member, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="group flex flex-col md:flex-row gap-16 items-center max-w-5xl mx-auto"
            >
              <div className="relative w-full md:w-[450px] aspect-[4/5] rounded-[4rem] overflow-hidden shadow-axl group-hover:scale-[1.02] transition-transform duration-700">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>

              <div className="flex-1 space-y-8 text-center md:text-left">
                <div>
                  <h3 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors duration-500">
                    {member.name}
                  </h3>
                  <p className="text-primary font-black uppercase tracking-[0.4em] text-lg">
                    {member.role}
                  </p>
                </div>

                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light italic opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                  "{member.bio}"
                </p>

                <div className="flex items-center justify-center md:justify-start gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-2xl w-14 h-14 border-white/10 hover:bg-primary hover:text-white transition-all duration-500"
                  >
                    <Mail className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-2xl w-14 h-14 border-white/10 hover:bg-primary hover:text-white transition-all duration-500"
                  >
                    <Linkedin className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-2xl w-14 h-14 border-white/10 hover:bg-primary hover:text-white transition-all duration-500"
                  >
                    <Twitter className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-32 relative bg-accent/5">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto"
          >
            {staff.map((member, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="group relative glass p-8 rounded-[3rem] border border-white/5 hover:border-primary/20 transition-all duration-700 flex flex-col gap-8"
              >
                <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors duration-500">
                      {member.name}
                    </h3>
                    <p className="text-primary font-bold uppercase tracking-[0.2em] text-xs mt-1">
                      {member.role}
                    </p>
                  </div>

                  <p className="text-base text-muted-foreground leading-relaxed font-light line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                    {member.bio}
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl h-10 w-10 hover:bg-primary/20 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl h-10 w-10 hover:bg-primary/20 transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Join the Team CTA */}
      <section className="py-32 border-t glass relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto relative z-10 text-center">
          <motion.h2
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            className="text-4xl md:text-6xl font-bold tracking-tighter mb-8"
          >
            Want to join our mission?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light"
          >
            We're always looking for talented individuals who share our passion
            for financial excellence.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
          >
            <Button
              size="lg"
              className="rounded-full px-12 h-16 text-lg font-bold bg-primary hover:bg-primary/90 transition-all duration-500 hover:scale-110 active:scale-95 group"
            >
              View Careers{" "}
              <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
