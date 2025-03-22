import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import MobileHeader from "@/components/layout/mobile-header";
import PointsSummary from "@/components/dashboard/points-summary";
import PointsChart from "@/components/dashboard/points-chart";
import CardList from "@/components/dashboard/card-list";
import TransactionList from "@/components/dashboard/transaction-list";
import RedemptionRecommendations from "@/components/dashboard/redemption-recommendations";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AddCardDialog from "@/components/cards/add-card-dialog";

export default function DashboardPage() {
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  
  type DashboardData = {
    totalPoints: number;
    pointsValue: number;
    expiringPoints: number;
  };

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Header with Dark Mode Toggle */}
      <MobileHeader />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-[60px] md:pt-0">
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
          {/* Page Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-white bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            
            <Button 
              onClick={() => setIsAddCardOpen(true)}
              className="mt-3 sm:mt-0 btn-gradient"
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
