export function getWorker(source: string, options?: WorkerOptions): Worker {
  return new Worker(
    URL.createObjectURL(new Blob([source], { type: "text/javascript" })),
    options
  );
}
