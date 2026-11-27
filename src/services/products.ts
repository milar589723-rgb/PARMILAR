import { requireSupabase } from "./supabase";

export type ProductTranslations = Record<string, string> | string;

export type StoreProduct = {
  id: string;
  name: ProductTranslations;
  description?: ProductTranslations;
  category?: string;
  price_lak: number;
  images: string[] | null;
  sizes: string[] | null;
  colors: string[] | null;
  stock: number;
  active: boolean;
  featured?: boolean;
};

export async function getProducts(): Promise<StoreProduct[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("products")
    .select("id,name,description,category,price_lak,images,sizes,colors,stock,active,featured")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as StoreProduct[];
}
