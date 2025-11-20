//------Arithmetic-------
const display = document.getElementById("display");
const isOp = ch => ['+', '-', '*', '/', '%'].includes(ch); //Used when user wants to continue evaluating more after their previous evaluation
let justEval = false; //Used to confrimed a user has done an evaluation. 

//fraction variables
let fractionActive = false;
let fractionTarget = 'num';

function appendToDisplay(input) {


if (fractionActive) {
        const numInput = document.getElementById('fraction-num');
        const denInput = document.getElementById('fraction-den');

        const target = (fractionTarget === 'den') ? denInput : numInput;


        if (!/^[0-9.]$/.test(input)) return;// ignore things like +, -, (, )
        if (input === '.' && target.value.includes('.')) return;

        target.value += input;
        return;

    }



    
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
    if (fractionActive) {
        cancelFraction(); // hide overlay + set fractionActive = false
    }
}


function calculate() {
    try {
        const expression = display.textContent.trim();

        // 1) First, try to evaluate as a pure fraction expression
        const fracResult = tryFractionExpression(expression);

        if (fracResult !== null) {
            // fracResult is a string like "2/5" or "7/3"
            display.textContent = fracResult;

            if (typeof calcHistory !== 'undefined') {
                calcHistory.addRecord(expression, fracResult);
            }
        } else {
            // 2) Otherwise, fall back to normal JS evaluation (decimal)
            const result = eval(expression);
            display.textContent = result;

            if (typeof calcHistory !== 'undefined') {
                calcHistory.addRecord(expression, result);
            }
        }
    } catch (error) {
        display.textContent = "Error";
    } finally {
        justEval = true;
    }
}




//Fraction Functions

// Greatest common divisor for integers
function gcdInt(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        const t = a % b;
        a = b;
        b = t;
    }
    return a || 1;
}

// Normalize a fraction (num/den)
function makeFraction(num, den) {
    if (den === 0) throw new Error("Zero denominator");

    // Keep sign in numerator
    if (den < 0) {
        num = -num;
        den = -den;
    }

    const g = gcdInt(num, den);
    return { num: num / g, den: den / g };
}

function addFractions(a, b) {
    return makeFraction(
        a.num * b.den + b.num * a.den,
        a.den * b.den
    );
}

function subFractions(a, b) {
    return makeFraction(
        a.num * b.den - b.num * a.den,
        a.den * b.den
    );
}

function mulFractions(a, b) {
    return makeFraction(
        a.num * b.num,
        a.den * b.den
    );
}

function divFractions(a, b) {
    if (b.num === 0) throw new Error("Division by zero");
    return makeFraction(
        a.num * b.den,
        a.den * b.num
    );
}

// Turn a fraction into a display string
function fractionToString(f) {
    if (f.den === 1) return String(f.num); // plain integer
    return `${f.num}/${f.den}`;
}

/**
 * Try to evaluate an expression made only of fractions (a/b) and + - * /.
 * Supports ANY number of fractions, like:
 *   (1/5) + (1/5) + (1/5)
 *   1/3 + 1/6 * 3/2
 * Returns a string like "2/5" or "9/8" on success, or null to fall back to eval().
 */
function tryFractionExpression(expr) {
    expr = expr.trim();

    // If there's no "/" at all, it's definitely not a fraction expression → bail out
    if (!expr.includes('/')) return null;

    const tokens = tokenizeFractionExpr(expr);
    if (!tokens) return null;

    try {
        const result = evalFractionTokens(tokens);
        return fractionToString(result);
    } catch (e) {
        // Any problem => not a clean fraction expression; let normal eval handle it
        return null;
    }
}

// Tokenize into: {type: 'frac', value: {num,den}} or {type: 'op', value:'+','-','*','/'}
function tokenizeFractionExpr(str) {
    const tokens = [];
    // Matches: (a/b)  or  a/b  or  an operator
    const re = /\(\s*\d+\s*\/\s*\d+\s*\)|\d+\s*\/\s*\d+|[+\-*\/]/g;

    let match;
    while ((match = re.exec(str)) !== null) {
        const tokStr = match[0];

        // Operator?
        if (/^[+\-*\/]$/.test(tokStr)) {
            tokens.push({ type: 'op', value: tokStr });
        } else {
            // Fraction, possibly wrapped in parentheses
            let fracStr = tokStr.trim();
            if (fracStr.startsWith('(') && fracStr.endsWith(')')) {
                fracStr = fracStr.slice(1, -1).trim();
            }
            const parts = fracStr.split('/');
            if (parts.length !== 2) return null;

            const n = Number(parts[0]);
            const d = Number(parts[1]);
            if (!Number.isInteger(n) || !Number.isInteger(d)) return null;

            tokens.push({ type: 'frac', value: makeFraction(n, d) });
        }
    }

    // Basic structure check: frac op frac op frac ...
    if (tokens.length === 0) return null;
    if (tokens[0].type !== 'frac') return null;
    if (tokens.length % 2 === 0) return null; // must be odd length

    for (let i = 1; i < tokens.length; i += 2) {
        if (tokens[i].type !== 'op') return null;
        if (i + 1 >= tokens.length || tokens[i + 1].type !== 'frac') return null;
    }

    return tokens;
}

// Evaluate tokens with normal operator precedence (*, / before +, -)
function evalFractionTokens(tokens) {
    const values = [];
    const ops = [];

    function precedence(op) {
        if (op === '+' || op === '-') return 1;
        if (op === '*' || op === '/') return 2;
        return 0;
    }

    function applyTopOp() {
        const op = ops.pop();
        const b = values.pop();
        const a = values.pop();
        switch (op) {
            case '+': values.push(addFractions(a, b)); break;
            case '-': values.push(subFractions(a, b)); break;
            case '*': values.push(mulFractions(a, b)); break;
            case '/': values.push(divFractions(a, b)); break;
        }
    }

    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];

        if (t.type === 'frac') {
            values.push(t.value);
        } else if (t.type === 'op') {
            while (ops.length > 0 && precedence(ops[ops.length - 1]) >= precedence(t.value)) {
                applyTopOp();
            }
            ops.push(t.value);
        }
    }

    while (ops.length > 0) {
        applyTopOp();
    }

    if (values.length !== 1) {
        throw new Error("Invalid fraction expression");
    }
    return values[0];
}





/*function calculate() {
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
} */



//Fraction function

function showFractionEditor() {
    const editor = document.getElementById('fraction-editor');
    const numInput = document.getElementById('fraction-num');
    const denInput = document.getElementById('fraction-den');

    //reset field 
    numInput.value = '';
    denInput.value = '';

    numInput.onfocus = () => { fractionTarget = 'num' };
    denInput.onfocus = () => { fractionTarget = 'den' };

    //Show overlay 
    editor.classList.add('active');
    fractionActive = true;
    fractionTarget = 'num';

    //start typing on num
    numInput.focus();
}

function cancelFraction() {
    const editor = document.getElementById('fraction-editor');
    editor.classList.remove('active');
    fractionActive = false;
    fractionTarget = null;
}

function confirmFraction() {
    const num = document.getElementById('fraction-num').value.trim();
    const den = document.getElementById('fraction-den').value.trim();

    if (!num || !den) {
        alert('Please enter both numerator and denominator.');
        return;
    }
    if (Number(den) === 0) {
        alert('Denominator cannot be 0.');
        return;
    }

    const fracExpr = `(${num}/${den})`;
    cancelFraction();
    appendToDisplay(fracExpr);

}

document.addEventListener('keydown', (e) => {

    if (!fractionActive) return

    const numInput = document.getElementById('fraction-num');
    const denInput = document.getElementById('fraction-den');


    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {

        e.preventDefault();
        if (fractionTarget === 'den') {
            numInput.focus();
        }


    }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {

        e.preventDefault()
        if (fractionTarget === 'num') {
            denInput.focus();
        }


    }

});
