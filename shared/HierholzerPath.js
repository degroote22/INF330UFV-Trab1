"use strict";
exports.__esModule = true;
var flattenVertices = function (vertices) {
    return vertices.reduce(function (prev, curr) { return prev.concat(curr); }, []);
};
var createCircuit = function (circuit, vertices) {
    // O proximo vertice eh o ultimo que esta no circuito.
    var nextVerticeNumber = circuit[circuit.length - 1];
    // O proximo passo(vertice) eh o ultimo que esta no array de vertices
    // e eh removido para nao poder mais ser usado.
    var nextStep = vertices[nextVerticeNumber].pop();
    // Temos que tomar o cuidado de deletar esta aresta do outro vertice
    // ao qual ela esta ligada.
    var anotherIndex = vertices[nextStep].indexOf(nextVerticeNumber);
    vertices[nextStep].splice(anotherIndex, 1);
    // O novo circuito eh o que recebemos de antes
    // concatenado com o proximo passo.
    var newCircuit = circuit.concat([nextStep]);
    if (nextStep === circuit[0]) {
        // Se o item sendo inserido no circuito eh o primeiro item
        // do circuito significa que completamos uma volta.
        // Podemos retornar este circuito.
        return newCircuit;
    }
    else {
        // Ainda ha caminho para andar. Recursivamente construimos o circuito.
        return createCircuit(newCircuit, vertices);
    }
};
var findNonEmptyVerticeIndex = function (vertices, index) {
    if (vertices[index].length !== 0) {
        return index;
    }
    else {
        return findNonEmptyVerticeIndex(vertices, index + 1);
    }
};
var mergeCircuits = function (circuits) {
    var merged = circuits.pop();
    var shouldContinue = true;
    while (shouldContinue) {
        shouldContinue = false;
        circuits.forEach(function (circuit) {
            var init = circuit[0];
            var positionToInsert = merged.indexOf(init);
            if (positionToInsert !== -1) {
                // Esse circuito pode ser removido do array pois sera usado
                // OBS da linguagem: Esta remocao nao altera os proximos valores
                // que serao iterados pelo forEach e multiplas alteracoes
                var indexToRemove = circuits.indexOf(circuit);
                circuits.splice(indexToRemove, 1);
                // O loop pode continuar porque o merged foi alterado
                shouldContinue = true;
                // O array end nao contem o vertice que eh o init do novo grafo.
                // Assim podemos inserir este novo circuito antes desta parte.
                // Por exemplo, se o circuito antigo eh '1 2 3 4 1' e o novo eh '3 5 3'
                // beg == [1, 2]
                // end == [4, 1]
                var beg = merged.slice().slice(0, positionToInsert);
                var end = merged.slice().slice(positionToInsert + 1);
                // Juntamos o circuito completo.
                merged = beg.concat(circuit, end);
            }
        });
    }
    if (circuits.length !== 0) {
        // Se nao achar o caminho eh porque o grafo nao eh conectado.
        // Como no exemplo_nao_euleriano2.txt
        throw Error("O grafo nao eh conectado");
    }
    // -- Se C inclui todas arestas, eis o circuito euleriano.
    // Se nao ha mais arestas para processar, basta retornar
    // o circuito jah formatado como string e com o primeiro indice
    // comecando em 1.
    return merged.map(function (n) { return n + 1; }).join(" ");
};
var HierholzerPath = function (vertices) {
    // -- Comece de um vértice qualquer
    // -- Crie um circuito C sem repetir aresta
    // -- (ao usar uma aresta para chegar em um vértice escolha outra não usada para sair)
    var startingCircuit = createCircuit([0], vertices);
    var circuits = [startingCircuit];
    var edgesRemaining = flattenVertices(vertices);
    while (edgesRemaining.length !== 0) {
        // Ainda ha arestas para processar
        // -- Senão, enquanto C não incluir todas as arestas,
        // -- construa outro circuito a partir de um vértice de C com arestas não usadas,
        // Achamos um vertice que ainda tenha arestas disponiveis.
        var init = findNonEmptyVerticeIndex(vertices, 0);
        // Montamos um novo circuito comecando dessa aresta.
        var newCircuit = createCircuit([init], vertices);
        circuits = circuits.concat([newCircuit]);
        edgesRemaining = flattenVertices(vertices);
    }
    // -- e "junte" esse circuito a C
    // -- Se C inclui todas arestas, eis o circuito euleriano.
    return mergeCircuits(circuits);
};
exports["default"] = HierholzerPath;
