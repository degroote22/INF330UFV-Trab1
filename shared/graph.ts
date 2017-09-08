export type Vertice = number[];

class Graph {
    private initialized = false;
    private verticesNumber = 0;
    private edgesNumber = 0;
    private vertices: Vertice[] = []

    public cloneVertices = () => JSON.parse(
        JSON.stringify(this.vertices)
    ) as Vertice[];

    public isInitialized = () => this.initialized

    public init = (line: string) => {
        const numbers = line.split(" ") as [string, string];
        this.verticesNumber = Number(numbers[0]);
        this.edgesNumber = Number(numbers[1]);
        this.initialized = true;
        for (let i = 0; i < this.verticesNumber; i++) {
            this.vertices[i] = [];
        }
    }

    public processLine = (line: string) => {
        const numbers = line.split(" ") as [string, string];
        // Como a contagem dos indices comeca de 1 no arquivo texto,
        // aqui eh normalizado para comecar em 0.
        const from = Number(numbers[0]) - 1;
        const to = Number(numbers[1]) - 1;

        // Cada vertice guarda o numero do outro vertice ao qual eh ligado.
        this.vertices[from] = [...this.vertices[from], to];
        this.vertices[to] = [...this.vertices[to], from];
    };

    public hasOnlyEvenDegrees = (): boolean =>
        this.vertices.reduce((prevResult, vertice) => {
            const verticeEdgesNumber = vertice.length;
            const isEven: boolean = verticeEdgesNumber % 2 === 0;
            return prevResult && isEven;
        }, true);
}

export default Graph