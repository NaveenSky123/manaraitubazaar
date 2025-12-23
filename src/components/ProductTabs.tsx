import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  labelTE: string;
}

const tabs: Tab[] = [
  { id: 'vegetables', label: 'Vegetables', labelTE: 'కూరగాయలు' },
  { id: 'fruits', label: 'Fruits & Flowers', labelTE: 'పండ్లు & పూలు' },
  { id: 'groceries', label: 'Groceries', labelTE: 'కిరాణా' },
  { id: 'milk', label: 'Milk Products', labelTE: 'పాల ఉత్పత్తులు' },
];

interface ProductTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function ProductTabs({ activeTab, onTabChange }: ProductTabsProps) {
  return (
    <div className="sticky top-[60px] z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex overflow-x-auto scrollbar-hide py-2 px-2 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300',
              activeTab === tab.id
                ? 'gradient-primary text-primary-foreground shadow-button'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 active:scale-95'
            )}
          >
            <span className="block">{tab.label}</span>
            <span className="block text-[10px] opacity-80">{tab.labelTE}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
