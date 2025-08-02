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
    margin: number;
    /**
     * @param margin  Margin value.
     */
    constructor(margin: number) {
        super();
        this.margin = margin;
    }
    /**
     * Apply constraint to all existing nodes.
     */
    apply_constraint(): void {
        const svg = document.querySelector('svg');
        if (svg == null) {
            throw new Error("invalid svg container");
        }
        const field_width = svg.getBoundingClientRect().width;
        const field_height = svg.getBoundingClientRect().height;
        for (const node of _NODES_MAP.values()) {
            const bbox = node.getBBox();
            const width = bbox.width / 2;
            const height = bbox.height / 2;
            if (node.x - width < this.margin) {
                node.x = width + this.margin;
            }
            if (node.y - height< this.margin) {
                node.y = height + this.margin;
            }
            if (node.x + width > field_width - this.margin) {
                node.x = field_width - this.margin - width;
            }
            if (node.y + height > field_height - this.margin) {
                node.y = field_height - this.margin - height;
            }
        }
    }
}

/**
 * Pins the display position of specific nodes.
 */
class PinningConstraint extends SConstraint {
    /**
     * Target SNode.
     */
    private _node: SNode;
    /**
     * Pinning position-x.
     */
    private _x_percent: number;
    /**
     * Pinning position-y.
     */
    private _y_percent: number;
    /**
     * @param node  Target node.
     * @param x_percent  Pinning position-x.
     * @param y_percent  Pinning position-y.
     */
    constructor(node: SNode, x_percent: number, y_percent: number) {
        super();
        this._node = node;
        this._x_percent = x_percent;
        this._y_percent = y_percent;
    }
    /**
     * Apply constraint to owned nodes.
     */
    apply_constraint(): void {
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
    private _nodes: SNode[];
    /**
     * @param nodes  Array of nodes.
     */
    constructor(nodes: SNode[]) {
        super();
        this._nodes = nodes;
    }
    /**
     * Apply constraint to owned nodes.
     */
    apply_constraint(): void {
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
    private _nodes: SNode[];
    /**
     * @param nodes  Array of nodes.
     */
    constructor(nodes: SNode[]) {
        super();
        this._nodes = nodes;
    }
    /**
     * Apply constraint to owned nodes.
     */
    apply_constraint(): void {
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
     * Left push target node.
     */
    private _left: SNode;
    /**
     * Right push target node.
     */
    private _right: SNode;
    /**
     * Push force.
     */
    private _df: number;
    /**
     * @param left  Left push target node.
     * @param right  Right push target node.
     * @param df  Push force.
     */
    constructor(left: SNode, right: SNode, df?: number) {
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
    apply_constraint(): void {
        this._left.fx -= this._df;
        this._right.fx += this._df;
    }
}

/**
 * Applies vertical repulsion between nodes.
 */
class VerticalConstraint extends SConstraint {
    /**
     * Push down target node.
     */
    private _down: SNode;
    /**
     * Push up target node.
     */
    private _up: SNode;
    /**
     * Push up/down force.
     */
    private _df: number;
    /**
     * @param down  Push down target node.
     * @param up  Push up target node.
     * @param df  Push up/down force.
     */
    constructor(down: SNode, up: SNode, df?: number) {
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
    apply_constraint(): void {
        this._up.fy -= this._df;
        this._down.fy += this._df;
    }
}
