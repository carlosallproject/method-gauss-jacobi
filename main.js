var SIZE_ROWS = 3;
var SIZE_COLS = 4;
var DEFAULT_INITIAL_VALUES = [0,0,0];
var DEFAULT_EPSILON = 0.05;
var EPYSILON;

const INPUT_MATRIZ = "matriz";
const INITIAL_VALUES = "initialValue";
const RESPONSE_VALUES = "response";

/**
 * Metodo Main
 */
function main() {
    let matriz = this.generateMatrix();
    let valuesInitial = this.getAllValuesOfForm(INITIAL_VALUES);
    valuesInitial = this.htmlColletionFromArray(valuesInitial);
    this.EPYSILON = this.epsilon();
    let vetor;

    if (!isValid(valuesInitial)) {
        valuesInitial = DEFAULT_INITIAL_VALUES;
    }

    do {
        if (vetor != undefined) {
            valuesInitial = vetor;
        }
        vetor = this.matchIteration(matriz,valuesInitial);
    } while (this.stopCriterion(valuesInitial,vetor));

    this.defineResponse(vetor);
}

/**
 * Define a saida da respota final
 * @param {*} vetor array contendo resposta final
 */
function defineResponse(vetor){
    let tableHTML = this.getAllValuesOfForm(RESPONSE_VALUES);

    for (let i = 0; i < vetor.length; i++) {
        tableHTML[i].value = vetor[i];
    }

}

/**
 * valida o criterio de parada
 * @param {*} beforeVector array anterior
 * @param {*} afterVector array atual
 */
function stopCriterion(beforeVector, afterVector){

    let newVector = [];

    for (let i = 0; i < beforeVector.length; i++) {
        let x = (beforeVector[i] - afterVector[i])
        newVector.push(x < 0 ? -x : x);
    }

    let d = this.biggerValue(newVector) / this.biggerValue(afterVector);

    return d > this.EPYSILON;
}

function biggerValue(vector){
    let biggerValue = 0;

    vector.forEach( value => {
        biggerValue = value > biggerValue ? value : biggerValue;
    });

    return biggerValue;
}

/**
 * Obtem o x da linha na iteração
 * @param {*} matrix matrix de input
 * @param {*} values valores iniciais dependendo da iteração
 */
function matchIteration(matrix,values){
    let result = [];

    for(var i = 0; i < matrix.length; i++){
        let value = matrix[i][matrix[i].length - 1]; 
        let elementDiagonal;
        let sub = [];
        for (var j = 0 ; j < matrix[i].length; j++){
            if(! (i != j)){
                elementDiagonal = matrix[i][j];
                continue;
            }
    
            if(j == matrix[i].length - 1){
                continue;
            }
    
            sub.push(matrix[i][j] * values[j]);
        }

        for(let i = 0 ; i < sub.length ; i++){
            if (i == 0){
                res = value - sub[i];
            }else{
                res -= sub[i];
            }
        }
        
        result.push(parseFloat((1/elementDiagonal) * res).toFixed(4));
    }

    return result;
}

/**
 * Popula toda a matrix de acordo com a matrix de entrada do usuario
 */
function generateMatrix(){
    let elements = this.getAllValuesOfForm(INPUT_MATRIZ); //Todos os elementos do Form
    let arrayMatriz = this.htmlColletionFromArray(elements); //Array contendo todos os valores da matriz
    let matrix = this.transformArrayInMatrix(arrayMatriz);

    if (!this.validateMatrix(matrix)) {
        throw "Preencha todos os campos da Matriz";
    }

    if (!this.toSatisfyCriterion(matrix)) {
        throw "Matriz não satisfaz o criterio de linhas";
    }

    return matrix;
}

function transformArrayInMatrix(array){
    let matriz = createMatrix(SIZE_ROWS,SIZE_COLS); // matriz com tamanho {size}
    let xCount = 0;

    for (let i = 0; i < SIZE_ROWS; i++) {
        for (let j = 0; j < SIZE_COLS; j++) {
            matriz[i][j] = parseInt(array[xCount == array.length ? xCount : xCount++]);
        }  
    }

    return matriz;
}

/**
 * Valida em modulo se satisfaz o criterio de linha (a convergencia)
 * @param {*} matrix matrix de input para teste
 */
function toSatisfyCriterion(matrix){

    let reduceMatrix = this.withdrawResult(matrix);//Matriz sem os resultados

    for (let i = 0; i < reduceMatrix.length; i++) {
        let sum = 0;
        let elementMainDiagonal;
        for (let j = 0; j < reduceMatrix[i].length; j++) {
            if (i != j) {
                sum += reduceMatrix[i][j] < 0 ? - reduceMatrix[i][j] : reduceMatrix[i][j];
            }else{
                elementMainDiagonal = reduceMatrix[i][j] < 0 ? - reduceMatrix[i][j] : reduceMatrix[i][j];
            }
        }
        if (elementMainDiagonal < sum) {
            return false;
        }
    }

    return true;
}

/**
 * Retorna uma matrix sem as suas igualdades
 * @param {*} matrix matrix de input para alteração
 */
function withdrawResult(matrix){
    let tempMatrix = createMatrix(SIZE_ROWS,SIZE_COLS - 1);

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length -1; j++) {
            tempMatrix[i][j] = matrix[i][j];
        }
    }

    return tempMatrix;
}

/**
 * transforma os nodes de elementos do html em array
 * @param {*} htmlFormCollection Elementos do html
 */
function htmlColletionFromArray(htmlFormCollection){
    let array = [];
    for (const element of htmlFormCollection) {
        if (element.tagName != "INPUT") {
            continue;
        }
        array.push(element.value);
    }

    return array;
}

/**
 * Define o episilom e se não existir o padrão é 0.05
 */
function epsilon(){
    let inputEpsilon = document.getElementById("epsilon");

    if (!isValid(inputEpsilon)) {
        return DEFAULT_EPSILON;
    }

    return isValid(inputEpsilon.value) ? inputEpsilon.value : DEFAULT_EPSILON;  
}

/**
 * Obtendo todos os elementos do Form
 * @param {string} nameForm Nome do Form 
 * @return {HTMLFormControlsColletion} Coleção de elementos do form
 */
function getAllValuesOfForm(nameForm){
    let elements = document.getElementsByName(nameForm);
    elements = elements[0].elements;
    return elements;
}

/**
 * Cria uma matriz quadratica dado o tamanho
 * @param {number} size Tamanho da matriz quadratica
 * @return Matriz Quadratica de tamanho {size}
 */
function createSquareMatrix(size){
    return createMatrix(size,size);
}

/**
 * Cria uma matriz multidimensional dado a quantidade de linhas e colunas
 * @param {number} rows Numero de linhas
 * @param {number} cols Numero de Colunas
 * @return Matriz de tamanho {rows} x {cols}
 */
function createMatrix(rows,cols){
    var matrix = new Array(rows);

    for (var i = 0; i < matrix.length; i++) {
        matrix[i] = new Array(cols);
    }

    return matrix;
}

function validateMatrix(matrix){
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            if (!this.isValidAndNotNan(matrix[i][j])) {
                return false;
            }
        }  
    }

    return true;
}

function isValidAndNotNan(value){
    return this.isValid(value) && !(isNaN(value));
}

function isValid(value){
    return (value != undefined && value != null && value != "");
}