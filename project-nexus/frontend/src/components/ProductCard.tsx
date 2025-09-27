import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Plus } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../types/product';
import { getImageUrl, handleImageError } from '../utils/imageUrl';
import { addToCart } from '../store/slices/cartSlice';
import type { RootState, AppDispatch } from '../store';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (user?.role !== 'buyer') {
      alert('Only buyers can add items to cart');
      return;
    }
    
    if (product.stock <= 0) {
      alert('This product is out of stock');
      return;
    }
    
    dispatch(addToCart({ product, quantity: 1 }));
    alert('Added to cart!');
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-indigo-100 hover:border-indigo-300 relative group"
      onClick={onClick}
    >
      <div className="relative h-48 w-full">
        <Image
          src={imageError ? '/images/default-product.svg' : getImageUrl(product.image)}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
          onError={() => setImageError(true)}
        />
        
        {/* Add to Cart Button */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-2 rounded-full shadow-lg transition-colors duration-200"
            title={product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
        
        {/* Stock indicator */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded-full text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900" style={{ 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.title}
          </h3>
          <span className="text-xl font-bold text-indigo-600 ml-2">
            ${product.price}
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full font-medium">
            {product.category}
          </span>
          {product.rating && (
            <div className="flex items-center">
              <svg className="w-4 h-4 text-indigo-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm text-indigo-600 font-medium">{product.rating}</span>
            </div>
          )}
        </div>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-3" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Stock:</span>
            <span className={`text-xs font-medium ${
              product.stock > 10 
                ? 'text-green-600' 
                : product.stock > 0 
                ? 'text-yellow-600' 
                : 'text-red-600'
            }`}>
              {product.stock > 0 ? product.stock : 'Out of stock'}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xs px-3 py-1.5 rounded-md transition-colors duration-200"
            title={product.stock <= 0 ? 'Out of stock' : 'Add to cart'}
          >
            <Plus className="h-3 w-3" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}