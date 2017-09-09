import Graph from "../../shared/graph";
import Renderer from "./renderer";
import HierholzerPath from "../../shared/HierholzerPath";
import examples from "./examples";

const handleSelectChange = (ev: Event) => {
  const n = (ev.target as HTMLSelectElement).value;
  const input = document.getElementById("input") as HTMLTextAreaElement;
  if (input) {
    input.value = examples[Number(n)];
  }
};

const loadSampleGraph = (graph: Graph, renderer: Renderer) => {
  const input = document.getElementById("input") as HTMLTextAreaElement;
  if (input) {
    input.value = examples[0];
  }
  handleRefresh(graph, renderer);
  handleCheck(graph, renderer);
};

const handleRefresh = (graph: Graph, renderer: Renderer) => {
  try {
    const input = document.getElementById("input") as HTMLTextAreaElement;
    if (input && input.value) {
      let inputText = input.value.split("\n");
      graph.init(inputText[0]);
      for (let i = 1; i < inputText.length; i++) {
        graph.processLine(inputText[i]);
      }
      renderer.render(graph.getEdges(), graph.getVerticesNumber());
      clearMessage();
    } else {
      displayMessage({
        error: true,
        message: "Erro ao ler o grafo. Não há dados."
      });
    }
  } catch (err) {
    displayMessage({
      error: true,
      message: "Erro ao ler o grafo. Confira os dados."
    });
  }
};

const clearMessage = () => {
  const el = document.getElementById("message") as HTMLParagraphElement;
  if (el) {
    el.innerText = "";
  }
};

const displayMessage = ({
  error,
  message
}: {
  error: boolean;
  message: string;
}) => {
  const el = document.getElementById("message") as HTMLParagraphElement;
  if (el) {
    el.innerText = message;
  }
};

const handleCheck = (graph: Graph, renderer: Renderer) => {
  if (graph.hasOnlyEvenDegrees()) {
    try {
      // Forca-se uma copia profunda do array
      // porque os proximos metodos sao recursivos
      // e alteram o array que lhes eh passado.

      const circuit = HierholzerPath(graph.cloneVertices());

      displayMessage({
        error: false,
        message: "É um grafo euleriano. Caminho: " + circuit
      });
      renderer.render(graph.getEdges(), graph.getVerticesNumber());
      renderer.renderCircuit(circuit);
    } catch (error) {
      // No momento o algoritmo de procurar o caminho vai lancar
      // um erro se ele perceber que o grafo nao eh conectado.
      displayMessage({
        error: true,
        message: "Não é um grafo euleriano. O grafo não é conectado."
      });
    }
  } else {
    // Como ha algum vertice com grau impar ja podemos afirmar
    // que o grafo nao eh euleriano.
    displayMessage({
      error: true,
      message: "Não é um grafo euleriano. Há algum vertice com grau ímpar."
    });
  }
};

const init = () => {
  const graph = new Graph();
  const width =
    window.innerWidth > window.innerHeight
      ? window.innerWidth / 2
      : window.innerWidth;
  const height = width / 16 * 9;
  const renderer = new Renderer(width, height);

  const select = document.getElementById("input_select");
  if (select) {
    select.addEventListener("change", ev => {
      handleSelectChange(ev);
      handleRefresh(graph, renderer);
      handleCheck(graph, renderer);
    });
  }

  const refresh = document.getElementById("refresh");
  if (refresh) {
    refresh.addEventListener("click", () => handleRefresh(graph, renderer));
  }

  const check = document.getElementById("check");
  if (check) {
    check.addEventListener("click", () => handleCheck(graph, renderer));
  }

  loadSampleGraph(graph, renderer);
};

window.onload = init;
