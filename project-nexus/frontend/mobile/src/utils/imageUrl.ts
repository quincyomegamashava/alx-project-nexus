// Image URL helper for mobile React Native app
export function getMobileImageUrl(imagePath: string): string {
  const API_URL = 'http://localhost:4000'; // Could be made configurable later
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  return `${API_URL}/${cleanPath}`;
}