var operandArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
var binaryOps = ["+", "-", "*", "/"];
var equalSign = "=";
var f = "0";// initialization
var result;
var lastNumberIsResultOfEqualOperation = false;

function keyStroke(input, buttonID) {
    console.log("-- Calling keyStroke(" + input + ")");
    f += input;
    // if last element in string is a number && result
    // then only keep it in the string
    if (lastNumberIsResultOfEqualOperation && operandArr.indexOf(input) != -1) {
        f = input;
    }
    lastNumberIsResultOfEqualOperation = false;// reset flag
    console.log("The formula now evaluated is: " + f);

    // if user presses "C", delete the last number only
    // if formula is empty, reset it to "0"
    if (input == "C") {
        f = f.slice(0, f.length - 1);
        f = f.replace(/\d*\.?\d*$/, ""); // deletes the last number, or
        f = f.replace(/(\+|-|\*|\/)$/, ""); // deletes the last operator
        document.getElementById("result").innerHTML = "";
    }
    // if user presses "AC" delete the entire formula
    // and reset it to "0"
    if (input == "AC") { f = "0"; }

    // delete unnecessary zeros ( NECESSARY??? )
    //f = f.replace(/(\+|-|\*|\/)0/, "$1") // if zero after a binary operator
    f = f.replace(/^-?0+(\d)/, "$1"); // if zero is in the beginning of a number

    // if the 2 last characters include are binary operators
    // => remove the 2nd last binary operator from the string
    if (binaryOps.indexOf(f[f.length - 1]) != -1 && binaryOps.indexOf(f[f.length - 2]) != -1) {
        f = f.slice(0, f.length - 1);
    }

    // if decimal point followed by an operator, remove the decimal point
    f = f.replace(/\.([+-/*%p])/g, "$1");

    // if the string includes 2 nos of binary operators (excluding the 
    // the first possible "-" sign), 
    // => evaluate the formula without the last binary operator
    if (charOccurencesInString(f.slice(1), binaryOps) > 1) {
        result = evaluateFormula(f.slice(0, f.length - 1));
        f = result.toString() + f[f.length - 1];
    }

    // if string includes 1 nos of binary operator and the equal sign (excluding the 
    // the first possible "-" sign),
    // => evaluate the formula without the last character (the equal sign)
    // if (charOccurencesInString(f.slice(1), binaryOps) == 1 && f[f.length - 1] == equalSign) {
    if (f[f.length - 1] == equalSign) {
        result = evaluateFormula(f.slice(0, f.length - 1));
        f = result.toString();
        lastNumberIsResultOfEqualOperation = true;
    }

    // if a number includes 2 decimal points , remove the last one
    f = f.replace(/(\.\d*)\./, "$1");

    // apply minus operation to a number followed by "p"
    f = f.replace(/(\d*?\.?\d*?)p/, "-$1"); // for "+/-"
    
    // if there is a "%""
    if (/%/.test(f)) {
        f = divideLastNumberByHundred(f);
        lastNumberIsResultOfEqualOperation = false;
    }

    // Finally, update display panel
    display(f, buttonID);
    console.log(lastNumberIsResultOfEqualOperation);
}

function display(f, buttonID) {
    /* Displays last number/result onto the display panel of the calculator. */
    // console.log("Calling display(" + f + ")");
    let lastEl, op, numberDisplayed;
    let r = /.-?\d*\.?\d*\D?$/;
    lastEl = f.match(r);
    lastEl = lastEl[0];
    lastEl = lastEl.replace(/^-(-)/, "$1");
    lastEl = lastEl.replace(/^\+(-)/, "$1");
    lastEl = lastEl.replace(/^\d-/, "");
    lastEl = lastEl.replace(/^\+/, "");
    lastEl = lastEl.replace(/^(\+|\*|\/)/, "");

    // take out the last non numeric characters and/or last decimal point
    numberDisplayed = lastEl;
    while (["+", "-", "*", "/", "="].indexOf(numberDisplayed[numberDisplayed.length - 1]) != -1) {
        numberDisplayed = numberDisplayed.slice(0, numberDisplayed.length - 1);
    }

    // if too many digits, express result in powers of 10.
    // Note the display can fit exactly 11 digits or decimal pt


    // display
    console.log("display(" + f + ") returns", numberDisplayed);
    document.getElementById("result").innerHTML = numberDisplayed;

    // if last char is binary operator
    // then toggle the operator button in HTML
    if (buttonID != undefined && binaryOps.indexOf(lastEl[lastEl.length - 1]) != -1) {
        toggleButton(buttonID)
    }
    else {
        // untoggle all buttons
        let functionButtonArr = ["divisionBtn", "multiplicationBtn", "minusBtn", "plusBtn"];
        functionButtonArr.forEach(element => {
            document.getElementById(element).classList.remove("clicked");
        });
    }
}

function toggleButton(id) {document.getElementById(id).classList.add("clicked");}

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

function divideLastNumberByHundred(f) {
    // just divide last number by 100 and eval the last number
    var result, index;
    result = f.match(/\d*\.?\d*%/)[0];
    result = result.match(/\d*\.?\d*/)[0] / 100;
    result = result.toString();
    index = f.match(/(\d*\.?\d*)%/).index;
    return f.slice(0, index) + result;
}

function evaluateFormula(f) {
    /*
    This function solves the problem of floating point arithmetic by
    multiplying each member of a binary operation by ten, then 
    dividing, to return an exact result; 
    */
    // if no decimal point in the formula, just return eval()
    console.log("---------");
    console.log("Calling evaluateFormula(" + f + ")");
    if (/\./.test(f) == false) { return eval(f) }
    // if there are decimal points multiply each member by 10 
    // until there are no decimal points anymore
    // then divide by 10^number of times the operation was necessary
    else {
        let result, elements, op, divisor = 1;
        // elements = f.split(/\+-|\--|\*-|\/-|\+|\-|\*|\//);
        // elements = f.split(/[*/]/) || f.split(/\+-|--/) || f.split(/\+|-/);

        if (/\*|\//.test(f)) { op = f.match(/\*|\//); elements = f.split(/[*/]/) }
        else if (/\+-|--/.test(f)) { op = f.match(/\+-|--/)[0].slice(0, 1); elements = f.split(/\+-|--/) }
        else if (/\+|-/.test(f)) { op = f.match(/\+|-/); elements = f.split(/\+|-/) };

        let a = elements[0], b = elements[1];
        console.log("elements =", elements);
        console.log("a =", a, ", b =", b, ", op=", op);

        if (/\*/.test(f)) {
            let power = 0;
            while (/\./.test(a) || /\./.test(b)) {
                a = multiplyByTen(a); b = multiplyByTen(b);
                divisor = divisor * 100;
                console.log(a, b, divisor);
            }
            result = eval(a.toString() + f.match(/\+|\-|\*|\//) + b.toString());
            result /= divisor;
        }
        if (/\//.test(f)) {
            while (/\./.test(a) || /\./.test(b)) {
                a = multiplyByTen(a); b = multiplyByTen(b);
                // console.log(a, b, divisor);
            }
            result = eval(a.toString() + f.match(/\+|\-|\*|\//) + b.toString());
        }
        if (/(\+|-)/.test(f)) {
            while (/\./.test(a) || /\./.test(b)) {
                a = multiplyByTen(a); b = multiplyByTen(b);
                divisor *= 10;
                console.log(a, b, divisor);
            }
            result = eval(a.toString() + op + b.toString());
            result /= divisor;
        }
        return result;
    }
}

function multiplyByTen(str) {
    if (/\./.test(str) == false) { return str * 10 }
    if (/\.$/.test(str)) { return str * 10 }
    else {
        let decPos = str.indexOf(".");
        let decimals = str.length - decPos - 1;
        let result;
        result = str.slice(0, decPos) || "";
        result += str.slice(decPos + 1, decPos + 2);
        result += ".";
        result += str.slice(decPos + 2);
        return result;
    }
}

//------------------
// FOR TESTING ONLY
function strToKeyStroke(str) {
    console.log("Calling strToKeyStroke(" + str + ")");
    for (j = 0; j < str.length; j++) { keyStroke(str[j]); }
}
