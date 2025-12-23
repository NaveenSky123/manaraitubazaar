import { useEffect, useState } from 'react';
import { Truck, Clock, Sparkles } from 'lucide-react';

export function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div 
      className={`mx-4 mb-4 overflow-hidden rounded-2xl gradient-banner shadow-float transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="relative px-4 py-5">
        {/* Decorative elements */}
        <div className="absolute top-2 right-2 opacity-20">
          <Sparkles className="w-16 h-16 text-primary-foreground" />
        </div>
        
        <div className="relative z-10">
          <p className="text-2xl mb-2">🙏</p>
          <h2 className="text-lg font-bold text-primary-foreground mb-2">
            Welcome to Mana Raitu Bazaar!
          </h2>
          <p className="text-sm text-primary-foreground/90 font-medium mb-1">
            Morthad Branch | మొర్తాడ్ బ్రాంచ్
          </p>
          
          <p className="text-sm text-primary-foreground/90 leading-relaxed mb-4">
            Fresh from Raitu to Your Home – రైతుల నుండి మీ ఇంటికి
          </p>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">
                Morning: 6:00 AM – 9:00 AM
              </span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">
                Evening: 4:00 PM – 9:00 PM
              </span>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground mt-2">
              <Truck className="w-4 h-4" />
              <span className="text-xs font-semibold">
                Free Delivery on orders ₹100+
              </span>
            </div>
          </div>
          
          <p className="mt-3 text-xs text-primary-foreground/80 font-medium">
            – Mana Raitu Bazaar, Morthad Branch
          </p>
        </div>
      </div>
    </div>
  );
}
