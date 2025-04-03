import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import CardList from "@/components/dashboard/card-list";
import { Button } from "@/components/ui/button";
import { PlusCircle, Menu, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import AddCardDialog from "@/components/cards/add-card-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Card as CardType } from "@shared/schema";

export default function CardsPage() {
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  
  const { data: cards, isLoading } = useQuery<CardType[]>({
    queryKey: ["/api/cards"],
  });

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
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">My Cards</h1>
            
            <Button 
              onClick={() => setIsAddCardOpen(true)}
              className="mt-3 sm:mt-0"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Card
            </Button>
          </div>
          
          {/* Cards Summary */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Total Cards</h4>
                  <p className="text-2xl font-bold mt-1 dark:text-white">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : cards?.length || 0}
                  </p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Total Points</h4>
                  <p className="text-2xl font-bold mt-1 dark:text-white">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : ((cards && cards.length > 0) ? cards.reduce((total, card) => total + card.points, 0).toLocaleString() : "0")}
                  </p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Banks</h4>
                  <p className="text-2xl font-bold mt-1 dark:text-white">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : new Set(cards?.map(card => card.bankId)).size || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Card Management */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">Manage Your Cards</h2>
            
            {/* Show all cards with no limit */}
            <CardList showViewAll={false} />
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileNav />
      
      {/* Add Card Dialog */}
      <AddCardDialog
        open={isAddCardOpen}
        onOpenChange={setIsAddCardOpen}
      />
    </div>
  );
}
