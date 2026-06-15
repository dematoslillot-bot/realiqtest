"use client";

import { useEffect, useRef, useState } from "react";

/* ════════════════════════════════════════════════════════════════════════
   NEURAL SCENE — full-viewport 3D neural network (Three.js)

   The user is traveling through their own brain. Hundreds of nodes connected
   by thin axon lines, slow ambient float, mouse parallax, color theming per
   cognitive dimension, and a camera "fly" pulse for question transitions.

   Mobile / prefers-reduced-motion → lightweight CSS gradient fallback.
   Three.js is lazy-imported so it never blocks LCP.
═══════════════════════════════════════════════════════════════════════════ */

type Props = {
  /** Hex accent for nodes/lines — shifts with cognitive dimension */
  accent?: string;
  /** Secondary hex accent (a portion of nodes use this) */
  accent2?: string;
  /** Increment to trigger a camera fly-forward pulse (question transitions) */
  flyKey?: number;
  /** Overall opacity of the canvas */
  opacity?: number;
  /** Node count scale 0..1 (default 1) */
  density?: number;
  /** Fixed full-viewport (test) vs absolute-in-parent (hero) */
  fixed?: boolean;
};

/* True when WebGL is missing or software-emulated (SwiftShader etc.) —
   those machines can't sustain a 60fps particle scene. */
function isSoftwareGL(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return true;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
    return /swiftshader|software|llvmpipe|basic render/i.test(renderer);
  } catch {
    return true;
  }
}

function useIsLite() {
  const [lite, setLite] = useState<boolean | null>(null);
  useEffect(() => {
    // ?force3d query param bypasses the lite fallback (debugging aid)
    if (window.location.search.includes("force3d")) { setLite(false); return; }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile  = window.innerWidth < 768;
    setLite(reduced || mobile || isSoftwareGL());
  }, []);
  return lite;
}

/* ── CSS fallback: animated gradient + drifting dot field ── */
function LiteScene({ accent = "#5B4FFF", accent2 = "#00F5D4", opacity = 1, fixed }: Props) {
  const dots = useRef(
    Array.from({ length: 26 }, (_, i) => ({
      left: (i * 37.7) % 100,
      top: (i * 53.3) % 100,
      size: 1.5 + (i % 3),
      dur: 5 + (i % 7),
      delay: (i % 10) * 0.7,
      col: i % 3 === 0 ? accent2 : accent,
    }))
  ).current;

  return (
    <div aria-hidden="true" style={{
      position: fixed ? "fixed" : "absolute", inset: 0, overflow: "hidden",
      pointerEvents: "none", opacity, zIndex: 0,
    }}>
      <div style={{
        position: "absolute", inset: "-20%",
        background: `radial-gradient(ellipse 60% 50% at 28% 30%, ${accent}26, transparent 65%),
                     radial-gradient(ellipse 55% 45% at 75% 68%, ${accent2}1c, transparent 65%)`,
        animation: "bgPulse1 8s ease-in-out infinite",
      }} />
      {dots.map((d, i) => (
        <span key={i} style={{
          position: "absolute", left: `${d.left}%`, top: `${d.top}%`,
          width: d.size, height: d.size, borderRadius: "50%",
          background: d.col, boxShadow: `0 0 ${d.size * 3}px ${d.col}`,
          animation: `node-breathe ${d.dur}s ease-in-out infinite`,
          animationDelay: `${d.delay}s`,
        }} />
      ))}
      <style>{`@keyframes bgPulse1 { 0%,100%{opacity:0.75} 50%{opacity:0.45} }
        @keyframes node-breathe { 0%,100%{opacity:0.45} 50%{opacity:0.95} }`}</style>
    </div>
  );
}

/* ── Full Three.js scene ── */
function ThreeScene({ accent = "#5B4FFF", accent2 = "#00F5D4", flyKey = 0, opacity = 1, density = 1, fixed }: Props) {
  const mountRef  = useRef<HTMLDivElement>(null);
  const accentRef = useRef({ a: accent, b: accent2 });
  const flyRef    = useRef(0);

  accentRef.current = { a: accent, b: accent2 };

  // Register fly pulses
  const lastFly = useRef(flyKey);
  if (flyKey !== lastFly.current) { lastFly.current = flyKey; flyRef.current = 1; }

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      if (disposed || !mountRef.current) return;

      const mount = mountRef.current;
      const W = () => mount.clientWidth  || window.innerWidth;
      const H = () => mount.clientHeight || window.innerHeight;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(W(), H());
      renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
      mount.appendChild(renderer.domElement);

      const scene  = new THREE.Scene();
      scene.fog    = new THREE.FogExp2(0x03050f, 0.016);
      const camera = new THREE.PerspectiveCamera(62, W() / H(), 0.1, 220);
      camera.position.set(0, 0, 46);

      /* ── Build network: nodes in a flattened ellipsoid cloud ── */
      const COUNT = Math.round(320 * density);
      const positions = new Float32Array(COUNT * 3);
      const phases    = new Float32Array(COUNT);
      const pts: { x: number; y: number; z: number }[] = [];
      let seed = 1337;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

      for (let i = 0; i < COUNT; i++) {
        const r1 = rnd(), r2 = rnd(), r3 = rnd();
        const x = (r1 - 0.5) * 150;
        const y = (r2 - 0.5) * 82;
        const z = (r3 - 0.5) * 120;
        positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
        phases[i] = rnd() * Math.PI * 2;
        pts.push({ x, y, z });
      }

      /* Connect near neighbours with axon lines */
      const linePairs: number[] = [];
      const MAXD2 = 17 * 17;
      for (let i = 0; i < COUNT; i++) {
        let links = 0;
        for (let j = i + 1; j < COUNT && links < 3; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, dz = pts[i].z - pts[j].z;
          if (dx * dx + dy * dy + dz * dz < MAXD2) { linePairs.push(i, j); links++; }
        }
      }

      const colA = new THREE.Color(accentRef.current.a);
      const colB = new THREE.Color(accentRef.current.b);
      const curA = colA.clone(), curB = colB.clone();

      /* Points */
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const colors = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        const c = i % 4 === 0 ? curB : curA;
        colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
      }
      pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const pMat = new THREE.PointsMaterial({
        size: 1.5, vertexColors: true, transparent: true, opacity: 0.95,
        sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(pGeo, pMat);
      scene.add(points);

      /* Lines */
      const lPos = new Float32Array(linePairs.length * 3);
      const lGeo = new THREE.BufferGeometry();
      const fillLines = () => {
        const p = pGeo.getAttribute("position") as { array: ArrayLike<number> };
        for (let k = 0; k < linePairs.length; k++) {
          const idx = linePairs[k];
          lPos[k * 3] = p.array[idx * 3]; lPos[k * 3 + 1] = p.array[idx * 3 + 1]; lPos[k * 3 + 2] = p.array[idx * 3 + 2];
        }
        lGeo.setAttribute("position", new THREE.BufferAttribute(lPos, 3));
        lGeo.attributes.position.needsUpdate = true;
      };
      fillLines();
      const lMat = new THREE.LineBasicMaterial({
        color: curA, transparent: true, opacity: 0.14,
        depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const lines = new THREE.LineSegments(lGeo, lMat);
      scene.add(lines);

      /* Electric pulses traveling along axons */
      const PULSES = 14;
      const pulseGeo = new THREE.BufferGeometry();
      const pulsePos = new Float32Array(PULSES * 3);
      pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePos, 3));
      const pulseMat = new THREE.PointsMaterial({
        size: 2.6, color: curB, transparent: true, opacity: 0.9,
        sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const pulsePts = new THREE.Points(pulseGeo, pulseMat);
      scene.add(pulsePts);
      const pulseState = Array.from({ length: PULSES }, (_, i) => ({
        seg: Math.floor(rnd() * (linePairs.length / 2)) * 2,
        t: rnd(), speed: 0.004 + rnd() * 0.011,
      }));

      /* ── Interaction state ── */
      const mouse = { x: 0, y: 0 };
      const onMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMove, { passive: true });

      const onResize = () => {
        camera.aspect = W() / H();
        camera.updateProjectionMatrix();
        renderer.setSize(W(), H());
      };
      window.addEventListener("resize", onResize);

      let tabVisible = true;
      const onVis = () => { tabVisible = document.visibilityState === "visible"; };
      document.addEventListener("visibilitychange", onVis);

      /* Pause rendering entirely when the canvas is off-screen */
      let inView = true;
      const io = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; }, { threshold: 0.01 });
      io.observe(mount);

      /* ── Animation loop ── */
      let raf = 0;
      let t = 0;
      let frame = 0;
      const basePos = positions.slice();
      const tmpA = new THREE.Color(), tmpB = new THREE.Color();

      const animate = () => {
        raf = requestAnimationFrame(animate);
        if (!tabVisible || !inView) return;
        t += 0.0042;
        frame++;

        /* Ambient float — each node breathes around base position */
        const posAttr = pGeo.getAttribute("position") as { array: Float32Array; needsUpdate: boolean };
        const arr = posAttr.array;
        for (let i = 0; i < COUNT; i++) {
          const ph = phases[i];
          arr[i * 3]     = basePos[i * 3]     + Math.sin(t * 2.1 + ph) * 0.9;
          arr[i * 3 + 1] = basePos[i * 3 + 1] + Math.cos(t * 1.7 + ph * 1.3) * 0.9;
          arr[i * 3 + 2] = basePos[i * 3 + 2] + Math.sin(t * 1.4 + ph * 0.7) * 0.9;
        }
        posAttr.needsUpdate = true;
        /* Axon endpoints follow nodes — every other frame is imperceptible */
        if (frame % 2 === 0) fillLines();

        /* Color lerp toward current accents — skip work once settled */
        tmpA.set(accentRef.current.a); tmpB.set(accentRef.current.b);
        const settled =
          Math.abs(curA.r - tmpA.r) + Math.abs(curA.g - tmpA.g) + Math.abs(curA.b - tmpA.b) +
          Math.abs(curB.r - tmpB.r) + Math.abs(curB.g - tmpB.g) + Math.abs(curB.b - tmpB.b) < 0.004;
        if (!settled) {
          curA.lerp(tmpA, 0.045); curB.lerp(tmpB, 0.045);
          const colAttr = pGeo.getAttribute("color") as { array: Float32Array; needsUpdate: boolean };
          for (let i = 0; i < COUNT; i++) {
            const c = i % 4 === 0 ? curB : curA;
            colAttr.array[i * 3] = c.r; colAttr.array[i * 3 + 1] = c.g; colAttr.array[i * 3 + 2] = c.b;
          }
          colAttr.needsUpdate = true;
          lMat.color.copy(curA);
          pulseMat.color.copy(curB);
        }

        /* Pulses along axons */
        for (let i = 0; i < PULSES; i++) {
          const ps = pulseState[i];
          ps.t += ps.speed;
          if (ps.t >= 1) { ps.t = 0; ps.seg = Math.floor(Math.random() * (linePairs.length / 2)) * 2; }
          const a = linePairs[ps.seg], b = linePairs[ps.seg + 1];
          pulsePos[i * 3]     = arr[a * 3]     + (arr[b * 3]     - arr[a * 3])     * ps.t;
          pulsePos[i * 3 + 1] = arr[a * 3 + 1] + (arr[b * 3 + 1] - arr[a * 3 + 1]) * ps.t;
          pulsePos[i * 3 + 2] = arr[a * 3 + 2] + (arr[b * 3 + 2] - arr[a * 3 + 2]) * ps.t;
        }
        (pulseGeo.getAttribute("position") as { needsUpdate: boolean }).needsUpdate = true;

        /* Slow scene rotation + mouse parallax */
        scene.rotation.y = t * 0.16 + mouse.x * 0.06;
        scene.rotation.x = Math.sin(t * 0.4) * 0.04 + mouse.y * 0.045;

        /* Camera fly pulse (question transition) — dash forward then ease back */
        if (flyRef.current > 0) {
          flyRef.current = Math.max(0, flyRef.current - 0.025);
          const f = flyRef.current;
          const dash = Math.sin((1 - f) * Math.PI) * 16;
          camera.position.z = 46 - dash;
          camera.fov = 62 + Math.sin((1 - f) * Math.PI) * 9;
          camera.updateProjectionMatrix();
        } else {
          camera.position.z += (46 - camera.position.z) * 0.08;
        }

        renderer.render(scene, camera);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVis);
        pGeo.dispose(); lGeo.dispose(); pulseGeo.dispose();
        pMat.dispose(); lMat.dispose(); pulseMat.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      };
    })();

    return () => { disposed = true; cleanup?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={mountRef} aria-hidden="true" style={{
      position: fixed ? "fixed" : "absolute", inset: 0,
      pointerEvents: "none", opacity, zIndex: 0,
    }} />
  );
}

export default function NeuralScene(props: Props) {
  const lite = useIsLite();
  if (lite === null) return null;
  return lite ? <LiteScene {...props} /> : <ThreeScene {...props} />;
}
