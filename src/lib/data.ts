export type Category = 'T-Shirts' | 'Caps' | 'Mugs & Cups' | 'Bags';

export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: Category;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  isNew?: boolean;
  isSale?: boolean;
  rating: number;
  reviews: number;
  details: {
    fabric?: string;
    fit?: string;
    print?: string;
  };
};

export const MOCK_PRODUCTS: Product[] = [
  // T-Shirts
  {
    id: 'ts-1',
    name: 'Oversized "No Signal" Graphic Tee',
    price: 35,
    category: 'T-Shirts',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Heavyweight oversized tee with a retro "No Signal" distressed print on the back and minimalist logo on the front.',
    isNew: true,
    rating: 4.8,
    reviews: 124,
    details: {
      fabric: '100% Premium Cotton, 240 GSM',
      fit: 'Oversized Drop Shoulder',
      print: 'High-Density Screen Print',
    }
  },
  {
    id: 'ts-2',
    name: 'Cyberpunk Essential T-Shirt',
    price: 28,
    originalPrice: 40,
    category: 'T-Shirts',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Neon Orange', hex: '#FF5F1F' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Regular fit essential tee with bold cyber-inspired typography down the spine.',
    isSale: true,
    rating: 4.5,
    reviews: 89,
    details: {
      fabric: '100% Ring-Spun Cotton, 180 GSM',
      fit: 'Regular Street Fit',
      print: 'DTG Print',
    }
  },
  {
    id: 'ts-3',
    name: 'Minimalist Box Logo Tee',
    price: 30,
    category: 'T-Shirts',
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Sand', hex: '#C2B280' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'Clean, simple, everyday premium tee featuring a subtle raised box logo on the chest.',
    rating: 4.9,
    reviews: 312,
    details: {
      fabric: '100% Organic Cotton, 200 GSM',
      fit: 'Relaxed Fit',
      print: 'Rubberized 3D Print',
    }
  },
  {
    id: 'ts-4',
    name: 'Acid Wash Vintage Tee',
    price: 45,
    category: 'T-Shirts',
    images: [
      'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'Acid Black', hex: '#2A2A2A' },
      { name: 'Acid Blue', hex: '#4A5D70' },
    ],
    sizes: ['M', 'L', 'XL'],
    description: 'Custom acid washed tee with a raw hem and subtle distressed details.',
    isNew: true,
    rating: 4.7,
    reviews: 56,
    details: {
      fabric: '100% Cotton, 220 GSM',
      fit: 'Boxy Vintage Fit',
      print: 'None',
    }
  },
  // Caps
  {
    id: 'cp-1',
    name: 'Zavento Signature Snapback',
    price: 25,
    category: 'Caps',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#000080' },
    ],
    sizes: ['One Size'],
    description: 'Classic 6-panel snapback with 3D embroidered Zavento logo.',
    rating: 4.6,
    reviews: 78,
    details: {
      fabric: '100% Cotton Twill',
      fit: 'Adjustable Snapback',
      print: '3D Embroidery',
    }
  },
  {
    id: 'cp-2',
    name: 'Distressed Dad Hat',
    price: 22,
    originalPrice: 30,
    category: 'Caps',
    images: [
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'Washed Charcoal', hex: '#444444' },
      { name: 'Olive', hex: '#808000' },
    ],
    sizes: ['One Size'],
    description: 'Low-profile dad hat with distressed visor and embroidered icon.',
    isSale: true,
    rating: 4.8,
    reviews: 145,
    details: {
      fabric: '100% Washed Cotton',
      fit: 'Adjustable Strapback',
      print: 'Flat Embroidery',
    }
  },
  // Mugs
  {
    id: 'mg-1',
    name: 'Matte Black Developer Mug',
    price: 18,
    category: 'Mugs & Cups',
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'Matte Black', hex: '#1C1C1C' },
    ],
    sizes: ['11oz', '15oz'],
    description: 'Sleek matte black ceramic mug with glossy inner coating.',
    rating: 4.9,
    reviews: 210,
    details: {
      fabric: 'Premium Ceramic',
      fit: 'Standard Mug',
      print: 'Laser Engraved',
    }
  },
  {
    id: 'mg-2',
    name: 'Enamel Camp Cup',
    price: 20,
    category: 'Mugs & Cups',
    images: [
      'https://images.unsplash.com/photo-1517255955139-3825ccce0669?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Forest Green', hex: '#228B22' },
    ],
    sizes: ['12oz'],
    description: 'Durable enamel coated steel camp cup perfect for outdoor adventures.',
    isNew: true,
    rating: 4.7,
    reviews: 42,
    details: {
      fabric: 'Enamel Coated Steel',
      fit: 'Camp Cup',
      print: 'Sublimation',
    }
  },
  // Bags
  {
    id: 'bg-1',
    name: 'Urban Tactical Backpack',
    price: 65,
    category: 'Bags',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Coyote Brown', hex: '#8B6508' },
    ],
    sizes: ['25L'],
    description: 'Water-resistant tactical backpack with laptop sleeve and molle webbing.',
    rating: 4.9,
    reviews: 156,
    details: {
      fabric: '1000D Cordura Nylon',
      fit: 'Adjustable Padded Straps',
      print: 'Woven Label',
    }
  },
  {
    id: 'bg-2',
    name: 'Heavyweight Canvas Tote',
    price: 25,
    category: 'Bags',
    images: [
      'https://images.unsplash.com/photo-1597339798448-f2a89467d5ce?auto=format&fit=crop&w=800&q=80',
    ],
    colors: [
      { name: 'Natural', hex: '#F5F5DC' },
      { name: 'Black', hex: '#000000' },
    ],
    sizes: ['One Size'],
    description: 'Ultra-durable heavyweight canvas tote bag with reinforced handles.',
    isSale: true,
    originalPrice: 35,
    rating: 4.6,
    reviews: 89,
    details: {
      fabric: '14oz Cotton Canvas',
      fit: 'Over the shoulder',
      print: 'Screen Print',
    }
  }
];

export const CATEGORIES = [
  {
    name: 'T-Shirts',
    image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=800&q=80',
    link: '/category/t-shirts'
  },
  {
    name: 'Caps',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    link: '/category/caps'
  },
  {
    name: 'Mugs & Cups',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80',
    link: '/category/mugs-cups'
  },
  {
    name: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    link: '/category/bags'
  }
];

/**
 * Normalize any input category string into the canonical store Category type.
 */
export function normalizeCategory(cat: string | undefined): Category {
  if (!cat) return 'T-Shirts';
  const c = cat.toLowerCase().trim();
  if (c === 'mugs & cups' || c === 'mugs-cups' || c.includes('mug') || c.includes('cup') || c.includes('drinkware') || c.includes('tumbler')) {
    return 'Mugs & Cups';
  }
  if (c === 'caps' || c.includes('cap') || c.includes('hat') || c.includes('beanie') || c.includes('snapback')) {
    return 'Caps';
  }
  if (c === 'bags' || c.includes('bag') || c.includes('tote') || c.includes('backpack') || c.includes('duffle')) {
    return 'Bags';
  }
  return 'T-Shirts';
}

/**
 * Merge Printify synced products with default catalog.
 */
export function combineProducts(synced: Product[] = []): Product[] {
  if (!synced || synced.length === 0) return MOCK_PRODUCTS;
  const normalizedSynced = synced.map((p) => ({
    ...p,
    category: normalizeCategory(p.category),
  }));
  const syncedIds = new Set(normalizedSynced.map((p) => p.id));
  return [...normalizedSynced, ...MOCK_PRODUCTS.filter((p) => !syncedIds.has(p.id))];
}

