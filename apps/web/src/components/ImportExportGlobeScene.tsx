"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AdaptiveDpr, Environment, OrbitControls, PerspectiveCamera, Preload } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import ThreeGlobe from "three-globe";
import * as THREE from "three";

interface TradeStop {
  id: string;
  lat: number;
  lng: number;
  color: string;
}

interface TradeArc {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  altitude: number;
  order: number;
  colors: string[];
  particleColor: string;
}

interface CountryGeoJsonFeature {
  properties?: {
    ISO_A2?: string;
  };
  geometry?: unknown;
}

interface CountryGeoJson {
  features?: CountryGeoJsonFeature[];
}

const globeScale = 0.0146;
const mobileGlobeScale = globeScale * 0.92;
const globeRadius = 100;
const countryGeoJsonUrl = "/data/world-countries.geojson";
const gold = "#D8B56D";
const goldSoft = "#F1D58D";
const burgundy = "#8B1118";
const routeCountryCodes = new Set(["IN", "AE", "SG", "MY", "NL", "KE"]);

const tradeStops: TradeStop[] = [
  { id: "india", lat: 19.076, lng: 72.8777, color: goldSoft },
  { id: "uae", lat: 25.2048, lng: 55.2708, color: burgundy },
  { id: "singapore", lat: 1.3521, lng: 103.8198, color: gold },
  { id: "malaysia", lat: 3.139, lng: 101.6869, color: gold },
  { id: "europe", lat: 51.9244, lng: 4.4777, color: burgundy },
  { id: "africa", lat: -4.0435, lng: 39.6682, color: gold }
];

const tradeArcs: TradeArc[] = tradeStops.slice(1).map((stop, index) => {
  const start = tradeStops[index];
  const burgundyHighlight = index === 0 || index === 3;

  return {
    id: `${start.id}-${stop.id}`,
    startLat: start.lat,
    startLng: start.lng,
    endLat: stop.lat,
    endLng: stop.lng,
    altitude: [0.14, 0.2, 0.1, 0.34, 0.22][index],
    order: index,
    colors: burgundyHighlight ? [goldSoft, burgundy, gold] : [goldSoft, gold, "#B88A44"],
    particleColor: burgundyHighlight ? burgundy : goldSoft
  };
});

export default function ImportExportGlobeScene() {
  const isMobile = useMobileGlobeLayout();

  return (
    <Canvas
      className="absolute inset-0 h-full w-full"
      dpr={[1, 1.35]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      performance={{ min: 0.66 }}
    >
      <Suspense fallback={null}>
        <PerspectiveCamera
          makeDefault
          position={isMobile ? [0, 0.06, 6.28] : [0.1, 0.08, 5.86]}
          fov={isMobile ? 36 : 34}
          near={0.1}
          far={34}
        />
        <ambientLight intensity={0.34} />
        <directionalLight color="#fff2d4" intensity={1.85} position={[4.6, 4.8, 5.2]} />
        <directionalLight color="#8B1118" intensity={0.5} position={[-3.8, 1.2, 2.6]} />
        <pointLight color="#D8B56D" intensity={1.1} position={[-2.8, 2.2, 3.4]} />
        <pointLight color="#fff8e6" intensity={0.52} position={[2.8, -1.5, 2.8]} />
        <Environment resolution={64}>
          <mesh>
            <sphereGeometry args={[12, 28, 16]} />
            <meshBasicMaterial color="#D8B56D" side={THREE.BackSide} transparent opacity={0.045} />
          </mesh>
        </Environment>
        <AceternityGlobalCommerceGlobe isMobile={isMobile} />
        <CameraOrbit isMobile={isMobile} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.24}
          minPolarAngle={Math.PI * 0.27}
          maxPolarAngle={Math.PI * 0.73}
        />
        <AdaptiveDpr pixelated />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

function useMobileGlobeLayout() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const updateMobileState = () => setIsMobile(media.matches);

    updateMobileState();
    media.addEventListener("change", updateMobileState);

    return () => media.removeEventListener("change", updateMobileState);
  }, []);

  return isMobile;
}

function AceternityGlobalCommerceGlobe({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const globe = useMemo(() => {
    const globeTexture = createMetallicTradeTexture();
    const material = new THREE.MeshPhysicalMaterial({
      map: globeTexture,
      color: "#1a1712",
      roughness: 0.32,
      metalness: 0.58,
      clearcoat: 0.72,
      clearcoatRoughness: 0.18,
      emissive: "#070605",
      emissiveIntensity: 0.18
    });

    return new ThreeGlobe({ waitForGlobeReady: false, animateIn: false })
      .globeMaterial(material)
      .globeCurvatureResolution(6)
      .showAtmosphere(true)
      .atmosphereColor("#D8B56D")
      .atmosphereAltitude(0.16)
      .hexPolygonsData([])
      .hexPolygonGeoJsonGeometry("geometry")
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.31)
      .hexPolygonUseDots(false)
      .hexPolygonColor((feature) => {
        const code = (feature as CountryGeoJsonFeature).properties?.ISO_A2;
        return routeCountryCodes.has(code ?? "") ? "rgba(139, 17, 24, 0.88)" : "rgba(216, 181, 109, 0.78)";
      })
      .hexPolygonAltitude((feature) => {
        const code = (feature as CountryGeoJsonFeature).properties?.ISO_A2;
        return routeCountryCodes.has(code ?? "") ? 0.0105 : 0.0048;
      })
      .hexPolygonCurvatureResolution(4)
      .hexPolygonsTransitionDuration(900)
      .arcsData([])
      .arcStartLat("startLat")
      .arcStartLng("startLng")
      .arcEndLat("endLat")
      .arcEndLng("endLng")
      .arcAltitude("altitude")
      .arcColor("colors")
      .arcStroke(0.58)
      .arcCurveResolution(72)
      .arcCircularResolution(7)
      .arcDashLength(0.62)
      .arcDashGap(0.96)
      .arcDashInitialGap((arc) => ((arc as TradeArc).order + 1) * 0.25)
      .arcDashAnimateTime(5600)
      .arcsTransitionDuration(1100)
      .pointsData([])
      .pointLat("lat")
      .pointLng("lng")
      .pointColor("color")
      .pointAltitude(0.018)
      .pointRadius(0.36)
      .pointResolution(22)
      .pointsMerge(false)
      .pointsTransitionDuration(900)
      .ringsData([])
      .ringLat("lat")
      .ringLng("lng")
      .ringAltitude(0.02)
      .ringColor(() => (progress: number) => `rgba(216,181,109,${Math.max(0, 0.46 - progress * 0.46)})`)
      .ringMaxRadius(1.7)
      .ringPropagationSpeed(0.38)
      .ringRepeatPeriod(2200);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void fetch(countryGeoJsonUrl)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: CountryGeoJson | null) => {
        if (cancelled || !data?.features) return;

        globe.hexPolygonsData(data.features.filter((feature) => feature.properties?.ISO_A2 !== "AQ") as unknown as object[]);
      })
      .catch(() => {
        if (!cancelled) globe.hexPolygonsData([]);
      });

    const revealRoutes = gsap.delayedCall(0.85, () => {
      globe
        .arcsData(tradeArcs as unknown as object[])
        .pointsData(tradeStops as unknown as object[])
        .ringsData(tradeStops as unknown as object[]);
    });

    return () => {
      cancelled = true;
      revealRoutes.kill();
      globe._destructor();
    };
  }, [globe]);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;

    const scrollProgress = typeof window === "undefined" ? 0 : THREE.MathUtils.clamp(window.scrollY / 1000, 0, 1);
    groupRef.current.rotation.y += delta * 0.018;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      0.075 + scrollProgress * 0.045 + Math.sin(clock.elapsedTime * 0.14) * 0.015,
      0.03
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -0.035 + Math.sin(clock.elapsedTime * 0.1) * 0.01, 0.025);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -0.02 + scrollProgress * 0.04, 0.034);
  });

  return (
    <group ref={groupRef} scale={isMobile ? mobileGlobeScale : globeScale} rotation={[0.08, -0.74, -0.035]}>
      <primitive object={globe} />
      {tradeArcs.map((route) => (
        <MovingRoutePulse key={route.id} route={route} />
      ))}
      {tradeStops.map((point, index) => (
        <DestinationPulse key={point.id} point={point} delay={index * 0.28} />
      ))}
    </group>
  );
}

function MovingRoutePulse({ route }: { route: TradeArc }) {
  const cargoRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        createArcPoints([route.startLat, route.startLng], [route.endLat, route.endLng], globeRadius * 1.02, route.altitude)
      ),
    [route]
  );

  useFrame(({ clock }) => {
    const progress = (clock.elapsedTime * 0.05 + route.order * 0.17) % 1;
    const point = curve.getPointAt(progress);

    cargoRef.current?.position.copy(point);

    if (glowRef.current) {
      glowRef.current.position.copy(point);
      glowRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 1.9 + route.order) * 0.16);
    }
  });

  return (
    <>
      <mesh ref={glowRef}>
        <sphereGeometry args={[5.4, 24, 12]} />
        <meshBasicMaterial color={route.particleColor} transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={cargoRef}>
        <sphereGeometry args={[1.78, 24, 12]} />
        <meshStandardMaterial color={route.particleColor} emissive={route.particleColor} emissiveIntensity={0.54} roughness={0.22} metalness={0.34} />
      </mesh>
    </>
  );
}

function DestinationPulse({ point, delay }: { point: TradeStop; delay: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const position = useMemo(() => latLngToVector(point.lat, point.lng, globeRadius * 1.035), [point]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    groupRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 1.75 + delay) * 0.18);
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[2.2, 22, 10]} />
        <meshStandardMaterial color={point.color} emissive={point.color} emissiveIntensity={0.52} roughness={0.2} metalness={0.34} />
      </mesh>
      <mesh>
        <sphereGeometry args={[6.1, 22, 10]} />
        <meshBasicMaterial color={point.color} transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

function CameraOrbit({ isMobile }: { isMobile: boolean }) {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame(({ clock }) => {
    const scrollProgress = typeof window === "undefined" ? 0 : THREE.MathUtils.clamp(window.scrollY / 1000, 0, 1);
    const desired = new THREE.Vector3(
      isMobile ? 0 : pointer.x * 0.15 + Math.sin(clock.elapsedTime * 0.12) * 0.05,
      (isMobile ? 0.06 : 0.08) + pointer.y * (isMobile ? 0.035 : 0.08) + scrollProgress * 0.07,
      (isMobile ? 6.28 : 5.86) - scrollProgress * 0.12
    );

    camera.position.lerp(desired, 0.024);
    camera.lookAt(target);
  });

  return null;
}

function createArcPoints(from: [number, number], to: [number, number], radius: number, altitudeRatio: number) {
  const start = latLngToVector(from[0], from[1], radius).normalize();
  const end = latLngToVector(to[0], to[1], radius).normalize();
  const points: THREE.Vector3[] = [];

  for (let index = 0; index <= 76; index += 1) {
    const progress = index / 76;
    const direction = start.clone().lerp(end, progress).normalize();
    const height = radius * (1 + Math.sin(progress * Math.PI) * altitudeRatio);
    points.push(direction.multiplyScalar(height));
  }

  return points;
}

function latLngToVector(lat: number, lng: number, radius: number) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lng + 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function createMetallicTradeTexture() {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture(canvas);

  const ocean = ctx.createLinearGradient(0, 0, width, height);
  ocean.addColorStop(0, "#0e0d0b");
  ocean.addColorStop(0.42, "#1b1711");
  ocean.addColorStop(0.74, "#2a2116");
  ocean.addColorStop(1, "#11100e");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(216, 181, 109, 0.14)";
  ctx.lineWidth = 1;
  for (let longitude = -150; longitude <= 180; longitude += 30) {
    const [x] = projectToTexture(longitude, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let latitude = -60; latitude <= 60; latitude += 30) {
    const [, y] = projectToTexture(0, latitude, width, height);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  tradeArcs.forEach((route) => {
    const [sx, sy] = projectToTexture(route.startLng, route.startLat, width, height);
    const [ex, ey] = projectToTexture(route.endLng, route.endLat, width, height);
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo((sx + ex) / 2, Math.min(sy, ey) - 42 - route.order * 5, ex, ey);
    ctx.strokeStyle = route.order === 0 || route.order === 3 ? "rgba(139, 17, 24, 0.42)" : "rgba(216, 181, 109, 0.34)";
    ctx.lineWidth = route.order === 0 || route.order === 3 ? 2.4 : 1.6;
    ctx.stroke();
  });

  tradeStops.forEach((stop) => {
    const [x, y] = projectToTexture(stop.lng, stop.lat, width, height);
    ctx.fillStyle = stop.color;
    ctx.beginPath();
    ctx.arc(x, y, 4.4, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;

  return texture;
}

function projectToTexture(lng: number, lat: number, width: number, height: number) {
  return [((lng + 180) / 360) * width, ((90 - lat) / 180) * height];
}
