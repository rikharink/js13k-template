import { Identifiable } from "../mixins/identifiable";
import { swap, UUIDV4 } from "../util";

type PriorityNode<T> = {
    priority: number;
    value: T;
};

export class PriorityQueue<T extends { id: UUIDV4 }> {
    private _heap: Array<PriorityNode<T>> = [];

    public isEmpty(): boolean {
        return this.length == 0;
    }

    public peek(): T | null {
        return this.isEmpty() ? null : this._heap[0].value;
    }

    public get length(): number {
        return this._heap.length;
    }

    public contains(ele: T): boolean {
        return this._heap.findIndex((e) => e.value.id === ele.id) !== -1;
    }

    public insert(ele: T, priority: number) {
        this._heap.push({ priority: priority, value: ele });
        this.rebalance();
    }

    public insertOrUpdate(ele: T, priority: number) {
        const e = this._heap.find((e) => e.value.id === ele.id);
        if (e) {
            e.priority = priority;
            this.rebalance();
        } else {
            this.insert(ele, priority);
        }
    }

    public pop(): T | null {
        if (this.length == 0) {
            return null;
        }
        swap(this._heap, 0, this.length - 1);
        const item = this._heap.pop()!;
        let current = 0;
        while (this.hasLeft(current)) {
            let smallerChild = this.left(current)
            if (this.hasRight(current) && this._heap[this.right(current)].priority < this._heap[this.left(current)].priority) {
                smallerChild = this.right(current)
            }
            if (this._heap[smallerChild].priority > this._heap[current].priority) {
                break;
            }
            swap(this._heap, current, smallerChild)
            current = smallerChild
        }
        return item.value;
    }

    private rebalance(): void {
        let i = this.length - 1
        while (i > 0) {
            const p = this.parent(i)
            if (this._heap[p].priority < this._heap[i].priority) {
                break;
            }
            swap(this._heap, i, p);
            i = p
        }
    }

    private parent(i: number): number {
        return Math.floor((i - 1) / 2);
    }

    private left(i: number): number {
        return 2 * i + 1;
    }

    private right(i: number): number {
        return 2 * i + 2;
    }

    private hasLeft(i: number): boolean {
        return this.left(i) < this.length;
    }

    private hasRight(i: number): boolean {
        return this.right(i) < this.length;
    }
}