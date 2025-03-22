import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getRedemptionOptions } from "@/services/mockData";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card as CardType } from "@shared/schema";
import { Gift, ShoppingBag, CreditCard as CreditCardIcon, Plane } from "lucide-react";
import RedemptionModal from "@/components/redemption/redemption-modal";

interface RedemptionRecommendationsProps {
  isLoading?: boolean;
}

export default function RedemptionRecommendations({ isLoading = false }: RedemptionRecommendationsProps) {
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  
  const { data: cards } = useQuery<CardType[]>({
    queryKey: ["/api/cards"],
  });

  // Get the card with the most points for default redemption
  const defaultCard = cards && cards.length > 0 
    ? cards.reduce((prev, current) => 
        (prev?.points > current.points) ? prev : current, cards[0])
    : undefined;

  // Get redemption options
  const redemptionOptions = getRedemptionOptions();
  const recommendations = redemptionOptions.slice(0, 3); // Top 3 recommendations

  const getOptionIcon = (category: string) => {
    switch (category) {
      case 'Cashback':
        return <CreditCardIcon className="text-neutral-500" />;
      case 'Travel':
        return <Plane className="text-neutral-500" />;
      case 'Shopping':
        return <ShoppingBag className="text-neutral-500" />;
      default:
        return <Gift className="text-neutral-500" />;
    }
  };

  const getTagClass = (type: string) => {
    switch (type) {
      case 'best':
        return 'bg-primary/10 text-primary';
      case 'expiring':
        return 'bg-amber-500/10 text-amber-500';
      case 'popular':
        return 'bg-neutral-200 text-neutral-600';
      case 'limited':
        return 'bg-rose-500/10 text-rose-500';
      default:
        return 'bg-neutral-200 text-neutral-600';
    }
  };

  const handleRedeemClick = (optionId: string) => {
    setSelectedOptionId(optionId);
    setIsRedeemOpen(true);
  };

  if (isLoading) {
    return <RecommendationsSkeleton />;
  }

  return (
    <>
      <Card className="bg-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-800">Redemption Recommendations</h2>
            <Link href="/redeem">
              <Button variant="link" size="sm">View All Options</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((option) => (
              <div key={option.id} className="border border-neutral-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  {option.tag && (
                    <span className={`px-2 py-1 ${getTagClass(option.tag.type)} text-xs font-medium rounded-full`}>
                      {option.tag.text}
                    </span>
                  )}
                  {getOptionIcon(option.category)}
                </div>
                
                <h3 className="font-semibold text-neutral-800 mb-1">{option.name}</h3>
                <p className="text-sm text-neutral-600 mb-3">{option.description}</p>
                
                <div className="flex items-center text-sm text-neutral-500 mb-4">
                  <span className="font-medium text-neutral-800">₹{option.conversionRate}</span>
                  <span className="mx-2">per point</span>
                  {option.minPoints > 0 && (
                    <span className="text-xs px-2 py-1 bg-neutral-200 text-neutral-600 rounded-full">
                      Min {option.minPoints.toLocaleString()} pts
                    </span>
                  )}
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => handleRedeemClick(option.id)}
                  disabled={!defaultCard || defaultCard.points < option.minPoints}
                >
                  Redeem Now
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Redemption Modal */}
      {defaultCard && selectedOptionId && (
        <RedemptionModal
          card={defaultCard}
          open={isRedeemOpen}
          onClose={() => setIsRedeemOpen(false)}
          preselectedOptionId={selectedOptionId}
        />
      )}
    </>
  );
}

function RecommendationsSkeleton() {
  return (
    <Card className="bg-white">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-9 w-24" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-5 rounded" />
              </div>
              
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              
              <div className="flex items-center mb-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24 mx-2" />
              </div>
              
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
