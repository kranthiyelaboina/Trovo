import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getAllBanks } from "@/services/mockData";

const formSchema = z.object({
  bankId: z.string().min(1, "Please select a bank"),
  cardType: z.string().min(1, "Please select a card type"),
  lastFourDigits: z.string().length(4, "Must be exactly 4 digits").regex(/^\d+$/, "Must contain only numbers"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid format (MM/YY)"),
  points: z.string().regex(/^\d+$/, "Must contain only numbers").transform(Number).optional(),
  pointsExpiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").optional().or(z.literal(''))
});

type FormValues = z.infer<typeof formSchema>;

interface AddCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddCardDialog({ open, onOpenChange }: AddCardDialogProps) {
  const { toast } = useToast();
  const [selectedBank, setSelectedBank] = useState<string>('');
  
  const banks = getAllBanks();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankId: '',
      cardType: '',
      lastFourDigits: '',
      expiryDate: '',
      points: '',
      pointsExpiryDate: ''
    }
  });
  
  const addCardMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const payload = {
        ...data,
        points: Number(data.points || 0),
        pointsExpiryDate: data.pointsExpiryDate || undefined
      };
      const res = await apiRequest("POST", "/api/cards", payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Card added successfully",
        description: "Your credit card has been added to your account",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding card",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  function onSubmit(data: FormValues) {
    addCardMutation.mutate(data);
  }
  
  // Get available card types for the selected bank
  const getCardTypes = () => {
    if (!selectedBank) return [];
    const bank = banks.find(b => b.id === selectedBank);
    return bank ? bank.cardTypes : [];
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
          <DialogDescription>
            Add your credit card details to track and manage your reward points.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bankId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Bank</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedBank(value);
                      // Reset card type when bank changes
                      form.setValue('cardType', '');
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="-- Select Bank --" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {banks.map(bank => (
                        <SelectItem key={bank.id} value={bank.id}>
                          {bank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cardType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedBank}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedBank ? "-- Select Card Type --" : "Select a bank first"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getCardTypes().map(cardType => (
                        <SelectItem key={cardType} value={cardType}>
                          {cardType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastFourDigits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last 4 Digits</FormLabel>
                  <FormControl>
                    <Input placeholder="1234" maxLength={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input placeholder="MM/YY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Points Balance (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="pointsExpiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points Expiry Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                type="submit" 
                disabled={addCardMutation.isPending}
              >
                {addCardMutation.isPending ? "Adding..." : "Add Card"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
