import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Menu, Sun, Moon } from "lucide-react";

export default function SettingsPage() {
  // Get current theme from localStorage or default to system
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      return savedTheme || 'light';
    }
    return 'light';
  });

  const { toast } = useToast();
  const [location, navigate] = useLocation();

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
    });
  };

  // Handle notification settings
  const handleNotificationChange = (value: boolean) => {
    toast({
      title: value ? "Notifications Enabled" : "Notifications Disabled",
      description: value 
        ? "You will now receive notifications about your account activity." 
        : "You will no longer receive notifications about your account activity.",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Header & Sidebar */}
      <header className="md:hidden bg-white dark:bg-neutral-900 p-4 shadow z-10 fixed top-0 left-0 right-0 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          CredPal
        </h1>
        
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
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-[60px] md:pt-0">
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
          {/* Page Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">Settings</h1>
            
            {/* Desktop theme toggle */}
            <div className="hidden md:flex items-center gap-2 mt-3 sm:mt-0">
              <Button 
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="gap-2"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="h-4 w-4" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4" />
                    <span>Light Mode</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Settings Cards */}
          <div className="grid grid-cols-1 gap-6">
            {/* Appearance */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-white">Appearance</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Toggle between light and dark mode</p>
                    </div>
                    <Switch 
                      id="dark-mode" 
                      checked={theme === 'dark'}
                      onCheckedChange={() => toggleTheme()}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Notifications */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-white">Notifications</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="all-notifications" className="font-medium">Enable Notifications</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Receive notifications about your account activity</p>
                    </div>
                    <Switch 
                      id="all-notifications" 
                      defaultChecked={true}
                      onCheckedChange={handleNotificationChange}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="points-expiry" className="font-medium">Points Expiry Alerts</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Get notified when your points are about to expire</p>
                    </div>
                    <Switch id="points-expiry" defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="new-offers" className="font-medium">New Redemption Offers</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Get notified about new redemption options</p>
                    </div>
                    <Switch id="new-offers" defaultChecked={true} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Security */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-white">Security</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="two-factor" className="font-medium">Two-Factor Authentication</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Add an extra layer of security to your account</p>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="biometric" className="font-medium">Biometric Authentication</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Use fingerprint or face ID to authenticate</p>
                    </div>
                    <Switch id="biometric" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Data & Privacy */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-white">Data & Privacy</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="analytics" className="font-medium">Usage Analytics</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Allow us to collect anonymous usage data</p>
                    </div>
                    <Switch id="analytics" defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing" className="font-medium">Marketing Communications</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Receive emails about new features and offers</p>
                    </div>
                    <Switch id="marketing" defaultChecked={true} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}