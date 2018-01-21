var operandArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
var unaryOps = ["p", "%"];
var binaryOps = ["+", "-", "*", "/"];
var equalSign = "=";
var f = "0";
var result;
var lastNumberIsResultOfEqualOperation = false;

function keyStroke(input) {
    // if last number in string is a NOT a result, 
    // THEN add last input character to the formula string
    // ELSE IF last number in string is a result AND
    // last input character is a digit
    // then wipe off result from formula and start with
    // the new number
    f += input;
    if (lastNumberIsResultOfEqualOperation) {
        if (operandArr.indexOf(input) != -1) {
            f = input;
            // reset lastNumberIsResultOfEqualOperation
            lastNumberIsResultOfEqualOperation = false;
        }
    }
    console.log("formula now evaluated: <" + f + ">");

    // delete unnecessary zeros
    f = f.replace(/(\W)0/, "$1") // if zero after an operator
    f = f.replace(/^0+(\d)/, "$1"); // if zero is in the beginning of a number

    // if the 2 last characters include are binary operators
    // => remove the 2nd last binary operator from the string
    if (binaryOps.indexOf(f[f.length - 1]) != -1 && binaryOps.indexOf(f[f.length - 2]) != -1) {
        f = f.slice(0, f.length - 1);
    }

    // if decimal point followed by an operator
    // remove the decimal point
    f = f.replace(/\.([+-/*%p])/g, "$1");

    // if the string includes 2 nos of binary operators (excluding the 
    // the first possible "-" sign), 
    // => evaluate the formula without the last binary operator
    // => formula = result + new binary operator 
    if (charOccurencesInString(f.slice(1), binaryOps) > 1) {
        result = evaluateFormula(f.slice(0, f.length - 1));
        f = result.toString() + f[f.length - 1];
        // lastNumberIsResultOfEqualOperation = true;
    }

    // if string includes 1 nos of binary operator and the equal sign 
    // => evaluate the formula without the last character (the equal sign)
    // => formula = result 
    if (charOccurencesInString(f, binaryOps) == 1 && f[f.length - 1] == equalSign) {
        result = evaluateFormula(f.slice(0, f.length - 1));
        f = result.toString();
        lastNumberIsResultOfEqualOperation = true;
    }

    // if last number in string includes 2 decimal points 
    // => remove the last decimal point from the formula
    f = f.replace(/(\.\d*)\./, "$1");


    // if string includes "p" 
    // => apply unary operator to the last number in the formula string 
    f = f.replace(/(\d*?\.?\d*?)p/, "-$1"); // for "+/-"

    // if string includes %
    // => apply unary operator to the last number in the formula string 
    if (/%/.test(f)) {
        f = divideLastNumberByHundred(f);
    }

    // update display on the display panel
    display(f);
    console.log(lastNumberIsResultOfEqualOperation);
}

function display(f) {
    /*
    Displays last number/result onto the display 
    panel of the calculator. 
    */
    // regexp to find last number, with or without decinal point
    console.log("f = " + f);
    var d;
    d = f.match(/-?\d+\.?\d*/g);
    d = d[d.length - 1];
    d = d.replace(/^(-?)0+/, "$10");
    // take out the unnecessary zeros
    d = d.replace(/^0+(\d)/, "$1");
    console.log("display(f) = ", d);
    // if last char is binary operator
    // then toggle the operator button
    if (binaryOps.indexOf(d[d.length - 1]) != -1) {
        // toggle
    }
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
    var decimals = nStr.length - nStr.search(/\./) - 1;
    result = nStr * Math.pow(10, decimals)
    result /= Math.pow(10, 2 + decimals);
    return result;
}
// console.log(divideByHundred("5.6"));

function divideLastNumberByHundred(f) {
    // just divide last number by 100 and eval the last number
    var result, index;
    result = f.match(/\d*\.?\d*%/)[0];
    result = result.match(/\d*\.?\d*/)[0] / 100;
    result = result.toString();
    index = f.match(/(\d*\.?\d*)%/).index;
    return f.slice(0, index) + result;
}
// console.log(divideLastNumberByHundred("3%"));
// console.log(divideLastNumberByHundred("4+5%"));

function evaluateFormula(f) {
    /*
    This function solves the problem of floating point arithmetic by
    multiplying each member of a binary operation by ten, then 
    dividing, to return an exact result; 
    */
    // if no decimal point in the formula, just return eval()
    if (/\./.test(f) == false) { return eval(f) }
    // if there are decimal points multiply each member by 10 
    // until there are no decimal points anymore
    // then divide by 10^number of times the operation was necessary
    else {
        var result, elements, divisor = 1;
        elements = f.split(/\+|\-|\*|\//);
        var a = elements[0], b = elements[1];
        while (/\./.test(a) || /\./.test(b)){
            a *= 10; b *= 10;
            divisor *= 10;
        }
        result = eval(a.toString() + f.match(/\+|\-|\*|\//) + b.toString());
        result /= divisor;
        return result;
    }
}
// console.log(evaluateFormula("45.2+0.45"));

//------------------
// FOR TESTING ONLY
function strToKeyStroke(str) {
    for (j = 0; j < str.length; j++) {
        keyStroke(str[j]);
    }
}

// strToKeyStroke("45.2+45%=");
// strToKeyStroke("00045.200*0045%=");
