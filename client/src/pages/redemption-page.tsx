import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Menu, Search, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Card as CardType } from "@shared/schema";
import { getRedemptionOptions, getRedemptionCategories } from "@/services/mockData";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import RedemptionModal from "@/components/redemption/redemption-modal";

export default function RedemptionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  
  const { data: cards, isLoading } = useQuery<CardType[]>({
    queryKey: ["/api/cards"],
  });
  
  // Get redemption options and categories
  const allOptions = getRedemptionOptions();
  const categories = getRedemptionCategories();
  
  // Filter options based on search term and selected category
  const filteredOptions = allOptions.filter(option => {
    const matchesSearch = option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         option.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || option.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get the card with the most points for default redemption
  const defaultCard = cards && cards.length > 0 
    ? cards.reduce((prev, current) => 
        (prev?.points > current.points) ? prev : current, cards[0])
    : undefined;
  
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
  
  const getTotalPoints = () => {
    return (cards && cards.length > 0) ? cards.reduce((total, card) => total + card.points, 0) : 0;
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Header & Sidebar */}
      <header className="md:hidden bg-white dark:bg-neutral-900 p-4 shadow z-10 fixed top-0 left-0 right-0 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Trovo
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">Redemption Marketplace</h1>
          </div>
          
          {/* Points Summary */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Available Points</h4>
                  <p className="text-2xl font-bold mt-1 dark:text-white">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : getTotalPoints().toLocaleString()}
                  </p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Cards</h4>
                  <p className="text-2xl font-bold mt-1 dark:text-white">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : cards?.length || 0}
                  </p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Redemption Options</h4>
                  <p className="text-2xl font-bold mt-1 dark:text-white">
                    {allOptions.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Search and Categories */}
          <div className="mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <Input
                placeholder="Search redemption options..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Tabs 
              defaultValue="all" 
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <TabsList className="mb-6 w-full overflow-x-auto flex whitespace-nowrap">
                <TabsTrigger value="all">All Categories</TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value={selectedCategory} className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOptions.map((option) => (
                    <div 
                      key={option.id}
                      className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all dark:bg-neutral-800/50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        {option.tag && (
                          <span className={`px-2 py-1 ${getTagClass(option.tag.type)} text-xs font-medium rounded-full`}>
                            {option.tag.text}
                          </span>
                        )}
                        <div className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-700">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="h-4 w-4 text-neutral-600 dark:text-neutral-300"
                          >
                            {option.category === "Cashback" && <path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z" />}
                            {option.category === "Travel" && <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />}
                            {option.category === "Shopping" && <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />}
                            {option.category === "Entertainment" || option.category === "Lifestyle" && <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />}
                          </svg>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-neutral-800 dark:text-white mb-1">{option.name}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">{option.description}</p>
                      
                      <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                        <span className="font-medium text-neutral-800 dark:text-white">₹{option.conversionRate}</span>
                        <span className="mx-2">per point</span>
                        {option.minPoints > 0 && (
                          <span className="text-xs px-2 py-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full">
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
                
                {filteredOptions.length === 0 && (
                  <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                    <p className="text-neutral-600 dark:text-neutral-300 font-medium">No redemption options found</p>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Try adjusting your search or category</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileNav />
      
      {/* Redemption Modal */}
      {defaultCard && selectedOptionId && (
        <RedemptionModal
          card={defaultCard}
          open={isRedeemOpen}
          onClose={() => setIsRedeemOpen(false)}
          preselectedOptionId={selectedOptionId}
        />
      )}
    </div>
  );
}
