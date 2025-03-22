import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Sample data - in a real implementation this would come from API
const monthlyData = [
  { name: 'Jan', points: 4000 },
  { name: 'Feb', points: 5000 },
  { name: 'Mar', points: 6000 },
  { name: 'Apr', points: 15000 },
  { name: 'May', points: 10000 },
  { name: 'Jun', points: 12000 },
  { name: 'Jul', points: 19000 },
];

const quarterlyData = [
  { name: 'Q1', points: 15000 },
  { name: 'Q2', points: 37000 },
  { name: 'Q3', points: 45000 },
  { name: 'Q4', points: 52000 },
];

const yearlyData = [
  { name: '2020', points: 50000 },
  { name: '2021', points: 85000 },
  { name: '2022', points: 120000 },
  { name: '2023', points: 165000 },
];

type TimeFrame = 'monthly' | 'quarterly' | 'yearly';

interface PointsChartProps {
  isLoading?: boolean;
}

export default function PointsChart({ isLoading = false }: PointsChartProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('monthly');

  const data = timeFrame === 'monthly' 
    ? monthlyData 
    : timeFrame === 'quarterly' 
      ? quarterlyData 
      : yearlyData;

  if (isLoading) {
    return <PointsChartSkeleton />;
  }

  return (
    <Card className="bg-white mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-neutral-800">Points History</h2>
          <div className="flex space-x-2">
            <Button
              variant={timeFrame === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFrame('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={timeFrame === 'quarterly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFrame('quarterly')}
            >
              Quarterly
            </Button>
            <Button
              variant={timeFrame === 'yearly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFrame('yearly')}
            >
              Yearly
            </Button>
          </div>
        </div>
        
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--muted))' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `${value / 1000}k`;
                  }
                  return value;
                }}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()} Points`, 'Points']}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="points" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorPoints)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function PointsChartSkeleton() {
  return (
    <Card className="bg-white mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-5">
          <div className="h-6 w-32 bg-neutral-200 animate-pulse rounded-md"></div>
          <div className="flex space-x-2">
            <div className="h-9 w-20 bg-neutral-200 animate-pulse rounded-md"></div>
            <div className="h-9 w-20 bg-neutral-200 animate-pulse rounded-md"></div>
            <div className="h-9 w-20 bg-neutral-200 animate-pulse rounded-md"></div>
          </div>
        </div>
        
        <div className="h-[240px] bg-neutral-100 animate-pulse rounded-lg"></div>
      </CardContent>
    </Card>
  );
}
