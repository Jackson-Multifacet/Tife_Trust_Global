import { Outlet, Link } from "react-router-dom"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Menu, ChevronDown, LogIn, UserPlus, ShieldCheck } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"

export default function MainLayout() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight leading-none">Tife Trust</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Global</span>
              </div>
            </Link>
            <nav className="hidden md:flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" className="gap-2" />}>
                  Portal <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem render={<Link to="/portal/login" />} className="gap-2">
                    <LogIn className="h-4 w-4" /> Login
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link to="/candidate-form" />} className="gap-2">
                    <UserPlus className="h-4 w-4" /> Apply Now
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-2">
              <ModeToggle />
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger render={<Button variant="ghost" size="icon" />}>
                  <Menu className="h-6 w-6" />
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[400px] p-0 border-l-0 bg-background/80 backdrop-blur-2xl">
                  <div className="flex flex-col h-full">
                    <SheetHeader className="p-6 border-b bg-muted/10 backdrop-blur-md">
                      <SheetTitle className="text-left">
                        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold tracking-tight text-lg">Tife Trust Global</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Excellence in Finance</span>
                          </div>
                        </Link>
                      </SheetTitle>
                    </SheetHeader>
                    
                    <div className="flex-1 overflow-y-auto py-8 px-6">
                      <nav className="flex flex-col gap-6">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 px-2">Main Navigation</p>
                          <div className="grid gap-1">
                            {navLinks.map((link) => (
                              <Link
                                key={link.name}
                                to={link.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between group p-4 rounded-2xl hover:bg-primary/10 transition-all duration-300 active:scale-[0.98]"
                              >
                                <span className="text-lg font-semibold group-hover:text-primary transition-colors">{link.name}</span>
                                <ChevronDown className="h-5 w-5 -rotate-90 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                              </Link>
                            ))}
                          </div>
                        </div>
                        
                        <div className="h-px bg-border/50 mx-2" />
                        
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 px-2">Portal Access</p>
                          <div className="grid gap-4">
                            <Link
                              to="/portal/login"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-4 p-5 rounded-[2rem] border bg-background/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
                                <LogIn className="h-6 w-6" />
                              </div>
                              <div className="flex flex-col">
                                <p className="font-bold text-base">Staff Login</p>
                                <p className="text-xs text-muted-foreground leading-tight">Manage applications & clients</p>
                              </div>
                            </Link>
                            
                            <Link
                              to="/candidate-form"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-4 p-5 rounded-[2rem] border-2 border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-500 shadow-xl shadow-primary/20 group active:scale-[0.98]"
                            >
                              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                <UserPlus className="h-6 w-6" />
                              </div>
                              <div className="flex flex-col">
                                <p className="font-bold text-base">Apply Now</p>
                                <p className="text-xs text-primary-foreground/80 leading-tight">Start your financial journey today</p>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </nav>
                    </div>
                    
                    <div className="p-8 border-t bg-muted/5 backdrop-blur-md">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                          <p className="text-xs text-muted-foreground font-semibold">© 2026 Tife Trust Global</p>
                          <p className="text-[10px] text-muted-foreground/60">All rights reserved</p>
                        </div>
                        <ModeToggle />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Tife Trust Global. Finance made easy, trust made strong.
          </p>
        </div>
      </footer>
    </div>
  )
}
