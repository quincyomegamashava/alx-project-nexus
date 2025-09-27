'use client';

import { useSelector } from 'react-redux';
import { ProductList } from '../components/ProductList';
import LandingPage from '../components/LandingPage';
import { RootState } from '../store';

export default function Home() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Show landing page to unregistered users, product list to registered users
  return (
    <>
      {!isAuthenticated && <LandingPage />}
      {isAuthenticated && <ProductList />}
    </>
  );
}
