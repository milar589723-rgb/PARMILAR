"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Product = {
  id: number; name: string; category: string; price: number;
  color: string; colorName: string; description: string;
};

const products: Product[] = [
  { id: 1, name: "Essential Oversized Tee", category: "T-SHIRTS", price: 32, color: "#e8e5df", colorName: "Bone", description: "A relaxed everyday silhouette in heavyweight cotton." },
  { id: 2, name: "Studio Hoodie", category: "HOODIES", price: 68, color: "#687c67", colorName: "Forest", description: "A soft, structured hoodie made for everyday rotation." },
  { id: 3, name: "Core Tee", category: "T-SHIRTS", price: 29, color: "#222326", colorName: "Washed Black", description: "A clean essential with a comfortable oversized fit." },
  { id: 4, name: "Relaxed Crewneck", category: "SWEATSHIRTS", price: 58, color: "#b98e83", colorName: "Dusty Rose", description: "A premium layer with a calm, understated finish." },
  { id: 5, name: "Everyday Hoodie", category: "HOODIES", price: 64, color: "#d2c7b3", colorName: "Oat", description: "An easy layer with a generous, relaxed fit." }
];

function Garment({ color, selected, onClick, index }: { color: string; selected: boolean; onClick: () => void; index: number }) {
  const group = useRef<THREE.Group>(null);
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.42, 0.48); s.lineTo(-0.76, 0.32); s.lineTo(-0.94, -0.05);
    s.lineTo(-0.72, -0.2); s.lineTo(-0.58, 0.02); s.lineTo(-0.56, -0.72);
    s.lineTo(0.56, -0.72); s.lineTo(0.58, 0.02); s.lineTo(0.72, -0.2);
    s.lineTo(0.94, -0.05); s.lineTo(0.76, 0.32); s.lineTo(0.42, 0.48);
    s.quadraticCurveTo(0, 0.18, -0.42, 0.48);
    return s;
  }, []);
  useFrame((state) => {
    if (group.current && selected) {
      // Continuous turntable spin: one full revolution every ~12.6 seconds.
      group.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });
  return (
    <group ref={group} position={[index * 1.55, 0, 0]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <mesh position={[0, 0, 0]} castShadow>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <torusGeometry args={[0.16, 0.025, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#aaa9a5" metalness={0.75} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[0.035, 0.18, 0.035]} />
        <meshStandardMaterial color="#aaa9a5" metalness={0.7} />
      </mesh>
      {selected && <mesh position={[0, 0, -0.035]}>
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.12} />
      </mesh>}
    </group>
  );
}

function RackScene({ selected, onSelect }: { selected: number; onSelect: (id: number) => void }) {
  return (
    <>
      <ambientLight intensity={1.1} />
      <spotLight position={[2, 6, 5]} intensity={2.2} angle={0.45} penumbra={0.7} castShadow />
      <pointLight position={[-5, 1, -3]} intensity={0.7} color="#8d8d9c" />
      <group position={[-3.1, 0, 0]}>
        <mesh position={[3.1, 1.45, -0.12]} castShadow>
          <boxGeometry args={[8.4, 0.055, 0.08]} />
          <meshStandardMaterial color="#aaa9a5" metalness={0.85} roughness={0.24} />
        </mesh>
        {[-0.95, 7.15].map((x) => <mesh key={x} position={[x, 0.72, -0.12]}>
          <cylinderGeometry args={[0.025, 0.025, 1.45, 12]} />
          <meshStandardMaterial color="#aaa9a5" metalness={0.8} roughness={0.25} />
        </mesh>)}
        {products.map((p, i) => (
          <group key={p.id} position={[i * 1.55, 0, 0]}>
            <Garment color={p.color} selected={selected === p.id} onClick={() => onSelect(p.id)} index={0} />
          </group>
        ))}
      </group>
      <ContactShadows position={[0, -1.1, 0]} opacity={0.35} scale={13} blur={2.4} />
      <Environment preset="city" />
      <OrbitControls enablePan={false} minDistance={5} maxDistance={12} minPolarAngle={Math.PI / 3.2} maxPolarAngle={Math.PI / 1.9} />
    </>
  );
}

export default function Storefront() {
  const [selectedId, setSelectedId] = useState(2);
  const [cart, setCart] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const selected = products.find(p => p.id === selectedId) ?? products[0];

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#">PARMILAR<span>®</span></a>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#collection" onClick={() => setMenuOpen(false)}>COLLECTION</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>OUR STORY</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>CONTACT</a>
        </nav>
        <button className="cart-button" onClick={() => alert(`Your bag has ${cart} item(s). Checkout can be connected in the next phase.`)}>
          BAG ({cart})
        </button>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">☰</button>
      </header>


      <section className="hero" id="collection">
        <div className="campaign">
          <div className="campaign-image" role="img" aria-label="PARMILAR streetwear campaign model">
            <div className="campaign-shade" />
            <div className="campaign-copy">
              <p className="eyebrow">PARMILAR / LIMITED COLLECTION 001</p>
              <h1>LIMITED DROPS,<br /><em>MAXIMUM IMPACT.</em></h1>
              <p className="campaign-description">We release exclusive, small-batch collections to keep your style fresh and unique — once it’s gone, it’s gone.</p>
              <a className="shop-now" href="#3d-rack"><span>↗</span> SHOP NOW</a>
            </div>
            <div className="campaign-bottom">
              {["Community-Driven Culture", "Future-Ready Fashion", "Art Meets Attitude", "Built for the Streets"].map((item, i) => (
                <div className="campaign-point" key={item}><b>0{i + 1}</b><span>{item}</span></div>
              ))}
            </div>
          </div>
        </div>

        <div className="rack-intro" id="3d-rack">
          <div><p className="eyebrow">THE PARMILAR EXPERIENCE / 001</p><h2>Find your <em>uniform.</em></h2></div>
          <p>Explore the collection. Choose your piece.<br />Make it yours.</p>
        </div>
        <div className="stage-wrap">
          <div className="stage-topline"><span>INTERACTIVE 3D RACK</span><span>DRAG TO EXPLORE ↗</span></div>
          <div className="stage">
            <Suspense fallback={<div className="loading">LOADING 3D COLLECTION…</div>}>
              <Canvas camera={{ position: [0, 1.1, 8.4], fov: 38 }} shadows dpr={[1, 1.7]}>
                <RackScene selected={selectedId} onSelect={setSelectedId} />
              </Canvas>
            </Suspense>
            <div className="stage-hint">SELECT A PIECE · DRAG TO ROTATE VIEW</div>
          </div>
        </div>

        <div className="product-panel">
          <div className="product-index"><span>0{selected.id}</span><span> / 05</span></div>
          <div className="product-copy">
            <p className="eyebrow">{selected.category} · PARMILAR ESSENTIALS</p>
            <h2>{selected.name}</h2>
            <p>{selected.description}</p>
          </div>
          <div className="product-actions">
            <div className="price">${selected.price.toFixed(2)}</div>
            <div className="swatches" aria-label="Product color">
              {products.map(p => <button key={p.id} className={p.id === selectedId ? "swatch active" : "swatch"} style={{ background: p.color }} onClick={() => setSelectedId(p.id)} aria-label={`Select ${p.colorName}`} />)}
            </div>
            <button className="add-button" onClick={() => setCart(cart + 1)}>ADD TO BAG <span>＋</span></button>
          </div>
        </div>
      </section>
      <section className="below" id="story">
        <div><p className="eyebrow">LESS, BUT BETTER</p><h2>Everyday pieces.<br /><em>Different perspective.</em></h2></div>
        <p>PARMILAR is a modern wardrobe built around thoughtful essentials, relaxed silhouettes and pieces you reach for again and again.</p>
      </section>
      <footer id="contact"><span>PARMILAR®</span><span>BUILT FOR YOUR EVERYDAY.</span><span>© 2026 PARMILAR</span></footer>
    </main>
  );
}
