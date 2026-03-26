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
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.15 }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Hero Section - Editorial Style */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background z-10" />
          <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[160px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px]" />
          <div className="absolute inset-0 bg-grid-white opacity-20 z-10" />
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-20">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-semibold text-primary uppercase tracking-[0.2em] shadow-2xl"
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
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.85] mb-10 text-glow"
            >
              FINANCE MADE <span className="text-primary italic font-serif">EASY</span>,<br />
              TRUST MADE <span className="text-primary">STRONG</span>.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-12 leading-relaxed font-light"
            >
              Empowering individuals and businesses in Nigeria to achieve their financial goals with tailored solutions and expert guidance.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
            >
              <Button size="lg" render={<Link to="/candidate-form" />} className="h-16 px-10 text-lg rounded-full gap-3 group bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all duration-500 hover:scale-105 active:scale-95">
                Get Started <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Button>
              <Button size="lg" variant="outline" render={<Link to="/services" />} className="h-16 px-10 text-lg rounded-full border-white/10 hover:bg-white/5 backdrop-blur-sm transition-all duration-500 hover:scale-105 active:scale-95">
                Explore Services
              </Button>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40"
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary flex justify-center pt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y glass relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white opacity-5" />
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            className="grid grid-cols-2 md:grid-cols-4 gap-12"
          >
            {[
              { label: "Active Clients", value: "10k+", icon: Users },
              { label: "Success Rate", value: "99.2%", icon: CheckCircle2 },
              { label: "Years Experience", value: "12+", icon: Award },
              { label: "Funds Managed", value: "₦5B+", icon: TrendingUp },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 rounded-2xl bg-primary/10 text-primary">
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="text-4xl md:text-5xl font-bold tracking-tighter mb-1">{stat.value}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-[0.3em] font-bold">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Services */}
      <section className="py-32 bg-background relative">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-3xl">
              <motion.h2 
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                className="text-sm font-bold text-primary uppercase tracking-[0.4em] mb-6"
              >
                Our Expertise
              </motion.h2>
              <motion.h3 
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight"
              >
                Tailored solutions for your <span className="text-primary italic">financial journey</span>.
              </motion.h3>
            </div>
            <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView">
              <Button variant="link" render={<Link to="/services" />} className="text-primary font-bold text-xl p-0 h-auto gap-2 group">
                View all services <ArrowUpRight className="h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto">
            {/* TravelCash - Large Card */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="md:col-span-8 group relative overflow-hidden rounded-[3rem] border border-white/10 bg-card p-12 md:p-16 hover:shadow-3xl hover:shadow-primary/10 transition-all duration-700 min-h-[500px] flex flex-col justify-end"
            >
              <div className="absolute inset-0 z-0">
                <img 
                  src="/travel_cash_service.png" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
              </div>
              <div className="relative z-10 text-white">
                <div className="glass w-20 h-20 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <h4 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">TravelCash</h4>
                <p className="text-xl text-white/80 max-w-xl mb-10 leading-relaxed font-light">
                  Unlock your travel dreams. We provide secure funds for visa processing, flight bookings, and travel logistics with flexible repayment plans.
                </p>
                <Button className="h-14 px-8 text-lg rounded-full bg-white text-black hover:bg-white/90 gap-2 font-bold transition-all duration-500 hover:px-12">
                  Learn more <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>

            {/* Savings */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="md:col-span-4 group relative overflow-hidden rounded-[3rem] border border-white/10 bg-card p-10 hover:shadow-3xl hover:shadow-primary/10 transition-all duration-700 flex flex-col"
            >
              <div className="absolute inset-0 z-0 h-1/2">
                <img 
                  src="/savings_investment_service.png" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
              </div>
              <div className="relative z-10 pt-48 flex flex-col h-full">
                <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <h4 className="text-3xl font-bold mb-4 tracking-tight">Savings & Investments</h4>
                <p className="text-muted-foreground mb-10 leading-relaxed font-light text-lg">
                  Grow your wealth with high-yield savings plans and diversified investment opportunities.
                </p>
                <Button variant="ghost" className="mt-auto p-0 h-auto text-primary font-bold text-lg hover:bg-transparent hover:text-primary/80 gap-3 group/btn">
                  Get started <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-2" />
                </Button>
              </div>
            </motion.div>

            {/* Advisory */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="md:col-span-4 group relative overflow-hidden rounded-[3rem] border border-white/10 bg-card p-10 hover:shadow-3xl hover:shadow-primary/10 transition-all duration-700 flex flex-col"
            >
              <div className="absolute inset-0 z-0 h-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
              </div>
              <div className="relative z-10 pt-48 flex flex-col h-full">
                <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <ShieldCheck className="h-7 w-7 text-primary" />
                </div>
                <h4 className="text-3xl font-bold mb-4 tracking-tight">Financial Advisory</h4>
                <p className="text-muted-foreground mb-10 leading-relaxed font-light text-lg">
                  Expert guidance on wealth management, tax planning, and retirement strategies.
                </p>
                <Button variant="ghost" className="mt-auto p-0 h-auto text-primary font-bold text-lg hover:bg-transparent hover:text-primary/80 gap-3 group/btn">
                  Consult now <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-2" />
                </Button>
              </div>
            </motion.div>

            {/* Business */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="md:col-span-8 group relative overflow-hidden rounded-[3rem] border border-white/10 bg-card p-12 md:p-16 hover:shadow-3xl hover:shadow-primary/10 transition-all duration-700 min-h-[500px] flex flex-col justify-end"
            >
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1000" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
              </div>
              <div className="relative z-10 text-white">
                <div className="glass w-20 h-20 rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                  <Briefcase className="h-10 w-10 text-white" />
                </div>
                <h4 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Business Financing</h4>
                <p className="text-xl text-white/80 max-w-xl mb-10 leading-relaxed font-light">
                  Fuel your business growth with our tailored funding solutions. From working capital to expansion loans, we support your entrepreneurial journey.
                </p>
                <Button className="h-14 px-8 text-lg rounded-full bg-white text-black hover:bg-white/90 gap-2 font-bold transition-all duration-500 hover:px-12">
                  Explore options <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-32 bg-muted/10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="relative"
            >
              <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-axl hover:scale-[1.02] transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1000" 
                  alt="Partnership"
                  className="w-full h-full object-cover aspect-[4/5]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-primary/20 rounded-[4rem] -z-10 blur-3xl animate-pulse" />
              <div className="absolute -top-10 -left-10 w-40 h-40 border-8 border-primary/20 rounded-full -z-10" />
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-20 -right-16 glass p-8 rounded-3xl shadow-2xl border-white/20 z-20 hidden md:block max-w-[280px]"
              >
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-black">99.2%</p>
                    <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Approval Rate</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="space-y-12"
            >
              <div>
                <h2 className="text-sm font-black text-primary uppercase tracking-[0.5em] mb-8">Our Impact</h2>
                <h3 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] mb-8">
                  Driving growth through <span className="text-primary italic">financial inclusion</span>.
                </h3>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                  At Tife Trust Global, we believe that access to capital is a fundamental right. We've spent over a decade bridging the gap between ambition and achievement.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-4">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group hover:bg-primary hover:text-white transition-all duration-500 hover:scale-110">
                    <Zap className="h-7 w-7" />
                  </div>
                  <h4 className="text-2xl font-bold tracking-tight">Fast Processing</h4>
                  <p className="text-lg text-muted-foreground font-light">Get your funds in as little as 24-48 hours after approval.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group hover:bg-primary hover:text-white transition-all duration-500 hover:scale-110">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <h4 className="text-2xl font-bold tracking-tight">Secure Platform</h4>
                  <p className="text-lg text-muted-foreground font-light">Your data and transactions are protected by bank-grade security.</p>
                </div>
              </div>

              <Button size="lg" className="rounded-full px-12 h-16 text-xl font-bold group bg-primary hover:bg-primary/90 transition-all duration-500 hover:scale-105" render={<Link to="/about" />}>
                Our Story <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Immersive Style */}
      <section className="py-40 relative overflow-hidden mx-4 md:mx-10 rounded-[4rem] mb-20 shadow-3xl">
        <div className="absolute inset-0 z-0 scale-110">
          <img 
            src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/90 backdrop-blur-sm z-10" />
        </div>
        <div className="absolute inset-0 bg-grid-white opacity-10 z-20" />
        
        <div className="container px-4 md:px-6 mx-auto relative z-30 text-center">
          <div className="max-w-4xl mx-auto text-white">
            <motion.h2 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="text-5xl md:text-8xl font-bold tracking-tighter mb-12 leading-[0.9]"
            >
              Ready to take control of your <span className="italic font-serif">financial future</span>?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="text-xl md:text-3xl font-light opacity-90 mb-16 max-w-3xl mx-auto leading-relaxed"
            >
              Join thousands of Nigerians who trust Tife Trust Global for their financial growth and security.
            </motion.p>
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button size="lg" variant="secondary" render={<Link to="/candidate-form" />} className="h-18 px-12 text-xl rounded-full bg-white text-primary hover:bg-white/90 shadow-2xl font-bold transition-all duration-500 hover:scale-110 active:scale-95">
                Apply Now
              </Button>
              <Button size="lg" variant="outline" className="h-18 px-12 text-xl rounded-full border-white/20 text-white hover:bg-white/10 backdrop-blur-md transition-all duration-500 hover:scale-110 active:scale-95">
                Contact Support
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
