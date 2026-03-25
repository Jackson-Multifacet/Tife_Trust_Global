import React from "react"
import { motion } from "framer-motion"
import { Shield, Users, Target, Award, CheckCircle2 } from "lucide-react"

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary/5 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Empowering Dreams, <span className="text-primary">Building Futures</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Tife Trust Global is a leading financial services provider dedicated to fostering economic growth and individual prosperity through innovative financial solutions.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 transform translate-x-1/2" />
      </section>

      {/* Mission & Vision */}
      <section className="py-24 container mx-auto px-4">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12"
        >
          <motion.div variants={itemVariants} className="space-y-6 p-8 rounded-3xl bg-card border shadow-sm">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              To provide accessible, reliable, and transparent financial services that empower individuals and businesses to achieve their full potential and contribute to a thriving global economy.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6 p-8 rounded-3xl bg-card border shadow-sm">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Award className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold">Our Vision</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              To be the most trusted and innovative financial partner, recognized globally for our commitment to excellence, integrity, and the sustainable success of our clients.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground">The principles that guide everything we do at Tife Trust Global.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Integrity", desc: "We uphold the highest standards of honesty and ethical behavior in all our interactions.", icon: Shield },
              { title: "Client-Centric", desc: "Our clients' success is our priority. We listen, understand, and deliver tailored solutions.", icon: Users },
              { title: "Innovation", desc: "We continuously seek new ways to improve our services and leverage technology for better results.", icon: CheckCircle2 },
              { title: "Excellence", desc: "We strive for perfection in every detail, ensuring the highest quality of service.", icon: Award },
            ].map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-6 rounded-2xl border text-center space-y-4"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
