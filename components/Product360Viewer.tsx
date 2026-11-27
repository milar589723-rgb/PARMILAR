"use client";

import { useRef, useState } from "react";
import "./Product360Viewer.css";

type Props = { images?: string[] | null; name: string };

export default function Product360Viewer({ images = [], name }: Props) {
  
const frames = (images ?? []).filter(Boolean);
  const [current, setCurrent] = useState(0);
  const lastX = useRef<number | null>(null);
  const movement = useRef(0);

  const changeFrame = (direction: number) => {
    if (frames.length < 2) return;
    setCurrent((index) => (index + direction + frames.length) % frames.length);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    lastX.current = event.clientX;
    movement.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (lastX.current === null || frames.length < 2) return;
    const delta = event.clientX - lastX.current;
    lastX.current = event.clientX;
    movement.current += delta;
    while (movement.current >= 30) {
      changeFrame(-1);
      movement.current -= 30;
    }
    while (movement.current <= -30) {
      changeFrame(1);
      movement.current += 30;
    }
  };

  const stop = () => {
    lastX.current = null;
    movement.current = 0;
  };

  if (!frames.length) {
    return <div className="viewer-empty"><b>PARMILAR</b><span>No product images yet</span></div>;
  }

  return (
    <div className="product-viewer">
      <div
        className="viewer-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={stop}
      >
        <img src={frames[current]} alt={`${name}, view ${current + 1}`} draggable={false} />
        {frames.length > 1 && <>
          <button type="button" className="viewer-arrow prev" onClick={() => changeFrame(-1)} aria-label="Previous image">‹</button>
          <button type="button" className="viewer-arrow next" onClick={() => changeFrame(1)} aria-label="Next image">›</button>
        </>}
        <span className="viewer-counter">{current + 1} / {frames.length}</span>
        {frames.length > 1 && <span className="viewer-hint">DRAG TO EXPLORE</span>}
      </div>
      {frames.length > 1 && <div className="viewer-thumbnails">
        {frames.map((src, index) => <button
          type="button"
          key={`${src}-${index}`}
          className={current === index ? "active" : ""}
          onClick={() => setCurrent(index)}
          aria-label={`Show view ${index + 1}`}
        ><img src={src} alt="" /></button>)}
      </div>}
    </div>
  );
}
