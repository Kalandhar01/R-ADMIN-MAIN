"use client";

import { Suspense, type RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  AdaptiveDpr,
  ContactShadows,
  Environment,
  Float,
  Html,
  Lightformer,
  Line,
  PerspectiveCamera,
  Preload,
  RoundedBox
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import * as THREE from "three";

interface InteriorLuxuryHeroSceneProps {
  reduceMotion: boolean;
}

type AreaLabel = "Living Area" | "Dining Area" | "Detail Material Shot";
type VectorTuple = [number, number, number];

const areaLabels: AreaLabel[] = ["Living Area", "Dining Area", "Detail Material Shot"];

export default function InteriorLuxuryHeroScene({ reduceMotion }: InteriorLuxuryHeroSceneProps) {
  return (
    <Canvas
      className="absolute inset-0 h-full w-full"
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      shadows
      performance={{ min: 0.65 }}
    >
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[3.45, 1.45, 4.45]} fov={36} near={0.1} far={40} />
        <color attach="background" args={["#f4efe5"]} />
        <ambientLight intensity={0.78} />
        <directionalLight
          castShadow
          color="#fff1d3"
          intensity={2.7}
          position={[3.6, 5.4, 3.6]}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-7}
          shadow-camera-right={7}
          shadow-camera-top={7}
          shadow-camera-bottom={-7}
        />
        <spotLight
          castShadow
          color="#ffd99a"
          intensity={1.42}
          angle={0.46}
          penumbra={0.82}
          position={[-2.8, 3.8, 2.6]}
        />
        <pointLight color="#8b1118" intensity={0.22} position={[3.2, 0.8, 1.2]} />
        <pointLight color="#ffd99a" intensity={0.82} position={[0.1, 1.35, -0.45]} />
        <Environment resolution={64}>
          <Lightformer color="#fff7e6" intensity={2.6} position={[0, 5, -5]} scale={[7, 3, 1]} />
          <Lightformer color="#d6b45f" intensity={1.6} position={[-4, 2.5, 3]} scale={[3, 4, 1]} />
          <Lightformer color="#ffffff" intensity={1.5} position={[4, 4, 4]} scale={[4, 3, 1]} />
        </Environment>
        <LuxuryInteriorScene reduceMotion={reduceMotion} />
        <ContactShadows opacity={0.24} scale={7.2} blur={2.8} far={3.8} resolution={256} position={[0, -1.18, 0]} />
        <AdaptiveDpr pixelated />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

function LuxuryInteriorScene({ reduceMotion }: { reduceMotion: boolean }) {
  const [activeArea, setActiveArea] = useState<AreaLabel>("Living Area");
  const groupRef = useRef<THREE.Group>(null);
  const goldRef = useRef<THREE.MeshStandardMaterial>(null);
  const highlightRef = useRef({ value: 0 });
  const viewRef = useRef({ value: 0 });
  const { camera, pointer } = useThree();
  const cameraState = useMemo(
    () => ({
      positions: [
        new THREE.Vector3(3.08, 1.38, 4.72),
        new THREE.Vector3(-2.75, 1.28, 4.05),
        new THREE.Vector3(1.65, 0.78, 2.55)
      ],
      targets: [
        new THREE.Vector3(0.32, -0.36, -0.62),
        new THREE.Vector3(-1.72, -0.32, -0.62),
        new THREE.Vector3(0.72, -0.56, -0.18)
      ],
      currentTarget: new THREE.Vector3()
    }),
    []
  );

  useEffect(() => {
    if (reduceMotion) {
      viewRef.current.value = 0;
      highlightRef.current.value = 0.45;
      setActiveArea("Living Area");
      return;
    }

    const context = gsap.context(() => {
      gsap.to(highlightRef.current, {
        value: 1,
        duration: 3.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      if (groupRef.current) {
        gsap.to(groupRef.current.position, {
          y: -0.42,
          duration: 8.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }

      gsap
        .timeline({ repeat: -1, repeatDelay: 1.2 })
      .call(() => setActiveArea("Living Area"))
        .to(viewRef.current, { value: 0.98, duration: 9.2, ease: "sine.inOut" })
        .call(() => setActiveArea("Dining Area"))
        .to(viewRef.current, { value: 1.96, duration: 9.2, ease: "sine.inOut" })
        .call(() => setActiveArea("Detail Material Shot"))
        .to(viewRef.current, { value: 0.04, duration: 9.6, ease: "sine.inOut" });
    });

    return () => context.revert();
  }, [reduceMotion]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const view = THREE.MathUtils.clamp(viewRef.current.value, 0, 2);
    const baseIndex = view < 1 ? 0 : 1;
    const nextIndex = view < 1 ? 1 : 2;
    const localProgress = view < 1 ? view : view - 1;
    const eased = THREE.MathUtils.smoothstep(localProgress, 0, 1);
    const position = cameraState.positions[baseIndex].clone().lerp(cameraState.positions[nextIndex], eased);
    const target = cameraState.targets[baseIndex].clone().lerp(cameraState.targets[nextIndex], eased);

    if (!reduceMotion) {
      position.x += pointer.x * 0.08;
      position.y += pointer.y * 0.035;
      target.x += pointer.x * 0.06;
      target.y += pointer.y * 0.03;
    }

    camera.position.lerp(position, reduceMotion ? 0.16 : 0.035);
    cameraState.currentTarget.lerp(target, reduceMotion ? 0.16 : 0.04);
    camera.lookAt(cameraState.currentTarget);

    if (groupRef.current) {
      const targetRotation = -0.08 + view * 0.042 + (reduceMotion ? 0 : Math.sin(elapsed * 0.16) * 0.024);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, 0.04);
    }

    if (goldRef.current) {
      goldRef.current.emissiveIntensity = 0.04 + highlightRef.current.value * 0.12;
    }
  });

  return (
    <>
      <group ref={groupRef} position={[0, -0.48, 0]} rotation={[0, -0.08, 0]}>
        <InteriorEnvelope goldRef={goldRef} />
        <LivingArea />
        <DiningArea />
        <MaterialDetailShot goldRef={goldRef} />
        <ArchitecturalGuides />
      </group>
      <SceneModeOverlay activeArea={activeArea} />
    </>
  );
}

function InteriorEnvelope({ goldRef }: { goldRef: RefObject<THREE.MeshStandardMaterial | null> }) {
  const marbleVeins = useMemo<VectorTuple[][]>(
    () => [
      [
        [-3.4, -0.735, 1.8],
        [-1.6, -0.732, 0.55],
        [0.55, -0.73, 0.92],
        [3.4, -0.733, -1.4]
      ],
      [
        [-2.9, -0.731, -1.6],
        [-0.75, -0.734, -0.75],
        [1.1, -0.73, -1.02],
        [3.2, -0.733, 0.45]
      ],
      [
        [-3.35, -0.729, 0.1],
        [-1.9, -0.731, -0.24],
        [0.2, -0.729, -0.05],
        [2.75, -0.732, -0.72]
      ]
    ],
    []
  );

  const slats = useMemo(() => Array.from({ length: 16 }, (_, index) => -3.32 + index * 0.16), []);

  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.75, 0]}>
        <planeGeometry args={[7.4, 5.2, 1, 1]} />
        <meshStandardMaterial color="#eee8dc" roughness={0.32} metalness={0.03} />
      </mesh>
      {marbleVeins.map((points, index) => (
        <Line
          key={`marble-vein-${index}`}
          points={points}
          color={index === 1 ? "#8f8070" : "#c6a45b"}
          transparent
          opacity={index === 1 ? 0.16 : 0.2}
          lineWidth={0.75}
        />
      ))}

      <mesh receiveShadow position={[0, 1.05, -2.28]}>
        <boxGeometry args={[7.25, 3.6, 0.12]} />
        <meshStandardMaterial color="#f7f0e4" roughness={0.55} metalness={0.02} />
      </mesh>
      <mesh receiveShadow position={[3.58, 1.05, -0.04]}>
        <boxGeometry args={[0.12, 3.6, 4.5]} />
        <meshStandardMaterial color="#f2e7d7" roughness={0.6} metalness={0.02} />
      </mesh>
      <mesh position={[0, 2.92, -0.06]}>
        <boxGeometry args={[7.25, 0.08, 4.5]} />
        <meshStandardMaterial color="#fff8ec" roughness={0.52} metalness={0.02} />
      </mesh>

      <mesh position={[-2.28, 0.98, -2.18]}>
        <boxGeometry args={[2.35, 2.88, 0.08]} />
        <meshStandardMaterial color="#4d3020" roughness={0.44} metalness={0.08} />
      </mesh>
      {slats.map((x, index) => (
        <mesh key={`walnut-slat-${index}`} castShadow position={[x, 0.98, -2.09]}>
          <boxGeometry args={[0.035, 2.96, 0.12]} />
          <meshStandardMaterial color={index % 2 === 0 ? "#6b452c" : "#3f281b"} roughness={0.36} metalness={0.05} />
        </mesh>
      ))}

      <LuxuryTvWall goldRef={goldRef} />
    </group>
  );
}

function LuxuryTvWall({ goldRef }: { goldRef: RefObject<THREE.MeshStandardMaterial | null> }) {
  return (
    <group position={[1.05, 0, -2.035]}>
      <RoundedBox castShadow receiveShadow args={[2.72, 2.62, 0.1]} radius={0.035} smoothness={4} position={[0, 1.12, 0]}>
        <meshStandardMaterial color="#f5efe3" roughness={0.36} metalness={0.04} />
      </RoundedBox>
      {[-0.64, 0.02, 0.68].map((x) => (
        <Line
          key={`tv-marble-vein-${x}`}
          points={[
            [x - 0.34, 0.1, 0.061],
            [x - 0.08, 0.78, 0.064],
            [x + 0.24, 1.82, 0.061],
            [x + 0.44, 2.38, 0.064]
          ]}
          color={x === 0.02 ? "#c6a45b" : "#8f8070"}
          transparent
          opacity={x === 0.02 ? 0.2 : 0.13}
          lineWidth={0.58}
        />
      ))}
      <mesh castShadow position={[0, 1.38, 0.095]}>
        <boxGeometry args={[1.64, 0.92, 0.055]} />
        <meshStandardMaterial color="#070606" roughness={0.18} metalness={0.42} />
      </mesh>
      <mesh position={[0.18, 1.52, 0.128]}>
        <boxGeometry args={[1.06, 0.42, 0.018]} />
        <meshPhysicalMaterial color="#fff9eb" transparent opacity={0.18} roughness={0.02} metalness={0} clearcoat={1} />
      </mesh>
      <mesh castShadow position={[0, 1.96, 0.125]}>
        <boxGeometry args={[1.74, 0.032, 0.075]} />
        <meshStandardMaterial ref={goldRef} color="#c6a45b" emissive="#c6a45b" metalness={0.78} roughness={0.18} />
      </mesh>
      <RoundedBox castShadow receiveShadow args={[2.16, 0.34, 0.38]} radius={0.035} smoothness={4} position={[0, 0.13, 0.18]}>
        <meshStandardMaterial color="#5f3d27" roughness={0.34} metalness={0.05} />
      </RoundedBox>
      <mesh castShadow position={[0, 0.33, 0.19]}>
        <boxGeometry args={[2.22, 0.045, 0.42]} />
        <meshStandardMaterial color="#14100e" roughness={0.25} metalness={0.28} />
      </mesh>
      {[-0.72, 0, 0.72].map((x) => (
        <mesh key={`console-handle-${x}`} castShadow position={[x, 0.15, 0.405]}>
          <boxGeometry args={[0.34, 0.026, 0.035]} />
          <meshStandardMaterial color="#d6b45f" metalness={0.84} roughness={0.18} />
        </mesh>
      ))}
      {[-1.2, 1.2].map((x) => (
        <mesh key={`tv-gold-upright-${x}`} castShadow position={[x, 1.12, 0.09]}>
          <boxGeometry args={[0.035, 2.36, 0.07]} />
          <meshStandardMaterial color="#c6a45b" metalness={0.78} roughness={0.2} />
        </mesh>
      ))}
      <mesh position={[1.04, 1.22, 0.15]}>
        <boxGeometry args={[0.055, 1.34, 0.3]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.2} roughness={0.02} metalness={0} clearcoat={1} />
      </mesh>
    </group>
  );
}

function LivingArea() {
  return (
    <group position={[0.1, 0, 0.56]}>
      <RoundedBox receiveShadow args={[3.25, 0.018, 2.08]} radius={0.04} smoothness={3} position={[0, -0.725, -0.18]}>
        <meshStandardMaterial color="#dacdbe" roughness={0.84} metalness={0} />
      </RoundedBox>

      <RoundedBox castShadow receiveShadow args={[2.72, 0.34, 0.82]} radius={0.12} smoothness={6} position={[0, -0.38, 0.18]}>
        <meshStandardMaterial color="#e7ddd0" roughness={0.82} metalness={0.01} />
      </RoundedBox>
      <RoundedBox castShadow receiveShadow args={[2.82, 0.78, 0.24]} radius={0.11} smoothness={6} position={[0, -0.08, 0.64]}>
        <meshStandardMaterial color="#f2e8dc" roughness={0.8} metalness={0} />
      </RoundedBox>
      {[-1.48, 1.48].map((x) => (
        <RoundedBox key={`sofa-arm-${x}`} castShadow receiveShadow args={[0.28, 0.58, 0.88]} radius={0.1} smoothness={6} position={[x, -0.22, 0.2]}>
          <meshStandardMaterial color="#e2d6c8" roughness={0.82} metalness={0} />
        </RoundedBox>
      ))}
      {[-0.83, 0, 0.83].map((x) => (
        <RoundedBox key={`sofa-cushion-${x}`} castShadow receiveShadow args={[0.7, 0.14, 0.62]} radius={0.08} smoothness={5} position={[x, -0.14, 0.04]}>
          <meshStandardMaterial color="#fbf1e5" roughness={0.86} metalness={0} />
        </RoundedBox>
      ))}
      {[
        [-0.92, 0.17, 0.5, "#7f151d", 0.12],
        [-0.28, 0.19, 0.52, "#efe2d2", -0.08],
        [0.46, 0.16, 0.51, "#6d432b", 0.06],
        [0.98, 0.14, 0.5, "#dcc5a8", -0.12]
      ].map(([x, y, z, color, rotation]) => (
        <RoundedBox
          key={`sofa-pillow-${x}`}
          castShadow
          args={[0.38, 0.32, 0.095]}
          radius={0.055}
          smoothness={4}
          position={[x as number, y as number, z as number]}
          rotation={[0.06, rotation as number, 0.02]}
        >
          <meshStandardMaterial color={color as string} roughness={0.82} metalness={0} />
        </RoundedBox>
      ))}

      <DesignerArmchair position={[-1.86, -0.22, -0.44]} rotationY={0.5} />
      <DesignerArmchair position={[1.86, -0.22, -0.48]} rotationY={-0.48} />

      <group position={[0, 0, -0.42]}>
        <mesh castShadow receiveShadow position={[0, -0.46, 0]} scale={[1.08, 1, 0.62]}>
          <cylinderGeometry args={[0.76, 0.76, 0.09, 72]} />
          <meshStandardMaterial color="#f6f0e7" roughness={0.22} metalness={0.06} />
        </mesh>
        <Line
          points={[
            [-0.54, -0.405, -0.14],
            [-0.12, -0.398, -0.3],
            [0.28, -0.405, -0.08],
            [0.58, -0.4, 0.2]
          ]}
          color="#917e6b"
          transparent
          opacity={0.22}
          lineWidth={0.62}
        />
        <mesh castShadow position={[0, -0.63, 0]}>
          <cylinderGeometry args={[0.12, 0.18, 0.28, 32]} />
          <meshStandardMaterial color="#c6a45b" metalness={0.82} roughness={0.16} />
        </mesh>
        <RoundedBox castShadow args={[0.56, 0.045, 0.28]} radius={0.025} smoothness={4} position={[-0.22, -0.385, 0.02]} rotation={[0, 0.16, 0]}>
          <meshStandardMaterial color="#14100e" roughness={0.28} metalness={0.22} />
        </RoundedBox>
        <RoundedBox castShadow args={[0.34, 0.05, 0.2]} radius={0.02} smoothness={3} position={[0.36, -0.375, -0.02]} rotation={[0, -0.14, 0]}>
          <meshStandardMaterial color="#6d432b" roughness={0.34} metalness={0.05} />
        </RoundedBox>
        <mesh castShadow position={[0.46, -0.335, 0.17]}>
          <sphereGeometry args={[0.095, 32, 16]} />
          <meshStandardMaterial color="#8b1118" roughness={0.36} metalness={0.08} />
        </mesh>
      </group>

      <FloorLamp />
      <LivingChandelier />
    </group>
  );
}

function DesignerArmchair({ position, rotationY }: { position: VectorTuple; rotationY: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <RoundedBox castShadow receiveShadow args={[0.58, 0.18, 0.58]} radius={0.08} smoothness={5} position={[0, -0.21, 0]}>
        <meshStandardMaterial color="#ede3d7" roughness={0.78} metalness={0} />
      </RoundedBox>
      <RoundedBox castShadow receiveShadow args={[0.64, 0.56, 0.16]} radius={0.08} smoothness={5} position={[0, 0.02, 0.32]}>
        <meshStandardMaterial color="#e4d7c9" roughness={0.8} metalness={0} />
      </RoundedBox>
      {[-0.38, 0.38].map((x) => (
        <RoundedBox key={`armchair-arm-${x}`} castShadow receiveShadow args={[0.14, 0.38, 0.58]} radius={0.055} smoothness={4} position={[x, -0.06, 0.02]}>
          <meshStandardMaterial color="#d8cabb" roughness={0.78} metalness={0} />
        </RoundedBox>
      ))}
      <mesh castShadow position={[0, -0.34, 0]}>
        <cylinderGeometry args={[0.2, 0.16, 0.08, 32]} />
        <meshStandardMaterial color="#c6a45b" metalness={0.78} roughness={0.18} />
      </mesh>
    </group>
  );
}

function FloorLamp() {
  return (
    <Float speed={0.45} rotationIntensity={0.025} floatIntensity={0.035}>
      <group position={[2.36, -0.12, 0.16]}>
        <mesh castShadow position={[0, -0.59, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.035, 36]} />
          <meshStandardMaterial color="#16110f" roughness={0.26} metalness={0.38} />
        </mesh>
        <mesh castShadow position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 1.24, 24]} />
          <meshStandardMaterial color="#c6a45b" metalness={0.82} roughness={0.16} />
        </mesh>
        <mesh castShadow position={[0, 0.74, 0]} rotation={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.22, 0.34, 0.34, 40]} />
          <meshStandardMaterial color="#ffe3ad" emissive="#d6b45f" emissiveIntensity={0.24} roughness={0.32} metalness={0.04} />
        </mesh>
        <pointLight color="#ffd99a" intensity={0.45} distance={2.2} position={[0, 0.74, 0]} />
      </group>
    </Float>
  );
}

function LivingChandelier() {
  return (
    <Float speed={0.38} rotationIntensity={0.03} floatIntensity={0.035}>
      <group position={[0.1, 1.62, -0.52]}>
        <mesh castShadow>
          <boxGeometry args={[1.15, 0.035, 0.035]} />
          <meshStandardMaterial color="#c6a45b" metalness={0.86} roughness={0.14} />
        </mesh>
        {[-0.48, -0.24, 0, 0.24, 0.48].map((x, index) => (
          <group key={`living-chandelier-${x}`} position={[x, 0, index % 2 === 0 ? 0.08 : -0.08]}>
            <Line
              points={[
                [0, 0.42, 0],
                [0, -0.1 - index * 0.035, 0]
              ]}
              color="#9a7428"
              transparent
              opacity={0.42}
              lineWidth={0.58}
            />
            <mesh castShadow position={[0, -0.2 - index * 0.035, 0]}>
              <sphereGeometry args={[0.09, 28, 14]} />
              <meshStandardMaterial color="#fff1c9" emissive="#d6b45f" emissiveIntensity={0.24} roughness={0.2} metalness={0.04} />
            </mesh>
          </group>
        ))}
      </group>
    </Float>
  );
}

function DiningArea() {
  const chairPositions: Array<[number, number, number, number]> = [
    [-2.58, -0.46, 0.15, 0.25],
    [-1.58, -0.46, 0.15, -0.25],
    [-2.58, -0.46, -0.96, -0.15],
    [-1.58, -0.46, -0.96, 0.15]
  ];

  return (
    <group position={[-0.2, 0, -0.06]}>
      <RoundedBox castShadow receiveShadow args={[1.42, 0.09, 0.82]} radius={0.04} smoothness={4} position={[-2.08, -0.44, -0.4]}>
        <meshStandardMaterial color="#6b432b" roughness={0.32} metalness={0.08} />
      </RoundedBox>
      <mesh castShadow position={[-2.08, -0.64, -0.4]}>
        <boxGeometry args={[0.12, 0.38, 0.12]} />
        <meshStandardMaterial color="#c6a45b" metalness={0.78} roughness={0.18} />
      </mesh>
      {[
        [-2.43, -0.38, -0.18],
        [-1.73, -0.38, -0.18],
        [-2.43, -0.38, -0.62],
        [-1.73, -0.38, -0.62]
      ].map(([x, y, z]) => (
        <group key={`table-setting-${x}-${z}`} position={[x, y, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.105, 0.105, 0.018, 32]} />
            <meshStandardMaterial color="#f8f1e6" roughness={0.2} metalness={0.04} />
          </mesh>
          <mesh castShadow position={[0.13, 0.035, -0.02]}>
            <cylinderGeometry args={[0.035, 0.044, 0.115, 24]} />
            <meshPhysicalMaterial color="#ffffff" transparent opacity={0.36} roughness={0.02} clearcoat={1} />
          </mesh>
        </group>
      ))}
      {chairPositions.map(([x, y, z, rotation], index) => (
        <group key={`dining-chair-${index}`} position={[x, y, z]} rotation={[0, rotation, 0]}>
          <RoundedBox castShadow receiveShadow args={[0.36, 0.16, 0.38]} radius={0.05} smoothness={4}>
            <meshStandardMaterial color="#eee3d6" roughness={0.68} metalness={0.01} />
          </RoundedBox>
          <RoundedBox castShadow receiveShadow args={[0.4, 0.46, 0.09]} radius={0.05} smoothness={4} position={[0, 0.24, -0.18]}>
            <meshStandardMaterial color="#e6d8ca" roughness={0.7} metalness={0.01} />
          </RoundedBox>
        </group>
      ))}
      {[-2.48, -2.08, -1.68].map((x, index) => (
        <Float key={`pendant-${x}`} speed={0.8 + index * 0.08} rotationIntensity={0.04} floatIntensity={0.05}>
          <group position={[x, 1.42, -0.4]}>
            <Line
              points={[
                [0, 0.92, 0],
                [0, 0.22, 0]
              ]}
              color="#9a7428"
              transparent
              opacity={0.42}
              lineWidth={0.7}
            />
            <mesh castShadow position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.18, 0.26, 0.18, 36]} />
              <meshStandardMaterial color="#c6a45b" emissive="#d6b45f" emissiveIntensity={0.14} metalness={0.68} roughness={0.22} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  );
}

function MaterialDetailShot({ goldRef }: { goldRef: RefObject<THREE.MeshStandardMaterial | null> }) {
  return (
    <group position={[2.15, 0, -0.12]} rotation={[0, -0.18, 0]}>
      <RoundedBox castShadow receiveShadow args={[0.82, 0.18, 0.82]} radius={0.035} smoothness={4} position={[0, -0.44, 0]}>
        <meshStandardMaterial color="#f4eee5" roughness={0.22} metalness={0.05} />
      </RoundedBox>
      <Line
        points={[
          [-0.32, -0.34, 0.24],
          [-0.04, -0.335, 0.05],
          [0.3, -0.34, 0.18]
        ]}
        color="#917e6b"
        transparent
        opacity={0.22}
        lineWidth={0.58}
      />
      <RoundedBox castShadow args={[0.34, 0.045, 0.58]} radius={0.018} smoothness={3} position={[-0.25, -0.22, 0.06]} rotation={[0.08, -0.2, 0.03]}>
        <meshStandardMaterial color="#6d432b" roughness={0.3} metalness={0.06} />
      </RoundedBox>
      <RoundedBox castShadow args={[0.34, 0.045, 0.56]} radius={0.018} smoothness={3} position={[0.2, -0.18, -0.08]} rotation={[0.06, 0.22, -0.03]}>
        <meshStandardMaterial color="#efe6d8" roughness={0.26} metalness={0.04} />
      </RoundedBox>
      <mesh castShadow position={[0.05, 0.22, 0.14]} rotation={[0.1, -0.36, 0]}>
        <boxGeometry args={[0.04, 0.9, 0.68]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.24} roughness={0.02} metalness={0} clearcoat={1} />
      </mesh>
      <mesh castShadow position={[0.43, 0.05, 0.33]} rotation={[Math.PI / 2, 0.18, 0]}>
        <torusGeometry args={[0.22, 0.018, 18, 76]} />
        <meshStandardMaterial ref={goldRef} color="#c6a45b" emissive="#c6a45b" metalness={0.84} roughness={0.16} />
      </mesh>
      <mesh castShadow position={[-0.32, 0.04, -0.32]}>
        <sphereGeometry args={[0.11, 32, 16]} />
        <meshStandardMaterial color="#8b1118" roughness={0.36} metalness={0.1} />
      </mesh>
      <mesh castShadow position={[0.08, -0.06, 0.33]}>
        <cylinderGeometry args={[0.035, 0.052, 0.22, 24]} />
        <meshPhysicalMaterial color="#fff6e8" transparent opacity={0.44} roughness={0.04} clearcoat={1} />
      </mesh>
    </group>
  );
}

function ArchitecturalGuides() {
  const guideLines = useMemo<VectorTuple[][]>(
    () => [
      [
        [-3.4, -0.72, -1.82],
        [3.3, -0.72, -1.82]
      ],
      [
        [-3.4, -0.72, 1.72],
        [3.3, -0.72, 1.72]
      ],
      [
        [-3.25, -0.72, -1.8],
        [-3.25, 2.7, -1.8]
      ],
      [
        [3.2, -0.72, -1.8],
        [3.2, 2.7, -1.8]
      ],
      [
        [-3.25, 2.7, -1.8],
        [3.2, 2.7, -1.8]
      ]
    ],
    []
  );

  return (
    <group>
      {guideLines.map((points, index) => (
        <Line key={`interior-guide-${index}`} points={points} color="#c6a45b" transparent opacity={0.16} lineWidth={0.65} />
      ))}
    </group>
  );
}

function SceneModeOverlay({ activeArea }: { activeArea: AreaLabel }) {
  return (
    <Html fullscreen zIndexRange={[30, 0]} className="pointer-events-none select-none">
      <div className="absolute inset-x-4 bottom-4 z-40 grid gap-3 rounded-[8px] border border-[#f8f5ef]/42 bg-[#120d0a]/46 p-4 shadow-[0_22px_74px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-[14px] sm:inset-x-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-[#efe4c4] [text-shadow:0_2px_12px_rgba(0,0,0,0.28)]">
            Luxury Interior Studio
          </p>
          <p className="mt-1 text-[1rem] font-semibold text-[#fff8ec] [text-shadow:0_2px_12px_rgba(0,0,0,0.3)]">
            {activeArea}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {areaLabels.map((label) => (
            <span
              key={label}
              className={`h-1.5 w-9 rounded-full transition duration-500 ${
                label === activeArea ? "bg-[#d6b45f] shadow-[0_0_18px_rgba(214,180,95,0.4)]" : "bg-[#fff8ec]/28"
              }`}
            />
          ))}
        </div>
      </div>
    </Html>
  );
}
