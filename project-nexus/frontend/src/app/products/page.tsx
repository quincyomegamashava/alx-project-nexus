'use client';

import { useSelector } from 'react-redux';
import { ProductList } from '../../components/ProductList';
import type { RootState } from '../../store';

export default function ProductsPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return <ProductList />;
}
