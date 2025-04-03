import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card as CardType } from "@shared/schema";
import { getBankById } from "@/services/mockData";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, CreditCard } from "lucide-react";
import AddCardDialog from "@/components/cards/add-card-dialog";
import CardDetails from "@/components/cards/card-details";
import RedemptionModal from "@/components/redemption/redemption-modal";

interface CardListProps {
  limit?: number;
  showViewAll?: boolean;
}

export default function CardList({ limit, showViewAll = true }: CardListProps) {
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [redeemCardId, setRedeemCardId] = useState<number | null>(null);
  
  const { data: cards, isLoading } = useQuery<CardType[]>({
    queryKey: ["/api/cards"],
  });

  const displayCards = limit && cards ? cards.slice(0, limit) : cards;

  const getCardById = useCallback((id: number) => {
    return cards?.find(card => card.id === id);
  }, [cards]);

  const handleViewDetails = (cardId: number) => {
    setSelectedCardId(cardId);
  };

  const handleCloseDetails = () => {
    setSelectedCardId(null);
  };

  const handleOpenRedeem = (cardId: number) => {
    setRedeemCardId(cardId);
    setIsRedeemOpen(true);
  };

  const handleCloseRedeem = () => {
    setIsRedeemOpen(false);
    setRedeemCardId(null);
  };

  // Helper to determine card background class
  const getCardBackground = (bankId: string) => {
    if (bankId === 'hdfc') return "bg-gradient-to-r from-purple-700 to-purple-500";
    if (bankId === 'icici') return "bg-gradient-to-r from-orange-600 to-amber-500";
    if (bankId === 'sbi') return "bg-gradient-to-r from-blue-700 to-blue-500";
    if (bankId === 'axis') return "bg-gradient-to-r from-emerald-600 to-emerald-400";
    return "bg-gradient-to-r from-primary to-primary/80"; // Default
  };

  const selectedCard = selectedCardId ? getCardById(selectedCardId) : null;
  const redeemCard = redeemCardId ? getCardById(redeemCardId) : null;

  if (isLoading) {
    return <CardListSkeleton />;
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-white">My Cards</h2>
          <div className="flex space-x-2">
            <Button
              onClick={() => setIsAddCardOpen(true)}
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Add Card
            </Button>
            {showViewAll && displayCards && displayCards.length > 0 && (
              <Link href="/cards">
                <Button variant="link" size="sm">View All</Button>
              </Link>
            )}
          </div>
        </div>
        
        {displayCards && displayCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayCards.map((card) => {
              const bank = getBankById(card.bankId);
              const conversionRate = bank?.conversionRates[card.cardType] || 0.25;
              const estimatedValue = Math.round(card.points * conversionRate);
              
              return (
                <div key={card.id} className="rounded-xl overflow-hidden shadow-sm">
                  <div className={`${getCardBackground(card.bankId)} p-5 text-white`}>
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
                  
                  <div className="bg-white dark:bg-neutral-800 p-4">
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="font-semibold dark:text-white">Points Balance</h4>
                      <span className="text-xl font-bold dark:text-white">{card.points.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500 dark:text-neutral-300">Conversion Rate</span>
                      <span className="font-medium dark:text-white">₹{conversionRate} per point</span>
                    </div>
                    
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-neutral-500 dark:text-neutral-300">Estimated Value</span>
                      <span className="font-medium dark:text-white">₹{estimatedValue.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <Button 
                        variant="link" 
                        size="sm"
                        className="p-0 h-auto font-medium"
                        onClick={() => handleViewDetails(card.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button 
                        variant="default"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleOpenRedeem(card.id)}
                      >
                        Redeem
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl p-8 text-center">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-neutral-400 dark:text-neutral-500" />
            <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-2">No Cards Added Yet</h3>
            <p className="text-neutral-500 dark:text-neutral-300 mb-4">Add your first credit card to start tracking rewards points</p>
            <Button onClick={() => setIsAddCardOpen(true)}>
              <CreditCard className="mr-2 h-4 w-4" />
              Add Your First Card
            </Button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AddCardDialog
        open={isAddCardOpen}
        onOpenChange={setIsAddCardOpen}
      />

      {selectedCard && (
        <CardDetails
          card={selectedCard}
          open={!!selectedCardId}
          onClose={handleCloseDetails}
        />
      )}

      {redeemCard && (
        <RedemptionModal
          card={redeemCard}
          open={isRedeemOpen}
          onClose={handleCloseRedeem}
        />
      )}
    </>
  );
}

function CardListSkeleton() {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-24" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl overflow-hidden shadow-sm">
            <Skeleton className="h-[160px] w-full" />
            <div className="bg-white dark:bg-neutral-800 p-4">
              <div className="flex justify-between items-baseline mb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
              
              <div className="space-y-2 mt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              
              <div className="flex justify-between mt-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
