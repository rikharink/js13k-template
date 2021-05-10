export function getWorker(source: string, options?: WorkerOptions): Worker {
  return new Worker(
    URL.createObjectURL(new Blob([source], { type: "text/javascript" })),
    options
  );
}

export function range(start: number, end: number) {
  return Array.from("x".repeat(end - start), (_, i) => start + i);
}
