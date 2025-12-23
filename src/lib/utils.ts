import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatQuantity(quantity: number, unit: string): string {
  if (unit === 'kg') {
    const kg = Math.floor(quantity / 1000);
    const g = quantity % 1000;
    if (kg > 0 && g > 0) {
      return `${kg} kg ${g}g`;
    } else if (kg > 0) {
      return `${kg} kg`;
    }
    return `${g}g`;
  }
  
  if (unit === 'liter') {
    if (quantity >= 1000) {
      const liters = quantity / 1000;
      return `${liters} L`;
    }
    return `${quantity} ml`;
  }
  
  if (unit === 'bunch') {
    return quantity === 1 ? '1 Bunch' : `${quantity} Bunches`;
  }
  
  if (unit === 'packet') {
    return quantity === 1 ? '1 Packet' : `${quantity} Packets`;
  }
  
  if (unit === 'piece') {
    return quantity === 1 ? '1 Piece' : `${quantity} Pieces`;
  }
  
  return `${quantity}`;
}

export function calculateItemPrice(price: number, quantity: number, unit: string): number {
  if (unit === 'kg' || unit === 'liter') {
    return (price * quantity) / 1000;
  }
  return price * quantity;
}

export function formatPrice(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export function validateMobile(mobile: string): boolean {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
}

export function generateOrderId(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MRB${dateStr}${randomStr}`;
}

export function generateUPILink(amount: number, orderId: string): string {
  const upiId = '9494719306@ybl';
  const payeeName = encodeURIComponent('Mana Raitu Bazaar');
  const transactionNote = encodeURIComponent(`Order ID: ${orderId}`);
  return `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR&tn=${transactionNote}`;
}

export function generateWhatsAppMessage(
  customerName: string,
  primaryMobile: string,
  alternateMobile: string,
  fullAddress: string,
  deliveryDate: string,
  deliveryTime: string,
  remarks: string,
  items: { name: string; quantity: string; price: number }[],
  subtotal: number,
  deliveryCharge: number,
  paymentMode: string,
  paidAmount: number,
  remainingAmount: number,
  transactionId?: string,
  locationLink?: string | null
): string {
  let message = `🛒 *New Order - Mana Raitu Bazaar, Morthad*\n\n`;
  message += `👤 *Customer:* ${customerName}\n`;
  message += `📞 *Primary Mobile:* ${primaryMobile}\n`;
  message += `📞 *Alternate Mobile:* ${alternateMobile}\n`;
  message += `📍 *Address:* ${fullAddress}\n`;
  
  if (locationLink) {
    message += `\n📍 *Delivery Location (Google Maps):*\n${locationLink}\n`;
  }
  
  message += `\n📅 *Delivery Date:* ${deliveryDate}\n`;
  message += `⏰ *Time Slot:* ${deliveryTime}\n`;
  
  if (remarks) {
    message += `📝 *Remarks:* ${remarks}\n`;
  }
  
  message += `\n📦 *Order Items:*\n`;
  message += `─────────────────\n`;
  
  items.forEach(item => {
    message += `• ${item.name} - ${item.quantity} = ₹${item.price.toFixed(2)}\n`;
  });
  
  message += `─────────────────\n`;
  message += `💰 *Items Total:* ₹${subtotal.toFixed(2)}\n`;
  message += `🚚 *Delivery:* ${deliveryCharge > 0 ? `₹${deliveryCharge}` : 'FREE'}\n`;
  message += `💵 *Grand Total:* ₹${(subtotal + deliveryCharge).toFixed(2)}\n\n`;
  
  message += `💳 *Payment Mode:* ${paymentMode}\n`;
  if (transactionId) {
    message += `🔖 *UPI Transaction ID:* ${transactionId}\n`;
  }
  message += `✅ *Paid:* ₹${paidAmount.toFixed(2)}\n`;
  
  if (remainingAmount > 0) {
    message += `⏳ *Remaining:* ₹${remainingAmount.toFixed(2)}\n`;
  }
  
  message += `\n🙏 Thank you for choosing Mana Raitu Bazaar – Morthad Branch.\nOnce payment or order verification is completed, your order will be delivered in the selected time slot.`;
  
  return encodeURIComponent(message);
}
