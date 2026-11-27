"use client";

import { useEffect, useState } from "react";
import {
  getAdminVariants, saveVariant, deleteVariant,
  type ProductVariant
} from "../src/services/variants";
import "./VariantManager.css";

export default function VariantManager({ productId }: { productId: string }) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [size, setSize] = useState("M");
  const [color, setColor] = useState("Black");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try { setVariants(await getAdminVariants(productId)); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to load variants."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, [productId]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await saveVariant({
        product_id: productId, size, color, sku: sku || null, stock,
        price_lak: price === "" ? null : Number(price)
      });
      setSku(""); setStock(0); setPrice("");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to save variant."); }
    finally { setSaving(false); }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this variant?")) return;
    try { await deleteVariant(id); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to delete variant."); }
  }

  return <section className="variant-manager">
    <div className="variant-heading"><span>PARMILAR INVENTORY</span><h2>Size & Color Stock</h2></div>
    <form className="variant-form" onSubmit={submit}>
      <label>Size<input value={size} onChange={e => setSize(e.target.value)} required /></label>
      <label>Color<input value={color} onChange={e => setColor(e.target.value)} required /></label>
      <label>SKU<input value={sku} onChange={e => setSku(e.target.value)} placeholder="Optional" /></label>
      <label>Stock<input type="number" min="0" step="1" value={stock} onChange={e => setStock(Number(e.target.value))} required /></label>
      <label>Price override (LAK)<input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="Use product price" /></label>
      <button disabled={saving} type="submit">{saving ? "Saving..." : "SAVE VARIANT"}</button>
    </form>
    {error && <p className="variant-error">{error}</p>}
    {loading ? <p>Loading inventory...</p> : <div className="variant-table-wrap">
      <table className="variant-table"><thead><tr><th>SKU</th><th>Color</th><th>Size</th><th>Stock</th><th>Price</th><th /></tr></thead>
        <tbody>{variants.map(v => <tr key={v.id}><td>{v.sku || "—"}</td><td>{v.color}</td><td>{v.size}</td><td>{v.stock}</td><td>{v.price_lak == null ? "Product price" : `${v.price_lak.toLocaleString()} LAK`}</td><td><button type="button" onClick={() => remove(v.id)}>Delete</button></td></tr>)}
          {!variants.length && <tr><td colSpan={6}>No variants added yet.</td></tr>}
        </tbody>
      </table>
    </div>}
  </section>;
}
