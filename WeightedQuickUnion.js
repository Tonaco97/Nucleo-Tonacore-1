"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeightedQuickUnion = void 0;
/**
 * WeightedQuickUnion
 * Disjoint Set Union (DSU) implementation with Path Compression.
 * Optimized for real-time tenant grouping with O(alpha(N)) complexity.
 */
class WeightedQuickUnion {
    constructor(n) {
        this.parent = new Int32Array(n).map((_, i) => i);
        this.size = new Int32Array(n).fill(1);
    }
    root(i) {
        while (i !== this.parent[i]) {
            this.parent[i] = this.parent[this.parent[i]];
            i = this.parent[i];
        }
        return i;
    }
    union(p, q) {
        const i = this.root(p);
        const j = this.root(q);
        if (i === j)
            return;
        if (this.size[i] < this.size[j]) {
            this.parent[i] = j;
            this.size[j] += this.size[i];
        }
        else {
            this.parent[j] = i;
            this.size[i] += this.size[j];
        }
    }
}
exports.WeightedQuickUnion = WeightedQuickUnion;
