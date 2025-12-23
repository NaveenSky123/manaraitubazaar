import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Address } from '@/types';

interface AddressContextType {
  address: Address | null;
  saveAddress: (address: Address) => void;
  deleteAddress: () => void;
  hasAddress: boolean;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<Address | null>(() => {
    const saved = localStorage.getItem('address');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (address) {
      localStorage.setItem('address', JSON.stringify(address));
    } else {
      localStorage.removeItem('address');
    }
  }, [address]);

  const saveAddress = (newAddress: Address) => {
    setAddress(newAddress);
  };

  const deleteAddress = () => {
    setAddress(null);
  };

  return (
    <AddressContext.Provider
      value={{
        address,
        saveAddress,
        deleteAddress,
        hasAddress: !!address,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
}
