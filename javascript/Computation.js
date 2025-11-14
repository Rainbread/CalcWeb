//------Arithmetic-------
const display = document.getElementById("display");
const isOp = ch => ['+', '-', '*', '/', '%'].includes(ch); //Used when user wants to continue evaluating more after their previous evaluation
let justEval = false; //Used to confrimed a user has done an evaluation. 

function appendToDisplay(input) {
    let current = display.textContent || '';
    if (current === 'Error') current = '';
    if (justEval) {
        if (isOp(input)) { 
            display.textContent = current + input; 
        } else {
            display.textContent = (input === '.') ? '0.' : String(input);
        }
        justEval = false;
        return;
    }

    // Rules for an empty display
    if (current === '') {
        if (input === '.') { 
            display.textContent = ''; //Display 0 on the left ide of "." when user press this first 
            return;
         }
        // Don’t start with +, *, /, %, but allow "-" (negative) and "("
        if (isOp(input) && input !== '-') return;
    }
    display.textContent = current + String(input);
}

function clearDisplay() {
    display.textContent = ""; //When button "C" is pressed
    justEval = false;
}

function calculate() {
    try {
        display.textContent = eval(display.textContent); //Used to evaluate a complete expression
    }
    catch (error) {
        display.textContent = "Error"; //Used when an incomplete or invalid expression occur 
    } finally {
        justEval = true;
    }
}


/*function adding(num1, num2) {

    const a = Number(num1);
    const b = Number(num2);

    if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;


    const raw = a + b;

    const aIsDecimal = !Number.isInteger(a);
    const bIsDecimal = !Number.isInteger(b);
    const rawIsDecimal = !Number.isInteger(raw);

    return (aIsDecimal || bIsDecimal || rawIsDecimal) ? Number(raw.toFixed(2)) : raw;

}


function subtracting(num1, num2) {


    const a = Number(num1);
    const b = Number(num2);

    if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;


    const raw = a - b;


    const aIsDecimal = !Number.isInteger(a);
    const bIsDecimal = !Number.isInteger(b);
    const rawIsDecimal = !Number.isInteger(raw);

    return (aIsDecimal || bIsDecimal || rawIsDecimal) ? Number(raw.toFixed(2)) : raw;

}

function multiplying(num1, num2) {


    const a = Number(num1);
    const b = Number(num2);

    if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;

    const raw = a * b;


    const aIsDecimal = !Number.isInteger(a);
    const bIsDecimal = !Number.isInteger(b);
    const rawIsDecimal = !Number.isInteger(raw);

    return (aIsDecimal || bIsDecimal || rawIsDecimal) ? Number(raw.toFixed(2)) : raw;
}

function dividing(num1, num2) {

    const a = Number(num1);
    const b = Number(num2);

    if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;

    if (b === 0) return undefined
    const raw = a / b;

    const aIsDecimal = !Number.isInteger(a);
    const bIsDecimal = !Number.isInteger(b);
    const rawIsDecimal = !Number.isInteger(raw);

    return (aIsDecimal || bIsDecimal || rawIsDecimal) ? Number(raw.toFixed(2)) : raw;

}*/



