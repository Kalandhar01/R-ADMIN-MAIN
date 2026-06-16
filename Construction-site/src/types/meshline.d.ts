import "@react-three/fiber";

declare module "meshline" {
  export const MeshLineGeometry: new (...args: never[]) => object;
  export const MeshLineMaterial: new (...args: never[]) => object;
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: Record<string, unknown>;
    meshLineMaterial: Record<string, unknown>;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: Record<string, unknown>;
      meshLineMaterial: Record<string, unknown>;
    }
  }
}
