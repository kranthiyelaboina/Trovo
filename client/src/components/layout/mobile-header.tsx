import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Sun, Moon, Shield } from "lucide-react";
import Sidebar from "./sidebar";

export default function MobileHeader() {
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
      description: `The application is now in ${newTheme} mode.`,
      variant: newTheme === 'dark' ? 'default' : 'default',
    });
  };

  return (
    <header className="md:hidden bg-white dark:bg-neutral-800 p-4 shadow-sm z-10 fixed top-0 left-0 right-0 flex items-center justify-between border-b border-border">
      <Link href="/">
        <div className="flex items-center cursor-pointer">
          <h1 className="text-xl font-bold flex items-center">
            <Shield className="mr-2 h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent dark:from-primary dark:to-primary/80">
              Trovo
            </span>
          </h1>
        </div>
      </Link>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="text-neutral-600 dark:text-neutral-300 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? 
            <Moon className="h-5 w-5 text-neutral-700" /> : 
            <Sun className="h-5 w-5 text-neutral-200" />
          }
        </Button>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 border-r border-border">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}