import { UUIDV4 } from "../util";

export type Location = UUIDV4;

export abstract class Graph {
    private _nodes: Array<Location>;
    private _edges: Map<Location, Array<Location>>;

    constructor(nodes: Array<Location>, edges: Map<Location, Array<Location>>) {
        this._nodes = nodes;
        this._edges = edges;
    }

    public neighbors(node: Location): Array<Location> {
        return this._edges.get(node) || [];
    }
}

export interface WeightedGraph extends Graph {
    cost: (from: Location, to: Location) => number;
}