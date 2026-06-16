"use client";

import { Environment, Lightformer, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  type RigidBodyProps,
  type RapierRigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import "./Lanyard.css";

extend({ MeshLineGeometry, MeshLineMaterial });

const CARD_GLB = "/assets/lanyard/card.glb";
const LANYARD_TEXTURE = "/assets/lanyard/lanyard.png";
const BLANK_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };
const DEFAULT_CHARM_LABEL = "subscribe";

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: "cover" | "contain";
  lanyardImage?: string | null;
  lanyardWidth?: number;
  className?: string;
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardImage = null,
  lanyardWidth = 1,
  className = "",
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== "undefined" && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`lanyard-wrapper${className ? ` ${className}` : ""}`}>
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            lanyardImage={lanyardImage}
            lanyardWidth={lanyardWidth}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: "cover" | "contain";
  lanyardImage?: string | null;
  lanyardWidth?: number;
}

type LanyardRigidBody = RapierRigidBody & { lerped?: THREE.Vector3 };

type CardGLTF = {
  nodes: {
    card: THREE.Mesh<THREE.BufferGeometry>;
    clip: THREE.Mesh<THREE.BufferGeometry>;
    clamp: THREE.Mesh<THREE.BufferGeometry>;
  };
  materials: {
    base: THREE.MeshStandardMaterial;
    metal: THREE.MeshStandardMaterial;
  };
};

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = "cover",
  lanyardImage = null,
  lanyardWidth = 1,
}: BandProps) {
  const band = useRef<THREE.Mesh | null>(null);
  const connector = useRef<THREE.Mesh | null>(null);
  const fixed = useRef<LanyardRigidBody>(null!);
  const j1 = useRef<LanyardRigidBody>(null!);
  const j2 = useRef<LanyardRigidBody>(null!);
  const j3 = useRef<LanyardRigidBody>(null!);
  const card = useRef<LanyardRigidBody>(null!);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const cardAnchor = useMemo(() => new THREE.Vector3(0, 1.45, 0), []);
  const cardAnchorWorld = useMemo(() => new THREE.Vector3(), []);
  const connectorAnchorWorld = useMemo(() => new THREE.Vector3(), []);
  const cardRotation = useMemo(() => new THREE.Quaternion(), []);

  const segmentProps = {
    type: "dynamic" as RigidBodyProps["type"],
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(CARD_GLB) as unknown as CardGLTF;
  const rawBandTexture = useTexture(lanyardImage || LANYARD_TEXTURE);
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  const texture = useMemo(() => {
    const cloned = rawBandTexture.clone();
    cloned.wrapS = THREE.RepeatWrapping;
    cloned.wrapT = THREE.RepeatWrapping;
    cloned.needsUpdate = true;
    return cloned;
  }, [rawBandTexture]);

  const cardMap = useMemo(() => {
    const baseMap = materials.base.map;

    const baseImg = baseMap?.image as CanvasImageSource & { width?: number; height?: number };
    const width = Number(baseImg?.width) || 1024;
    const height = Number(baseImg?.height) || 1024;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return baseMap ?? null;

    if (baseImg) {
      ctx.drawImage(baseImg, 0, 0, width, height);
    } else {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);
    }

    const getImageSize = (img: CanvasImageSource, dimension: "width" | "height") => {
      const source = img as unknown as {
        naturalWidth?: number;
        naturalHeight?: number;
        videoWidth?: number;
        videoHeight?: number;
        width?: number;
        height?: number;
      };

      return dimension === "width"
        ? source.naturalWidth ?? source.videoWidth ?? source.width ?? 1
        : source.naturalHeight ?? source.videoHeight ?? source.height ?? 1;
    };

    const drawFitted = (img: CanvasImageSource, rect: typeof FRONT_UV_RECT) => {
      const iw = getImageSize(img, "width");
      const ih = getImageSize(img, "height");
      const rx = rect.x * width;
      const ry = rect.y * height;
      const rw = rect.w * width;
      const rh = rect.h * height;
      const pick = imageFit === "contain" ? Math.min : Math.max;
      const scale = pick(rw / iw, rh / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    const drawFittedText = (text: string, maxWidth: number, startSize: number, minSize: number) => {
      let size = startSize;
      do {
        ctx.font = `800 ${size}px Arial, sans-serif`;
        size -= 2;
      } while (ctx.measureText(text).width > maxWidth && size >= minSize);
    };

    const drawDefaultFace = (rect: typeof FRONT_UV_RECT, showLabel = false) => {
      const rx = rect.x * width;
      const ry = rect.y * height;
      const rw = rect.w * width;
      const rh = rect.h * height;
      const padX = rw * 0.14;

      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.fillStyle = "#000000";
      ctx.fillRect(rx, ry, rw, rh);

      if (showLabel) {
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        drawFittedText(DEFAULT_CHARM_LABEL, rw - padX * 1.4, width * 0.088, width * 0.04);
        ctx.fillText(DEFAULT_CHARM_LABEL, rx + rw / 2, ry + rh / 2);
      }

      ctx.restore();
    };

    if (frontImage && frontTex.image) {
      drawFitted(frontTex.image as CanvasImageSource, FRONT_UV_RECT);
    } else {
      drawDefaultFace(FRONT_UV_RECT, true);
    }
    if (backImage && backTex.image) {
      drawFitted(backTex.image as CanvasImageSource, BACK_UV_RECT);
    } else {
      drawDefaultFace(BACK_UV_RECT);
    }

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    if (baseMap) composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);

  const curve = useMemo(() => {
    const nextCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    nextCurve.curveType = "chordal";
    return nextCurve;
  }, []);
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [
    [0, 0, 0],
    [0, 0, 0],
    1,
  ]);
  useRopeJoint(j1, j2, [
    [0, 0, 0],
    [0, 0, 0],
    1,
  ]);
  useRopeJoint(j2, j3, [
    [0, 0, 0],
    [0, 0, 0],
    1,
  ]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== "boolean") {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current?.lerped) ref.current!.lerped = new THREE.Vector3().copy(ref.current!.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current!.lerped.distanceTo(ref.current!.translation())));
        ref.current!.lerped.lerp(
          ref.current!.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
        );
      });
      const rotation = card.current.rotation();
      cardRotation.set(rotation.x, rotation.y, rotation.z, rotation.w);
      cardAnchorWorld.copy(cardAnchor).applyQuaternion(cardRotation).add(vec.copy(card.current.translation()));
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped!);
      curve.points[2].copy(j1.current.lerped!);
      curve.points[3].copy(fixed.current.translation());
      const mesh = band.current as THREE.Mesh & { geometry: { setPoints: (points: THREE.Vector3[]) => void } };
      mesh.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      const connectorMesh = connector.current as (THREE.Mesh & { geometry: { setPoints: (points: THREE.Vector3[]) => void } }) | null;
      connectorAnchorWorld.copy(j3.current.translation());
      connectorMesh?.geometry.setPoints([cardAnchorWorld, connectorAnchorWorld]);
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type={"fixed" as RigidBodyProps["type"]} />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type={"dynamic" as RigidBodyProps["type"]}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type={"dynamic" as RigidBodyProps["type"]}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type={"dynamic" as RigidBodyProps["type"]}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? ("kinematicPosition" as RigidBodyProps["type"]) : ("dynamic" as RigidBodyProps["type"])}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={1.55}
            position={[0, -0.83, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              const target = e.target as unknown as { releasePointerCapture: (pointerId: number) => void };
              target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              const target = e.target as unknown as { setPointerCapture: (pointerId: number) => void };
              target.setPointerCapture(e.pointerId);
              if (card.current) drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.2}
                roughness={0.84}
                metalness={0.62}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#7dd3fc"
          depthTest={false}
          visible={lanyardWidth > 0.05}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
      <mesh ref={connector}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#7dd3fc"
          depthTest={false}
          visible={lanyardWidth > 0.05}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          lineWidth={lanyardWidth * 1.05}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(CARD_GLB);
