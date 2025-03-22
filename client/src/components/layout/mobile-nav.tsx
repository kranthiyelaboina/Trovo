import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CreditCard, Gift, Wallet, User, Settings } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { 
      href: "/", 
      label: "Dashboard", 
      icon: <LayoutDashboard className="text-xl" /> 
    },
    { 
      href: "/cards", 
      label: "Cards", 
      icon: <CreditCard className="text-xl" /> 
    },
    { 
      href: "/redeem", 
      label: "Redeem", 
      icon: <Gift className="text-xl" /> 
    },
    { 
      href: "/payments", 
      label: "Payments", 
      icon: <Wallet className="text-xl" /> 
    },
    { 
      href: "/settings", 
      label: "Settings", 
      icon: <Settings className="text-xl" /> 
    },
  ];

  // Fix the Link nesting issue
  const NavItem = ({ href, isActive, children }: { 
    href: string, 
    isActive: boolean, 
    children: React.ReactNode 
  }) => (
    <Link href={href}>
      <div className={cn(
        "flex flex-col items-center py-2 px-3 cursor-pointer",
        isActive ? "text-primary" : "text-neutral-600 dark:text-neutral-400"
      )}>
        {children}
      </div>
    </Link>
  );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 z-10">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <NavItem key={item.href} href={item.href} isActive={location === item.href}>
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </NavItem>
        ))}
      </div>
    </nav>
  );
}
