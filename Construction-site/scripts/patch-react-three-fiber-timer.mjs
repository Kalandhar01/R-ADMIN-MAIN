import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

const timerClockShim = (threeNamespace) => `const createTimerClock = () => {
  let timer = new ${threeNamespace}.Timer();
  const connectTimer = () => {
    if (typeof document !== 'undefined') timer.connect(document);
  };
  connectTimer();
  return {
    autoStart: true,
    startTime: 0,
    oldTime: 0,
    elapsedTime: 0,
    running: false,
    start() {
      timer.dispose();
      timer = new ${threeNamespace}.Timer();
      connectTimer();
      this.startTime = performance.now();
      this.oldTime = this.startTime;
      this.elapsedTime = 0;
      this.running = true;
    },
    stop() {
      this.getElapsedTime();
      this.running = false;
      this.autoStart = false;
    },
    getElapsedTime() {
      this.getDelta();
      return this.elapsedTime;
    },
    getDelta(timestamp) {
      let diff = 0;
      if (this.autoStart && !this.running) {
        this.start();
        return 0;
      }
      if (this.running) {
        timer.update(timestamp);
        diff = timer.getDelta();
        this.oldTime = performance.now();
        this.elapsedTime += diff;
      }
      return diff;
    },
    dispose() {
      timer.dispose();
    }
  };
};
`;

const patches = [
  {
    file: "node_modules/@react-three/fiber/dist/events-b389eeca.esm.js",
    context: "const context = /* @__PURE__ */React.createContext(null);",
    oldClock: "clock: new THREE.Clock(),",
    namespace: "THREE",
  },
  {
    file: "node_modules/@react-three/fiber/dist/events-f19bcc32.cjs.dev.js",
    context: "const context = /* @__PURE__ */React__namespace.createContext(null);",
    oldClock: "clock: new THREE__namespace.Clock(),",
    namespace: "THREE__namespace",
  },
  {
    file: "node_modules/@react-three/fiber/dist/events-583399dd.cjs.prod.js",
    context: "const context = /* @__PURE__ */React__namespace.createContext(null);",
    oldClock: "clock: new THREE__namespace.Clock(),",
    namespace: "THREE__namespace",
  },
];

for (const patch of patches) {
  const filePath = join(rootDir, patch.file);
  if (!existsSync(filePath)) continue;

  let source = readFileSync(filePath, "utf8");
  const original = source;

  if (!source.includes("const createTimerClock = () =>")) {
    source = source.replace(`${patch.context}\n`, `${patch.context}\n${timerClockShim(patch.namespace)}`);
  }

  source = source
    .replace(patch.oldClock, "clock: createTimerClock(),")
    .replace("let delta = state.clock.getDelta();", "let delta = state.clock.getDelta(timestamp);");

  if (source !== original) writeFileSync(filePath, source);
}
