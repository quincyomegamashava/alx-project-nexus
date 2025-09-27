// Image URL helper for consistent image serving across platforms
export function getImageUrl(imagePath: string): string {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  return `${API_URL}/${cleanPath}`;
}

// Mobile-specific image URL (React Native doesn't use NEXT_PUBLIC_ prefix)
export function getMobileImageUrl(imagePath: string): string {
  const API_URL = 'http://localhost:4000'; // Could be made configurable later
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  return `${API_URL}/${cleanPath}`;
}