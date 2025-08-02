"use strict";
// -*- mode: javascript -*-
let i = 0;
let prev_cdr;
function test_draw_classes() {
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
        .setLength(50);
    new ArrowEdge(vertical_compound_constraint, sconstraint)
        .setLength(50);
    new ArrowEdge(horizontal_compound_constraint, sconstraint)
        .setLength(50);
    new ArrowEdge(vertical_constraint, sconstraint)
        .setLength(50);
    new ArrowEdge(horizontal_constraint, sconstraint)
        .setLength(50);
    const snode = new TextNode("SNode");
    {
        new PinningConstraint(snode, 50, 50);
    }
    const text_node = new TextNode("TextNode");
    {
        new VerticalConstraint(text_node, snode);
        new ArrowEdge(text_node, snode)
            .setLength(50);
        const svg_text_node = new TextNode("SVG:<text/>");
        // new VerticalConstraint(svg_text_node, text_node);
        new TripleEdge(text_node, new TextNode("_element"), svg_text_node)
            .setLineAttribute("stroke-dasharray", "4")
            .setLength(50);
    }
    const rect_node = new TextNode("RectNode");
    {
        new VerticalConstraint(rect_node, snode);
        new ArrowEdge(rect_node, snode)
            .setLength(50);
    }
    const svg_rect_node = new TextNode("SVG:<rect/>");
    {
        // new VerticalConstraint(svg_rect_node, rect_node);
        new TripleEdge(rect_node, new TextNode("_element"), svg_rect_node)
            .setLineAttribute("stroke-dasharray", "4")
            .setLength(50);
    }
    const sedge = new TextNode("SEdge");
    {
        new ArrowEdge(sedge, snode)
            .setLineAttribute("stroke-dasharray", "4")
            .setLength(50);
    }
    const line_edge = new TextNode("LineEdge");
    {
        new VerticalConstraint(line_edge, sedge);
        const sedge_line_edge = new ArrowEdge(line_edge, sedge)
            .setLength(50);
        const svg_line_edge = new TextNode("SVG:<line/>");
        // new VerticalConstraint(svg_line_edge, line_edge);
        new TripleEdge(line_edge, new TextNode("_line"), svg_line_edge)
            .setLineAttribute("stroke-dasharray", "4")
            .setLength(100);
    }
    const arrow_edge = new TextNode("ArrowEdge");
    {
        new VerticalConstraint(arrow_edge, sedge);
        const sedge_arrow_edge = new ArrowEdge(arrow_edge, sedge)
            .setLength(50);
        const svg_line_edge_line = new TextNode("SVG:<line/>");
        const svg_line_edge_head1 = new TextNode("SVG:<line/>");
        const svg_line_edge_head2 = new TextNode("SVG:<line/>");
        // new VerticalConstraint(svg_line_edge_line, arrow_edge);
        // new VerticalConstraint(svg_line_edge_head1, arrow_edge);
        // new VerticalConstraint(svg_line_edge_head2, arrow_edge);
        new TripleEdge(arrow_edge, new TextNode("_line"), svg_line_edge_line)
            .setLineAttribute("stroke-dasharray", "4")
            .setLength(100);
        new TripleEdge(arrow_edge, new TextNode("_head1"), svg_line_edge_head1)
            .setLineAttribute("stroke-dasharray", "4")
            .setLength(100);
        new TripleEdge(arrow_edge, new TextNode("_head2"), svg_line_edge_head2)
            .setLineAttribute("stroke-dasharray", "4")
            .setLength(100);
    }
    const triple_edge = new TextNode("TripleEdge");
    {
        new VerticalConstraint(arrow_edge, triple_edge);
        new VerticalConstraint(line_edge, triple_edge);
        new TripleEdge(triple_edge, new TextNode("_head"), arrow_edge)
            .setLineAttribute("stroke-dasharray", "4")
            .setLength(50);
        new TripleEdge(triple_edge, new TextNode("_tail"), line_edge)
            .setLineAttribute("stroke-dasharray", "4")
            .setLength(50);
        const triple_edge_constraint = new TextNode("TripleEdgeConstraint");
        new ArrowEdge(triple_edge_constraint, sconstraint)
            .setLength(50);
        new TripleEdge(triple_edge, new TextNode("_constraint"), triple_edge_constraint)
            .setLineAttribute("stroke-dasharray", "4")
            .setLength(50);
    }
    new HorizontalConstraint(text_node, rect_node);
    new HorizontalConstraint(triple_edge, text_node);
    new HorizontalConstraint(line_edge, triple_edge);
    new HorizontalConstraint(arrow_edge, line_edge);
    new VerticalConstraint(snode, field_constraint);
    new VerticalConstraint(snode, vertical_compound_constraint);
    new VerticalConstraint(snode, horizontal_compound_constraint);
    new VerticalConstraint(snode, vertical_constraint);
    new VerticalConstraint(snode, horizontal_constraint);
    new ArrowEdge(field_constraint, snode)
        .setLineAttribute("stroke-dasharray", "4")
        .setLength(50);
    new ArrowEdge(vertical_compound_constraint, snode)
        .setLineAttribute("stroke-dasharray", "4")
        .setLength(50);
    new ArrowEdge(horizontal_compound_constraint, snode)
        .setLineAttribute("stroke-dasharray", "4")
        .setLength(50);
    new ArrowEdge(vertical_constraint, snode)
        .setLineAttribute("stroke-dasharray", "4")
        .setLength(50);
    new ArrowEdge(horizontal_constraint, snode)
        .setLineAttribute("stroke-dasharray", "4")
        .setLength(50);
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
