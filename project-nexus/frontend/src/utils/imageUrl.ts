// Image URL helper for frontend Next.js app with fallback support
export function getImageUrl(imagePath: string): string {
  // If no image path provided or default placeholder requested, use local fallback
  if (!imagePath || imagePath === '/images/default-product.png' || imagePath === 'default-product.png') {
    return '/images/default-product.svg';
  }
  
  // If the path is already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // For development, prefer local images if they exist
  // This ensures images work even when backend is not running
  if (process.env.NODE_ENV === 'development') {
    // Check if it's a product image that should exist locally
    if (imagePath.includes('/images/') || imagePath.startsWith('images/')) {
      return imagePath;
    }
  }
  
  // For API-served images, try the backend first
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://alx-project-nexus-production-4427.up.railway.app';
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  return `${API_URL}/${cleanPath}`;
}

// Fallback function for handling image load errors
export function handleImageError(event: any) {
  event.target.src = '/images/default-product.svg';
}
