import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#c5d8c5] transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo and branding */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* App Logo */}
        <div className="w-32 h-32 rounded-3xl overflow-hidden mb-6 animate-logo-float shadow-float">
          <img 
            src="/logo.jpg" 
            alt="Raitu Bazar Logo" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Title with color animation */}
        <h1 className="text-3xl font-bold mb-2 animate-fade-in animate-color-cycle" style={{ animationDelay: '0.2s' }}>
          Mana Raitu Bazaar
        </h1>

        {/* Branch Name with color animation */}
        <p className="text-xl font-semibold mb-4 animate-fade-in animate-color-cycle" style={{ animationDelay: '0.4s', animationDuration: '3s' }}>
          Morthad Branch
        </p>

        {/* Tagline */}
        <p className="text-base text-foreground/80 font-medium italic animate-fade-in" style={{ animationDelay: '0.6s' }}>
          "Raitula Nundi – Mee Intiki"
        </p>
        <p className="text-sm text-foreground/70 mt-1 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          From Farmers – To Your Home
        </p>

        {/* Loading indicator */}
        <div className="mt-10 flex flex-col items-center gap-3 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="flex gap-1.5">
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-sm text-foreground/70">
            Loading Freshness… 🌿
          </p>
        </div>
      </div>
    </div>
  );
}
