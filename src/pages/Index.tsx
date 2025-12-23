import { useState } from 'react';
import { Header } from '@/components/Header';
import { WelcomeBanner } from '@/components/WelcomeBanner';
import { ProductTabs } from '@/components/ProductTabs';
import { ProductGrid } from '@/components/ProductGrid';
import { AddressSheet } from '@/components/AddressSheet';
import { CartSheet } from '@/components/CartSheet';
import { InstallPrompt } from '@/components/InstallPrompt';
import { SplashScreen } from '@/components/SplashScreen';

const Index = () => {
  const [activeTab, setActiveTab] = useState('vegetables');
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header
        onAddressClick={() => setIsAddressOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      {/* Spacer for fixed header */}
      <div className="h-[60px]" />
      
      <main>
        <WelcomeBanner />
        <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <ProductGrid category={activeTab} />
      </main>

      <AddressSheet
        isOpen={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
      />

      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onAddressClick={() => {
          setIsCartOpen(false);
          setTimeout(() => setIsAddressOpen(true), 300);
        }}
      />

      <InstallPrompt />
    </div>
  );
};

export default Index;
