export function getWorker(source: string, options?: WorkerOptions): Worker {
  return new Worker(
    URL.createObjectURL(new Blob([source], { type: "text/javascript" })),
    options
  );
}

export function range(start: number, end: number) {
  return Array.from("x".repeat(end - start), (_, i) => start + i);
}

export function swap<T>(arr: T[], i: number, j: number): void {
  [arr[j], arr[i]] = [arr[i], arr[j]];
}
