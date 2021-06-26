import { UUIDV4 } from "../util";

type NodeId = UUIDV4;

export interface Node<T> {
    id: NodeId;
    value: T;
}

export abstract class Graph<T> {
    private _nodes: Array<Node<T>>;
    private _edges: Map<Node<T>, Array<Node<T>>>;

    constructor(nodes: Array<Node<T>>, edges: Map<Node<T>, Array<Node<T>>>) {
        this._nodes = nodes;
        this._edges = edges;
    }

    public neighbors(node: Node<T>): Array<Node<T>> {
        return this._edges.get(node) || [];
    }
}

export interface WeightedGraph<T> extends Graph<T> {
    cost: (from: Node<T>, to: Node<T>) => number;
}