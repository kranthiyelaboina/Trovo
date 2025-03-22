import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, loginSchema, registerSchema } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { Shield, CreditCard, Wallet, Gift, ChevronRight, Loader2 } from "lucide-react";

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      email: "",
    },
  });

  // Submit handlers
  function onLoginSubmit(data: LoginFormValues) {
    loginMutation.mutate(data);
  }

  function onRegisterSubmit(data: RegisterFormValues) {
    registerMutation.mutate(data);
  }

  // If user is already logged in, redirect to home
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center mb-2">
              <Shield className="h-6 w-6 text-primary mr-2" />
              <CardTitle className="text-2xl font-bold text-primary">CredPal</CardTitle>
            </div>
            <CardDescription>
              Your digital credit card rewards manager
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={registerForm.control}
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
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="john@example.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Create a password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Confirm password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Hero section */}
      <div className="flex-1 bg-gradient-to-br from-primary/90 to-primary p-6 flex flex-col justify-center text-white">
        <div className="max-w-lg mx-auto">
          <h1 className="text-4xl font-bold mb-4">Maximize Your Credit Card Rewards</h1>
          <p className="text-white/90 text-lg mb-8">
            Track, manage, and redeem your credit card points all in one place. Never miss out on rewards again.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-white/10 p-3 rounded-lg mr-4">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Multiple Card Management</h3>
                <p className="text-white/80">Add all your credit cards from different banks in one dashboard</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/10 p-3 rounded-lg mr-4">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Smart Redemption</h3>
                <p className="text-white/80">Get personalized recommendations for the best value redemptions</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white/10 p-3 rounded-lg mr-4">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Easy Payments</h3>
                <p className="text-white/80">Make UPI payments and use your points for partial redemptions</p>
              </div>
            </div>
          </div>
          
          <div className="mt-10">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              onClick={() => setActiveTab("register")}
            >
              Get Started Today
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
