import { Link, useLocation } from "wouter";
import { useApp } from "@/context/AppContext";
import { 
  LayoutDashboard, 
  FolderGit2, 
  ActivitySquare, 
  Receipt, 
  Settings2,
  LogOut,
  Map,
  Compass
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useApp();
  const [location] = useLocation();

  if (!user) {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: FolderGit2 },
    { name: "Activities", href: "/activities", icon: ActivitySquare },
    { name: "Billing", href: "/billing", icon: Receipt },
    { name: "Equipment", href: "/equipment", icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border shrink-0">
          <Map className="w-6 h-6 text-sidebar-primary mr-3" />
          <span className="font-semibold text-lg tracking-tight">Digital Reality</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.startsWith(item.href);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-9 w-9 border border-sidebar-border">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user.role}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
