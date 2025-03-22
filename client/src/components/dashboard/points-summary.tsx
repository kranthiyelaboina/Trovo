import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, Clock } from "lucide-react";

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
      <Card className="bg-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-neutral-800">Total Points</h2>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">All Cards</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-neutral-900">{totalPoints.toLocaleString()}</span>
            <span className="ml-2 text-sm text-emerald-500 font-medium flex items-center">
              <ArrowUpIcon className="h-3 w-3 mr-1" />
              6.2%
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">vs. last month</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-neutral-800">Points Value</h2>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">INR</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-neutral-900">₹{pointsValue.toLocaleString()}</span>
            <span className="ml-2 text-sm text-neutral-500 font-medium">Approx.</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Based on current conversion rates</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-neutral-800">Expiring Soon</h2>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-500/10 text-amber-500">Next 30 Days</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-neutral-900">{expiringPoints.toLocaleString()}</span>
            <span className="ml-2 text-sm text-rose-500 font-medium flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Expiring
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">Act now to avoid losing points</p>
        </CardContent>
      </Card>
    </div>
  );
}

function PointsSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="h-6 w-32 bg-neutral-200 animate-pulse rounded-md"></div>
              <div className="h-5 w-16 bg-neutral-200 animate-pulse rounded-full"></div>
            </div>
            <div className="h-10 w-24 bg-neutral-200 animate-pulse rounded-md"></div>
            <div className="h-4 w-40 bg-neutral-200 animate-pulse rounded-md mt-2"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
