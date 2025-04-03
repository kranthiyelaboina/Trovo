import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, Transaction } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBankById } from "@/services/mockData";
import { formatDistanceToNow } from "date-fns";
import { Loader2, CreditCard, Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CardDetailsProps {
  card: Card;
  open: boolean;
  onClose: () => void;
}

export default function CardDetails({ card, open, onClose }: CardDetailsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: transactions, isLoading: loadingTransactions } = useQuery<Transaction[]>({
    queryKey: [`/api/cards/${card.id}/transactions`],
    enabled: open,
  });
  
  const bank = getBankById(card.bankId);
  const conversionRate = bank?.conversionRates[card.cardType] || 0.25;
  
  const deleteCardMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/cards/${card.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Card deleted",
        description: "Your card has been removed from your account",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting card",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleDeleteCard = () => {
    deleteCardMutation.mutate();
  };
  
  // Card background gradient
  const getCardBackground = (bankId: string) => {
    if (bankId === 'hdfc') return "bg-gradient-to-r from-purple-700 to-purple-500";
    if (bankId === 'icici') return "bg-gradient-to-r from-orange-600 to-amber-500";
    if (bankId === 'sbi') return "bg-gradient-to-r from-blue-700 to-blue-500";
    if (bankId === 'axis') return "bg-gradient-to-r from-emerald-600 to-emerald-400";
    return "bg-gradient-to-r from-primary to-primary/80"; // Default
  };
  
  const formatDate = (dateString: Date) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Card Details</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className={`${getCardBackground(card.bankId)} p-5 rounded-xl text-white mb-4`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs opacity-80">{bank?.name}</span>
                <h3 className="font-bold">{card.cardType} Credit Card</h3>
              </div>
              {bank && (
                <div className="h-5 w-10 bg-white/20 rounded flex items-center justify-center">
                  {card.bankId.toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="mb-3">
              <span className="text-xs opacity-80">Card Number</span>
              <p className="font-mono">•••• •••• •••• {card.lastFourDigits}</p>
            </div>
            
            <div className="flex justify-between">
              <div>
                <span className="text-xs opacity-80">Valid Thru</span>
                <p>{card.expiryDate}</p>
              </div>
              <div>
                <span className="text-xs opacity-80">CVV</span>
                <p>•••</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg">
              <h4 className="text-sm text-neutral-500 dark:text-neutral-300 mb-1">Points Balance</h4>
              <p className="text-2xl font-bold dark:text-white">{card.points.toLocaleString()}</p>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg">
              <h4 className="text-sm text-neutral-500 dark:text-neutral-300 mb-1">Points Value</h4>
              <p className="text-2xl font-bold dark:text-white">₹{(card.points * conversionRate).toLocaleString()}</p>
            </div>
          </div>
          
          <Tabs defaultValue="transactions">
            <TabsList className="mb-4">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="details">Card Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions">
              {loadingTransactions ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : !transactions || transactions.length === 0 ? (
                <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                  <p className="text-neutral-500 dark:text-neutral-300">No transactions found for this card</p>
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto border dark:border-neutral-700 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-800/70 sticky top-0">
                      <tr>
                        <th className="text-left py-2 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-300">Date</th>
                        <th className="text-left py-2 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-300">Description</th>
                        <th className="text-right py-2 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-300">Amount</th>
                        <th className="text-right py-2 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-300">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-t border-neutral-100 dark:border-neutral-800">
                          <td className="py-2 px-4 text-sm dark:text-neutral-300">{formatDate(transaction.date)}</td>
                          <td className="py-2 px-4 text-sm font-medium dark:text-white">{transaction.description}</td>
                          <td className="py-2 px-4 text-sm text-right dark:text-neutral-300">₹{transaction.amount.toLocaleString()}</td>
                          <td className="py-2 px-4 text-sm text-emerald-600 font-medium text-right">+{transaction.pointsEarned}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="details">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium dark:text-neutral-300">Bank</h4>
                    <p className="dark:text-white">{bank?.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium dark:text-neutral-300">Card Type</h4>
                    <p className="dark:text-white">{card.cardType}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium dark:text-neutral-300">Card Number</h4>
                    <p className="dark:text-white">•••• •••• •••• {card.lastFourDigits}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium dark:text-neutral-300">Expiry Date</h4>
                    <p className="dark:text-white">{card.expiryDate}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium dark:text-neutral-300">Conversion Rate</h4>
                    <p className="dark:text-white">₹{conversionRate} per point</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium dark:text-neutral-300">Points Expiry</h4>
                    <p className="dark:text-white">{card.pointsExpiryDate || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t dark:border-neutral-700">
                  <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Card
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete your card and all associated data.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDeleteCard}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {deleteCardMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete Card"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-end mt-4">
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
