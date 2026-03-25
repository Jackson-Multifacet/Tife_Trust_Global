import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Globe, 
  Briefcase, 
  CheckCircle2, 
  Users, 
  Award,
  ArrowUpRight,
  Zap,
  ChevronRight
} from "lucide-react"

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.1 }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Hero Section - Editorial Style */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1 }}
            src="https://images.unsplash.com/photo-1454165833767-027ffea9e778?q=80&w=2000"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background z-10" />
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary uppercase tracking-wider"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Trusted by 10,000+ Nigerians
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-8xl font-bold tracking-tight leading-[0.9] mb-8"
            >
              FINANCE MADE <span className="text-primary italic">EASY</span>,<br />
              TRUST MADE <span className="text-primary">STRONG</span>.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
            >
              Empowering individuals and businesses in Nigeria to achieve their financial goals with tailored solutions and expert guidance.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Button size="lg" render={<Link to="/candidate-form" />} className="h-14 px-8 text-base rounded-full gap-2 group">
                Get Started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" render={<Link to="/services" />} className="h-14 px-8 text-base rounded-full">
                Explore Services
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: "Active Clients", value: "10k+", icon: Users },
              { label: "Success Rate", value: "99.2%", icon: CheckCircle2 },
              { label: "Years Experience", value: "12+", icon: Award },
              { label: "Funds Managed", value: "₦5B+", icon: TrendingUp },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center md:items-start text-center md:text-left">
                <stat.icon className="h-5 w-5 text-primary mb-2 opacity-70" />
                <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Services */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-4">Our Expertise</h2>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Tailored solutions for your financial journey.</h3>
            </div>
            <Button variant="link" render={<Link to="/services" />} className="text-primary font-semibold text-lg p-0 h-auto gap-1">
              View all services <ArrowUpRight className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* TravelCash - Large Card */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="md:col-span-2 group relative overflow-hidden rounded-3xl border bg-card p-8 md:p-12 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
            >
              <div className="absolute inset-0 z-0 opacity-10 md:opacity-0 md:group-hover:opacity-10 transition-opacity duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=1000" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-3xl font-bold mb-4">TravelCash</h4>
                <p className="text-lg text-muted-foreground max-w-md mb-8">
                  Unlock your travel dreams. We provide secure funds for visa processing, flight bookings, and travel logistics with flexible repayment plans.
                </p>
                <div className="mt-auto">
                  <Button variant="ghost" className="p-0 h-auto text-primary font-semibold hover:bg-transparent hover:text-primary/80 gap-2">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
            </motion.div>

            {/* Savings */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="group relative overflow-hidden rounded-3xl border bg-card p-8 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
            >
              <div className="absolute inset-0 z-0 opacity-10 md:opacity-0 md:group-hover:opacity-10 transition-opacity duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=600" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-2xl font-bold mb-3">Savings & Investments</h4>
              <p className="text-muted-foreground mb-6">
                Grow your wealth with high-yield savings plans and diversified investment opportunities.
              </p>
              <Button variant="ghost" className="p-0 h-auto text-primary font-semibold hover:bg-transparent hover:text-primary/80 gap-2">
                Get started <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>

            {/* Advisory */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="group relative overflow-hidden rounded-3xl border bg-card p-8 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
            >
              <div className="absolute inset-0 z-0 opacity-10 md:opacity-0 md:group-hover:opacity-10 transition-opacity duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h4 className="text-2xl font-bold mb-3">Financial Advisory</h4>
              <p className="text-muted-foreground mb-6">
                Expert guidance on wealth management, tax planning, and retirement strategies.
              </p>
              <Button variant="ghost" className="p-0 h-auto text-primary font-semibold hover:bg-transparent hover:text-primary/80 gap-2">
                Consult now <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>

            {/* Business */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="md:col-span-2 group relative overflow-hidden rounded-3xl border bg-card p-8 md:p-12 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
            >
              <div className="absolute inset-0 z-0 opacity-10 md:opacity-0 md:group-hover:opacity-10 transition-opacity duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-3xl font-bold mb-4">Business Financing</h4>
                <p className="text-lg text-muted-foreground max-w-md mb-8">
                  Fuel your business growth with our tailored funding solutions. From working capital to expansion loans, we support your entrepreneurial journey.
                </p>
                <div className="mt-auto">
                  <Button variant="ghost" className="p-0 h-auto text-primary font-semibold hover:bg-transparent hover:text-primary/80 gap-2">
                    Explore options <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mb-20 blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-muted/20 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="relative"
            >
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1521791136064-7986c2923216?q=80&w=1000" 
                  alt="Partnership"
                  className="w-full h-full object-cover aspect-[4/5]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-primary rounded-[2.5rem] -z-10" />
              <div className="absolute -top-8 -left-8 w-32 h-32 border-4 border-primary/20 rounded-full -z-10" />
              
              <div className="absolute top-12 -right-12 bg-background p-6 rounded-2xl shadow-xl border z-20 hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">99.2% Success</p>
                    <p className="text-xs text-muted-foreground">Application Approval</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="space-y-8"
            >
              <h2 className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">Our Impact</h2>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Driving economic growth through <span className="text-primary">financial inclusion</span>.
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Tife Trust Global, we believe that access to capital is a fundamental right. We've spent over a decade building a platform that bridges the gap between ambition and achievement for thousands of Nigerians.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-bold">Fast Processing</h4>
                  <p className="text-sm text-muted-foreground">Get your funds in as little as 24-48 hours after approval.</p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-bold">Secure Platform</h4>
                  <p className="text-sm text-muted-foreground">Your data and transactions are protected by bank-grade security.</p>
                </div>
              </div>

              <Button size="lg" className="rounded-full px-8 h-14 text-lg font-bold group" render={<Link to="/about" />}>
                Our Story <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Immersive Style */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2000" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/90 z-10" />
        </div>
        <div className="absolute inset-0 opacity-10 z-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div className="container px-4 md:px-6 mx-auto relative z-30">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <motion.h2 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="text-4xl md:text-6xl font-bold tracking-tight mb-8"
            >
              Ready to take control of your financial future?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="text-xl opacity-90 mb-12 max-w-2xl mx-auto"
            >
              Join thousands of Nigerians who trust Tife Trust Global for their financial growth and security.
            </motion.p>
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" variant="secondary" render={<Link to="/candidate-form" />} className="h-14 px-10 text-lg rounded-full">
                Apply Now
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Contact Support
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
