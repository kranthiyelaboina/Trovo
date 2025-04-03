import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Menu, QrCode, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Card as CardType } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBankById } from "@/services/mockData";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { apiRequest, queryClient } from "@/lib/queryClient";

const paymentFormSchema = z.object({
  upiId: z.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/, "Invalid UPI ID format (e.g. name@upi)"),
  amount: z.coerce.number().min(1, "Amount must be at least ₹1").max(100000, "Amount cannot exceed ₹1,00,000"),
  cardId: z.string().optional(),
  usePoints: z.boolean().default(false),
  paymentMethod: z.enum(["upi", "card", "points"], {
    required_error: "Please select a payment method",
  }),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export default function PaymentsPage() {
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const { data: cards, isLoading } = useQuery<CardType[]>({
    queryKey: ["/api/cards"],
  });
  
  // Initialize form
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      upiId: "",
      amount: 0,
      usePoints: false,
      paymentMethod: "upi",
    },
  });
  
  // Get the selected card details
  const selectedCardId = form.watch("cardId");
  const selectedCard = selectedCardId 
    ? cards?.find(card => card.id.toString() === selectedCardId) 
    : undefined;
  
  // Calculate points that would be used for payment
  const amount = form.watch("amount") || 0;
  const selectedPaymentMethod = form.watch("paymentMethod") as string; // Cast to string for TypeScript compatibility
  const usePoints = form.watch("usePoints");
  
  // Calculate points required (using a fixed conversion rate of 0.25)
  const conversionRate = 0.25;
  const requiredPoints = Math.ceil(amount / conversionRate);
  
  // Calculate points available for the selected card
  const availablePoints = selectedCard?.points || 0;
  const canUsePoints = selectedCard && availablePoints >= requiredPoints;
  
  // Create payment mutation
  const paymentMutation = useMutation({
    mutationFn: async (data: PaymentFormValues) => {
      let transactionData: any = {
        date: new Date(), // Send as Date object, not string
        amount: data.amount,
        description: `UPI Payment to ${data.upiId}`,
      };
      
      // Determine if this transaction uses points (either "points" payment method or UPI with usePoints)
      // Using as-casting to handle TypeScript's enum checking
      const paymentMethod = data.paymentMethod as string;
      const isPointsPayment = paymentMethod === "points";
      const isUpiWithPoints = paymentMethod === "upi" && data.usePoints;
      const isCardPayment = paymentMethod === "card";
      
      // If we need a card for this transaction
      if (isCardPayment || isUpiWithPoints || isPointsPayment) {
        if (!data.cardId) throw new Error("Card ID is required");
        const cardId = parseInt(data.cardId);
        
        // For points-based payment, calculate points spent
        // For card payment, calculate points earned (cashback)
        const pointsEarned = (isPointsPayment || isUpiWithPoints)
          ? -Math.ceil(data.amount / conversionRate) // Negative for points spent
          : Math.ceil(data.amount * 0.01); // 1% cashback on card payments
          
        transactionData = {
          ...transactionData,
          cardId,
          pointsEarned,
        };
      } else {
        // Regular UPI payment without card/points
        if (!data.cardId && cards && cards.length > 0) {
          // Use the first card if available
          transactionData.cardId = cards[0].id;
          transactionData.pointsEarned = Math.ceil(data.amount * 0.01); // 1% cashback
        } else {
          throw new Error("No card available for this transaction");
        }
      }
      
      const res = await apiRequest("POST", "/api/transactions", transactionData);
      return await res.json();
    },
    onSuccess: () => {
      setIsProcessing(false);
      setIsPaymentSuccess(true);
      
      // Invalidate relevant queries to update UI
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      
      toast({
        title: "Payment Successful",
        description: `₹${form.getValues().amount.toLocaleString()} paid to ${form.getValues().upiId}`,
      });
    },
    onError: (error: Error) => {
      setIsProcessing(false);
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle payment submission
  const onSubmit = (data: PaymentFormValues) => {
    setIsProcessing(true);
    paymentMutation.mutate(data);
  };
  
  // Reset form for another payment
  const handleNewPayment = () => {
    setIsPaymentSuccess(false);
    form.reset();
  };
  
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
            <h1 className="text-2xl font-bold text-neutral-800">UPI Payments</h1>
            <p className="text-neutral-500 mt-1">Make payments and use your credit card points</p>
          </div>
          
          {/* Payment Section */}
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3">
              <Card>
                <CardContent className="pt-6">
                  {isPaymentSuccess ? (
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-neutral-800 mb-2">Payment Successful!</h2>
                      <p className="text-neutral-600 mb-6">Your payment has been processed successfully.</p>
                      <Button onClick={handleNewPayment}>Make Another Payment</Button>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                          <h2 className="text-xl font-semibold">Payment Details</h2>
                          
                          <FormField
                            control={form.control}
                            name="upiId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>UPI ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="name@upi" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Amount (₹)</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="0" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>Payment Method</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="upi" id="upi" />
                                      <Label htmlFor="upi">UPI</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem 
                                        value="card" 
                                        id="card" 
                                        disabled={!cards || cards.length === 0}
                                      />
                                      <Label htmlFor="card" className={!cards || cards.length === 0 ? "text-neutral-400" : ""}>
                                        Credit Card
                                        {(!cards || cards.length === 0) && " (No cards available)"}
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem 
                                        value="points" 
                                        id="points" 
                                        disabled={!canUsePoints}
                                      />
                                      <Label htmlFor="points" className={!canUsePoints ? "text-neutral-400" : ""}>
                                        Redeem Points
                                        {!selectedCard && " (Select a card)"}
                                        {selectedCard && !canUsePoints && " (Insufficient points)"}
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {selectedPaymentMethod === "card" && (
                            <FormField
                              control={form.control}
                              name="cardId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Select Card</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a card" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {cards?.map(card => {
                                        const bank = getBankById(card.bankId);
                                        return (
                                          <SelectItem key={card.id} value={card.id.toString()}>
                                            {bank?.name} •••• {card.lastFourDigits}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          {selectedPaymentMethod === "points" && (
                            <FormField
                              control={form.control}
                              name="cardId"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Select Card for Points</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a card" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {cards?.map(card => {
                                        const bank = getBankById(card.bankId);
                                        return (
                                          <SelectItem key={card.id} value={card.id.toString()}>
                                            {bank?.name} •••• {card.lastFourDigits} ({card.points.toLocaleString()} pts)
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          {selectedPaymentMethod === "upi" && cards && cards.length > 0 && (
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center space-x-2">
                                <FormField
                                  control={form.control}
                                  name="usePoints"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                      <FormControl>
                                        <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                          id="use-points"
                                        />
                                      </FormControl>
                                      <Label htmlFor="use-points">Pay with Points</Label>
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              {usePoints && (
                                <FormField
                                  control={form.control}
                                  name="cardId"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Select Card for Points</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select a card" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {cards?.map(card => {
                                            const bank = getBankById(card.bankId);
                                            return (
                                              <SelectItem key={card.id} value={card.id.toString()}>
                                                {bank?.name} •••• {card.lastFourDigits} ({card.points.toLocaleString()} pts)
                                              </SelectItem>
                                            );
                                          })}
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={isProcessing || (
                            (selectedPaymentMethod === "points" || (selectedPaymentMethod === "upi" && usePoints)) && 
                            (!selectedCard || !canUsePoints)
                          )}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Pay ₹{amount.toLocaleString()}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
                  
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-600">Amount</span>
                          <span className="font-medium">₹{amount.toLocaleString()}</span>
                        </div>
                        
                        {(selectedPaymentMethod === "points" || (selectedPaymentMethod === "upi" && usePoints)) && selectedCard && (
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-600">Points Required</span>
                            <div className="flex flex-col items-end">
                              <span className="font-medium">{requiredPoints.toLocaleString()} pts</span>
                              <span className="text-xs text-neutral-500">
                                (₹{conversionRate} per point)
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {selectedCard && (
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-600">Available Points</span>
                            <span className={`font-medium ${availablePoints < requiredPoints && (selectedPaymentMethod === "points" || usePoints) ? "text-rose-500" : ""}`}>
                              {selectedCard.points.toLocaleString()} pts
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {selectedCard && (
                        <div className="p-3 bg-neutral-50 rounded-lg">
                          <h3 className="text-sm font-medium mb-2">Selected Card</h3>
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-md flex items-center justify-center text-white ${
                              selectedCard.bankId === 'hdfc' ? "bg-purple-600" :
                              selectedCard.bankId === 'icici' ? "bg-orange-500" :
                              selectedCard.bankId === 'sbi' ? "bg-blue-600" :
                              selectedCard.bankId === 'axis' ? "bg-emerald-600" :
                              "bg-primary"
                            }`}>
                              {selectedCard.bankId.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-sm">
                                {getBankById(selectedCard.bankId)?.name} {selectedCard.cardType}
                              </p>
                              <p className="text-xs text-neutral-500">
                                •••• {selectedCard.lastFourDigits}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium mb-3">Scan to Pay</h3>
                        <div className="flex justify-center">
                          <div className="h-40 w-40 bg-white p-1 border border-neutral-200 rounded-md flex items-center justify-center">
                            <QrCode className="h-full w-full text-neutral-800" />
                          </div>
                        </div>
                        <p className="text-xs text-center text-neutral-500 mt-2">
                          Scan this QR code with any UPI app
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
