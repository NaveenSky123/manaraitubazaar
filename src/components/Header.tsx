import { MapPin, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAddress } from '@/hooks/useAddress';

interface HeaderProps {
  onAddressClick: () => void;
  onCartClick: () => void;
}

export function Header({ onAddressClick, onCartClick }: HeaderProps) {
  const { getTotalItems } = useCart();
  const { hasAddress } = useAddress();
  const itemCount = getTotalItems();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#c5d8c5] shadow-button">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 flex-1">
          {/* Animated Logo */}
          <div className="w-11 h-11 rounded-xl overflow-hidden animate-logo-float shadow-card flex-shrink-0">
            <img 
              src="/logo.jpg" 
              alt="Raitu Bazar Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <h1 className="text-lg font-bold leading-tight animate-color-cycle">
              Mana Raitu Bazaar
            </h1>
            <p className="text-xs animate-color-cycle" style={{ animationDelay: '1s' }}>
              Morthad Branch | మొర్తాడ్ బ్రాంచ్
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onAddressClick}
            className={`relative p-2.5 rounded-full transition-all duration-200 active:scale-95 ${
              hasAddress 
                ? 'bg-primary/20' 
                : 'bg-secondary animate-pulse-slow'
            }`}
            aria-label="Address"
          >
            <MapPin className="w-5 h-5 text-primary" />
            {hasAddress && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[hsl(var(--available))] rounded-full border-2 border-[#c5d8c5]" />
            )}
          </button>
          
          <button
            onClick={onCartClick}
            className="relative p-2.5 rounded-full bg-primary/20 transition-all duration-200 active:scale-95"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5 text-primary" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center px-1 text-xs font-bold text-primary-foreground bg-secondary rounded-full animate-fade-in">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
