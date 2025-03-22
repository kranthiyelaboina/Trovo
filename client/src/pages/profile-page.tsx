import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Menu, UserRound, Save, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery } from "@tanstack/react-query";
import { Card as CardType } from "@shared/schema";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const securityFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const preferenceFormSchema = z.object({
  notifications: z.boolean().default(true),
  theme: z.enum(["light", "dark", "system"]).default("light"),
  language: z.enum(["english", "hindi", "tamil"]).default("english"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;
type PreferenceFormValues = z.infer<typeof preferenceFormSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { data: cards } = useQuery<CardType[]>({
    queryKey: ["/api/cards"],
  });
  
  // Parse preferences
  const userPreferences = user?.preferences 
    ? JSON.parse(user.preferences) 
    : { notifications: true, theme: "light", language: "english" };
  
  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });
  
  // Security form
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Preferences form
  const preferencesForm = useForm<PreferenceFormValues>({
    resolver: zodResolver(preferenceFormSchema),
    defaultValues: {
      notifications: userPreferences.notifications,
      theme: userPreferences.theme,
      language: userPreferences.language || "english",
    },
  });
  
  function onProfileSubmit(data: ProfileFormValues) {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated.",
      });
    }, 1000);
  }
  
  function onSecuritySubmit(data: SecurityFormValues) {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      securityForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1000);
  }
  
  function onPreferencesSubmit(data: PreferenceFormValues) {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "Preferences updated",
        description: "Your preferences have been saved.",
      });
    }, 1000);
  }
  
  // Calculate account stats
  const totalCards = cards?.length || 0;
  const totalPoints = (cards && cards.length > 0) ? cards.reduce((sum, card) => sum + card.points, 0) : 0;
  const memberSince = user ? new Date(user.id > 1 ? "2023-01-01" : "2023-07-01").toLocaleDateString() : "";
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Header & Sidebar */}
      <header className="md:hidden bg-white p-4 shadow z-10 fixed top-0 left-0 right-0 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          CredPal
        </h1>
        
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
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-[60px] md:pt-0">
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-neutral-800">Your Profile</h1>
            <p className="text-neutral-500 mt-1">Manage your account settings and preferences</p>
          </div>
          
          {/* Profile Content */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <UserRound className="h-12 w-12" />
                    </div>
                    
                    <h2 className="text-xl font-bold">{user?.name || user?.username}</h2>
                    <p className="text-neutral-500">{user?.email}</p>
                    
                    <div className="w-full mt-6 pt-6 border-t border-neutral-200">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Username</span>
                          <span className="font-medium">{user?.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Account ID</span>
                          <span className="font-medium">#{user?.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Member Since</span>
                          <span className="font-medium">{memberSince}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Cards</span>
                          <span className="font-medium">{totalCards}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Total Points</span>
                          <span className="font-medium">{totalPoints.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Settings Tabs */}
            <div className="md:col-span-2">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                        <CardContent className="pt-6 space-y-4">
                          <FormField
                            control={profileForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="john@example.com" type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </CardFooter>
                      </form>
                    </Form>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card>
                    <Form {...securityForm}>
                      <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)}>
                        <CardContent className="pt-6 space-y-4">
                          <FormField
                            control={securityForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                  <Input placeholder="••••••••" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={securityForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input placeholder="••••••••" type="password" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Password must be at least 6 characters long.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={securityForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                  <Input placeholder="••••••••" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              "Change Password"
                            )}
                          </Button>
                        </CardFooter>
                      </form>
                    </Form>
                  </Card>
                </TabsContent>
                
                <TabsContent value="preferences">
                  <Card>
                    <Form {...preferencesForm}>
                      <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)}>
                        <CardContent className="pt-6 space-y-6">
                          <FormField
                            control={preferencesForm.control}
                            name="notifications"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Notifications
                                  </FormLabel>
                                  <FormDescription>
                                    Receive email notifications about your account activity.
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={preferencesForm.control}
                            name="theme"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>Theme</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="light" id="light" />
                                      <Label htmlFor="light">Light</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="dark" id="dark" />
                                      <Label htmlFor="dark">Dark</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="system" id="system" />
                                      <Label htmlFor="system">System</Label>
                                    </div>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={preferencesForm.control}
                            name="language"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>Language</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="english" id="english" />
                                      <Label htmlFor="english">English</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="hindi" id="hindi" />
                                      <Label htmlFor="hindi">Hindi</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="tamil" id="tamil" />
                                      <Label htmlFor="tamil">Tamil</Label>
                                    </div>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save Preferences"
                            )}
                          </Button>
                        </CardFooter>
                      </form>
                    </Form>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
