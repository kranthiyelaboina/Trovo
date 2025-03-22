import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, Clock, Award } from "lucide-react";

interface PointsSummaryProps {
  totalPoints: number;
  pointsValue: number;
  expiringPoints: number;
  isLoading?: boolean;
}

export default function PointsSummary({ totalPoints, pointsValue, expiringPoints, isLoading = false }: PointsSummaryProps) {
  if (isLoading) {
    return <PointsSummarySkeleton />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <Card className="bg-white dark:bg-neutral-800 card-gradient">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-white flex items-center">
              <Award className="mr-2 h-5 w-5 text-primary dark:text-primary-foreground opacity-80" />
              Total Points
            </h2>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground">All Cards</span>
          </div>
          <div className="flex items-baseline">
            <span className="data-value dark:text-white">{totalPoints.toLocaleString()}</span>
            <span className="ml-2 text-sm text-emerald-500 dark:text-emerald-400 font-medium flex items-center">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              6.2%
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">vs. last month</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white dark:bg-neutral-800 card-gradient">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-white flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="mr-2 h-5 w-5 text-primary dark:text-primary-foreground opacity-80"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Points Value
            </h2>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground">INR</span>
          </div>
          <div className="flex items-baseline">
            <span className="data-value dark:text-white">₹{pointsValue.toLocaleString()}</span>
            <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400 font-medium">Approx.</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Based on current conversion rates</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white dark:bg-neutral-800 card-gradient">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-white flex items-center">
              <Clock className="mr-2 h-5 w-5 text-amber-500 dark:text-amber-400 opacity-80" />
              Expiring Soon
            </h2>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 dark:text-amber-400">Next 30 Days</span>
          </div>
          <div className="flex items-baseline">
            <span className="data-value dark:text-white">{expiringPoints.toLocaleString()}</span>
            <span className="ml-2 text-sm text-rose-500 dark:text-rose-400 font-medium flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-3 w-3 mr-1"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              Expiring
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Act now to avoid losing points</p>
        </CardContent>
      </Card>
    </div>
  );
}

function PointsSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="bg-white dark:bg-neutral-800 card-gradient">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded-md"></div>
              <div className="h-5 w-16 bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded-full"></div>
            </div>
            <div className="h-10 w-24 bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded-md"></div>
            <div className="h-4 w-40 bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded-md mt-2"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
