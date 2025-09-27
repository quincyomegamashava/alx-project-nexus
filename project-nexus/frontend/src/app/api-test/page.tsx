'use client';

import { useEffect, useState } from 'react';

export default function ApiTestPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApi = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Testing API endpoint: http://localhost:4000/api/products');
        const response = await fetch('http://localhost:4000/api/products');
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API data:', data);
        setProducts(data);
      } catch (err: any) {
        console.error('API error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Testing: /api/products endpoint</h2>
          
          {loading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <span>Loading...</span>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {!loading && !error && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <p className="text-green-800">✅ API call successful!</p>
                <p className="text-green-700">Found {products.length} products</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Products:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.slice(0, 4).map((product) => (
                    <div key={product.id} className="border rounded p-4">
                      <h4 className="font-semibold">{product.title}</h4>
                      <p className="text-gray-600">${product.price}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Debug Info:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Frontend running on: {typeof window !== 'undefined' ? window.location.origin : 'Unknown'}</li>
            <li>• API server should be on: http://localhost:4000</li>
            <li>• Endpoint being tested: /api/products</li>
            <li>• Check browser network tab for more details</li>
          </ul>
        </div>
      </div>
    </div>
  );
}