"use client";

import { useEffect, useRef, useState } from "react";
import { getProducts, type StoreProduct } from "../src/services/products";
import Product360Viewer from "./Product360Viewer";
import "./VirtualWardrobe.css";

type Props = {
  language?: "th" | "en" | "lo" | "zh" | "vi";
  onAddToCart?: (product: StoreProduct, size?: string, color?: string) => void;
};

function translated(value: StoreProduct["name"] | StoreProduct["description"], language: string) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[language] || value.en || value.th || "";
}

export default function VirtualWardrobe({ language = "en", onAddToCart }: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [selected, setSelected] = useState<StoreProduct | null>(null);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    getProducts()
      .then((data) => { if (mounted) setProducts(data); })
      .catch((err) => { if (mounted) setError(err instanceof Error ? err.message : "Could not load products."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const scroll = (direction: number) => railRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });

  const choose = (product: StoreProduct) => {
    setSelected(product);
    setSize(product.sizes?.[0] || "");
    setColor(product.colors?.[0] || "");
  };

  const add = () => {
    if (!selected || !onAddToCart || selected.stock <= 0) return;
    if (selected.sizes?.length && !size) return;
    if (selected.colors?.length && !color) return;
    onAddToCart(selected, size, color);
    setSelected(null);
  };

  return <main className="wardrobe-page">
    <header className="wardrobe-header">
      <span>PARMILAR COLLECTION</span>
      <h1>THE VIRTUAL WARDROBE</h1>
      <p>Explore your style. Discover your next favorite.</p>
    </header>
    <section className="wardrobe-room">
      <div className="wardrobe-top"><span>YOUR COLLECTION</span><div>
        <button type="button" onClick={() => scroll(-1)} aria-label="Scroll left">←</button>
        <button type="button" onClick={() => scroll(1)} aria-label="Scroll right">→</button>
      </div></div>
      <div className="wardrobe-rail">
        <div className="rail-bar" />
        {loading ? <p className="wardrobe-message">Loading collection...</p>
          : error ? <p className="wardrobe-message">{error}</p>
          : products.length === 0 ? <p className="wardrobe-message">No products available yet.</p>
          : <div className="clothes-track" ref={railRef}>
            {products.map((product) => <button className="clothing-item" key={product.id} type="button" onClick={() => choose(product)}>
              <div className="hanger"><span /></div>
              <div className="clothing-image">{product.images?.[0] ? <img src={product.images[0]} alt={translated(product.name, language)} /> : <div className="no-image">PARMILAR</div>}</div>
              <div className="clothing-info"><span>{translated(product.name, language)}</span><small>{product.price_lak.toLocaleString()} LAK</small></div>
            </button>)}
          </div>}
      </div>
      <div className="wardrobe-floor">PARMILAR / YOUR PERSONAL STYLE SPACE</div>
    </section>

    {selected && <div className="wardrobe-backdrop" onClick={() => setSelected(null)}>
      <section className="wardrobe-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="wardrobe-close" onClick={() => setSelected(null)} aria-label="Close">×</button>
        <Product360Viewer images={selected.images} name={translated(selected.name, language)} />
        <div className="wardrobe-details">
          <small>PARMILAR / SELECTED ITEM</small>
          <h2>{translated(selected.name, language)}</h2>
          <p>{selected.price_lak.toLocaleString()} LAK</p>
          <p>{translated(selected.description, language)}</p>
          {!!selected.sizes?.length && <div className="wardrobe-options"><label>SIZE</label>{selected.sizes.map((v) => <button type="button" className={size === v ? "active" : ""} key={v} onClick={() => setSize(v)}>{v}</button>)}</div>}
          {!!selected.colors?.length && <div className="wardrobe-options"><label>COLOR</label>{selected.colors.map((v) => <button type="button" className={color === v ? "active" : ""} key={v} onClick={() => setColor(v)}>{v}</button>)}</div>}
          <small>{selected.stock > 0 ? `Available: ${selected.stock}` : "Out of stock"}</small>
          <button className="wardrobe-add" type="button" disabled={!onAddToCart || selected.stock <= 0} onClick={add}>ADD TO BAG</button>
          {!onAddToCart && <small>Cart connection is not configured in this starter.</small>}
        </div>
      </section>
    </div>}
  </main>;
}
