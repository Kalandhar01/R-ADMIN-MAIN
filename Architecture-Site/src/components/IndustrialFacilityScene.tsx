"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { AdaptiveDpr, ContactShadows, Environment, PerspectiveCamera, Preload } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface IndustrialFacilitySceneProps {
  reduceMotion?: boolean;
  loop?: boolean;
}

const buildDuration = 12.4;
const graphite = "#121315";
const deepBlack = "#050505";
const concrete = "#a9a194";
const steel = "#6d7478";
const darkSteel = "#2b3032";
const glass = "#b9d5d2";
const gold = "#c4a15b";

export function IndustrialFacilityScene({ reduceMotion = false, loop = false }: IndustrialFacilitySceneProps) {
  const isMobile = useMobileCanvas();

  return (
    <Canvas
      className="h-full w-full"
      shadows
      dpr={isMobile ? [1, 1.15] : [1, 1.7]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: true }}
      camera={{ position: isMobile ? [7.6, 4.6, 9.2] : [8.2, 4.7, 8.8], fov: isMobile ? 43 : 36, near: 0.1, far: 90 }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.94;
      }}
      performance={{ min: 0.55 }}
    >
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={isMobile ? [7.6, 4.6, 9.2] : [8.2, 4.7, 8.8]} fov={isMobile ? 43 : 36} />
        <color attach="background" args={[deepBlack]} />
        <fog attach="fog" args={["#070706", 9, 28]} />
        <ambientLight intensity={0.18} />
        <hemisphereLight color="#fff1d8" groundColor="#0a0b0b" intensity={0.42} />
        <directionalLight color="#ffe5b2" intensity={1.72} position={[6.4, 7.2, 4.8]} castShadow />
        <directionalLight color="#9fb4c0" intensity={0.34} position={[-6.2, 3.2, -6.4]} />
        <IndustrialCameraRig reduceMotion={reduceMotion} isMobile={isMobile} />
        <group position={[0, -1.05, 0]} rotation={[0, isMobile ? -0.22 : -0.34, 0]} scale={isMobile ? 0.78 : 1}>
          <IndustrialFacilityModel reduceMotion={reduceMotion} loop={loop} />
        </group>
        <Environment resolution={64}>
          <mesh>
            <sphereGeometry args={[20, 36, 18]} />
            <meshBasicMaterial color={gold} side={THREE.BackSide} transparent opacity={0.032} />
          </mesh>
        </Environment>
        <AdaptiveDpr pixelated />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

function IndustrialFacilityModel({ reduceMotion, loop }: { reduceMotion: boolean; loop: boolean }) {
  const seconds = useSceneSeconds(reduceMotion, loop);
  const ground = segment(seconds, 0.15, 1.25);
  const frame = segment(seconds, 1.15, 3.35);
  const steelSystem = segment(seconds, 2.55, 5.15);
  const envelope = segment(seconds, 4.25, 6.55);
  const campus = segment(seconds, 6.75, 9.1);
  const lights = segment(seconds, 8.25, 11.25);
  const reveal = segment(seconds, 9.65, 12.4);

  const columnPositions = useMemo(() => {
    const xs = [-4.15, -2.08, 0, 2.08, 4.15];
    const zs = [-2.05, 0.05, 2.15];
    return xs.flatMap((x) => zs.map((z) => [x, z] as const));
  }, []);

  const roofRibs = useMemo(() => [-4.2, -3.15, -2.1, -1.05, 0, 1.05, 2.1, 3.15, 4.2], []);
  const glassPanels = useMemo(() => [-3.55, -2.65, -1.75, -0.85, 0.05, 0.95, 1.85, 2.75, 3.65], []);
  const dockBays = useMemo(() => [-3.2, -1.92, -0.64, 0.64, 1.92, 3.2], []);
  const campusMarkers = useMemo(() => [-5.4, -4.8, -4.2, 4.2, 4.8, 5.4], []);

  return (
    <group>
      <group scale={[0.72 + ground * 0.28, 1, 0.72 + ground * 0.28]}>
        <mesh position={[0, -0.04, 0]} receiveShadow>
          <boxGeometry args={[11.2, 0.12, 6.8]} />
          <meshStandardMaterial color="#151512" roughness={0.86} metalness={0.02} transparent opacity={0.2 + ground * 0.8} />
        </mesh>
        <mesh position={[0, 0.025, 3.68]} receiveShadow>
          <boxGeometry args={[11.6, 0.035, 1.15]} />
          <meshStandardMaterial color="#242321" roughness={0.72} transparent opacity={ground} />
        </mesh>
        <mesh position={[0, 0.055, 4.03]}>
          <boxGeometry args={[9.8, 0.022, 0.05]} />
          <meshBasicMaterial color={gold} transparent opacity={ground * 0.72} />
        </mesh>
      </group>

      {columnPositions.map(([x, z], index) => {
        const localReveal = segment(seconds, 1.15 + index * 0.035, 3.05 + index * 0.035);
        return (
          <mesh key={`${x}-${z}`} position={[x, 0.1 + localReveal * 1.34, z]} scale={[1, Math.max(0.001, localReveal), 1]} castShadow>
            <boxGeometry args={[0.105, 2.82, 0.105]} />
            <meshStandardMaterial color={index % 2 ? steel : "#8b9295"} roughness={0.38} metalness={0.62} transparent opacity={localReveal} />
          </mesh>
        );
      })}

      <group>
        {[-2.05, 0.05, 2.15].map((z) => (
          <mesh key={`beam-x-${z}`} position={[0, 2.75, z]} scale={[Math.max(0.001, frame), 1, 1]} castShadow>
            <boxGeometry args={[8.76, 0.105, 0.105]} />
            <meshStandardMaterial color={darkSteel} roughness={0.34} metalness={0.7} transparent opacity={0.12 + frame * 0.88} />
          </mesh>
        ))}
        {[-4.15, -2.08, 0, 2.08, 4.15].map((x) => (
          <mesh key={`beam-z-${x}`} position={[x, 2.82, 0.05]} scale={[1, 1, Math.max(0.001, frame)]} castShadow>
            <boxGeometry args={[0.09, 0.09, 4.35]} />
            <meshStandardMaterial color="#353b3e" roughness={0.34} metalness={0.74} transparent opacity={frame} />
          </mesh>
        ))}
      </group>

      <group position={[0, 3.02 + (1 - steelSystem) * 0.22, 0.04]} scale={[Math.max(0.001, steelSystem), 1, Math.max(0.001, steelSystem)]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[9.36, 0.15, 5.02]} />
          <meshStandardMaterial color={graphite} roughness={0.42} metalness={0.34} transparent opacity={0.18 + steelSystem * 0.82} />
        </mesh>
        <mesh position={[0, 0.13, -0.1]}>
          <boxGeometry args={[8.25, 0.035, 3.88]} />
          <meshStandardMaterial color="#1f2223" roughness={0.5} metalness={0.36} transparent opacity={steelSystem * 0.7} />
        </mesh>
      </group>

      {roofRibs.map((x, index) => {
        const localReveal = segment(seconds, 2.9 + index * 0.025, 5.1 + index * 0.025);
        return (
          <mesh key={`rib-${x}`} position={[x, 3.15, 0.02]} rotation={[0, 0, index % 2 ? -0.055 : 0.055]} scale={[1, 1, Math.max(0.001, localReveal)]}>
            <boxGeometry args={[0.055, 0.08, 5.28]} />
            <meshStandardMaterial color={gold} roughness={0.28} metalness={0.56} transparent opacity={localReveal * 0.72} />
          </mesh>
        );
      })}

      <group>
        <mesh position={[0, 1.28, -2.36]} scale={[1, Math.max(0.001, envelope), 1]} castShadow receiveShadow>
          <boxGeometry args={[8.9, 2.22, 0.16]} />
          <meshStandardMaterial color={concrete} roughness={0.68} metalness={0.05} transparent opacity={0.08 + envelope * 0.72} />
        </mesh>
        <mesh position={[-4.62, 1.28, 0.05]} scale={[1, Math.max(0.001, envelope), 1]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 2.16, 4.72]} />
          <meshStandardMaterial color="#8f8a7f" roughness={0.72} transparent opacity={envelope * 0.72} />
        </mesh>
        <mesh position={[4.62, 1.28, -0.05]} scale={[1, Math.max(0.001, envelope), 1]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 2.16, 4.42]} />
          <meshStandardMaterial color="#7c7b75" roughness={0.76} transparent opacity={envelope * 0.7} />
        </mesh>
        <mesh position={[-2.95, 1.04, 2.45]} scale={[1, Math.max(0.001, envelope), 1]} castShadow>
          <boxGeometry args={[2.55, 1.72, 0.16]} />
          <meshStandardMaterial color="#d4ccc0" roughness={0.58} transparent opacity={envelope * 0.78} />
        </mesh>
      </group>

      <group position={[0.64, 1.36, 2.42]}>
        {glassPanels.map((x, index) => {
          const localReveal = segment(seconds, 5.55 + index * 0.055, 7.55 + index * 0.055);
          return (
            <mesh key={`glass-${x}`} position={[x - (1 - localReveal) * 0.18, 0, 0]} scale={[0.88, Math.max(0.001, localReveal), 1]}>
              <boxGeometry args={[0.72, 1.82, 0.045]} />
              <meshPhysicalMaterial
                color={glass}
                roughness={0.08}
                metalness={0.04}
                transmission={0.22}
                transparent
                opacity={0.08 + localReveal * 0.34}
                clearcoat={1}
              />
            </mesh>
          );
        })}
        <mesh position={[0, 0, 0.035]}>
          <boxGeometry args={[8.68, 1.9, 0.018]} />
          <meshBasicMaterial color="#f4d08b" transparent opacity={lights * 0.065} />
        </mesh>
      </group>

      <group position={[3.18, 0.7, 3.04]}>
        {dockBays.map((x, index) => {
          const localReveal = segment(seconds, 6.55 + index * 0.05, 8.3 + index * 0.05);
          return (
            <group key={`dock-${x}`} position={[x, 0, 0]} scale={[1, Math.max(0.001, localReveal), 1]}>
              <mesh castShadow>
                <boxGeometry args={[0.8, 1.05, 0.09]} />
                <meshStandardMaterial color="#1d1d1b" roughness={0.52} metalness={0.16} transparent opacity={localReveal} />
              </mesh>
              <mesh position={[0, -0.48, 0.16]}>
                <boxGeometry args={[0.76, 0.05, 0.44]} />
                <meshStandardMaterial color={gold} roughness={0.4} metalness={0.24} transparent opacity={localReveal * 0.62} />
              </mesh>
            </group>
          );
        })}
      </group>

      <group scale={[campus, campus, campus]} position={[0, -0.01 - (1 - campus) * 0.14, 0]}>
        <mesh position={[5.55, 0.11, -1.18]} castShadow receiveShadow>
          <boxGeometry args={[1.72, 0.22, 2.85]} />
          <meshStandardMaterial color="#3d4141" roughness={0.54} metalness={0.2} transparent opacity={campus * 0.85} />
        </mesh>
        <mesh position={[5.55, 0.68, -1.18]} castShadow>
          <boxGeometry args={[1.54, 0.88, 2.45]} />
          <meshPhysicalMaterial color="#d5e4de" roughness={0.1} metalness={0.03} transparent opacity={campus * 0.32} clearcoat={1} />
        </mesh>
        <mesh position={[-4.9, 0.12, 3.58]} castShadow>
          <boxGeometry args={[1.1, 0.24, 0.64]} />
          <meshStandardMaterial color="#232526" roughness={0.48} metalness={0.42} transparent opacity={campus} />
        </mesh>
        <mesh position={[-4.9, 0.33, 3.58]} castShadow>
          <boxGeometry args={[0.88, 0.22, 0.48]} />
          <meshStandardMaterial color="#c8c0b2" roughness={0.48} transparent opacity={campus} />
        </mesh>
        {campusMarkers.map((x, index) => (
          <mesh key={`marker-${x}`} position={[x, 0.18, index < 3 ? 3.82 : -3.12]}>
            <boxGeometry args={[0.055, 0.36, 0.055]} />
            <meshBasicMaterial color="#ffd88c" transparent opacity={lights * 0.65} />
          </mesh>
        ))}
      </group>

      <group>
        <pointLight color="#ffd28a" intensity={lights * 2.1} distance={8} position={[2.6, 2.25, 2.65]} />
        <pointLight color="#fff0d3" intensity={lights * 1.25} distance={6} position={[-2.55, 1.9, 2.55]} />
        <pointLight color="#cce9ff" intensity={lights * 0.7} distance={7} position={[4.8, 2.4, -1.25]} />
        {[-3.6, -2.2, -0.8, 0.8, 2.2, 3.6].map((x) => (
          <mesh key={`light-${x}`} position={[x, 0.24, 3.5]}>
            <boxGeometry args={[0.14, 0.08, 0.045]} />
            <meshBasicMaterial color="#ffd482" transparent opacity={lights} />
          </mesh>
        ))}
      </group>

      <mesh position={[0.1, 1.34, 2.48]}>
        <boxGeometry args={[9.1, 2.08, 0.014]} />
        <meshBasicMaterial color="#f4d08b" transparent opacity={reveal * 0.03} />
      </mesh>

      <ContactShadows position={[0, -0.08, 0]} opacity={0.28 + reveal * 0.18} blur={2.4} scale={13.5} far={7} color="#020202" />
    </group>
  );
}

function IndustrialCameraRig({ reduceMotion, isMobile }: { reduceMotion: boolean; isMobile: boolean }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const t = reduceMotion ? 1 : Math.min(elapsed / buildDuration, 1);
    const drift = elapsed * 0.12;
    target.set(
      (isMobile ? 7.6 : 8.2) - t * 1.08 + Math.sin(drift) * 0.72,
      (isMobile ? 4.6 : 4.7) + Math.sin(t * Math.PI) * 0.32,
      (isMobile ? 9.2 : 8.8) - t * 1.36 + Math.cos(drift) * 0.58
    );
    camera.position.lerp(target, reduceMotion ? 1 : 0.026);
    lookAt.set(0.1, 0.76 + t * 0.42, 0.2);
    camera.lookAt(lookAt);
  });

  return null;
}

function useSceneSeconds(reduceMotion: boolean, loop: boolean) {
  const [seconds, setSeconds] = useState(reduceMotion ? buildDuration : 0);

  useFrame(({ clock }) => {
    if (reduceMotion) {
      setSeconds(buildDuration);
      return;
    }

    const elapsed = clock.getElapsedTime();
    setSeconds(loop ? elapsed % buildDuration : Math.min(elapsed, buildDuration));
  });

  return seconds;
}

function useMobileCanvas() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function segment(seconds: number, start: number, end: number) {
  if (seconds <= start) return 0;
  if (seconds >= end) return 1;
  const value = (seconds - start) / (end - start);
  return value * value * value * (value * (value * 6 - 15) + 10);
}
