import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import MobileHeader from "@/components/layout/mobile-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, Bell, Shield, Lock } from "lucide-react";

export default function SettingsPage() {
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
      variant: newTheme === 'dark' ? 'default' : 'default',
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
      
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-[60px] md:pt-0">
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
          {/* Page Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent dark:from-primary dark:to-primary/80 mb-2">
                Settings
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base">
                Customize your account preferences and application settings
              </p>
            </div>
            
            {/* Desktop theme toggle */}
            <div className="hidden md:flex items-center gap-2 mt-4 sm:mt-0">
              <Button 
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-700/60"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4 text-neutral-300" />
                    <span>Light Mode</span>
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Settings Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Appearance */}
            <Card className="card-gradient bg-white dark:bg-neutral-800">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Sun className="h-5 w-5 mr-2 text-primary dark:text-primary-foreground" />
                  <h2 className="section-title">Appearance</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700/30 rounded-lg">
                    <div>
                      <Label htmlFor="dark-mode" className="font-medium text-neutral-800 dark:text-white">Dark Mode</Label>
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
            <Card className="card-gradient bg-white dark:bg-neutral-800">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Bell className="h-5 w-5 mr-2 text-primary dark:text-primary-foreground" />
                  <h2 className="section-title">Notifications</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700/30 rounded-lg">
                    <div>
                      <Label htmlFor="all-notifications" className="font-medium text-neutral-800 dark:text-white">Enable Notifications</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Receive notifications about your account activity</p>
                    </div>
                    <Switch 
                      id="all-notifications" 
                      defaultChecked={true}
                      onCheckedChange={handleNotificationChange}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700/30 rounded-lg">
                    <div>
                      <Label htmlFor="points-expiry" className="font-medium text-neutral-800 dark:text-white">Points Expiry Alerts</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Get notified when your points are about to expire</p>
                    </div>
                    <Switch id="points-expiry" defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700/30 rounded-lg">
                    <div>
                      <Label htmlFor="new-offers" className="font-medium text-neutral-800 dark:text-white">New Redemption Offers</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Get notified about new redemption options</p>
                    </div>
                    <Switch id="new-offers" defaultChecked={true} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Security */}
            <Card className="card-gradient bg-white dark:bg-neutral-800">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-5 w-5 mr-2 text-primary dark:text-primary-foreground" />
                  <h2 className="section-title">Security</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700/30 rounded-lg">
                    <div>
                      <Label htmlFor="two-factor" className="font-medium text-neutral-800 dark:text-white">Two-Factor Authentication</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Add an extra layer of security to your account</p>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700/30 rounded-lg">
                    <div>
                      <Label htmlFor="biometric" className="font-medium text-neutral-800 dark:text-white">Biometric Authentication</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Use fingerprint or face ID to authenticate</p>
                    </div>
                    <Switch id="biometric" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Data & Privacy */}
            <Card className="card-gradient bg-white dark:bg-neutral-800">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Lock className="h-5 w-5 mr-2 text-primary dark:text-primary-foreground" />
                  <h2 className="section-title">Data & Privacy</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700/30 rounded-lg">
                    <div>
                      <Label htmlFor="analytics" className="font-medium text-neutral-800 dark:text-white">Usage Analytics</Label>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Allow us to collect anonymous usage data</p>
                    </div>
                    <Switch id="analytics" defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700/30 rounded-lg">
                    <div>
                      <Label htmlFor="marketing" className="font-medium text-neutral-800 dark:text-white">Marketing Communications</Label>
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