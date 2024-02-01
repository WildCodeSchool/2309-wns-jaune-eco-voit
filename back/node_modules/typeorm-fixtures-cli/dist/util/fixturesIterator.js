"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixturesIterator = void 0;
const graphology_1 = require("graphology");
const graphology_dag_1 = require("graphology-dag");
function* fixturesIterator(fixtures) {
    const graph = new graphology_1.DirectedGraph({ allowSelfLoops: false });
    const fixturesByName = new Map();
    for (const fixture of fixtures) {
        fixturesByName.set(fixture.name, fixture);
        graph.addNode(fixture.name, fixture);
    }
    for (const fixture of fixtures) {
        for (const dep of fixture.dependencies) {
            if ((0, graphology_dag_1.willCreateCycle)(graph, dep, fixture.name)) {
                throw new Error(`There is a cycle between ${dep} and ${fixture.name}`);
            }
            graph.addDirectedEdge(dep, fixture.name);
        }
    }
    for (const name of (0, graphology_dag_1.topologicalSort)(graph)) {
        yield fixturesByName.get(name);
    }
}
exports.fixturesIterator = fixturesIterator;
//# sourceMappingURL=fixturesIterator.js.map