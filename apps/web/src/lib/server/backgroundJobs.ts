type BackgroundJobDetails = Record<string, unknown>;

function shouldLogPerformance(): boolean {
  return process.env.NODE_ENV !== "production";
}

export function elapsedMs(startedAt: number): number {
  return Math.round(performance.now() - startedAt);
}

export function logSubmissionTiming(
  flow: string,
  timings: Record<string, number | string | boolean | undefined>
): void {
  if (!shouldLogPerformance()) return;

  console.info(`[perf:${flow}]`, timings);
}

export function runBackgroundJob(
  name: string,
  job: () => Promise<void>,
  details: BackgroundJobDetails = {}
): void {
  setTimeout(() => {
    const startedAt = performance.now();

    void job()
      .then(() => {
        if (!shouldLogPerformance()) return;
        console.info(`[background:${name}] completed`, {
          ...details,
          durationMs: elapsedMs(startedAt)
        });
      })
      .catch((error) => {
        console.error(`[background:${name}] failed`, {
          ...details,
          durationMs: elapsedMs(startedAt),
          error: error instanceof Error ? error.message : String(error)
        });
      });
  }, 0);
}
