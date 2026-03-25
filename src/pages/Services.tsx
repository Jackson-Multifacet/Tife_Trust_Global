import React from "react"
import { motion } from "framer-motion"
import { Building2, CreditCard, Landmark, LineChart, ShieldCheck, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Services() {
  const services = [
    {
      title: "Personal Loans",
      description: "Flexible personal loans tailored to your individual needs, with competitive rates and easy repayment options.",
      icon: Wallet,
      features: ["Quick approval", "No hidden fees", "Flexible terms"]
    },
    {
      title: "Business Financing",
      description: "Empower your business growth with our comprehensive financing solutions for startups and established enterprises.",
      icon: Building2,
      features: ["Working capital", "Equipment financing", "Expansion loans"]
    },
    {
      title: "Investment Management",
      description: "Expert guidance and strategic investment plans to help you grow and protect your wealth for the long term.",
      icon: LineChart,
      features: ["Portfolio diversification", "Risk management", "Market analysis"]
    },
    {
      title: "Mortgage Services",
      description: "Turn your dream home into a reality with our competitive mortgage rates and personalized guidance.",
      icon: Landmark,
      features: ["First-time buyers", "Refinancing", "Home equity loans"]
    },
    {
      title: "Credit Solutions",
      description: "Manage your credit effectively with our range of credit cards and credit improvement services.",
      icon: CreditCard,
      features: ["Reward programs", "Low interest rates", "Credit monitoring"]
    },
    {
      title: "Financial Planning",
      description: "Comprehensive financial planning to help you achieve your life goals and secure your financial future.",
      icon: ShieldCheck,
      features: ["Retirement planning", "Tax strategies", "Estate planning"]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Financial <span className="text-primary">Services</span></h1>
            <p className="text-xl text-muted-foreground">
              We offer a wide range of financial solutions designed to meet your unique needs and help you achieve your financial goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-3xl bg-card border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <service.icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, j) => (
                  <li key={j} className="flex items-center text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full rounded-xl" render={<Link to="/candidate-form" />}>
                Apply Now
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to take the next step?</h2>
          <p className="text-primary-foreground/80 text-lg mb-10">
            Our experts are here to help you navigate your financial journey and find the best solutions for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="rounded-full px-8" render={<Link to="/candidate-form" />}>
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10" render={<Link to="/about" />}>
              Learn More About Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
