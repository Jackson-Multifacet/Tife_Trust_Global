import React from "react"
import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"

export function Breadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)

  const getBreadcrumbName = (path: string) => {
    const names: Record<string, string> = {
      portal: "Portal",
      staff: "Staff Dashboard",
      admin: "Admin Dashboard",
      applications: "Applications",
      users: "Staff Management",
      settings: "Settings",
    }
    return names[path] || path.charAt(0).toUpperCase() + path.slice(1)
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      <Link
        to="/"
        className="flex items-center hover:text-primary transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1
        const to = `/${pathnames.slice(0, index + 1).join("/")}`

        return (
          <React.Fragment key={to}>
            <ChevronRight className="h-4 w-4" />
            {last ? (
              <span className="font-medium text-foreground">
                {getBreadcrumbName(value)}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-primary transition-colors"
              >
                {getBreadcrumbName(value)}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
