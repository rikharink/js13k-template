import { PriorityQueue } from "../datastructures/priority-queue";
import { Node, WeightedGraph } from "../datastructures/graph";

type RouteMap<T> = Map<Node<T>, Node<T> | null>;

export function reconstructPath<T>(cameFrom: RouteMap<T>, from: Node<T>, to: Node<T>): Array<Node<T>> {
    let current = to;
    let path = new Array<Node<T>>();
    while (current !== from) {
        path.push(current);
        current = cameFrom.get(current)!;
    }
    path.push(from);
    path.reverse();
    return path;
}

export function dijkstra<T>(graph: WeightedGraph<T>, from: Node<T>, to: Node<T>): Array<Node<T>> | null {
    return aStar(graph, from, to, (_n, _g) => 0);
}

export function aStar<T>(graph: WeightedGraph<T>, from: Node<T>, to: Node<T>, h: (from: Node<T>, to: Node<T>) => number): Array<Node<T>> | null {
    let frontier = new PriorityQueue<Node<T>>();
    frontier.insert(from, 0);
    let cameFrom = new Map<Node<T>, Node<T> | null>();
    let currentCost = new Map<Node<T>, number>();
    cameFrom.set(from, null);
    currentCost.set(from, 0);
    while (!frontier.isEmpty()) {
        let current = frontier.pop()!;
        if (current.id === to.id) {
            return reconstructPath(cameFrom, from, to);
        }
        for (let next of graph.neighbors(current)) {
            let cost = currentCost.get(next)! + graph.cost(current, next);
            if (cost < (currentCost.get(next) || Number.POSITIVE_INFINITY)) {
                currentCost.set(next, cost);
                let priority = cost + h(next, to);
                frontier.insert(next, priority);
                cameFrom.set(next, current);
            }
        }
    }
    return null;
}