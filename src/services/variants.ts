 import { requireSupabase } from "./supabase";

export type ProductVariant = {
  id: string;
  product_id: string;
  sku: string | null;
  size: string;
  color: string;
  price_lak: number | null;
  stock: number;
  active: boolean;
};

export type VariantInput = {
  product_id: string;
  sku?: string | null;
  size: string;
  color: string;
  price_lak?: number | null;
  stock: number;
  active?: boolean;
};

export async function getProductVariants(productId: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .eq("active", true)
    .order("size");
  if (error) throw error;
  return (data ?? []) as ProductVariant[];
}

export async function getAdminVariants(productId: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .order("color")
    .order("size");
  if (error) throw error;
  return (data ?? []) as ProductVariant[];
}

export async function saveVariant(input: VariantInput) {
  const client = requireSupabase();
  if (!input.product_id) throw new Error("Product is required");
  if (!Number.isInteger(input.stock) || input.stock < 0) {
    throw new Error("Stock must be a non-negative whole number");
  }
  const payload = {
    ...input,
    sku: input.sku?.trim() || null,
    size: input.size.trim(),
    color: input.color.trim(),
    active: input.active ?? true,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await client
    .from("product_variants")
    .upsert(payload, { onConflict: "product_id,size,color" })
    .select()
    .single();
  if (error) throw error;
  return data as ProductVariant;
}

export async function deleteVariant(variantId: string) {
  const client = requireSupabase();
  const { error } = await client
    .from("product_variants")
    .delete()
    .eq("id", variantId);
  if (error) throw error;
}
