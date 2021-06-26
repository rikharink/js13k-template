import { PriorityQueue } from "../datastructures/priority-queue";
import {  Location, WeightedGraph } from "../datastructures/graph";

type RouteMap = Map<Location, Location | null>;
type Path = Array<Location>;
export function reconstructPath<T>(cameFrom: RouteMap, from: Location, to: Location): Path {
    let current = to;
    let path = new Array<Location>();
    while (current !== from) {
        path.push(current);
        current = cameFrom.get(current)!;
    }
    path.push(from);
    path.reverse();
    return path;
}

export function dijkstra<T>(graph: WeightedGraph, from: Location, to: Location): Path | null {
    return astar(graph, from, to, (_n, _g) => 0);
}

export function astar<T>(graph: WeightedGraph, from: Location, to: Location, h: (from: Location, to: Location) => number): Path | null {
    let frontier = new PriorityQueue<Location>();
    frontier.insert(from, 0);
    let cameFrom = new Map<Location, Location | null>();
    let currentCost = new Map<Location, number>();
    cameFrom.set(from, null);
    currentCost.set(from, 0);
    while (!frontier.isEmpty()) {
        let current = frontier.pop()!;
        if (current === to) {
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