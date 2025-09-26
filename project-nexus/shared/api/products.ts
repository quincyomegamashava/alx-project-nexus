import axios from "axios";
import type { Product } from "../types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function fetchProducts(page = 1, limit = 20): Promise<Product[]> {
  const res = await axios.get<Product[]>(`${API_URL}/products`, {
    params: { _page: page, _limit: limit },
  });
  return res.data;
}