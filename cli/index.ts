import * as fs from "fs";
import * as readline from "readline";
import HierholzerPath from "../shared/HierholzerPath";
import Graph, { Vertice } from "../shared/graph";

const graph = new Graph();
const rl = readline.createInterface({
  // input: fs.createReadStream("exemplo_nao_euleriano2.txt")
  input: fs.createReadStream(process.argv[2])
});

rl.on("line", line => {
  if (graph.isInitialized()) {
    graph.processLine(line);
  } else {
    graph.init(line);
  }
});

rl.on("close", () => {
  if (graph.hasOnlyEvenDegrees()) {
    try {
      // Forca-se uma copia profunda do array
      // porque os proximos metodos sao recursivos
      // e alteram o array que lhes eh passado.

      const circuit = HierholzerPath(graph.cloneVertices());

      console.log("Eh um grafo euleriano.");
      console.log("Caminho: " + circuit);
    } catch (error) {
      // No momento o algoritmo de procurar o caminho vai lancar
      // um erro se ele perceber que o grafo nao eh conectado.
      console.log("Nao eh um grafo euleriano. Motivo: ");
      console.log("O grafo nao eh conectado.");
    }
  } else {
    // Como ha algum vertice com grau impar ja podemos afirmar
    // que o grafo nao eh euleriano.
    console.log("Nao eh um grafo euleriano. Motivo: ");
    console.log("Ha algum vertice com grau impar");
  }
});
