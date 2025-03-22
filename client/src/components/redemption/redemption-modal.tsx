import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, RedemptionOption } from "@shared/schema";
import { getBankById, getRedemptionOptions } from "@/services/mockData";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Check, Gift, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RedemptionModalProps {
  card: Card;
  open: boolean;
  onClose: () => void;
  preselectedOptionId?: string;
}

export default function RedemptionModal({ card, open, onClose, preselectedOptionId }: RedemptionModalProps) {
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<RedemptionOption | null>(null);
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [redeemAll, setRedeemAll] = useState(false);
  
  const bank = getBankById(card.bankId);
  const options = getRedemptionOptions();
  
  useEffect(() => {
    // Set default selected option
    if (preselectedOptionId) {
      const option = options.find(o => o.id === preselectedOptionId);
      if (option) {
        setSelectedOption(option);
        if (redeemAll) {
          setPointsToRedeem(card.points);
        } else if (option.minPoints) {
          setPointsToRedeem(option.minPoints);
        }
      }
    } else if (options.length > 0) {
      setSelectedOption(options[0]);
      if (options[0].minPoints) {
        setPointsToRedeem(options[0].minPoints);
      }
    }
  }, [preselectedOptionId, options, card.points, redeemAll]);
  
  // Redeem mutation
  const redeemMutation = useMutation({
    mutationFn: async () => {
      if (!selectedOption) throw new Error("No redemption option selected");
      
      const payload = {
        cardId: card.id,
        optionId: selectedOption.id,
        pointsUsed: pointsToRedeem,
        valueObtained: Math.round(pointsToRedeem * selectedOption.conversionRate),
        status: "completed",
        date: new Date().toISOString()
      };
      
      const res = await apiRequest("POST", "/api/redemptions", payload);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/redemptions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: [`/api/cards/${card.id}/transactions`] });
      
      toast({
        title: "Points redeemed successfully!",
        description: selectedOption ? `You have redeemed ${pointsToRedeem.toLocaleString()} points for ${selectedOption.name}` : "",
      });
      
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Redemption failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleOptionSelect = (optionId: string) => {
    const option = options.find(o => o.id === optionId);
    if (option) {
      setSelectedOption(option);
      // Reset points to minimum for this option
      if (option.minPoints) {
        setPointsToRedeem(option.minPoints);
        setRedeemAll(false);
      }
    }
  };
  
  const handleRedeemAll = () => {
    setRedeemAll(!redeemAll);
    if (!redeemAll) {
      setPointsToRedeem(card.points);
    } else if (selectedOption?.minPoints) {
      setPointsToRedeem(selectedOption.minPoints);
    } else {
      setPointsToRedeem(0);
    }
  };
  
  const handleRedeem = () => {
    if (!selectedOption) {
      toast({
        title: "Please select a redemption option",
        variant: "destructive",
      });
      return;
    }
    
    if (pointsToRedeem <= 0) {
      toast({
        title: "Please enter points to redeem",
        variant: "destructive",
      });
      return;
    }
    
    if (pointsToRedeem > card.points) {
      toast({
        title: "Insufficient points",
        description: `You only have ${card.points.toLocaleString()} points available`,
        variant: "destructive",
      });
      return;
    }
    
    if (selectedOption.minPoints && pointsToRedeem < selectedOption.minPoints) {
      toast({
        title: "Minimum points requirement not met",
        description: `This option requires at least ${selectedOption.minPoints.toLocaleString()} points`,
        variant: "destructive",
      });
      return;
    }
    
    redeemMutation.mutate();
  };
  
  const calculateValue = () => {
    if (!selectedOption) return 0;
    return Math.round(pointsToRedeem * selectedOption.conversionRate);
  };
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Redeem Points</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-5 gap-6 mt-4">
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-3">Redemption Options</h3>
            
            <RadioGroup 
              value={selectedOption?.id || ""}
              onValueChange={handleOptionSelect}
              className="space-y-3"
            >
              {options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-start space-x-3 border rounded-lg p-3 hover:border-primary cursor-pointer"
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={option.id} className="font-medium cursor-pointer">
                      {option.name}
                    </Label>
                    <p className="text-sm text-neutral-600">{option.description}</p>
                    <div className="flex items-center mt-1 text-sm">
                      <span className="text-neutral-700 font-medium">₹{option.conversionRate}</span>
                      <span className="text-neutral-500 mx-1">per point</span>
                      {option.minPoints > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full">
                          Min {option.minPoints.toLocaleString()} pts
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-neutral-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium">Card Details</h3>
              <p className="text-sm text-neutral-600">{bank?.name} {card.cardType}</p>
              <p className="text-sm text-neutral-600">•••• {card.lastFourDigits}</p>
              <div className="mt-2">
                <span className="text-sm text-neutral-500">Available Points:</span>
                <p className="text-2xl font-bold">{card.points.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="pointsToRedeem">Points to Redeem</Label>
                <div className="flex mt-1">
                  <Input
                    id="pointsToRedeem"
                    type="number"
                    value={pointsToRedeem}
                    onChange={(e) => {
                      setPointsToRedeem(parseInt(e.target.value) || 0);
                      setRedeemAll(false);
                    }}
                    min={1}
                    max={card.points}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="redeemAll"
                    checked={redeemAll}
                    onChange={handleRedeemAll}
                    className="mr-2"
                  />
                  <label htmlFor="redeemAll" className="text-sm">Redeem all available points</label>
                </div>
              </div>
              
              <div className="bg-primary/10 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Points:</span>
                  <span>{pointsToRedeem.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Rate:</span>
                  <span>₹{selectedOption?.conversionRate || 0} per point</span>
                </div>
                <div className="flex justify-between font-semibold mt-2 text-primary border-t border-primary/20 pt-2">
                  <span>You'll receive:</span>
                  <span>₹{calculateValue().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleRedeem}
            disabled={
              redeemMutation.isPending || 
              !selectedOption || 
              pointsToRedeem <= 0 ||
              pointsToRedeem > card.points ||
              (selectedOption?.minPoints ? pointsToRedeem < selectedOption.minPoints : false)
            }
          >
            {redeemMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Gift className="mr-2 h-4 w-4" />
                Redeem Points
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
