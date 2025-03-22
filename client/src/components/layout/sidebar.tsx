import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LogOut, LayoutDashboard, CreditCard, ArrowLeftRight, Gift, Wallet, User, Settings, Shield, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Sidebar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  
  // Get current theme from localStorage or default to light
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });
  
  // Toggle dark mode
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Update document
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    // Update state
    setTheme(newTheme);
    
    // Show toast
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Mode Activated`,
      description: `The application is now in ${newTheme} mode.`
    });
  };

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

  // Fix the Link nesting issue
  const NavigationItem = ({ href, isActive, children }: { 
    href: string, 
    isActive: boolean, 
    children: React.ReactNode 
  }) => (
    <Link href={href}>
      <div className={cn(
        "flex items-center p-3 rounded-lg font-medium transition-all cursor-pointer",
        isActive 
          ? "bg-primary text-white dark:bg-primary/80" 
          : "text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      )}>
        {children}
      </div>
    </Link>
  );

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-neutral-900 shadow-lg h-screen">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary dark:text-white flex items-center">
          <Shield className="mr-2 h-6 w-6" />
          CredPal
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-neutral-600 dark:text-neutral-300"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavigationItem href={item.href} isActive={location === item.href}>
                {item.icon}
                {item.label}
              </NavigationItem>
            </li>
          ))}
        </ul>
        
        <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <h3 className="text-xs uppercase font-semibold text-neutral-500 dark:text-neutral-400 mb-2 px-3">Settings</h3>
          <ul className="space-y-1">
            {settingsItems.map((item) => (
              <li key={item.href}>
                <NavigationItem href={item.href} isActive={location === item.href}>
                  {item.icon}
                  {item.label}
                </NavigationItem>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-white font-semibold">
            {user?.name?.charAt(0) || user?.username?.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-neutral-800 dark:text-white">{user?.name || user?.username}</p>
            <button 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-all flex items-center"
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
