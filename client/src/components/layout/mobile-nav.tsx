import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CreditCard, Gift, Wallet, User } from "lucide-react";

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
      href: "/profile", 
      label: "Profile", 
      icon: <User className="text-xl" /> 
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-10">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a className={cn(
              "flex flex-col items-center py-2 px-3",
              location === item.href ? "text-primary" : "text-neutral-600"
            )}>
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
}
