import React, { useState } from 'react';
import ProductSearchModal from './ProductSearchModal';

interface Category {
  id: number;
  name: string;
}

interface Product {
  productId: number;
  productName: string;
  categoryId: number;
  categoryName: string;
  imageUrl: string;
  price: number;
}

const categories: Category[] = [
  { id: 1, name: '케이스' },
  { id: 2, name: '스위치' },
  { id: 3, name: '키캡' },
  { id: 4, name: 'PCB' },
  { id: 5, name: '플레이트' },
  { id: 7, name: '폼' },
];

export default function CategoryProductSelector() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Record<number, Product>>({});

  const handleSelectProduct = (product: Product) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [product.categoryId]: product,
    }));
    setSelectedCategory(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      {categories.map((cat) => (
        <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <div>{cat.name}</div>
            {selectedProducts[cat.id] && (
              <div style={{ fontSize: '12px', color: '#888' }}>
                ✅ {selectedProducts[cat.id].productName}
              </div>
            )}
          </div>
          <button onClick={() => setSelectedCategory(cat)} style={{ padding: '4px 8px' }}>
            +
          </button>
        </div>
      ))}

      {selectedCategory && (
        <ProductSearchModal
          categoryId={selectedCategory.id}
          categoryName={selectedCategory.name}
          onSelect={handleSelectProduct}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
}