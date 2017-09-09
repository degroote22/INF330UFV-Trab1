"use strict";
exports.__esModule = true;
var Graph = /** @class */ (function () {
    function Graph() {
        var _this = this;
        this.initialized = false;
        this.verticesNumber = 0;
        this.edgesNumber = 0;
        this.vertices = [];
        this.edges = [];
        this.cloneVertices = function () {
            return JSON.parse(JSON.stringify(_this.vertices));
        };
        this.getEdges = function () { return _this.edges; };
        this.getVerticesNumber = function () { return _this.verticesNumber; };
        this.isInitialized = function () { return _this.initialized; };
        this.init = function (line) {
            // pode ser q a gente ta atualizando o grafo
            _this.vertices = [];
            _this.edges = [];
            var numbers = line.split(" ");
            _this.verticesNumber = Number(numbers[0]);
            _this.edgesNumber = Number(numbers[1]);
            _this.initialized = true;
            for (var i = 0; i < _this.verticesNumber; i++) {
                _this.vertices[i] = [];
            }
        };
        this.processLine = function (line) {
            var numbers = line.split(" ");
            // Como a contagem dos indices comeca de 1 no arquivo texto,
            // aqui eh normalizado para comecar em 0.
            var from = Number(numbers[0]) - 1;
            var to = Number(numbers[1]) - 1;
            _this.edges.push([from, to]);
            // Cada vertice guarda o numero do outro vertice ao qual eh ligado.
            _this.vertices[from] = _this.vertices[from].concat([to]);
            _this.vertices[to] = _this.vertices[to].concat([from]);
        };
        this.hasOnlyEvenDegrees = function () {
            return _this.vertices.reduce(function (prevResult, vertice) {
                var verticeEdgesNumber = vertice.length;
                var isEven = verticeEdgesNumber % 2 === 0;
                return prevResult && isEven;
            }, true);
        };
    }
    return Graph;
}());
exports["default"] = Graph;
