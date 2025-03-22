import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LogOut, LayoutDashboard, CreditCard, ArrowLeftRight, Gift, Wallet, User, Settings, Shield } from "lucide-react";

export default function Sidebar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { 
      href: "/", 
      label: "Dashboard", 
      icon: <LayoutDashboard className="mr-3 h-5 w-5" /> 
    },
    { 
      href: "/cards", 
      label: "My Cards", 
      icon: <CreditCard className="mr-3 h-5 w-5" /> 
    },
    { 
      href: "/transactions", 
      label: "Transactions", 
      icon: <ArrowLeftRight className="mr-3 h-5 w-5" /> 
    },
    { 
      href: "/redeem", 
      label: "Redeem", 
      icon: <Gift className="mr-3 h-5 w-5" /> 
    },
    { 
      href: "/payments", 
      label: "UPI Payments", 
      icon: <Wallet className="mr-3 h-5 w-5" /> 
    },
  ];

  const settingsItems = [
    { 
      href: "/profile", 
      label: "Profile", 
      icon: <User className="mr-3 h-5 w-5" /> 
    },
    { 
      href: "/settings", 
      label: "Settings", 
      icon: <Settings className="mr-3 h-5 w-5" /> 
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg h-screen">
      <div className="p-4 border-b border-neutral-200">
        <h1 className="text-2xl font-bold text-primary flex items-center">
          <Shield className="mr-2 h-6 w-6" />
          CredPal
        </h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <a className={cn(
                  "flex items-center p-3 rounded-lg font-medium transition-all",
                  location === item.href 
                    ? "bg-primary text-white" 
                    : "text-neutral-700 hover:bg-neutral-100"
                )}>
                  {item.icon}
                  {item.label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="mt-8 pt-4 border-t border-neutral-200">
          <h3 className="text-xs uppercase font-semibold text-neutral-500 mb-2 px-3">Settings</h3>
          <ul className="space-y-1">
            {settingsItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <a className={cn(
                    "flex items-center p-3 rounded-lg font-medium transition-all",
                    location === item.href 
                      ? "bg-primary text-white" 
                      : "text-neutral-700 hover:bg-neutral-100"
                  )}>
                    {item.icon}
                    {item.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {user?.name?.charAt(0) || user?.username.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-neutral-800">{user?.name || user?.username}</p>
            <button 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="text-xs text-neutral-500 hover:text-primary transition-all flex items-center"
            >
              <LogOut className="h-3 w-3 mr-1" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
