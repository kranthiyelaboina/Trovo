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
  
  // Get current theme from localStorage or default to system preference
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      // Check if theme is stored in localStorage
      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      
      if (storedTheme) {
        return storedTheme;
      }
      
      // Check system preference if no stored theme
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      
      return 'light';
    }
    return 'light';
  });
  
  // Apply theme when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);
  
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
      description: `The application is now in ${newTheme} mode.`,
      variant: newTheme === 'dark' ? 'default' : 'default',
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
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-neutral-900 border-r border-border h-screen">
      <div className="p-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-xl font-bold flex items-center">
            <Shield className="mr-2 h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent dark:from-primary dark:to-primary/80">
              Trovo
            </span>
          </h1>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-neutral-600 dark:text-neutral-300 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? 
            <Moon className="h-5 w-5 text-neutral-700" /> : 
            <Sun className="h-5 w-5 text-neutral-200" />
          }
        </Button>
      </div>
      
      <div className="mt-2 px-3">
        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-3 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary font-semibold">
            {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-800 dark:text-white">{user?.name || user?.username || 'User'}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 mt-4">
        <div className="mb-2 px-3">
          <h3 className="text-xs uppercase font-medium text-neutral-500 dark:text-neutral-400">Main Menu</h3>
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavigationItem href={item.href} isActive={location === item.href}>
                {item.icon}
                {item.label}
              </NavigationItem>
            </li>
          ))}
        </ul>
        
        <div className="mt-6 mb-2 px-3">
          <h3 className="text-xs uppercase font-medium text-neutral-500 dark:text-neutral-400">Settings</h3>
        </div>
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
      </nav>
      
      <div className="p-3">
        <Button
          variant="outline" 
          className="w-full justify-start text-neutral-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {logoutMutation.isPending ? 'Logging out...' : 'Log Out'}
        </Button>
      </div>
    </aside>
  );
}
