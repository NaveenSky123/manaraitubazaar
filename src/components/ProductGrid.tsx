import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { getProductsByCategory } from '@/data/products';

interface ProductGridProps {
  category: string;
}

export function ProductGrid({ category }: ProductGridProps) {
  const products = getProductsByCategory(category);

  return (
    <div className="grid grid-cols-2 gap-3 p-4 animate-fade-in">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
