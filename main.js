var sizeRows = 3;
var sizeCols = 4;
var valuesInitial = [0.7,-1.6,0.6];

const INPUT_MATRIZ = "matriz";

function main() {
    let matriz = this.generateMatrix();
    
    let vetor  = this.matchIteration(matriz);
    

}

function matchIteration(matrix){
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
    
            sub.push(matrix[i][j] * this.valuesInitial[j]);
        }

        for(let i = 0 ; i < sub.length ; i++){
            if (i == 0){
                res = value - sub[i];
            }else{
                res -= sub[i];
            }
        }
        
        result.push((1/elementDiagonal) * res);
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
    let matriz = createMatrix(sizeRows,sizeCols); // matriz com tamanho {size}
    let xCount = 0;

    for (let i = 0; i < sizeRows; i++) {
        for (let j = 0; j < sizeCols; j++) {
            matriz[i][j] = parseInt(array[xCount == array.length ? xCount : xCount++]);
        }  
    }

    return matriz;
}

function toSatisfyCriterion(matrix){

    let reduceMatrix = this.withdrawResult(matrix);//Matriz sem os resultados

    for (let i = 0; i < reduceMatrix.length; i++) {
        let sum = 0;
        let elementMainDiagonal;
        for (let j = 0; j < reduceMatrix[i].length; j++) {
            if (i != j) {
                sum += reduceMatrix[i][j];
            }else{
                elementMainDiagonal = reduceMatrix[i][j];
            }
        }
        if (elementMainDiagonal < sum) {
            return false;
        }
    }

    return true;
}


function withdrawResult(matrix){
    let tempMatrix = createMatrix(sizeRows,sizeCols - 1);

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length -1; j++) {
            tempMatrix[i][j] = matrix[i][j];
        }
    }

    return tempMatrix;
}


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
            if (!this.isValid(matrix[i][j])) {
                return false;
            }
        }  
    }

    return true;
}

function isValid(value){
    return (value != undefined && !isNaN(value) && value != null && value != "");
}