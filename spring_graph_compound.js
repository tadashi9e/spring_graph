"use strict";
// -*- mode: javascript -*-
// ----------------------------------------------------------------------
// HorizontalCompoundConstraint
//   Constraint the position of nodes horizontally with a center alignment.
//
// VerticalCompoundConstraint
//   Constraint the position of nodes vertically with a center alignment.
// ----------------------------------------------------------------------
/**
 * Constraint the position of nodes horizontally with a center alignment.
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
 * Constraint the position of nodes vertically with a center alignment.
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
