import { Edge } from "../../shared/graph";

type RenderedVertice = {
  left: number;
  top: number;
};

class Renderer {
  private width = 0;
  private height = 0;
  private vertices: RenderedVertice[] = [];
  private renderedEdges: Edge[] = [];
  private glCtx: CanvasRenderingContext2D;
  private diameter = 20;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    canvas.height = height;
    canvas.width = width;
    this.glCtx = canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  private renderVertice = (left: number, top: number, n: number) => {
    this.glCtx.beginPath();
    this.glCtx.arc(left, top, this.diameter, 0, Math.PI * 2, false);
    this.glCtx.fillStyle = "#000000";
    this.glCtx.fill();
    this.glCtx.closePath();

    this.glCtx.font = "30px Arial";
    this.glCtx.fillStyle = "white";
    this.glCtx.textAlign = "center";
    this.glCtx.fillText(String(n), left, top + this.diameter / 2);
  };

  private renderedEdgesBetween = (from: number, to: number) => {
    let n = 0;
    this.renderedEdges.forEach(edge => {
      if (
        (edge[0] === from && edge[1] === to) ||
        (edge[0] === to && edge[1] === from)
      ) {
        n++;
      }
    });
    return n;
  };

  private renderStraightEdge = (
    fromLeft: number,
    fromTop: number,
    toLeft: number,
    toTop: number
  ) => {
    this.glCtx.beginPath();
    this.glCtx.moveTo(fromLeft, fromTop);
    this.glCtx.lineTo(toLeft, toTop);
    this.glCtx.lineWidth = this.diameter / 2;
    this.glCtx.strokeStyle = "rgba(0,0,0,0.5)";
    this.glCtx.stroke();
    this.glCtx.closePath();
  };

  private renderCurvedEdge = (
    fromLeft: number,
    fromTop: number,
    toLeft: number,
    toTop: number,
    n: number
  ) => {
    this.glCtx.beginPath();
    this.glCtx.moveTo(fromLeft, fromTop);
    this.glCtx.quadraticCurveTo(
      (toLeft + fromLeft) / 2 - this.diameter * (3 * n),
      (toTop + fromTop) / 2,
      toLeft,
      toTop
    );
    this.glCtx.lineWidth = this.diameter / 2;
    this.glCtx.strokeStyle = "rgba(0,0,0,0.5)";
    this.glCtx.stroke();
    this.glCtx.closePath();
  };

  private renderLoopEdge = (left: number, top: number, n: number) => {
    this.glCtx.beginPath();
    this.glCtx.arc(
      left - this.diameter,
      top - this.diameter,
      this.diameter * (n + 1),
      0,
      Math.PI * 2,
      false
    );
    this.glCtx.lineWidth = this.diameter / 2;
    this.glCtx.strokeStyle = "rgba(0,0,0,0.5)";
    this.glCtx.stroke();
    this.glCtx.closePath();
  };

  public renderCircuit = (c: string) => {
    const circuit = c.split(" ").map(x => Number(x) - 1);
    let edges: Edge[] = [];
    for (let i = 0; i < circuit.length - 1; i++) {
      edges.push([circuit[i], circuit[i + 1]]);
    }

    edges.forEach(edge => {
      this.renderArrow(edge);
    });
  };

  private renderArrow = (edge: Edge) => {
    const from = edge[0];
    const to = edge[1];

    // let n = this.renderedEdgesBetween(from, to);
    const fromLeft = this.vertices[from].left;
    const fromTop = this.vertices[from].top;
    const toLeft = this.vertices[to].left;
    const toTop = this.vertices[to].top;

    const angle = Math.atan((fromTop - toTop) / (fromLeft - toLeft));
    console.log("ra", edge.map(n => n + 1), angle);

    const initLeft = (fromLeft + toLeft) / 2;
    const initTop = (fromTop + toTop) / 2;

    this.glCtx.beginPath();
    this.glCtx.moveTo(initLeft, initTop);
    this.glCtx.lineTo(initLeft - this.diameter, initTop - this.diameter);
    this.glCtx.lineTo(initLeft - this.diameter, initTop + this.diameter);
    this.glCtx.fillStyle = "rgba(0, 255, 0, 0.5)";
    this.glCtx.fill();
    this.glCtx.closePath();
  };

  private renderEdge = (edge: Edge) => {
    const from = edge[0];
    const to = edge[1];

    let n = this.renderedEdgesBetween(from, to);
    const fromLeft = this.vertices[from].left;
    const fromTop = this.vertices[from].top;
    const toLeft = this.vertices[to].left;
    const toTop = this.vertices[to].top;

    if (from === to) {
      // render loop
      this.renderLoopEdge(fromLeft, fromTop, n);
    } else {
      if (n === 0) {
        this.renderStraightEdge(fromLeft, fromTop, toLeft, toTop);
      } else {
        this.renderCurvedEdge(fromLeft, fromTop, toLeft, toTop, n);
      }
    }
    this.renderedEdges.push(edge);
  };

  public render = (edges: Edge[], verticesNumber: number) => {
    this.renderedEdges = [];
    this.vertices = [];
    this.glCtx.clearRect(0, 0, this.width, this.height);
    const topVertices =
      verticesNumber % 2 === 0
        ? verticesNumber / 2
        : Math.floor(verticesNumber / 2) + 1;
    const bottomVertices = Math.floor(verticesNumber / 2);

    const topHorizontalSpace = this.width / topVertices;
    for (let i = 0; i < topVertices; i++) {
      const left = topHorizontalSpace / 2 + topHorizontalSpace * i;
      const top = this.height / 4;
      const n = 2 * i + 1;
      this.vertices[n - 1] = { left, top };
    }

    const bottomHorizontalSpace = this.width / bottomVertices;
    for (let i = 1; i <= bottomVertices; i++) {
      const left = bottomHorizontalSpace / 2 + bottomHorizontalSpace * (i - 1);
      const top = this.height / 4 * 3;
      const n = 2 * i;
      this.vertices[n - 1] = { left, top };
    }
    edges.forEach(this.renderEdge);

    this.vertices.forEach((vertice, index) => {
      this.renderVertice(vertice.left, vertice.top, index + 1);
    });
  };
}

export default Renderer;
