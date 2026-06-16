"use client";

import { Suspense, type MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type PointerRef = MutableRefObject<{ x: number; y: number }>;
type ProgressRef = MutableRefObject<{ value: number }>;

interface ConstructionServiceHeroSceneProps {
  pointerRef: PointerRef;
  progressRef: ProgressRef;
  reduceMotion: boolean;
}

const modelPath = "/models/construction-service-tower-optimized.glb";
const lowValueMeshPattern =
  /survey_grid|core_horizontal_pour_joint|core_embedded_service_mark|safety_(?:top|mid|rail_post)|starter_bar|formwork_timber_stack|stacked_steel_bundle|hoist_tie_beam/i;

export default function ConstructionServiceHeroScene({
  pointerRef,
  progressRef,
  reduceMotion
}: ConstructionServiceHeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { rootMargin: "160px 0px", threshold: 0.04 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        className="h-full w-full"
        dpr={[1, 1.6]}
        frameloop="demand"
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.04;
        }}
        performance={{ min: 0.5, debounce: 240 }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[5.8, 3.55, 8.25]} fov={34} near={0.1} far={80} />
          <DemandFrameInvalidator isActive={isActive} reduceMotion={reduceMotion} />
          <ConstructionCameraRig
            pointerRef={pointerRef}
            progressRef={progressRef}
            reduceMotion={reduceMotion}
            isActive={isActive}
          />
          <color attach="background" args={["#fffaf0"]} />
          <fog attach="fog" args={["#fffaf0", 12, 23]} />

          <ambientLight intensity={0.94} />
          <hemisphereLight color="#fff8ec" groundColor="#d8c7a8" intensity={1.88} />
          <directionalLight color="#fff1d2" intensity={2.45} position={[6.5, 8.8, 5.6]} />
          <directionalLight color="#fff8ee" intensity={0.42} position={[-3.6, 4.2, 5.4]} />

          <group position={[0.38, -1.34, 0]} rotation={[0, -0.2, 0]}>
            <PremiumSiteGround />
            <LoadedConstructionAsset
              pointerRef={pointerRef}
              progressRef={progressRef}
              reduceMotion={reduceMotion}
              isActive={isActive}
            />
            <ConstructionProgressAxis progressRef={progressRef} reduceMotion={reduceMotion} isActive={isActive} />
            <SubtleSiteParticles reduceMotion={reduceMotion} isActive={isActive} />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}

function DemandFrameInvalidator({ isActive, reduceMotion }: { isActive: boolean; reduceMotion: boolean }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    let rafId: number | undefined;
    let warmFrame = 0;
    const warmFrameLimit = reduceMotion ? 1 : 150;

    const requestFrame = () => {
      if (rafId !== undefined) return;

      rafId = requestAnimationFrame(() => {
        rafId = undefined;
        invalidate();
      });
    };

    const runWarmLoop = () => {
      if (!isActive && !reduceMotion) return;

      invalidate();
      warmFrame += 1;
      if (warmFrame < warmFrameLimit) {
        rafId = requestAnimationFrame(runWarmLoop);
      } else {
        rafId = undefined;
      }
    };

    runWarmLoop();

    if (isActive && !reduceMotion) {
      window.addEventListener("scroll", requestFrame, { passive: true });
      window.addEventListener("pointermove", requestFrame, { passive: true });
    }

    return () => {
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", requestFrame);
      window.removeEventListener("pointermove", requestFrame);
    };
  }, [invalidate, isActive, reduceMotion]);

  return null;
}

function ConstructionCameraRig({
  pointerRef,
  progressRef,
  reduceMotion,
  isActive
}: {
  pointerRef: PointerRef;
  progressRef: ProgressRef;
  reduceMotion: boolean;
  isActive: boolean;
}) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    if (!isActive && !reduceMotion) return;

    const elapsed = clock.getElapsedTime();
    const progress = reduceMotion ? 1 : progressRef.current.value;
    const pointerX = reduceMotion ? 0 : pointerRef.current.x;
    const pointerY = reduceMotion ? 0 : pointerRef.current.y;

    target.set(
      5.8 - progress * 0.46 + pointerX * 0.22,
      3.55 + progress * 0.22 - pointerY * 0.12 + Math.sin(elapsed * 0.12) * 0.025,
      8.25 - progress * 0.48
    );
    camera.position.lerp(target, 0.035);
    lookAt.set(0.18 + pointerX * 0.06, 2.4 + progress * 0.18 - pointerY * 0.04, -0.1);
    camera.lookAt(lookAt);
  });

  return null;
}

function LoadedConstructionAsset({
  pointerRef,
  progressRef,
  reduceMotion,
  isActive
}: {
  pointerRef: PointerRef;
  progressRef: ProgressRef;
  reduceMotion: boolean;
  isActive: boolean;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath, false, true) as { scene: THREE.Group };

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const materialCache = new Map<string, THREE.Material | THREE.Material[]>();

    clone.traverse((object) => {
      if (!(object as THREE.Mesh).isMesh) return;

      const mesh = object as THREE.Mesh;
      if (lowValueMeshPattern.test(mesh.name)) {
        mesh.visible = false;
        return;
      }

      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.frustumCulled = true;

      if (Array.isArray(mesh.material)) {
        const cacheKey = mesh.material.map((material) => material.uuid).join("|");
        const cachedMaterial = materialCache.get(cacheKey);
        if (cachedMaterial) {
          mesh.material = cachedMaterial as THREE.Material[];
        } else {
          const clonedMaterials = mesh.material.map((material) => material.clone());
          materialCache.set(cacheKey, clonedMaterials);
          mesh.material = clonedMaterials;
        }
      } else {
        const cachedMaterial = materialCache.get(mesh.material.uuid);
        if (cachedMaterial) {
          mesh.material = cachedMaterial as THREE.Material;
        } else {
          const clonedMaterial = mesh.material.clone();
          materialCache.set(mesh.material.uuid, clonedMaterial);
          mesh.material = clonedMaterial;
        }
      }

      const meshMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      meshMaterials.forEach((material) => {
        const standardMaterial = material as THREE.MeshStandardMaterial;
        const materialName = material.name.toLowerCase();
        standardMaterial.envMapIntensity = materialName.includes("glass") ? 0.68 : 0.42;
        standardMaterial.roughness = Math.min(standardMaterial.roughness ?? 0.72, 0.76);
        if (materialName.includes("glass")) {
          standardMaterial.transparent = true;
          standardMaterial.opacity = Math.min(standardMaterial.opacity, 0.58);
        }
        if (materialName.includes("concrete") || materialName.includes("slab")) {
          standardMaterial.color.lerp(new THREE.Color("#f2eadc"), 0.18);
        }
        if (materialName.includes("crane") || materialName.includes("gold")) {
          standardMaterial.color.lerp(new THREE.Color("#c9a45c"), 0.16);
          standardMaterial.metalness = Math.max(standardMaterial.metalness ?? 0.18, 0.24);
        }
      });
    });

    const hoistCage = clone.getObjectByName("executive construction hoist cage");
    const hoistFloor = clone.getObjectByName("hoist cage floor plate");
    const hook = clone.getObjectByName("CraneHook");
    [hoistCage, hoistFloor, hook].forEach((object) => {
      if (object) object.userData.baseY = object.position.y;
    });

    return clone;
  }, [scene]);

  const craneSwing = useMemo(() => model.getObjectByName("TowerCraneSwing"), [model]);
  const craneHook = useMemo(() => model.getObjectByName("CraneHook"), [model]);
  const hoistCage = useMemo(() => model.getObjectByName("executive construction hoist cage"), [model]);
  const hoistFloor = useMemo(() => model.getObjectByName("hoist cage floor plate"), [model]);

  useFrame(({ clock }) => {
    if (!isActive && !reduceMotion) return;

    const elapsed = clock.getElapsedTime();
    const progress = reduceMotion ? 1 : progressRef.current.value;
    const pointerX = reduceMotion ? 0 : pointerRef.current.x;
    const pointerY = reduceMotion ? 0 : pointerRef.current.y;

    if (rootRef.current) {
      rootRef.current.rotation.y = THREE.MathUtils.lerp(
        rootRef.current.rotation.y,
        -0.24 + progress * 0.035 + pointerX * 0.028 + Math.sin(elapsed * 0.08) * 0.05,
        0.035
      );
      rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, pointerY * 0.018, 0.035);
      rootRef.current.position.y = reduceMotion ? 0 : Math.sin(elapsed * 0.14) * 0.018;
    }

    if (craneSwing) {
      craneSwing.rotation.y = -0.4 + progress * 0.035 + (reduceMotion ? 0 : Math.sin(elapsed * 0.1) * 0.055);
    }

    if (craneHook) {
      const baseY = craneHook.userData.baseY ?? craneHook.position.y;
      craneHook.position.y = baseY + (reduceMotion ? 0 : Math.sin(elapsed * 0.13) * 0.06);
    }

    [hoistCage, hoistFloor].forEach((object) => {
      if (!object) return;
      const baseY = object.userData.baseY ?? object.position.y;
      object.position.y = baseY + progress * 0.14 + (reduceMotion ? 0 : Math.sin(elapsed * 0.1) * 0.035);
    });
  });

  return (
    <group ref={rootRef} scale={0.72} position={[0, -0.02, 0]}>
      <primitive object={model} />
    </group>
  );
}

function PremiumSiteGround() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.32, -0.095, 0.08]}>
        <planeGeometry args={[8.6, 6.8, 1, 1]} />
        <meshStandardMaterial color="#f6ecd9" roughness={0.86} metalness={0.02} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.32, -0.086, 0.08]}>
        <planeGeometry args={[6.6, 4.8, 1, 1]} />
        <meshStandardMaterial color="#e7dbc4" roughness={0.82} metalness={0.03} transparent opacity={0.7} />
      </mesh>
      <gridHelper args={[8.2, 18, "#c9a86a", "#d8cdb8"]} position={[0.28, -0.07, 0.06]} />
    </group>
  );
}

function ConstructionProgressAxis({
  progressRef,
  reduceMotion,
  isActive
}: {
  progressRef: ProgressRef;
  reduceMotion: boolean;
  isActive: boolean;
}) {
  const fillRef = useRef<THREE.Mesh>(null);
  const markers = useMemo(() => [-1.65, -0.68, 0.28, 1.22, 2.08], []);

  useFrame(() => {
    if (!isActive && !reduceMotion) return;

    if (!fillRef.current) return;
    const progress = reduceMotion ? 1 : progressRef.current.value;
    fillRef.current.scale.x = 0.22 + progress * 1.88;
    fillRef.current.position.x = -1.82 + progress * 0.9;
  });

  return (
    <group position={[0.22, -0.035, 2.46]}>
      <mesh scale={[4.18, 0.01, 0.018]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d5c8b1" roughness={0.7} transparent opacity={0.76} />
      </mesh>
      <mesh ref={fillRef} position={[-1.82, 0.018, 0]} scale={[0.22, 0.016, 0.026]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#b88a44" roughness={0.38} metalness={0.44} />
      </mesh>
      {markers.map((x, index) => (
        <mesh key={x} position={[x, 0.052, 0]}>
          <boxGeometry args={[0.086, 0.086, 0.086]} />
          <meshStandardMaterial color={index < 3 ? "#7b1016" : "#d6b45f"} roughness={0.4} metalness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function SubtleSiteParticles({ reduceMotion, isActive }: { reduceMotion: boolean; isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const particles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        x: -2.7 + ((index * 0.61) % 5.8),
        y: 0.28 + ((index * 0.17) % 1.35),
        z: -2.18 + ((index * 0.43) % 4.3),
        scale: 0.012 + (index % 4) * 0.003
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!groupRef.current || reduceMotion || !isActive) return;
    groupRef.current.children.forEach((child, index) => {
      child.position.y = particles[index].y + Math.sin(clock.getElapsedTime() * 0.18 + index * 0.7) * 0.035;
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, index) => (
        <mesh key={index} position={[particle.x, particle.y, particle.z]}>
          <sphereGeometry args={[particle.scale, 6, 6]} />
          <meshBasicMaterial color="#d6b45f" transparent opacity={0.22} />
        </mesh>
      ))}
    </group>
  );
}

useGLTF.preload(modelPath, false, true);
