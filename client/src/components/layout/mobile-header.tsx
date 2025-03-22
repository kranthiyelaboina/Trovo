import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Sun, Moon, Shield } from "lucide-react";
import Sidebar from "./sidebar";

export default function MobileHeader() {
  // Get current theme from localStorage or default to light
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });
  
  const { toast } = useToast();
  
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

  return (
    <header className="md:hidden bg-white dark:bg-neutral-900 p-4 shadow-sm z-10 fixed top-0 left-0 right-0 flex items-center justify-between">
      <Link href="/">
        <div className="flex items-center cursor-pointer">
          <h1 className="text-xl font-bold text-primary dark:text-white flex items-center">
            <Shield className="mr-2 h-6 w-6" />
            CredPal
          </h1>
        </div>
      </Link>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="text-neutral-600 dark:text-neutral-300"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}