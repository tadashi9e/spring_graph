"use strict";
// -*- mode: javascript -*-
let i = 0;
let prev_cdr;
function test_draw_classes() {
    const snode = new TextNode("SNode");
    new PinningConstraint(snode, 40, 50);
    const text_node = new TextNode("TextNode");
    new VerticalConstraint(text_node, snode);
    new ArrowEdge(text_node, snode)
        .setAttribute("length", "50");
    const svg_text_node = new TextNode("SVG:<text/>");
    new VerticalConstraint(svg_text_node, text_node);
    new ArrowEdge(text_node, svg_text_node)
        .setAttribute("length", "50")
        .setAttribute("stroke-dasharray", "4");
    const rect_node = new TextNode("RectNode");
    new VerticalConstraint(rect_node, snode);
    new ArrowEdge(rect_node, snode)
        .setAttribute("length", "50");
    const svg_rect_node = new TextNode("SVG:<rect/>");
    new VerticalConstraint(svg_rect_node, rect_node);
    new ArrowEdge(rect_node, svg_rect_node)
        .setAttribute("length", "50")
        .setAttribute("stroke-dasharray", "4");
    const sedge = new TextNode("SEdge");
    new ArrowEdge(sedge, snode)
        .setAttribute("length", "50")
        .setAttribute("stroke-dasharray", "4");
    const line_edge = new TextNode("LineEdge");
    new VerticalConstraint(line_edge, sedge);
    const sedge_line_edge = new ArrowEdge(line_edge, sedge)
        .setAttribute("length", "50");
    const svg_line_edge = new TextNode("SVG:<line/>");
    new VerticalConstraint(svg_line_edge, line_edge);
    new ArrowEdge(line_edge, svg_line_edge)
        .setAttribute("length", "50")
        .setAttribute("stroke-dasharray", "4");
    const arrow_edge = new TextNode("ArrowEdge");
    new VerticalConstraint(arrow_edge, sedge);
    const sedge_arrow_edge = new ArrowEdge(arrow_edge, sedge)
        .setAttribute("length", "50");
    new HorizontalConstraint(text_node, rect_node);
    new HorizontalConstraint(arrow_edge, text_node);
    new HorizontalConstraint(line_edge, arrow_edge);
    const sconstraint = new TextNode("SConstraint");
    const field_constraint = new TextNode("FieldConstraint");
    const vertical_compound_constraint = new TextNode("VerticalCompoundConstraint");
    const horizontal_compound_constraint = new TextNode("HorizontalCompoundConstraint");
    const vertical_constraint = new TextNode("VerticalConstraint");
    const horizontal_constraint = new TextNode("HorizontalConstraint");
    field_constraint.q *= 10;
    vertical_compound_constraint.q *= 10;
    horizontal_compound_constraint.q *= 10;
    vertical_constraint.q *= 10;
    horizontal_constraint.q *= 10;
    new VerticalConstraint(field_constraint, sconstraint);
    new VerticalConstraint(vertical_compound_constraint, sconstraint);
    new VerticalConstraint(horizontal_compound_constraint, sconstraint);
    new VerticalConstraint(vertical_constraint, sconstraint);
    new VerticalConstraint(horizontal_constraint, sconstraint);
    new ArrowEdge(field_constraint, sconstraint)
        .setAttribute("length", "50");
    new ArrowEdge(vertical_compound_constraint, sconstraint)
        .setAttribute("length", "50");
    new ArrowEdge(horizontal_compound_constraint, sconstraint)
        .setAttribute("length", "50");
    new ArrowEdge(vertical_constraint, sconstraint)
        .setAttribute("length", "50");
    new ArrowEdge(horizontal_constraint, sconstraint)
        .setAttribute("length", "50");
    new VerticalConstraint(snode, field_constraint);
    new VerticalConstraint(snode, vertical_compound_constraint);
    new VerticalConstraint(snode, horizontal_compound_constraint);
    new VerticalConstraint(snode, vertical_constraint);
    new VerticalConstraint(snode, horizontal_constraint);
    new ArrowEdge(field_constraint, snode)
        .setAttribute("length", "50")
        .setAttribute("stroke-dasharray", "4");
    new ArrowEdge(vertical_compound_constraint, snode)
        .setAttribute("length", "50")
        .setAttribute("stroke-dasharray", "4");
    new ArrowEdge(horizontal_compound_constraint, snode)
        .setAttribute("length", "50")
        .setAttribute("stroke-dasharray", "4");
    new ArrowEdge(vertical_constraint, snode)
        .setAttribute("length", "50")
        .setAttribute("stroke-dasharray", "4");
    new ArrowEdge(horizontal_constraint, snode)
        .setAttribute("length", "50")
        .setAttribute("stroke-dasharray", "4");
}
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
        new PinningConstraint(prev_cdr, 60, 10);
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
    // ------------------------------
    test_draw_classes();
    // ------------------------------
    test_add_linked_list();
};
