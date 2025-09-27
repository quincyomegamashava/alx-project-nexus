// Image URL helper for mobile React Native app
export function getMobileImageUrl(imagePath: string): string {
  // If no image path provided, return a placeholder
  if (!imagePath) {
    return 'https://via.placeholder.com/300x300?text=No+Image';
  }
  
  // If the path is already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://alx-project-nexus-production-4427.up.railway.app';
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  return `${API_URL}/${cleanPath}`;
}

// Fallback for when image fails to load
export function getDefaultProductImage(): string {
  return 'https://via.placeholder.com/300x300?text=Product';
}
