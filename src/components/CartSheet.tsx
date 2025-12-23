import { useState, useMemo } from 'react';
import { X, Minus, Plus, Trash2, Calendar, Clock, CreditCard, Truck, MessageCircle, ExternalLink, ChevronDown, MapPin, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAddress } from '@/hooks/useAddress';
import { useLocation } from '@/hooks/useLocation';
import { formatQuantity, calculateItemPrice, formatPrice, cn, generateOrderId, generateUPILink, generateWhatsAppMessage } from '@/lib/utils';
import { DeliverySlot, PaymentMode } from '@/types';
import { toast } from 'sonner';

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressClick: () => void;
}

const timeSlots = [
  { group: 'Morning (6 AM - 9 AM)', slots: ['6:00 – 6:30 AM', '6:30 – 7:00 AM', '7:00 – 7:30 AM', '7:30 – 8:00 AM', '8:00 – 8:30 AM', '8:30 – 9:00 AM'] },
  { group: 'Evening (4 PM - 9 PM)', slots: ['4:00 – 4:30 PM', '4:30 – 5:00 PM', '5:00 – 5:30 PM', '5:30 – 6:00 PM', '6:00 – 6:30 PM', '6:30 – 7:00 PM', '7:00 – 7:30 PM', '7:30 – 8:00 PM', '8:00 – 8:30 PM', '8:30 – 9:00 PM'] },
];

export function CartSheet({ isOpen, onClose, onAddressClick }: CartSheetProps) {
  const { items, updateQuantity, removeFromCart, getSubtotal, getDeliveryCharge, getGrandTotal, clearCart } = useCart();
  const { address, hasAddress } = useAddress();
  const { location, isLoading: locationLoading, error: locationError, requestLocation, getGoogleMapsLink, hasAskedPermission } = useLocation();
  
  const [deliveryDate, setDeliveryDate] = useState<'today' | 'tomorrow' | ''>('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [remarks, setRemarks] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode | ''>('');
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [orderId] = useState(generateOrderId);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  const subtotal = getSubtotal();
  const deliveryCharge = getDeliveryCharge();
  const grandTotal = getGrandTotal();

  const upiAmount = paymentMode === 'cod' ? 20 : grandTotal;
  const paidAmount = paymentMode === 'cod' ? 20 : grandTotal;
  const remainingAmount = paymentMode === 'cod' ? grandTotal - 20 : 0;

  // Validation: all fields required + UPI transaction ID if payment selected
  const canOrder = useMemo(() => {
    const hasBasics = hasAddress && items.length > 0 && deliveryDate && deliveryTime && paymentMode;
    const hasValidTransaction = upiTransactionId.trim().length >= 6;
    return hasBasics && hasValidTransaction;
  }, [hasAddress, items.length, deliveryDate, deliveryTime, paymentMode, upiTransactionId]);

  // Get missing fields for user feedback
  const getMissingFields = () => {
    const missing: string[] = [];
    if (!hasAddress) missing.push('Address');
    if (items.length === 0) missing.push('Cart items');
    if (!deliveryDate) missing.push('Delivery date');
    if (!deliveryTime) missing.push('Time slot');
    if (!paymentMode) missing.push('Payment method');
    if (!upiTransactionId.trim() || upiTransactionId.trim().length < 6) missing.push('UPI Transaction ID');
    return missing;
  };

  const handleRequestLocation = async () => {
    const result = await requestLocation();
    if (result) {
      toast.success('Location added successfully for delivery.');
      setShowLocationPrompt(false);
    } else {
      setLocationDenied(true);
      toast.info('Location not shared. Please ensure address is correct.');
      setShowLocationPrompt(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (!canOrder) return;
    
    // Show location prompt only once per order if not already asked
    if (!hasAskedPermission && !location && !locationDenied) {
      setShowLocationPrompt(true);
      return;
    }
    
    proceedWithOrder();
  };

  const proceedWithOrder = () => {
    if (!canOrder || !address) return;

    const itemsList = items.map(item => ({
      name: item.product.name,
      quantity: formatQuantity(item.quantity, item.product.unit),
      price: calculateItemPrice(item.product.price, item.quantity, item.product.unit),
    }));

    const dateLabel = deliveryDate === 'today' ? 'Today' : 'Tomorrow';
    const paymentLabel = paymentMode === 'cod' ? 'Cash on Delivery' : 'UPI (Paid)';
    const locationLink = getGoogleMapsLink();
    
    const fullAddress = `${address.houseNo}, ${address.street}, ${address.village}, Near ${address.landMark}, Pin: 503225`;

    const message = generateWhatsAppMessage(
      address.fullName,
      address.primaryMobile,
      address.alternateMobile,
      fullAddress,
      dateLabel,
      deliveryTime,
      remarks,
      itemsList,
      subtotal,
      deliveryCharge,
      paymentLabel,
      paidAmount,
      remainingAmount,
      upiTransactionId.trim(),
      locationLink
    );

    const whatsappUrl = `https://wa.me/919494719306?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    toast.success('Order sent to WhatsApp!');
    clearCart();
    onClose();
  };

  const skipLocationAndProceed = () => {
    setLocationDenied(true);
    setShowLocationPrompt(false);
    toast.info('Location not shared. Please ensure address is correct.');
    proceedWithOrder();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="absolute inset-0 top-12 bg-card rounded-t-3xl animate-slide-up shadow-float overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-foreground">Your Cart</h2>
            <p className="text-xs text-muted-foreground">మీ కార్ట్</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-muted transition-all active:scale-90"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <Truck className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold text-foreground">Cart is Empty</p>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Add some fresh items to get started!
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-6">
              {/* Cart Items */}
              <div className="space-y-3">
                {items.map((item) => {
                  const itemPrice = calculateItemPrice(item.product.price, item.quantity, item.product.unit);
                  return (
                    <div key={item.product.id} className="flex gap-3 p-3 bg-muted rounded-xl">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.product.price)} / {item.product.unit}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => {
                              if (item.quantity > item.product.minQuantity) {
                                updateQuantity(item.product.id, item.quantity - item.product.incrementBy);
                              }
                            }}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-card text-foreground"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-medium text-foreground min-w-[60px] text-center">
                            {formatQuantity(item.quantity, item.product.unit)}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + item.product.incrementBy)}
                            className="w-6 h-6 flex items-center justify-center rounded-full gradient-primary text-primary-foreground"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 rounded-full bg-destructive/10 text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-bold text-secondary">
                          {formatPrice(itemPrice)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Address Check */}
              {!hasAddress && (
                <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/30">
                  <p className="text-sm text-foreground font-medium mb-2">
                    Add delivery address to continue
                  </p>
                  <button
                    onClick={onAddressClick}
                    className="w-full py-2.5 rounded-lg gradient-secondary text-secondary-foreground text-sm font-semibold transition-all active:scale-95"
                  >
                    Add Address
                  </button>
                </div>
              )}

              {/* Delivery Date */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Delivery Date / డెలివరీ తేదీ
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeliveryDate('today')}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-semibold text-sm transition-all",
                      deliveryDate === 'today'
                        ? "gradient-primary text-primary-foreground shadow-button"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setDeliveryDate('tomorrow')}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-semibold text-sm transition-all",
                      deliveryDate === 'tomorrow'
                        ? "gradient-primary text-primary-foreground shadow-button"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    Tomorrow
                  </button>
                </div>
              </div>

              {/* Delivery Time - Dropdown */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Time Slot / సమయం
                  </span>
                </div>
                
                <div className="relative">
                  <select
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="">Select Time Slot</option>
                    {timeSlots.map((group) => (
                      <optgroup key={group.group} label={group.group}>
                        {group.slots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Remarks (Optional) / వ్యాఖ్యలు
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Example: Call before delivery / Leave at gate"
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none text-sm"
                />
              </div>

              {/* Price Summary */}
              <div className="p-4 bg-muted rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items Total</span>
                  <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={cn(
                    "font-semibold",
                    deliveryCharge === 0 ? "text-available" : "text-foreground"
                  )}>
                    {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                  </span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between">
                  <span className="font-bold text-foreground">Grand Total</span>
                  <span className="font-bold text-lg text-primary">{formatPrice(grandTotal)}</span>
                </div>
                {subtotal < 100 && (
                  <p className="text-xs text-secondary text-center pt-2">
                    Add ₹{(100 - subtotal).toFixed(0)} more for FREE delivery!
                  </p>
                )}
              </div>

              {/* Payment Options */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Payment / చెల్లింపు
                  </span>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setPaymentMode('cod')}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all border-2",
                      paymentMode === 'cod'
                        ? "border-primary bg-primary/5"
                        : "border-border bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        paymentMode === 'cod' ? "border-primary" : "border-muted-foreground"
                      )}>
                        {paymentMode === 'cod' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">Cash on Delivery</p>
                        <p className="text-xs text-muted-foreground">Pay when you receive</p>
                      </div>
                    </div>
                    {paymentMode === 'cod' && (
                      <p className="mt-2 text-xs text-secondary bg-secondary/10 p-2 rounded-lg">
                        ₹20 advance is required and is non-refundable
                      </p>
                    )}
                  </button>

                  <button
                    onClick={() => setPaymentMode('upi')}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all border-2",
                      paymentMode === 'upi'
                        ? "border-primary bg-primary/5"
                        : "border-border bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        paymentMode === 'upi' ? "border-primary" : "border-muted-foreground"
                      )}>
                        {paymentMode === 'upi' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">Pay Now (UPI)</p>
                        <p className="text-xs text-muted-foreground">Pay full amount upfront</p>
                      </div>
                    </div>
                    {paymentMode === 'upi' && (
                      <p className="mt-2 text-xs text-primary bg-primary/10 p-2 rounded-lg">
                        ₹20 will be deducted if order is cancelled
                      </p>
                    )}
                  </button>
                </div>
              </div>

              {/* UPI Payment Button */}
              {paymentMode && (
                <a
                  href={generateUPILink(upiAmount, orderId)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm gradient-secondary text-secondary-foreground shadow-button transition-all active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  Pay {formatPrice(upiAmount)} via UPI
                </a>
              )}

              {/* UPI Transaction ID Input - Required after payment */}
              {paymentMode && (
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    UPI Transaction ID / ట్రాన్సాక్షన్ ID <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={upiTransactionId}
                    onChange={(e) => setUpiTransactionId(e.target.value)}
                    placeholder="Enter UPI Transaction ID (min 6 characters)"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the transaction ID from your UPI payment confirmation
                  </p>
                </div>
              )}

              {/* Location Status */}
              {location && (
                <div className="p-3 bg-available/10 rounded-xl border border-available/30 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-available" />
                  <span className="text-sm text-foreground">Location added for delivery</span>
                </div>
              )}

              {/* WhatsApp Order Button */}
              <button
                onClick={handleWhatsAppClick}
                disabled={!canOrder}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all",
                  canOrder
                    ? "gradient-success text-primary-foreground shadow-button active:scale-95"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <MessageCircle className="w-5 h-5" />
                Confirm Order on WhatsApp
              </button>

              {/* Missing fields feedback */}
              {!canOrder && (
                <div className="text-xs text-destructive text-center space-y-1">
                  <p className="font-medium">Missing: {getMissingFields().join(', ')}</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Safe area padding */}
        <div className="h-6" />
      </div>

      {/* Location Permission Modal */}
      {showLocationPrompt && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-foreground/60" onClick={() => setShowLocationPrompt(false)} />
          <div className="relative bg-card rounded-2xl p-6 max-w-sm w-full shadow-float animate-slide-up">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                📍 Allow Location Access
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Allow location access for faster delivery. Your location will be used only for this order.
              </p>
              <p className="text-xs text-muted-foreground mb-6 bg-muted p-3 rounded-lg">
                మీ లొకేషన్ ఈ ఆర్డర్ కోసం మాత్రమే ఉపయోగించబడుతుంది.
              </p>
              
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={handleRequestLocation}
                  disabled={locationLoading}
                  className="w-full py-3 rounded-xl font-semibold text-sm gradient-primary text-primary-foreground shadow-button transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {locationLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4" />
                      Allow Location
                    </>
                  )}
                </button>
                <button
                  onClick={skipLocationAndProceed}
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-muted text-muted-foreground transition-all active:scale-95"
                >
                  Skip & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
