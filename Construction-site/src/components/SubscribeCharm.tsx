"use client";

import { Canvas, useFrame } from "@react-three/fiber";
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
import { Atom, X } from "lucide-react";
import {
  type Dispatch,
  type FormEvent,
  type RefObject,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import "./SubscribeCharm.css";

const CAMERA_Z = 20;
const FOV = 20;
const SHOW_DELAY_MS = 10_000;
const SUBSCRIBE_EXIT_MS = 3_200;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
type SubscribeStatus = "idle" | "loading" | "success" | "error";

type CharmRigidBody = RapierRigidBody & {
  lerped?: THREE.Vector3;
};

type CharmPhysicsDriverProps = {
  rootRef: RefObject<HTMLDivElement | null>;
  openSubscribePanel: () => void;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
};

function CharmPhysicsDriver({ rootRef, openSubscribePanel, setIsDragging }: CharmPhysicsDriverProps) {
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== "undefined" && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="subscribe-charm__physics" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, CAMERA_Z], fov: FOV }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), 0)}
      >
        <Physics gravity={[0, -40, 0]} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <CharmPhysicsRig rootRef={rootRef} openSubscribePanel={openSubscribePanel} setIsDragging={setIsDragging} />
        </Physics>
      </Canvas>
    </div>
  );
}

function CharmPhysicsRig({ rootRef, openSubscribePanel, setIsDragging }: CharmPhysicsDriverProps) {
  const fixed = useRef<CharmRigidBody>(null!);
  const j1 = useRef<CharmRigidBody>(null!);
  const j2 = useRef<CharmRigidBody>(null!);
  const j3 = useRef<CharmRigidBody>(null!);
  const card = useRef<CharmRigidBody>(null!);
  const dragPlane = useRef<THREE.Mesh | null>(null);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const [dragged, drag] = useState<false | THREE.Vector3>(false);

  const segmentProps = useMemo(
    () => ({
      type: "dynamic" as RigidBodyProps["type"],
      canSleep: true,
      colliders: false as const,
      angularDamping: 4,
      linearDamping: 4,
    }),
    [],
  );

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
    document.body.style.cursor = dragged ? "grabbing" : "";

    return () => {
      document.body.style.cursor = "";
    };
  }, [dragged]);

  useEffect(() => {
    return () => setIsDragging(false);
  }, [setIsDragging]);

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

    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current) return;

    [j1, j2].forEach((ref) => {
      if (!ref.current?.lerped) ref.current!.lerped = new THREE.Vector3().copy(ref.current!.translation());

      const clampedDistance = Math.max(0.1, Math.min(1, ref.current!.lerped.distanceTo(ref.current!.translation())));
      ref.current!.lerped.lerp(ref.current!.translation(), delta * clampedDistance * 50);
    });

    const root = rootRef.current;
    if (!root) return;

    const anchor = fixed.current.translation();
    const joint = j3.current.translation();
    const cardPosition = card.current.translation();
    const angularVelocity = card.current.angvel();
    const rootHeight = root.getBoundingClientRect().height || 300;
    const visibleWorldHeight = 2 * Math.tan(THREE.MathUtils.degToRad(FOV) / 2) * CAMERA_Z;
    const worldScale = rootHeight / visibleWorldHeight;
    const x = (joint.x - anchor.x) * worldScale;
    const y = (anchor.y - joint.y) * worldScale;
    const strapLength = Math.max(16, Math.hypot(x, y));
    const strapAngle = -THREE.MathUtils.radToDeg(Math.atan2(x, y));
    const cardTilt = THREE.MathUtils.radToDeg(Math.atan2(cardPosition.x - joint.x, joint.y - cardPosition.y));
    const bobRotate = clamp(cardTilt * 0.42 + angularVelocity.z * 2 + angularVelocity.y * 0.8, -16, 16);

    root.style.setProperty("--bob-x", `${x}px`);
    root.style.setProperty("--bob-y", `${y}px`);
    root.style.setProperty("--strap-angle", `${strapAngle}deg`);
    root.style.setProperty("--strap-length", `${strapLength}px`);
    root.style.setProperty("--bob-rotate", `${bobRotate}deg`);
  });

  const stopDrag = (pointerId: number, shouldOpenSubscribe = false) => {
    drag(false);
    setIsDragging(false);

    const target = dragPlane.current as unknown as { releasePointerCapture?: (id: number) => void };
    target.releasePointerCapture?.(pointerId);

    if (shouldOpenSubscribe) {
      openSubscribePanel();
    }
  };

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type={"fixed" as RigidBodyProps["type"]} />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? ("kinematicPosition" as RigidBodyProps["type"]) : ("dynamic" as RigidBodyProps["type"])}
        >
          <CuboidCollider args={[0.72, 0.96, 0.08]} />
        </RigidBody>
      </group>
      <mesh
        ref={dragPlane}
        position={[0, 0, 0]}
        onPointerCancel={(event) => stopDrag(event.pointerId)}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;

          event.stopPropagation();
          const target = event.target as unknown as { setPointerCapture: (id: number) => void };
          target.setPointerCapture(event.pointerId);
          [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
          if (card.current) drag(new THREE.Vector3().copy(event.point).sub(vec.copy(card.current.translation())));
          setIsDragging(true);
        }}
        onPointerLeave={() => {
          if (!dragged) document.body.style.cursor = "";
        }}
        onPointerOver={() => {
          if (!dragged) document.body.style.cursor = "grab";
        }}
        onPointerUp={(event) => stopDrag(event.pointerId, true)}
      >
        <planeGeometry args={[10, 14]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}

export default function SubscribeCharm() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dismissTimerRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<SubscribeStatus>("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const showTimer = window.setTimeout(() => setIsVisible(true), SHOW_DELAY_MS);

    return () => {
      window.clearTimeout(showTimer);
      if (dismissTimerRef.current !== null) {
        window.clearTimeout(dismissTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll('[aria-label="Ractysh construction circular gallery"], footer'),
    );

    if (!targets.length || !("IntersectionObserver" in window)) return;

    const visibleTargets = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.12) {
            visibleTargets.add(entry.target);
          } else {
            visibleTargets.delete(entry.target);
          }
        });
        setIsFooterVisible(visibleTargets.size > 0);
      },
      { threshold: [0, 0.12, 0.3] },
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  const openSubscribePanel = () => {
    if (isDismissed || isDismissing || isSubscribeOpen) return;

    setIsSubscribeOpen(true);
  };

  const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const website = String(formData.get("website") || "");

    setSubscribeStatus("loading");
    setSubscribeMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          website,
        }),
      });
      const result = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(result?.message || "Unable to subscribe right now.");
      }

      setIsSubscribed(true);
      setSubscribeStatus("success");
      setSubscribeMessage(result?.message || "Subscribed. Please check your inbox.");
      setIsDismissing(true);

      if (dismissTimerRef.current !== null) {
        window.clearTimeout(dismissTimerRef.current);
      }

      dismissTimerRef.current = window.setTimeout(() => {
        setIsDismissed(true);
        setIsSubscribeOpen(false);
        setIsDismissing(false);
      }, SUBSCRIBE_EXIT_MS);
    } catch (error) {
      setIsSubscribed(false);
      setSubscribeStatus("error");
      setSubscribeMessage(error instanceof Error ? error.message : "Unable to subscribe right now.");
    }
  };

  return (
    <div
      ref={rootRef}
      className={`subscribe-charm${isVisible ? " is-visible" : ""}${
        isSubscribeOpen ? " is-subscribe-open" : ""
      }${isDismissing ? " is-dismissing" : ""}${isDismissed ? " is-dismissed" : ""}${
        isDragging ? " is-dragging" : ""
      }${isFooterVisible ? " is-footer-hidden" : ""}`}
      aria-hidden={!isVisible || isDismissed}
      aria-label="Draggable subscribe charm"
      onPointerUpCapture={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest(".subscribe-charm__subscribe-drop")) return;
        if (isVisible) openSubscribePanel();
      }}
    >
      <div className="subscribe-charm__visual">
        {isVisible && !isDismissed ? (
          <CharmPhysicsDriver
            rootRef={rootRef}
            openSubscribePanel={openSubscribePanel}
            setIsDragging={setIsDragging}
          />
        ) : null}
        <div className="subscribe-charm__strap">
          <Atom className="subscribe-charm__strap-icon" strokeWidth={3} />
          <Atom className="subscribe-charm__strap-icon" strokeWidth={3} />
        </div>
        <div className="subscribe-charm__bob">
          <div className="subscribe-charm__ring" />
          <div className="subscribe-charm__hook" />
          <div className="subscribe-charm__card">
            <span>subscribe</span>
          </div>
        </div>
      </div>
      {isSubscribeOpen ? (
        <form className="subscribe-charm__subscribe-drop" onSubmit={handleSubscribe}>
          <input
            aria-hidden="true"
            autoComplete="off"
            className="subscribe-charm__honeypot"
            name="website"
            tabIndex={-1}
            type="text"
          />
          <div className="subscribe-charm__subscribe-strap">
            <Atom className="subscribe-charm__strap-icon" strokeWidth={3} />
            <Atom className="subscribe-charm__strap-icon" strokeWidth={3} />
          </div>
          <div className="subscribe-charm__subscribe-bob">
            <div className="subscribe-charm__subscribe-ring" />
            <div className="subscribe-charm__subscribe-hook" />
            <div className="subscribe-charm__subscribe-card">
              <button
                aria-label="Close subscribe form"
                className="subscribe-charm__panel-close"
                type="button"
                onClick={() => setIsSubscribeOpen(false)}
              >
                <X aria-hidden="true" size={13} strokeWidth={2.6} />
              </button>
              <div className="subscribe-charm__panel-copy">
                <strong>Ractysh project desk</strong>
                <span>
                  {subscribeStatus === "loading"
                    ? "Sending confirmation..."
                    : isSubscribed
                      ? "You are subscribed."
                      : "Get project-control notes."}
                </span>
              </div>
              <label className="subscribe-charm__field">
                <span>Email ID</span>
                <input
                  disabled={subscribeStatus === "loading" || isSubscribed}
                  required
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setIsSubscribed(false);
                    setSubscribeStatus("idle");
                    setSubscribeMessage("");
                  }}
                />
              </label>
              {subscribeMessage ? (
                <p
                  className={`subscribe-charm__message${
                    subscribeStatus === "error" ? " is-error" : " is-success"
                  }`}
                  role="status"
                >
                  {subscribeMessage}
                </p>
              ) : null}
              <button
                className="subscribe-charm__submit"
                disabled={subscribeStatus === "loading" || isSubscribed}
                type="submit"
              >
                {subscribeStatus === "loading" ? "Sending" : isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            </div>
          </div>
        </form>
      ) : null}
    </div>
  );
}
