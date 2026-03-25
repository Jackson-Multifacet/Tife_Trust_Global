import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, Users, FileText, Settings } from "lucide-react"
import { Breadcrumbs } from "@/components/Breadcrumbs"

export default function DashboardLayout({ role = "staff" }: { role?: "staff" | "admin" }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    // TODO: Implement actual logout
    navigate("/portal/login")
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40 hidden md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <span className="text-primary">Tife Trust Global</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
              <Link
                to={`/portal/${role}`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  isActive(`/portal/${role}`) ? "bg-muted text-primary" : "text-muted-foreground"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              {role === "admin" && (
                <Link
                  to="/portal/admin/users"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    isActive("/portal/admin/users") ? "bg-muted text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Staff Management
                </Link>
              )}
              <Link
                to={`/portal/${role}/applications`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  isActive(`/portal/${role}/applications`) ? "bg-muted text-primary" : "text-muted-foreground"
                }`}
              >
                <FileText className="h-4 w-4" />
                Applications
              </Link>
              <Link
                to={`/portal/${role}/settings`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  isActive(`/portal/${role}/settings`) ? "bg-muted text-primary" : "text-muted-foreground"
                }`}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 justify-between">
          <div className="flex items-center gap-4 md:hidden">
            <span className="font-semibold text-primary">Tife Trust Global</span>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
