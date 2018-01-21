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

    // if the first number starts with a "0"
    // then delete this first "0"
    f = f.replace(/^00/g, "0");
    f = f.replace(/0+([1-9]+\.?\d*)/g, "$1");

    // if the 2 last characters include are binary operators
    // => remove the 2nd last binary operator from the string
    if (binaryOps.indexOf(f[f.length - 1]) != -1 && binaryOps.indexOf(f[f.length - 2]) != -1) {
        f = f.slice(0, f.length - 1);
    }

    // if the string includes 2 nos of binary operators (excluding the 
    // the first possible "-" sign), 
    // => evaluate the formula without the last binary operator
    // => formula = result + new binary operator 
    if (charOccurencesInString(f.slice(1), binaryOps) > 1) {
        result = eval(f.slice(0, f.length - 1));
        f = result.toString() + f[f.length - 1];
        // lastNumberIsResultOfEqualOperation = true;
    }

    // if string includes 1 nos of binary operator and the equal sign 
    // => evaluate the formula without the last character (the equal sign)
    // => formula = result 
    if (charOccurencesInString(f, binaryOps) == 1 && f[f.length - 1] == equalSign) {
        result = eval(f.slice(0, f.length - 1));
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

    // if last char is operator
    // then toggle the operator button
    console.log("f = " + f);
    var d;
    d = f.match(/-?\d+\.?\d*/g);
    d = d[d.length - 1];
    d = d.replace(/^(-?)0+/, "$10");
    console.log("display(f) = ", d);
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
    // APPROACH 1: regex
    /*if (/%/.test(f)) {
       console.log("the str includes %");
       console.log(f);
       f = f.replace(f.match(/\d*\.?\d*%/)[0], divideByHundred(f.match(/\d*\.?\d*%/)[0].slice(0, this.length - 1)));
       console.log(f);
   } */

    // APPROACH 2: just divide last number by 100 and eval the last number
    var result, index;
    result = f.match(/\d*\.?\d*%/)[0];
    result = result.match(/\d*\.?\d*/)[0] / 100;
    result = result.toString();
    index = f.match(/(\d*\.?\d*)%/).index;
    return f.slice(0, index) + result;
}
// console.log(divideLastNumberByHundred("3%"));
// console.log(divideLastNumberByHundred("4+5%"));

//------------------
// FOR TESTING ONLY
function strToKeyStroke(str) {
    for (j = 0; j < str.length; j++) {
        keyStroke(str[j]);
    }
}

strToKeyStroke("4+3%=");
// strToKeyStroke("45.2+67-68=67");
