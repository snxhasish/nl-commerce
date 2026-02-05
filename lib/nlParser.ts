import { Product } from './products';

export interface ParsedIntent {
  action: 'search' | 'filter' | 'compare' | 'refine' | 'browse';
  category?: string;
  gender?: string;
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  keywords?: string[];
  sentiment?: 'cheaper' | 'expensive' | 'casual' | 'formal' | 'premium' | null;
  compareIds?: string[];
}

export function parseNaturalLanguage(input: string): ParsedIntent {
  const lowerInput = input.toLowerCase().trim();

  // Initialize the intent
  const intent: ParsedIntent = {
    action: 'search',
    keywords: [],
  };

  // Detect action type
  if (lowerInput.includes('compare')) {
    intent.action = 'compare';
  } else if (lowerInput.includes('find') || lowerInput.includes('show')) {
    intent.action = 'search';
  } else if (
    lowerInput.includes('cheaper') ||
    lowerInput.includes('more expensive') ||
    lowerInput.includes('premium')
  ) {
    intent.action = 'refine';
  }

  // Extract categories
  const categories = [
    'hoodie',
    'hoodies',
    'jeans',
    'trouser',
    'trousers',
    'sock',
    'socks',
    'shoe',
    'shoes',
    'sneaker',
    'sneakers',
    'boot',
    'boots',
    'tee',
    'tees',
    't-shirt',
    'shirt',
    'shirts',
    'blouse',
    'jacket',
    'jackets',
    'denim',
    'leather',
  ];
  for (const cat of categories) {
    if (lowerInput.includes(cat)) {
      intent.category = cat.replace(/s$/, '');
      if (intent.category === 'sneaker') intent.category = 'shoes';
      if (intent.category === 'boot') intent.category = 'shoes';
      if (intent.category === 't-shirt') intent.category = 'tees';
      if (intent.category === 'sock') intent.category = 'socks';
      if (intent.category === 'trouser') intent.category = 'trousers';
      break;
    }
  }

  // Extract gender
  if (
    lowerInput.includes('women') ||
    lowerInput.includes('womens') ||
    lowerInput.includes('for women')
  ) {
    intent.gender = 'women';
  } else if (
    lowerInput.includes('men') ||
    lowerInput.includes('mens') ||
    lowerInput.includes('for men')
  ) {
    intent.gender = 'men';
  }

  // Extract colors
  const colorKeywords = [
    'black',
    'white',
    'gray',
    'grey',
    'blue',
    'navy',
    'red',
    'pink',
    'brown',
    'green',
    'purple',
    'beige',
    'cream',
    'blush',
    'maroon',
  ];
  const foundColors: string[] = [];
  for (const color of colorKeywords) {
    if (lowerInput.includes(color)) {
      foundColors.push(color);
    }
  }
  if (foundColors.length > 0) {
    intent.colors = foundColors.map(
      (c) => c.charAt(0).toUpperCase() + c.slice(1)
    );
  }

  // Extract price range
  const priceMatch = lowerInput.match(/under\s+(\d+)|(\d+)\s*(?:rs|₹)?/);
  if (priceMatch) {
    const price = parseInt(priceMatch[1] || priceMatch[2]);
    intent.maxPrice = price;
  }

  // Extract sentiment keywords
  if (lowerInput.includes('cheaper')) {
    intent.sentiment = 'cheaper';
  } else if (
    lowerInput.includes('expensive') ||
    lowerInput.includes('premium')
  ) {
    intent.sentiment = 'expensive';
  } else if (
    lowerInput.includes('casual') ||
    lowerInput.includes('college')
  ) {
    intent.sentiment = 'casual';
  } else if (lowerInput.includes('formal')) {
    intent.sentiment = 'formal';
  }

  // Extract keywords for general search
  const words = lowerInput.split(/\s+/);
  intent.keywords = words.filter((w) => w.length > 3 && !['show', 'find', 'for', 'that', 'something', 'want', 'me', 'the', 'this'].includes(w));

  return intent;
}

export function filterProducts(
  products: Product[],
  intent: ParsedIntent,
  currentFilters?: ParsedIntent
): Product[] {
  let results = [...products];

  const activeFilters = currentFilters || intent;

  // Filter by category
  if (activeFilters.category) {
    const categoryMap: Record<string, string> = {
      hoodie: 'hoodies',
      jeans: 'jeans',
      trouser: 'trousers',
      sock: 'socks',
      shoe: 'shoes',
      tee: 'tees',
      shirt: 'shirts',
      jacket: 'jackets',
    };
    const categoryName =
      categoryMap[activeFilters.category] || activeFilters.category;
    results = results.filter((p) => p.category === categoryName);
  }

  // Filter by gender
  if (activeFilters.gender) {
    results = results.filter(
      (p) => p.gender === activeFilters.gender || p.gender === 'unisex'
    );
  }

  // Filter by color
  if (activeFilters.colors && activeFilters.colors.length > 0) {
    results = results.filter((p) =>
      activeFilters.colors?.some(
        (c) =>
          p.color.toLowerCase() === c.toLowerCase() ||
          p.colors.some((pc) => pc.toLowerCase() === c.toLowerCase())
      )
    );
  }

  // Filter by price range
  if (activeFilters.maxPrice) {
    results = results.filter((p) => p.price <= activeFilters.maxPrice!);
  }
  if (activeFilters.minPrice) {
    results = results.filter((p) => p.price >= activeFilters.minPrice!);
  }

  // Sort by price if sentiment suggests cheapness
  if (activeFilters.sentiment === 'cheaper') {
    results.sort((a, b) => a.price - b.price);
  } else if (activeFilters.sentiment === 'expensive') {
    results.sort((a, b) => b.price - a.price);
  }

  return results;
}
