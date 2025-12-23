import { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export function InstallPrompt() {
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show after a short delay if installable
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('pwa-dismissed');
      if (isInstallable && !dismissed) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isInstallable]);

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  if (!isVisible || isInstalled || isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="relative gradient-banner rounded-2xl p-4 shadow-float overflow-hidden">
        {/* Decorative sparkles */}
        <div className="absolute top-2 right-12 opacity-30 animate-bounce-gentle">
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        </div>
        
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-primary-foreground/20 transition-all active:scale-90"
        >
          <X className="w-4 h-4 text-primary-foreground" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center flex-shrink-0 animate-bounce-gentle">
            <Download className="w-6 h-6 text-primary-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-primary-foreground">
              📲 Install Mana Raitu App
            </h3>
            <p className="text-xs text-primary-foreground/80 mt-0.5">
              Faster ordering, works offline!
            </p>
          </div>
        </div>

        <button
          onClick={handleInstall}
          className="mt-3 w-full py-2.5 rounded-xl bg-primary-foreground text-primary font-semibold text-sm transition-all active:scale-95"
        >
          Install Now – Free
        </button>
      </div>
    </div>
  );
}
