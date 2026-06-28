"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL = "/3d/uploads_files_4881088_gltf.glb";
useGLTF.preload(MODEL);

function Glasses() {
  const { scene } = useGLTF(MODEL);
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  // Clone + normalize so any export scale/offset works: centre at the origin
  // and fit the largest dimension to ~2.6 world units.
  const model = useMemo(() => {
    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    cloned.scale.setScalar(2.6 / maxDim);
    const centered = new THREE.Box3().setFromObject(cloned);
    cloned.position.sub(centered.getCenter(new THREE.Vector3()));
    return cloned;
  }, [scene]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const targetY = pointer.current.x * 0.7; // look left/right
    const targetX = pointer.current.y * 0.45; // look up/down
    const k = 1 - Math.pow(0.0015, delta); // framerate-independent easing
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;
    g.position.y = Math.sin(state.clock.elapsedTime * 1.1) * 0.06; // idle float
  });

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  );
}

export default function FloatingGlassesScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <directionalLight position={[-5, 2, -4]} intensity={0.5} />
      <Glasses />
      <ContactShadows position={[0, -1.6, 0]} opacity={0.32} scale={9} blur={2.6} far={3.2} />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.4} position={[0, 3, 4]} scale={[9, 6, 1]} />
        <Lightformer intensity={1.2} position={[-5, 1, 1]} scale={[4, 7, 1]} />
        <Lightformer intensity={1.4} position={[5, 1, 1]} scale={[4, 7, 1]} />
        <Lightformer intensity={1} position={[0, -3, 2]} scale={[8, 3, 1]} />
      </Environment>
    </Canvas>
  );
}
