// -*- mode: javascript -*-
// ----------------------------------------------------------------------
// Display nodes and edges on SVG
//
// spring_graph_init()
//    Initialize this library.
// class TextNode
//    SVG <text/> class.
//    Behaves like a particle with an electric charge.
// class RectNode
//    SVG <rect/> class.
//    Behaves like a particle with an electric charge.
// class LineEdge
//    SVG <line/> class. Draw simple line edge.
//    Behaves like a spring between two TextNode/RectNode elements.
// class ArrowEdge
//    Draw arrow edge.
//    Connection of two TextNode/RectNode elements.
//    Behaves like a spring between two TextNode/RectNode elements.
// ----------------------------------------------------------------------
var DEFAULT_COLOR = 'black';

// Default parameters of equation of motion.

// Update interval (msec.)
var UPDATE_INTERVAL = 100;
// Time step
var TIME_STEP = 0.1;
// Minimum distance
var EPSILON = 1;
// Default electric charge of node
var DEFAULT_NODE_Q = 100;
// Default mass of node
var DEFAULT_NODE_M = 1;
// Default momentum decay factor
var DEFAULT_MOMENT_DECAY = 0.1;
// Default natural length of spring
var DEFAULT_EDGE_LENGTH = 10;
// Default constant factor of spring
var DEFAULT_EDGE_K = 1;

function _float2intstr(value: number): string {
    return (value|0).toString();
}

var _NODES_MAP : Map<string,SNode> = new Map();
var _EDGES_MAP : Map<string,SEdge> = new Map();
var _CONSTRAINTS_MAP : Map<string,SConstraint> = new Map();

var _LAST_NODE_ID = 0;
var _LAST_EDGE_ID = 0;
var _LAST_CONSTRAINT_ID = 0;

function _get_next_node_id(): string {
    return "node_" + (++_LAST_NODE_ID);
}
function _get_next_edge_id(): string {
    return "edge_" + (++_LAST_EDGE_ID);
}
function _get_next_constraint_id(): string {
    return "constraint_" + (++_LAST_CONSTRAINT_ID);
}

/**
 * Node class
 */
abstract class SNode {
    /** SVG node ID */
    public id: string;
    /** node position-x */
    public x: number;
    /** node position-y */
    public y: number;
    /** node electric charge */
    public q: number;
    /** node mass */
    public m: number;
    /** node momentum decay factor */
    public moment_decay: number;
    /** node momentum-x */
    public mx: number;
    /** node momentum-y */
    public my: number;
    /** node force-x */
    public fx: number;
    /** node force-y */
    public fy: number;
    /**
     * Node constructor.
     * @param x  Initial position-x
     * @param y  Initial position-y
     */
    constructor(x?: number, y?: number) {
        this.id = _get_next_node_id();
        const svg = document.querySelector('svg');
        if (svg == null) {
            throw new Error("invalid svg container");
        }
        const width = svg.getBoundingClientRect().width;
        const height = svg.getBoundingClientRect().height;
        if (x === undefined) {
            // x = height * Math.random();
            x = width * (1 + Math.random()) / 3;
        }
        if (y === undefined) {
            // y = height * Math.random();
            y = height * (1 + Math.random()) / 3;
        }
        this.x = x;
        this.y = y;
        this.q = DEFAULT_NODE_Q;
        this.m = DEFAULT_NODE_M;
        this.moment_decay = DEFAULT_MOMENT_DECAY;
        this.mx = 0;
        this.my = 0;
        this.fx = 0;
        this.fy = 0;
        _NODES_MAP.set(this.id, this);
    }
    /**
     * Delete this node.
     */
    dispose(): void {
        _NODES_MAP.delete(this.id);
    }
    /**
     * call setAttribute
     * @param name  Attribute name.
     * @param value  Attribute value.
     */
    abstract setAttribute(name: string, value: string): SNode;
    /**
     * update SVG.
     */
    abstract update_position(): void;
    /**
     * call getBBox() and get DOMRect
     * @return boundary box
     */
    abstract getBBox(): DOMRect;
}

abstract class SEdge {
    /** SVG edge ID */
    public id: string;
    /** Edge end node 1 */
    public node1: SNode;
    /** Edge end node 2 */
    public node2: SNode;
    /** Natural spring length */
    public length: number;
    /** Spring factor */
    public k: number;
    /**
     * Edge constructor.
     * @param node1  Edge end node1
     * @param node2  Edge end node2
     */
    constructor(node1: SNode, node2: SNode) {
        this.id = _get_next_edge_id();
        this.node1 = node1;
        this.node2 = node2;
        this.length = DEFAULT_EDGE_LENGTH;
        this.k = DEFAULT_EDGE_K;
        _EDGES_MAP.set(this.id, this);
    }
    /**
     * Delete this edge.
     */
    dispose(): void {
        _EDGES_MAP.delete(this.id);
    }
    /**
     * call setAttribute
     * @param name  Attribute name.
     * @param value  Attribute value.
     */
    abstract setAttribute(name: string, value: string): SEdge;
    /**
     * update SVG.
     */
    abstract update_position(): void;
}

abstract class SConstraint {
    /** constraint ID */
    public id: string;
    constructor() {
        this.id = _get_next_constraint_id();
        _CONSTRAINTS_MAP.set(this.id, this);
    }
    /**
     * Delete this constraint.
     */
    dispose(): void {
        _CONSTRAINTS_MAP.delete(this.id);
    }
    /**
     * Apply constraint to nodes.
     */
    abstract apply_constraint(): void;
}

// ----------------------------------------------------------------------
/**
 * SVG &lt;text/&gt; class.
 * Behaves like a particle with an electric charge.
 */
class TextNode extends SNode {
    /**
     * SVG &lt;text/&gt; element.
     */
    protected _element: SVGElement|undefined;
    /**
     * TextNode constructor.
     * @param title  Title string on &lt;text/&gt;
     * @param x  Initial position-x
     * @param y  Initial position-y
     */
    constructor(title: string,
                x?: number, y?: number) {
        super(x, y);
        this._element = this._display(title);
    }
    /**
     * Create SVG &lt;text/&gt; element.
     * @param title  Title string on &lt;text/&gt;
     * @return SVG &lt;text/&gt; element.
     */
    private _display(title: string): SVGElement {
        const svg = document.querySelector('svg');
        if (svg == null) {
            throw new Error("invalid svg container");
        }
        const text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        text.setAttribute('id', this.id)
        text.setAttribute('x', _float2intstr(this.x));
        text.setAttribute('y', _float2intstr(this.y));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.appendChild(document.createTextNode(title));
        svg.appendChild(text);
        return text;
    }
    /**
     * Delete this node.
     */
    dispose(): void {
        if (this._element !== undefined) {
            this._element.remove();
            this._element = undefined;
        }
        super.dispose();
    }
    /**
     * call setAttribute()
     * @param name  Attribute name.
     * @param value  Attribute value.
     */
    setAttribute(name: string, value: string): SNode {
        if (this._element === undefined) {
            throw new Error('TextNode initialization error');
        }
        this._element.setAttribute(name, value);
        return this;
    }
    /**
     * Update &lt;text/&gt; position on SVG.
     */
    update_position(): void {
        if (this._element === undefined) {
            throw new Error('TextNode initialization error');
        }
        const bbox = this.getBBox();
        this._element.setAttribute('x', _float2intstr(this.x));
        this._element.setAttribute('y', _float2intstr(this.y));
    }
    /**
     * call getBBox() and return DOMRect
     * @return boundary box
     */
    getBBox(): DOMRect {
        return (this._element as SVGSVGElement).getBBox();
    }
}
/**
 * SVG &lt;rect/&gt; class.
 * Behaves like a particle with an electric charge.
 */
class RectNode extends SNode {
    /**
     * Rect width.
     */
    public width: number;
    /**
     * Rect height.
     */
    public height: number;
    /**
     * SVG &lt;rect/&gt; element.
     */
    protected _element: SVGElement|undefined;
    /**
     * RectNode constructor.
     * @param width  Width.
     * @param height  Height.
     * @param x  Initial position-x.
     * @param y  Initial position-y.
     */
    constructor(width: number, height: number,
               x?: number, y?: number) {
        super(x, y);
        this.width = width;
        this.height = height;
        this._element = this._display();
    }
    /**
     * Create SVG &lt;rect/&gt; element.
     * @return SVG &lt;rect/&gt; element.
     */
    private _display(): SVGElement {
        const svg = document.querySelector('svg');
        if (svg == null) {
            throw new Error("invalid svg container");
        }
        const rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        rect.setAttribute('id', this.id);
        rect.setAttribute('width', _float2intstr(this.width));
        rect.setAttribute('height', _float2intstr(this.height));
        rect.setAttribute('x', _float2intstr(this.x - this.width / 2));
        rect.setAttribute('y', _float2intstr(this.y - this.height / 2));
        rect.setAttribute('fill', 'white');
        rect.setAttribute('stroke', DEFAULT_COLOR);
        svg.appendChild(rect);
        return rect;
    }
    /**
     * Delete this node.
     */
    dispose(): void {
        if (this._element !== undefined) {
            this._element.remove();
            this._element = undefined;
        }
        super.dispose();
    }
    /**
     * call setAttribute
     * @param name  Attribute name.
     * @param value  Attribute value.
     */
    setAttribute(name: string, value: string): SNode {
        if (this._element === undefined) {
            throw new Error('RectNode initialization error');
        }
        this._element.setAttribute(name, value);
        return this;
    }
    /**
     * update SVG.
     */
    update_position(): void {
        if (this._element === undefined) {
            throw new Error('RectNode initialization error');
        }
        const bbox = (this._element as SVGSVGElement).getBBox();
        this._element.setAttribute('x', _float2intstr(this.x - bbox.width / 2));
        this._element.setAttribute('y', _float2intstr(this.y - bbox.height / 2));
    }
    /**
     * call getBBox() and get DOMRect
     * @return boundary box
     */
    getBBox(): DOMRect {
        return (this._element as SVGSVGElement).getBBox();
    }
}

/**
 * SVG &lt;line/&gt; class. Draw simple line edge.
 * Connection of two TextNode/RectNode elements.
 * Behaves like a spring between two TextNode/RectNode elements.
 */
class LineEdge extends SEdge {
    private _element: SVGElement|undefined;
    /**
     * LineEdge constructor.
     * @param node1  Edge end node1
     * @param node2  Edge end node2
     */
    constructor(node1: SNode, node2: SNode) {
        super(node1, node2);
        this._display();
    }
    /**
     * Create SVG &lt;line/&gt; element.
     * @return SVG &lt;line/&gt; element.
     */
    private _display(): void {
        const svg = document.querySelector('svg');
        if (svg == null) {
            throw new Error("invalid svg container");
        }
        const line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        line.setAttribute('id', this.id);
        line.setAttribute('x1', _float2intstr(this.node1.x));
        line.setAttribute('y1', _float2intstr(this.node1.y));
        line.setAttribute('x2', _float2intstr(this.node2.x));
        line.setAttribute('y2', _float2intstr(this.node2.y));
        line.setAttribute('stroke', DEFAULT_COLOR);
        svg.appendChild(line);
        this._element = line;
    }
    /**
     * Delete this edge.
     */
    dispose(): void {
        if (this._element !== undefined) {
            this._element.remove();
            this._element = undefined;
        }
        super.dispose();
    }
    /**
     * call setAttribute
     * @param name  Attribute name.
     * @param value  Attribute value.
     */
    setAttribute(name: string, value: string): SEdge {
        if (this._element === undefined) {
            throw new Error('LineEdge initialization error');
        }
        this._element.setAttribute(name, value);
        return this;
    }
    /**
     * update SVG.
     */
    update_position(): void {
        if (this._element === undefined) {
            throw new Error('LineEdge initialization error');
        }
        this._element.setAttribute('x1', _float2intstr(this.node1.x));
        this._element.setAttribute('y1', _float2intstr(this.node1.y));
        this._element.setAttribute('x2', _float2intstr(this.node2.x));
        this._element.setAttribute('y2', _float2intstr(this.node2.y));
    }
}
/**
 * Draw arrow edge.
 * Connection of two TextNode/RectNode elements.
 * Behaves like a spring between two TextNode/RectNode elements.
 */
class ArrowEdge extends SEdge {
    /**
     * Arrow head size.
     */
    public head_size: number;
    private _line: SVGElement|undefined;
    private _head1: SVGElement|undefined;
    private _head2: SVGElement|undefined;
    /**
     * ArrowEdge constructor from node1 to node2.
     * @param node1  Edge end node1
     * @param node2  Edge end node2
     */
    constructor(node1: SNode, node2: SNode) {
        super(node1, node2);
        this.head_size = 10;
        this._display();
    }
    /**
     * Create SVG &lt;line/&gt; elements.
     */
    private _display(): void {
        const svg = document.querySelector('svg');
        if (svg == null) {
            throw new Error("invalid svg container");
        }
        const x1 = this.node1.x;
        const y1 = this.node1.y;
        let x2 = this.node2.x;
        let y2 = this.node2.y;
        const dx = x1 - x2;
        const dy = y1 - y2;
        const bbox1 = this.node1.getBBox();
        const bbox2 = this.node2.getBBox();
        if (Math.abs(dy * bbox2.width) < Math.abs(bbox2.height * dx)) {
            // |dy/dx| < |height/width|
            if (dx > 0) {
                x2 += bbox2.width / 2;
            } else {
                x2 -= bbox2.width / 2;
            }
            y2 += (bbox2.width / 2) * dy / Math.abs(dx);
        } else {
            x2 += (bbox2.height / 2) * dx / Math.abs(dy);
            if (dy > 0) {
                y2 += bbox2.height / 2;
            } else {
                y2 -= bbox2.height / 2;
            }
        }
        const line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        line.setAttribute('id', this.id);
        line.setAttribute('x1', _float2intstr(x1));
        line.setAttribute('y1', _float2intstr(y1));
        line.setAttribute('x2', _float2intstr(x2));
        line.setAttribute('y2', _float2intstr(y2));
        line.setAttribute('stroke', DEFAULT_COLOR);
        svg.appendChild(line);
        this._line = line;
        const angle = Math.atan2(dy, dx);
        const angle1 = angle + Math.PI / 6;
        const angle2 = angle - Math.PI / 6;
        const head1 = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        head1.setAttribute('id', this.id + '_1');
        head1.setAttribute('x1', _float2intstr(x2 + this.head_size * Math.cos(angle1)));
        head1.setAttribute('y1', _float2intstr(y2 + this.head_size * Math.sin(angle1)));
        head1.setAttribute('x2', _float2intstr(x2));
        head1.setAttribute('y2', _float2intstr(y2));
        head1.setAttribute('stroke', DEFAULT_COLOR);
        svg.appendChild(head1);
        this._head1 = head1;
        const head2 = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        head2.setAttribute('id', this.id + '_1');
        head2.setAttribute('x1', _float2intstr(x2 + this.head_size * Math.cos(angle2)));
        head2.setAttribute('y1', _float2intstr(y2 + this.head_size * Math.sin(angle2)));
        head2.setAttribute('x2', _float2intstr(x2));
        head2.setAttribute('y2', _float2intstr(y2));
        head2.setAttribute('stroke', DEFAULT_COLOR);
        svg.appendChild(head2);
        this._head2 = head2;
    }
    /**
     * Delete this node.
     */
    dispose(): void {
        if (this._line !== undefined) {
            this._line.remove();
            this._line = undefined;
        }
        if (this._head1 !== undefined) {
            this._head1.remove();
            this._head1 = undefined;
        }
        if (this._head2 != undefined) {
            this._head2.remove();
            this._head2 = undefined;
        }
        super.dispose();
    }
    /**
     * call setAttribute
     * @param name  Attribute name.
     * @param value  Attribute value.
     */
    setAttribute(name: string, value: string): SEdge {
        if (this._line === undefined ||
            this._head1 === undefined ||
            this._head2 === undefined) {
            throw new Error('SEdge initialization error');
        }
        this._line.setAttribute(name, value);
        this._head1.setAttribute(name, value);
        this._head2.setAttribute(name, value);
        return this;
    }
    /**
     * update SVG.
     */
    update_position(): void {
        if (this._line === undefined ||
            this._head1 === undefined ||
            this._head2 === undefined) {
            throw new Error('SEdge initialization error');
        }
        const x1 = this.node1.x;
        const y1 = this.node1.y;
        let x2 = this.node2.x;
        let y2 = this.node2.y;
        const dx = x1 - x2;
        const dy = y1 - y2;
        const bbox1 = this.node1.getBBox();
        const bbox2 = this.node2.getBBox();
        if (Math.abs(dy * bbox2.width) < Math.abs(bbox2.height * dx)) {
            // |dy/dx| < |height/width|
            if (dx > 0) {
                x2 += bbox2.width / 2;
            } else {
                x2 -= bbox2.width / 2;
            }
            y2 += (bbox2.width / 2) * dy / Math.abs(dx);
        } else {
            x2 += (bbox2.height / 2) * dx / Math.abs(dy);
            if (dy > 0) {
                y2 += bbox2.height / 2;
            } else {
                y2 -= bbox2.height / 2;
            }
        }
        this._line.setAttribute('x1', _float2intstr(x1));
        this._line.setAttribute('y1', _float2intstr(y1));
        this._line.setAttribute('x2', _float2intstr(x2));
        this._line.setAttribute('y2', _float2intstr(y2));

        const length2 = (y1 - y2)**2 + (x1 - x2)**2;
        const length = Math.sqrt(length2);
        const angle = Math.atan2(dy, dx);

        const angle1 = angle + Math.PI / 6;
        this._head1.setAttribute('x1', _float2intstr(x2 + this.head_size * Math.cos(angle1)));
        this._head1.setAttribute('y1', _float2intstr(y2 + this.head_size * Math.sin(angle1)));
        this._head1.setAttribute('x2', _float2intstr(x2));
        this._head1.setAttribute('y2', _float2intstr(y2));

        const angle2 = angle - Math.PI / 6;
        this._head2.setAttribute('x1', _float2intstr(x2 + this.head_size * Math.cos(angle2)));
        this._head2.setAttribute('y1', _float2intstr(y2 + this.head_size * Math.sin(angle2)));
        this._head2.setAttribute('x2', _float2intstr(x2));
        this._head2.setAttribute('y2', _float2intstr(y2));
    }
}

// ----------------------------------------------------------------------
/**
 * Solve equation of motion and move nodes.
 * @param dt  Delta-time.
 */
function _update(dt: number) {
    // reset forces
    for (const node of _NODES_MAP.values()) {
        node.fx = 0;
        node.fy = 0;
    }
    // calculate repulsive forces
    let i = 0;
    for (const node1 of _NODES_MAP.values()) {
        let j = 0;
        for (const node2 of _NODES_MAP.values()) {
            if (j >= i) {
                continue;
            }
            const distance2 = (node1.x - node2.x)**2 + (node1.y - node2.y)**2;
            const distance = Math.sqrt(distance2);
            const f = node1.q * node2.q / (distance2 + EPSILON);
            const fx = f * (node1.x - node2.x) / distance;
            const fy = f * (node1.y - node2.y) / distance;
            node1.fx += fx;
            node1.fy += fy;
            node2.fx -= fx;
            node2.fy -= fy;
            j += 1;
        }
        i += 1;
    }
    // calculate attractive forces
    for (const edge of _EDGES_MAP.values()) {
        const node1 = edge.node1;
        const node2 = edge.node2;
        const distance2 = (node1.x - node2.x)**2 + (node1.y - node2.y)**2;
        const distance = Math.sqrt(distance2);
        const f = edge.k * (edge.length - distance);
        const fx = f * (node1.x - node2.x) / distance;
        const fy = f * (node1.y - node2.y) / distance;
        node1.fx += fx;
        node1.fy += fy;
        node2.fx -= fx;
        node2.fy -= fy;
    }
    for (const constraint of _CONSTRAINTS_MAP.values()) {
        constraint.apply_constraint();
    }
    // update node momentums and positions
    for (const node of _NODES_MAP.values()) {
        node.mx = node.mx * (1 - node.moment_decay) + node.fx * dt;
        node.my = node.my * (1 - node.moment_decay) + node.fy * dt;
        node.x += (node.mx / node.m) * dt;
        node.y += (node.my / node.m) * dt;
    }
    // update display
    for (const node of _NODES_MAP.values()) {
        node.update_position();
    }
    for (const edge of _EDGES_MAP.values()) {
        edge.update_position();
    }
}

// ----------------------------------------------------------------------
function _find_target_node(event: MouseEvent): SNode|undefined {
    var min_distance: number|undefined;
    var min_distance_node: undefined|SNode;
    for (const node of _NODES_MAP.values()) {
        const distance2 =
              (node.x - event.offsetX)**2 + (node.y - event.offsetY)**2;
        const distance = Math.sqrt(distance2);
        if (min_distance === undefined ||
            min_distance > distance) {
            min_distance = distance;
            min_distance_node = node;
        }
    }
    return min_distance_node;
}
/**
 * Initialize this library.
 */
function spring_graph_init(): void {
    const svg = document.querySelector('svg');
    if (svg == null) {
        throw new Error("invalid svg container");
    }
    var DRAG_NODE: SNode|undefined;
    svg.onmouseenter = function(event) {
        DRAG_NODE = undefined;
    };
    svg.onmouseleave = function(event) {
        DRAG_NODE = undefined;
    };
    svg.onmousedown = function(event) {
        DRAG_NODE = _find_target_node(event);
        if (DRAG_NODE === undefined) {
            return;
        }
        DRAG_NODE.x = event.offsetX;
        DRAG_NODE.y = event.offsetY;
    };
    svg.onmouseup = function(event) {
        DRAG_NODE = undefined;
    };
    svg.onmousemove = function(event) {
        if (DRAG_NODE === undefined) {
            return;
        }
        DRAG_NODE.x = event.offsetX;
        DRAG_NODE.y = event.offsetY;
    };
    svg.ondrag = function(event) {};

    setInterval((): void => {
        _update(TIME_STEP);
    }, UPDATE_INTERVAL);
}
// ----------------------------------------------------------------------
