var operandArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
var operandColl = [
    { 0: "digit" },
    { 1: "digit" },
    { 2: "digit" },
    { 3: "digit" },
    { 4: "digit" },
    { 5: "digit" },
    { 6: "digit" },
    { 7: "digit" },
    { 8: "digit" },
    { 9: "digit" },
    { 10: "digit" },
    { ".": "decimal point" }
]
// var operatorArr = ["+", "-", "*", "/", "=", "+/-", "%"];
var unaryOps = ["pm", "%"];
var binaryOps = ["+", "-", "*", "/"];
var equalSign = "=";
var f = "0";
var result;

function keyStroke(input) {
    // if the 2 last characters include are binary operators
    // => remove the 2nd last binary operator from the string
    if (binaryOps.indexOf(f[f.length - 1]) != -1 && binaryOps.indexOf(f[f.length - 2]) != -1) {
        f = f.slice(0, f.length - 1);
    }

    // if the string includes 2 nos of binary operators
    // => evaluate the formula without the last binary operator
    // => formula = result + new binary operator 
    if (charOccurencesInString(f, binaryOps) > 1) {
        result = eval(f[f.length - 1]);
        f = result.toString() + f[f.length - 1];
    }

    // if string includes 1 nos of binary operator and the equal sign 
    // => evaluate the formula without the last character (the equal sign)
    // => formula = result 
    if (charOccurencesInString(f, binaryOps) == 1 && f[f.length - 1] == equalSign) {
        result = eval(f[f.length - 1]);
        f = result.toString();
    }

    // if last number in string includes 2 decimal points 
    // => remove the last decimal point from the formula
    f = f.replace(/(\.\d*)\./, "$1");

    // if string includes "pm" 
    // => apply unary operator to the last number in the formula string 
    f = f.replace(/(\d*?\.?\d*?)pm/, "-$1"); // for "+/-"

    // if string includes %
    // => apply unary operator to the last number in the formula string 
    f = f.replace(f.match(/\d*\.?\d*%/), divideByHundred(f.match(/\d*\.?\d*%/)[0].slice(0, this.length - 1)));

    // update display on the display panel
    display(f);
}

function display(f) {
    /*
    Displays last number/result onto the display 
    panel of the calculator. 
    */
    // regexp to find last number, with or without decinal point

    // if last char is operator
    // then toggle the operator button
}

function charOccurencesInString(aStr, anArrOfChars) {
    /*
    This function returns the number of occurences of an list
    of characters in a string. 
    aStr: string
    anArrOfChars: array of strings
    */
    var counter = 0;
    for (i = 0; i < aStr.length; i++) {
        if (anArrOfChars.indexOf(aStr[i]) != -1) { counter++ }
    }
    return counter;
}

function divideByHundred(nStr) {
    var decimals = test.length - test.search(/\./) - 1;
    result = nStr * Math.pow(10, decimals) 
    result /= Math.pow(10, 2 + decimals);
    return result;
}

// console.log(divideByHundred("5.6"));

// FOR TESTING ONLY
function strToKeyStroke(str) {
    for (i = 0; i < str.length; i++) {
        keyStroke(str[i]);
    }
}

strToKeyStroke("3*4");
