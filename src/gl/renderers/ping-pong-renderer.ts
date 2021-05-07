import { Framebuffer } from "../framebuffer";

export function pingPong(
  initial: Framebuffer,
  alpha: Framebuffer,
  beta: Framebuffer,
  count: number,
  render: (source: Framebuffer, destination: Framebuffer) => Framebuffer
) {
  if (count === 0) {
    return initial;
  }
  if (initial === alpha) {
    alpha = beta;
    beta = initial;
  }
  render(initial, alpha);
  let i = 1;

  if (i === count) {
    return alpha;
  }

  while (true) {
    render(alpha, beta);
    i++;
    if (i === count) {
      return beta;
    }
    render(beta, alpha);
    i++;
    if (i === count) {
      return alpha;
    }
  }
}
