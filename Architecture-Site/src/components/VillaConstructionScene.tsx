"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { AdaptiveDpr, ContactShadows, Environment, PerspectiveCamera, Preload } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface VillaConstructionSceneProps {
  reduceMotion: boolean;
}

const buildDuration = 10.8;
const concrete = "#c8c0b4";
const warmStone = "#9d8d76";
const graphite = "#151515";
const glass = "#b7d2d1";
const gold = "#c4a15b";
const mobileCameraPosition: [number, number, number] = [8.6, 4.8, 10.2];
const desktopCameraPosition: [number, number, number] = [6.4, 3.5, 7.8];
const mobileFov = 48;
const desktopFov = 35;

export function VillaConstructionScene({ reduceMotion }: VillaConstructionSceneProps) {
  const isMobile = useMobileCanvas();

  return (
    <Canvas
      className="h-full w-full"
      dpr={isMobile ? [1, 1.15] : [1, 1.65]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: isMobile ? mobileCameraPosition : desktopCameraPosition, fov: isMobile ? mobileFov : desktopFov, near: 0.1, far: 80 }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.93;
      }}
      performance={{ min: 0.55 }}
      data-construction-canvas
    >
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={isMobile ? mobileCameraPosition : desktopCameraPosition} fov={isMobile ? mobileFov : desktopFov} />
        <color attach="background" args={["#020202"]} />
        <fog attach="fog" args={["#050404", 8, 22]} />
        <ambientLight intensity={0.16} />
        <hemisphereLight color="#fff2db" groundColor="#15100c" intensity={0.44} />
        <directionalLight color="#ffe5b4" intensity={1.75} position={[5.6, 6.8, 4.4]} castShadow />
        <directionalLight color="#6a6f76" intensity={0.42} position={[-5.2, 2.8, -5.8]} />
        <ConstructionRig reduceMotion={reduceMotion} isMobile={isMobile} />
        <group position={[0, -1.05, 0]} rotation={[0, -0.29, 0]}>
          <VillaModel reduceMotion={reduceMotion} isMobile={isMobile} />
        </group>
        <Environment resolution={64}>
          <mesh>
            <sphereGeometry args={[18, 32, 16]} />
            <meshBasicMaterial color="#c4a15b" side={THREE.BackSide} transparent opacity={0.035} />
          </mesh>
        </Environment>
        <AdaptiveDpr pixelated />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

function VillaModel({ reduceMotion, isMobile }: { reduceMotion: boolean; isMobile: boolean }) {
  const elapsed = useSceneSeconds(reduceMotion);
  const foundation = segment(elapsed, 0.8, 2.0);
  const columns = segment(elapsed, 2.0, 3.35);
  const walls = segment(elapsed, 3.0, 4.85);
  const glazing = segment(elapsed, 4.7, 6.0);
  const roof = segment(elapsed, 5.8, 7.05);
  const landscape = segment(elapsed, 6.9, 8.65);
  const lights = segment(elapsed, 8.25, 10.4);
  const reveal = segment(elapsed, 9.2, 10.8);

  const columnsPositions = useMemo(
    () => [
      [-2.72, 0, -1.62],
      [-0.86, 0, -1.62],
      [1.1, 0, -1.62],
      [2.86, 0, -1.62],
      [-2.72, 0, 1.42],
      [-0.86, 0, 1.42],
      [1.1, 0, 1.42],
      [2.86, 0, 1.42]
    ],
    []
  );

  const landscapeScale = 0.75 + landscape * 0.25;

  return (
    <group scale={isMobile ? 0.74 : 1}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.09, 0]} receiveShadow>
        <planeGeometry args={[13.5, 9.2]} />
        <meshStandardMaterial color="#11100e" roughness={0.88} metalness={0.02} />
      </mesh>

      <group scale={[foundation, 1, foundation]}>
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[6.7, 0.18, 4.08]} />
          <meshStandardMaterial color={warmStone} roughness={0.74} metalness={0.05} transparent opacity={0.3 + foundation * 0.7} />
        </mesh>
        <mesh position={[0.36, 0.17, 1.93]} castShadow>
          <boxGeometry args={[5.4, 0.18, 0.16]} />
          <meshStandardMaterial color={concrete} roughness={0.66} transparent opacity={foundation} />
        </mesh>
      </group>

      {columnsPositions.map(([x, , z], index) => (
        <mesh key={`${x}-${z}`} position={[x, 0.16 + columns * 0.88, z]} scale={[1, Math.max(0.001, columns), 1]} castShadow>
          <boxGeometry args={[index % 2 === 0 ? 0.13 : 0.105, 1.92, 0.13]} />
          <meshStandardMaterial color={index % 2 === 0 ? concrete : "#eee2cc"} roughness={0.54} transparent opacity={columns} />
        </mesh>
      ))}

      <group>
        <mesh position={[0, 0.18 + walls * 0.74, -1.72]} scale={[1, Math.max(0.001, walls), 1]} castShadow receiveShadow>
          <boxGeometry args={[5.95, 1.55, 0.13]} />
          <meshStandardMaterial color={concrete} roughness={0.62} transparent opacity={walls} />
        </mesh>
        <mesh position={[-3.0, 0.18 + walls * 0.72, -0.12]} scale={[1, Math.max(0.001, walls), 1]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 1.5, 3.12]} />
          <meshStandardMaterial color="#d7d1c5" roughness={0.7} transparent opacity={walls} />
        </mesh>
        <mesh position={[3.08, 0.18 + walls * 0.72, -0.24]} scale={[1, Math.max(0.001, walls), 1]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 1.5, 2.76]} />
          <meshStandardMaterial color="#bdb2a3" roughness={0.78} transparent opacity={walls} />
        </mesh>
        <mesh position={[-1.28, 0.16 + walls * 0.56, 1.47]} scale={[1, Math.max(0.001, walls), 1]} castShadow>
          <boxGeometry args={[2.25, 1.16, 0.12]} />
          <meshStandardMaterial color="#8e7e68" roughness={0.86} transparent opacity={walls} />
        </mesh>
      </group>

      <group position={[0.92 - (1 - glazing) * 0.28, 0.9, 1.48]} scale={[Math.max(0.001, glazing), 1, 1]}>
        <mesh castShadow>
          <boxGeometry args={[3.35, 1.28, 0.055]} />
          <meshPhysicalMaterial
            color={glass}
            roughness={0.08}
            metalness={0.02}
            transmission={0.24}
            transparent
            opacity={0.14 + glazing * 0.34}
            clearcoat={1}
          />
        </mesh>
        <mesh position={[0, -0.03, 0.035]}>
          <boxGeometry args={[3.42, 1.36, 0.025]} />
          <meshBasicMaterial color="#d6fff7" transparent opacity={0.03 + lights * 0.13} />
        </mesh>
      </group>

      <group position={[0.34, 1.95 + (1 - roof) * 0.24, -0.02]} scale={[Math.max(0.001, roof), 1, Math.max(0.001, roof)]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[7.16, 0.18, 4.42]} />
          <meshStandardMaterial color={graphite} roughness={0.46} metalness={0.18} transparent opacity={roof} />
        </mesh>
        <mesh position={[-2.88, -0.18, 0.05]}>
          <boxGeometry args={[0.13, 0.18, 4.52]} />
          <meshStandardMaterial color={gold} roughness={0.34} metalness={0.36} transparent opacity={roof * 0.9} />
        </mesh>
      </group>

      <group scale={[landscapeScale, landscapeScale, landscapeScale]} position={[0, -0.02 - (1 - landscape) * 0.16, 0]}>
        <mesh position={[2.05, 0.06, 2.48]} receiveShadow>
          <boxGeometry args={[4.22, 0.035, 0.86]} />
          <meshStandardMaterial color="#202724" roughness={0.78} transparent opacity={landscape * 0.74} />
        </mesh>
        <mesh position={[2.1, 0.085, 2.48]}>
          <boxGeometry args={[3.8, 0.018, 0.52]} />
          <meshPhysicalMaterial color="#1d3837" roughness={0.05} metalness={0.02} transparent opacity={landscape * 0.42} />
        </mesh>
        {[-4.8, -4.18, 4.15, 4.78].map((x, index) => (
          <mesh key={x} position={[x, 0.18 + landscape * 0.16, index < 2 ? 2.25 : -2.35]} castShadow>
            <coneGeometry args={[0.28, 0.58, 8]} />
            <meshStandardMaterial color={index % 2 === 0 ? "#526044" : "#384533"} roughness={0.8} transparent opacity={landscape} />
          </mesh>
        ))}
      </group>

      <group>
        <pointLight color="#ffcf83" intensity={lights * 1.75} distance={7} position={[2.45, 1.48, 1.72]} />
        <pointLight color="#fff0d2" intensity={lights * 0.9} distance={5} position={[-1.8, 1.2, 1.3]} />
        {[-2.5, -0.4, 1.62, 2.76].map((x) => (
          <mesh key={x} position={[x, 0.16, 1.83]}>
            <boxGeometry args={[0.12, 0.07, 0.04]} />
            <meshBasicMaterial color="#ffd482" transparent opacity={lights} />
          </mesh>
        ))}
      </group>

      <mesh position={[0.1, 1.04, 1.54]} scale={[1, 1, 1]}>
        <boxGeometry args={[6.2, 1.72, 0.018]} />
        <meshBasicMaterial color="#f4d08b" transparent opacity={reveal * 0.025} />
      </mesh>

      <ContactShadows
        position={[0, -0.085, 0]}
        opacity={0.28 + reveal * 0.18}
        blur={2.2}
        scale={12}
        far={6}
        color="#020202"
      />
    </group>
  );
}

function ConstructionRig({ reduceMotion, isMobile }: { reduceMotion: boolean; isMobile: boolean }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const t = reduceMotion ? 1 : Math.min(clock.getElapsedTime() / buildDuration, 1);
    const orbit = t * Math.PI * 0.18;
    target.set(
      (isMobile ? mobileCameraPosition[0] : desktopCameraPosition[0]) - t * 1.18 + Math.sin(orbit) * 0.58,
      (isMobile ? mobileCameraPosition[1] : desktopCameraPosition[1]) + Math.sin(t * Math.PI) * 0.24,
      (isMobile ? mobileCameraPosition[2] : desktopCameraPosition[2]) - t * 1.42 + Math.cos(orbit) * 0.36
    );
    camera.position.lerp(target, reduceMotion ? 1 : 0.025);
    lookAt.set(0.06, 0.42 + t * 0.35, 0);
    camera.lookAt(lookAt);
  });

  return null;
}

function useSceneSeconds(reduceMotion: boolean) {
  const [seconds, setSeconds] = useState(reduceMotion ? buildDuration : 0);

  useFrame(({ clock }) => {
    setSeconds(reduceMotion ? buildDuration : Math.min(clock.getElapsedTime(), buildDuration));
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
