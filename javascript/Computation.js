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
        const expression = display.textContent;
        const result = eval(display.textContent); //Used to evaluate a complete expression
        display.textContent = result;
        
        //Add to history
        if (typeof calcHistory !== 'undefined') {
            calcHistory.addRecord(expression, result);
        }
    }
    catch (error) {
        display.textContent = "Error"; //Used when an incomplete or invalid expression occur 
    } finally {
        justEval = true;
    }
}
