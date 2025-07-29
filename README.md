# Real-Time Graph Rendering Based on a Spring Model

This system uses JavaScript to render a graph composed of nodes (represented as strings or rectangles) and edges between them using SVG.

The layout of the graph is dynamically updated in real-time based on the following physical simulation:

1. The initial positions of the nodes are set randomly (you may also specify fixed positions).
2. Each node behaves as a charged particle, repelling other nodes according to the inverse square law.
3. Edges between nodes are modeled as springs, applying attractive or repulsive forces according to Hooke’s law.
4. Nodes can also be moved manually via mouse interaction.

You can customize various properties such as each node’s initial position, charge, mass, as well as each link’s natural length and spring constant.

- [Document](https://tadashi9e.github.io/spring_graph/docs/)
- [DEMO](https://tadashi9e.github.io/spring_graph/test.html)

# File Structure

## spring_graph.js

A JavaScript library that defines nodes and edges and performs the physical simulation.

## spring_graph_constraints.js

A library for defining constraints among multiple nodes. It provides the following features:

- Keeps nodes within the visible display area.
- Pins the display position of specific nodes.
- Aligns nodes horizontally or vertically to present them as a cohesive group.
- Applies horizontal or vertical repulsion between nodes to control their relative positioning.


## test.js, test.html, test.css

A simple demo that shows the behavior of the graph as a linked list grows every 5 seconds.

## spring_graph.ts, spring_graph_compound.ts, test.ts

The TypeScript source code corresponding to each js files.
