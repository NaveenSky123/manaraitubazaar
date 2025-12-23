import { useState } from 'react';
import { X, User, Phone, MapPin, Check, Trash2, Edit2, Home, Navigation } from 'lucide-react';
import { useAddress } from '@/hooks/useAddress';
import { validateMobile, cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AddressSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddressSheet({ isOpen, onClose }: AddressSheetProps) {
  const { address, saveAddress, deleteAddress, hasAddress } = useAddress();
  const [isEditing, setIsEditing] = useState(!hasAddress);
  const [formData, setFormData] = useState({
    fullName: address?.fullName || '',
    primaryMobile: address?.primaryMobile || '',
    alternateMobile: address?.alternateMobile || '',
    houseNo: address?.houseNo || '',
    village: address?.village || 'Morthad',
    street: address?.street || '',
    landMark: address?.landMark || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }

    if (!formData.primaryMobile.trim()) {
      newErrors.primaryMobile = 'Primary mobile is required';
    } else if (!validateMobile(formData.primaryMobile)) {
      newErrors.primaryMobile = 'Enter valid 10-digit mobile number';
    }

    if (!formData.alternateMobile.trim()) {
      newErrors.alternateMobile = 'Alternate mobile is required';
    } else if (!validateMobile(formData.alternateMobile)) {
      newErrors.alternateMobile = 'Enter valid 10-digit mobile number';
    }

    if (!formData.houseNo.trim()) {
      newErrors.houseNo = 'House No. is required';
    }

    if (!formData.village.trim()) {
      newErrors.village = 'Village is required';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Street is required';
    }

    if (!formData.landMark.trim()) {
      newErrors.landMark = 'Land Mark is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      saveAddress(formData);
      setIsEditing(false);
      toast.success('Address saved successfully!');
    }
  };

  const handleDelete = () => {
    deleteAddress();
    setFormData({
      fullName: '',
      primaryMobile: '',
      alternateMobile: '',
      houseNo: '',
      village: 'Morthad',
      street: '',
      landMark: '',
    });
    setIsEditing(true);
    toast.success('Address deleted');
  };

  const handleEdit = () => {
    setFormData({
      fullName: address?.fullName || '',
      primaryMobile: address?.primaryMobile || '',
      alternateMobile: address?.alternateMobile || '',
      houseNo: address?.houseNo || '',
      village: address?.village || 'Morthad',
      street: address?.street || '',
      landMark: address?.landMark || '',
    });
    setIsEditing(true);
  };

  const getFullAddress = () => {
    if (!address) return '';
    return `${address.houseNo}, ${address.street}, ${address.village}, Near ${address.landMark}, Pin: 503225`;
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
      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl animate-slide-up shadow-float max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Delivery Address
              </h2>
              <p className="text-xs text-muted-foreground">
                డెలివరీ చిరునామా
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-muted transition-all active:scale-90"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {!isEditing && hasAddress ? (
            /* Display Mode */
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-xl space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">{address?.fullName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <span className="text-foreground">{address?.primaryMobile}</span>
                    <span className="text-muted-foreground text-xs ml-2">(Primary)</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-secondary" />
                  <div>
                    <span className="text-foreground">{address?.alternateMobile}</span>
                    <span className="text-muted-foreground text-xs ml-2">(Alternate)</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{getFullAddress()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleEdit}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm gradient-primary text-primary-foreground shadow-button flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Address
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-3 rounded-xl font-semibold text-sm bg-destructive text-destructive-foreground flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name / పూర్తి పేరు *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className={cn(
                      "w-full pl-11 pr-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all",
                      errors.fullName ? "border-destructive" : "border-border"
                    )}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-xs text-destructive">{errors.fullName}</p>
                )}
              </div>

              {/* Primary Mobile */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Primary Mobile Number / ప్రాథమిక మొబైల్ *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={formData.primaryMobile}
                    onChange={(e) => setFormData({ ...formData, primaryMobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="10-digit mobile number"
                    className={cn(
                      "w-full pl-11 pr-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all",
                      errors.primaryMobile ? "border-destructive" : "border-border"
                    )}
                  />
                </div>
                {errors.primaryMobile && (
                  <p className="mt-1 text-xs text-destructive">{errors.primaryMobile}</p>
                )}
              </div>

              {/* Alternate Mobile */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Alternate Mobile Number / ప్రత్యామ్నాయ మొబైల్ *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={formData.alternateMobile}
                    onChange={(e) => setFormData({ ...formData, alternateMobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="10-digit alternate mobile"
                    className={cn(
                      "w-full pl-11 pr-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all",
                      errors.alternateMobile ? "border-destructive" : "border-border"
                    )}
                  />
                </div>
                {errors.alternateMobile && (
                  <p className="mt-1 text-xs text-destructive">{errors.alternateMobile}</p>
                )}
              </div>

              {/* House No. */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  House No. / ఇంటి నంబర్ *
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.houseNo}
                    onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                    placeholder="Enter house number"
                    className={cn(
                      "w-full pl-11 pr-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all",
                      errors.houseNo ? "border-destructive" : "border-border"
                    )}
                  />
                </div>
                {errors.houseNo && (
                  <p className="mt-1 text-xs text-destructive">{errors.houseNo}</p>
                )}
              </div>

              {/* Village */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Village / గ్రామం *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    placeholder="Enter village name"
                    className={cn(
                      "w-full pl-11 pr-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all",
                      errors.village ? "border-destructive" : "border-border"
                    )}
                  />
                </div>
                {errors.village && (
                  <p className="mt-1 text-xs text-destructive">{errors.village}</p>
                )}
              </div>

              {/* Street */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Street / వీధి *
                </label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="Enter street name"
                    className={cn(
                      "w-full pl-11 pr-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all",
                      errors.street ? "border-destructive" : "border-border"
                    )}
                  />
                </div>
                {errors.street && (
                  <p className="mt-1 text-xs text-destructive">{errors.street}</p>
                )}
              </div>

              {/* Land Mark */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Land Mark / ల్యాండ్ మార్క్ *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.landMark}
                    onChange={(e) => setFormData({ ...formData, landMark: e.target.value })}
                    placeholder="Near temple, school, etc."
                    className={cn(
                      "w-full pl-11 pr-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all",
                      errors.landMark ? "border-destructive" : "border-border"
                    )}
                  />
                </div>
                {errors.landMark && (
                  <p className="mt-1 text-xs text-destructive">{errors.landMark}</p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3.5 rounded-xl font-semibold text-sm gradient-primary text-primary-foreground shadow-button flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Check className="w-5 h-5" />
                Save Address
              </button>
            </div>
          )}
        </div>
        
        {/* Safe area padding */}
        <div className="h-6" />
      </div>
    </div>
  );
}