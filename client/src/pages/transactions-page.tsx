import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Menu, Filter, Download, Search, Loader2, CalendarIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Transaction, Card as CardType } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { getBankById } from "@/services/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCard, setSelectedCard] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  
  const { data: transactions, isLoading: loadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });
  
  const { data: cards, isLoading: loadingCards } = useQuery<CardType[]>({
    queryKey: ["/api/cards"],
  });
  
  const isLoading = loadingTransactions || loadingCards;
  
  // Filter transactions based on search term, selected card, and date
  const filteredTransactions = transactions?.filter(transaction => {
    // Filter by search term
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by selected card
    const matchesCard = selectedCard === "all" || transaction.cardId === parseInt(selectedCard);
    
    // Filter by selected date
    const matchesDate = !selectedDate || 
      new Date(transaction.date).toDateString() === selectedDate.toDateString();
    
    return matchesSearch && matchesCard && matchesDate;
  });
  
  const getCardById = (cardId: number) => {
    return cards?.find(card => card.id === cardId);
  };
  
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };
  
  const formatDate = (dateString: Date) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  const getBankLogo = (bankId: string) => {
    // Use first letter of bank name
    return bankId.charAt(0).toUpperCase();
  };
  
  const getBankColor = (bankId: string) => {
    if (bankId === 'hdfc') return "bg-purple-600";
    if (bankId === 'icici') return "bg-orange-500";
    if (bankId === 'sbi') return "bg-blue-600";
    if (bankId === 'axis') return "bg-emerald-600";
    return "bg-primary";
  };
  
  const getTotalPointsEarned = () => {
    return (filteredTransactions && filteredTransactions.length > 0) 
      ? filteredTransactions.reduce((total, transaction) => total + transaction.pointsEarned, 0) 
      : 0;
  };
  
  const getTotalSpent = () => {
    return (filteredTransactions && filteredTransactions.length > 0) 
      ? filteredTransactions.reduce((total, transaction) => total + transaction.amount, 0) 
      : 0;
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCard("all");
    setSelectedDate(undefined);
  };
  
  // Function to export transactions to CSV
  const exportToCSV = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) return;
    
    // Format each transaction for CSV
    const csvRows = filteredTransactions.map(transaction => {
      const card = getCardById(transaction.cardId);
      const bank = card ? getBankById(card.bankId) : null;
      const cardName = card && bank ? `${bank?.name || 'Unknown'} ${card.cardType}` : 'Unknown Card';
      
      // Format date for CSV (using ISO format for proper date handling in spreadsheets)
      const date = new Date(transaction.date).toISOString().split('T')[0];
      
      return [
        date,
        transaction.description,
        transaction.amount,
        transaction.pointsEarned,
        cardName
      ].join(',');
    });
    
    // Add header row
    const csvContent = [
      'Date,Description,Amount,Points,Card',
      ...csvRows
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Transactions exported",
      description: `${filteredTransactions.length} transactions exported to CSV file.`
    });
  };
  
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
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-white">Transactions History</h1>
            
            <Button 
              variant="outline"
              className="mt-3 sm:mt-0"
              disabled={!filteredTransactions || filteredTransactions.length === 0}
              onClick={exportToCSV}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
          
          {/* Transactions Summary */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Total Transactions</h4>
                  <p className="text-2xl font-bold mt-1 dark:text-white">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : filteredTransactions?.length || 0}
                  </p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Total Amount</h4>
                  <p className="text-2xl font-bold mt-1 dark:text-white">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : formatCurrency(getTotalSpent())}
                  </p>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Total Points Earned</h4>
                  <p className="text-2xl font-bold mt-1 dark:text-white">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : getTotalPointsEarned().toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Filters Section */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <Input
                placeholder="Search transactions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Select
                value={selectedCard}
                onValueChange={setSelectedCard}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Cards" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cards</SelectItem>
                  {cards?.map(card => {
                    const bank = getBankById(card.bankId);
                    return (
                      <SelectItem key={card.id} value={card.id.toString()}>
                        {bank?.name || 'Unknown'} {card.cardType}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] flex justify-between items-center">
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Select date</span>
                    )}
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={clearFilters}
                disabled={!searchTerm && selectedCard === "all" && !selectedDate}
              >
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Transactions List */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !filteredTransactions || filteredTransactions.length === 0 ? (
                <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                  <p className="text-neutral-600 dark:text-neutral-300 font-medium">No transactions found</p>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-700">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-300">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-300">Description</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-300">Amount</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-300">Points</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-600 dark:text-neutral-300">Card</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => {
                        const card = getCardById(transaction.cardId);
                        const bank = card ? getBankById(card.bankId) : null;
                        
                        return (
                          <tr key={transaction.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800">
                            <td className="py-3 px-4 text-sm text-neutral-700 dark:text-neutral-300">
                              {formatDate(transaction.date)}
                            </td>
                            <td className="py-3 px-4 text-sm text-neutral-800 dark:text-white font-medium">
                              {transaction.description}
                            </td>
                            <td className="py-3 px-4 text-sm text-neutral-800 dark:text-white font-medium text-right">
                              {formatCurrency(transaction.amount)}
                            </td>
                            <td className={`py-3 px-4 text-sm font-medium text-right ${transaction.pointsEarned >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {transaction.pointsEarned >= 0 ? '+' : ''}{transaction.pointsEarned}
                            </td>
                            <td className="py-3 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                              {card && (
                                <div className="flex items-center">
                                  <div className={`w-6 h-6 rounded-full ${getBankColor(card.bankId)} flex items-center justify-center text-xs text-white mr-2`}>
                                    {getBankLogo(card.bankId)}
                                  </div>
                                  <span>{bank?.name || 'Unknown'} {card.cardType}</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
