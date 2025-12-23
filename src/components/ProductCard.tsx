import { Minus, Plus, ShoppingCart, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';
import { formatQuantity, calculateItemPrice, formatPrice, cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, getItemQuantity, updateQuantity, removeFromCart } = useCart();
  const cartQuantity = getItemQuantity(product.id);
  const [quantity, setQuantity] = useState(cartQuantity || product.minQuantity);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showUpdated, setShowUpdated] = useState(false);

  useEffect(() => {
    if (cartQuantity > 0) {
      setQuantity(cartQuantity);
    }
  }, [cartQuantity]);

  const handleIncrement = () => {
    const newQty = quantity + product.incrementBy;
    setQuantity(newQty);
    if (cartQuantity > 0) {
      updateQuantity(product.id, newQty);
    }
  };

  const handleDecrement = () => {
    if (quantity > product.minQuantity) {
      const newQty = quantity - product.incrementBy;
      setQuantity(newQty);
      if (cartQuantity > 0) {
        if (newQty >= product.minQuantity) {
          updateQuantity(product.id, newQty);
        } else {
          removeFromCart(product.id);
        }
      }
    }
  };

  const handleAddToCart = () => {
    const wasInCart = cartQuantity > 0;
    addToCart(product, quantity);
    
    if (wasInCart) {
      // Show "Updated ✓" indication for 1.5 seconds
      setShowUpdated(true);
      setTimeout(() => setShowUpdated(false), 1500);
    }
  };

  const itemPrice = calculateItemPrice(product.price, quantity, product.unit);
  const isInCart = cartQuantity > 0;

  return (
    <div className={cn(
      "relative bg-card rounded-2xl shadow-card overflow-hidden transition-all duration-300",
      !product.available && "opacity-60"
    )}>
      {/* Availability Badge */}
      <div className={cn(
        "absolute top-2 left-2 z-10 px-2 py-1 rounded-full text-[10px] font-bold text-primary-foreground",
        product.available ? "bg-available" : "bg-unavailable"
      )}>
        {product.available ? 'Available' : 'Unavailable'}
      </div>

      {/* Product Image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
        />
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-bold text-sm text-foreground truncate">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground truncate">
          {product.nameTE}
        </p>
        
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-base font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-muted-foreground">
            / {product.unit === 'kg' ? 'kg' : product.unit === 'liter' ? 'L' : product.unit}
          </span>
        </div>

        {/* Quantity Selector */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            onClick={handleDecrement}
            disabled={quantity <= product.minQuantity || !product.available}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-muted text-foreground transition-all active:scale-90 disabled:opacity-40"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="flex-1 text-center text-sm font-semibold text-foreground">
            {formatQuantity(quantity, product.unit)}
          </span>
          
          <button
            onClick={handleIncrement}
            disabled={!product.available}
            className="w-8 h-8 flex items-center justify-center rounded-full gradient-primary text-primary-foreground transition-all active:scale-90 disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Live Total Price */}
        <div className="mt-2 text-center">
          <span className="text-xs text-muted-foreground">Total: </span>
          <span className="text-sm font-bold text-secondary">
            {formatPrice(itemPrice)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.available}
          className={cn(
            "mt-3 w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2",
            showUpdated
              ? "bg-primary text-primary-foreground animate-pulse"
              : isInCart
                ? "bg-available text-primary-foreground"
                : "gradient-secondary text-secondary-foreground shadow-button active:scale-95",
            !product.available && "opacity-50 cursor-not-allowed"
          )}
        >
          {showUpdated ? (
            <>
              <Check className="w-4 h-4" />
              Updated ✓
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {isInCart ? 'Update Cart' : 'Add to Cart'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
