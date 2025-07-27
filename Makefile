
all: compile doc

compile:
	npx tsc

doc:
	npx typedoc spring_graph.ts spring_graph_compound.ts
