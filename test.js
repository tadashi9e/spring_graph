"use strict";
// -*- mode: javascript -*-
let i = 0;
let prev_cdr;
function test_add_linked_list() {
    if (i >= 20 && prev_cdr !== undefined) {
        const nil = new TextNode('NIL');
        nil.setAttribute('stroke', 'red');
        new ArrowEdge(prev_cdr, nil);
        prev_cdr = undefined;
        return;
    }
    if (i == 0) {
        prev_cdr = new TextNode("Linked List Example");
        prev_cdr.setAttribute('stroke', 'red');
    }
    else {
        const car = new RectNode(20, 10);
        car.setAttribute('fill', 'yellow');
        const cdr = new RectNode(20, 10);
        cdr.setAttribute('fill', 'yellow');
        new VerticalCompoundConstraint([car, cdr]);
        const t = new TextNode(i.toString());
        t.setAttribute('stroke', 'blue');
        new ArrowEdge(car, t);
        if (prev_cdr !== undefined) {
            new ArrowEdge(prev_cdr, car);
        }
        prev_cdr = cdr;
    }
    i += 1;
    setTimeout(test_add_linked_list, 5000);
}
window.onload = function () {
    console.log("onload");
    spring_graph_init();
    // ------------------------------
    new FieldConstraint(10);
    const node1 = new TextNode("Rectangle");
    node1.setAttribute('fill', 'gray');
    node1.setAttribute('font-size', '32px');
    const node2 = new RectNode(20, 10);
    node2.setAttribute('fill', 'green');
    const line = new LineEdge(node1, node2);
    line.length = 100;
    // ------------------------------
    line.setAttribute('stroke', 'red');
    var prev_node = new TextNode("Simple List Example");
    for (let i = 0; i < 10; i++) {
        const node = new TextNode("node:" + i);
        const edge = new ArrowEdge(prev_node, node);
        edge.length = 50;
        prev_node = node;
    }
    // ------------------------------
    test_add_linked_list();
};
