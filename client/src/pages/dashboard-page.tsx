import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import PointsSummary from "@/components/dashboard/points-summary";
import PointsChart from "@/components/dashboard/points-chart";
import CardList from "@/components/dashboard/card-list";
import TransactionList from "@/components/dashboard/transaction-list";
import RedemptionRecommendations from "@/components/dashboard/redemption-recommendations";
import { Button } from "@/components/ui/button";
import { PlusCircle, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import AddCardDialog from "@/components/cards/add-card-dialog";

export default function DashboardPage() {
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  
  const { data, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
  });

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
            
            <Button 
              onClick={() => setIsAddCardOpen(true)}
              className="mt-3 sm:mt-0"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Card
            </Button>
          </div>
          
          {/* Dashboard Content */}
          <PointsSummary
            totalPoints={data?.totalPoints || 0}
            pointsValue={data?.pointsValue || 0}
            expiringPoints={data?.expiringPoints || 0}
            isLoading={isLoading}
          />
          
          <PointsChart isLoading={isLoading} />
          
          <CardList limit={3} showViewAll={true} />
          
          <TransactionList limit={5} showViewAll={true} />
          
          <RedemptionRecommendations isLoading={isLoading} />
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
