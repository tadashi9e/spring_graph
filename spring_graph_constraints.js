"use strict";
// -*- mode: javascript -*-
// ----------------------------------------------------------------------
// class FieldConstraint
//    Keeps nodes within the visible display area.
//
// PinningConstraint
//    Pins the display position of specific nodes.
//
// HorizontalCompoundConstraint
//    Aligns nodes horizontally to present them as a cohesive group.
//
// VerticalCompoundConstraint
//    Aligns nodes vertically to present them as a cohesive group.
//
// HorizontalConstraint
//    Applies horizontal repulsion between nodes.
//
// VerticalConstraint
//    Applies vertical repulsion between nodes.
// ----------------------------------------------------------------------
/**
 * Keeps nodes within the visible display area.
 */
class FieldConstraint extends SConstraint {
    /**
     * @param margin  Margin value.
     */
    constructor(margin) {
        super();
        this.margin = margin;
    }
    /**
     * Apply constraint to all existing nodes.
     */
    apply_constraint() {
        const svg = document.querySelector('svg');
        if (svg == null) {
            throw new Error("invalid svg container");
        }
        const width = svg.getBoundingClientRect().width;
        const height = svg.getBoundingClientRect().height;
        for (const node of _NODES_MAP.values()) {
            if (node.x < this.margin) {
                node.x = this.margin;
            }
            if (node.y < this.margin) {
                node.y = this.margin;
            }
            if (node.x > width - this.margin) {
                node.x = width - this.margin;
            }
            if (node.y > height - this.margin) {
                node.y = height - this.margin;
            }
        }
    }
}
/**
 * Pins the display position of specific nodes.
 */
class PinningConstraint extends SConstraint {
    /**
     * @param node  Target node.
     * @param x_percent  Pinning position-x.
     * @param y_percent  Pinning position-y.
     */
    constructor(node, x_percent, y_percent) {
        super();
        this._node = node;
        this._x_percent = x_percent;
        this._y_percent = y_percent;
    }
    /**
     * Apply constraint to owned nodes.
     */
    apply_constraint() {
        const svg = document.querySelector('svg');
        if (svg == null) {
            throw new Error("invalid svg container");
        }
        const width = svg.getBoundingClientRect().width;
        const height = svg.getBoundingClientRect().height;
        this._node.x = width * (this._x_percent / 100);
        this._node.y = height * (this._y_percent / 100);
        this._node.mx = 0;
        this._node.my = 0;
        this._node.fx = 0;
        this._node.fy = 0;
    }
}
/**
 * Aligns nodes horizontally to present them as a cohesive group.
 */
class HorizontalCompoundConstraint extends SConstraint {
    /**
     * @param nodes  Array of nodes.
     */
    constructor(nodes) {
        super();
        this._nodes = nodes;
    }
    /**
     * Apply constraint to owned nodes.
     */
    apply_constraint() {
        let sum_width = 0;
        let sum_x = 0;
        let sum_y = 0;
        let sum_mx = 0;
        let sum_my = 0;
        let sum_fx = 0;
        let sum_fy = 0;
        for (const node of this._nodes) {
            const bbox = node.getBBox();
            sum_width += bbox.width;
            sum_x += node.x;
            sum_y += node.y;
            sum_mx += node.mx;
            sum_my += node.my;
            sum_fx += node.fx;
            sum_fy += node.fy;
        }
        let x = (sum_x - sum_width / 2) / this._nodes.length;
        const y = sum_y / this._nodes.length;
        const mx = sum_mx / this._nodes.length;
        const my = sum_my / this._nodes.length;
        const fx = sum_fx / this._nodes.length;
        const fy = sum_fy / this._nodes.length;
        for (const node of this._nodes) {
            node.x = x;
            node.y = y;
            node.mx = mx;
            node.my = my;
            node.fx = fx;
            node.fy = fy;
            const bbox = node.getBBox();
            x += bbox.width;
        }
    }
}
/**
 * Aligns nodes vertically to present them as a cohesive group.
 */
class VerticalCompoundConstraint extends SConstraint {
    /**
     * @param nodes  Array of nodes.
     */
    constructor(nodes) {
        super();
        this._nodes = nodes;
    }
    /**
     * Apply constraint to owned nodes.
     */
    apply_constraint() {
        let sum_height = 0;
        let sum_x = 0;
        let sum_y = 0;
        let sum_mx = 0;
        let sum_my = 0;
        let sum_fx = 0;
        let sum_fy = 0;
        for (const node of this._nodes) {
            const bbox = node.getBBox();
            sum_height += bbox.height;
            sum_x += node.x;
            sum_y += node.y;
            sum_mx += node.mx;
            sum_my += node.my;
            sum_fx += node.fx;
            sum_fy += node.fy;
        }
        const x = sum_x / this._nodes.length;
        let y = (sum_y - sum_height / 2) / this._nodes.length;
        const mx = sum_mx / this._nodes.length;
        const my = sum_my / this._nodes.length;
        const fx = sum_fx / this._nodes.length;
        const fy = sum_fy / this._nodes.length;
        for (const node of this._nodes) {
            node.x = x;
            node.y = y;
            node.mx = mx;
            node.my = my;
            node.fx = fx;
            node.fy = fy;
            const bbox = node.getBBox();
            y += bbox.height;
        }
    }
}
/**
 * Applies horizontal repulsion between nodes.
 */
class HorizontalConstraint extends SConstraint {
    /**
     * @param left  Left push target node.
     * @param right  Right push target node.
     * @param df  Push force.
     */
    constructor(left, right, df) {
        super();
        this._left = left;
        this._right = right;
        if (df === undefined) {
            df = 100;
        }
        this._df = df;
    }
    /**
     * Apply constraint to owned nodes.
     */
    apply_constraint() {
        this._left.fx -= this._df;
        this._right.fx += this._df;
    }
}
/**
 * Applies vertical repulsion between nodes.
 */
class VerticalConstraint extends SConstraint {
    /**
     * @param down  Push down target node.
     * @param up  Push up target node.
     * @param df  Push up/down force.
     */
    constructor(down, up, df) {
        super();
        this._down = down;
        this._up = up;
        if (df === undefined) {
            df = 100;
        }
        this._df = df;
    }
    /**
     * Apply constraint to owned nodes.
     */
    apply_constraint() {
        this._up.fy -= this._df;
        this._down.fy += this._df;
    }
}
