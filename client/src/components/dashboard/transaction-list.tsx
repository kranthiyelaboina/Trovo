import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Transaction, Card } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card as CardUI, CardContent } from "@/components/ui/card";
import { getBankById } from "@/services/mockData";

interface TransactionListProps {
  limit?: number;
  showViewAll?: boolean;
}

export default function TransactionList({ limit, showViewAll = true }: TransactionListProps) {
  const { data: transactions, isLoading: loadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });
  
  const { data: cards, isLoading: loadingCards } = useQuery<Card[]>({
    queryKey: ["/api/cards"],
  });
  
  const isLoading = loadingTransactions || loadingCards;
  const displayTransactions = limit && transactions 
    ? transactions.slice(0, limit) 
    : transactions;
  
  const getCardById = (cardId: number) => {
    return cards?.find(card => card.id === cardId);
  };
  
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };
  
  const formatDate = (dateString: Date) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  const getBankLogo = (bankId: string) => {
    // Use first letter of bank name
    return bankId.charAt(0).toUpperCase();
  };
  
  const getBankColor = (bankId: string) => {
    if (bankId === 'hdfc') return "bg-purple-600";
    if (bankId === 'icici') return "bg-orange-500";
    if (bankId === 'sbi') return "bg-blue-600";
    if (bankId === 'axis') return "bg-emerald-600";
    return "bg-primary";
  };
  
  if (isLoading) {
    return <TransactionListSkeleton />;
  }
  
  return (
    <CardUI className="bg-white rounded-xl shadow-sm mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-800">Recent Transactions</h2>
          {showViewAll && displayTransactions && displayTransactions.length > 0 && (
            <Link href="/transactions">
              <Button variant="link" size="sm">View All</Button>
            </Link>
          )}
        </div>
        
        {displayTransactions && displayTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-600">Description</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-600">Amount</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-600">Points</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-600">Card</th>
                </tr>
              </thead>
              <tbody>
                {displayTransactions.map((transaction) => {
                  const card = getCardById(transaction.cardId);
                  const bank = card ? getBankById(card.bankId) : null;
                  
                  return (
                    <tr key={transaction.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-3 px-4 text-sm text-neutral-700">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-800 font-medium">
                        {transaction.description}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-800 font-medium text-right">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-3 px-4 text-sm text-emerald-600 font-medium text-right">
                        +{transaction.pointsEarned}
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-600">
                        {card && (
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full ${getBankColor(card.bankId)} flex items-center justify-center text-xs text-white mr-2`}>
                              {getBankLogo(card.bankId)}
                            </div>
                            <span>{bank?.name} {card.cardType}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 border-t border-neutral-200">
            <p className="text-neutral-500">No transactions yet</p>
          </div>
        )}
      </CardContent>
    </CardUI>
  );
}

function TransactionListSkeleton() {
  return (
    <CardUI className="bg-white rounded-xl shadow-sm mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-9 w-24" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4"><Skeleton className="h-5 w-16" /></th>
                <th className="text-left py-3 px-4"><Skeleton className="h-5 w-24" /></th>
                <th className="text-right py-3 px-4"><Skeleton className="h-5 w-16 ml-auto" /></th>
                <th className="text-right py-3 px-4"><Skeleton className="h-5 w-16 ml-auto" /></th>
                <th className="text-left py-3 px-4"><Skeleton className="h-5 w-24" /></th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-neutral-100">
                  <td className="py-3 px-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-16 ml-auto" /></td>
                  <td className="py-3 px-4"><Skeleton className="h-4 w-12 ml-auto" /></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Skeleton className="h-6 w-6 rounded-full mr-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </CardUI>
  );
}
