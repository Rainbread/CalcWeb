//------Arithmetic-------
const display = document.getElementById("display");
const isOp = ch => ['+', '-', '*', '/', '%'].includes(ch);
let justEval = false;
display.textContent = "0";

//Fraction variables
let fractionActive = false;
let fractionTarget = 'num';

//Factorial function
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

//Advanced function
function appendFunction(funcName) {
    let current = display.textContent || '';
    if (current === 'Error') current = '';
            
    if (justEval) {
        display.textContent = funcName + '(';
        justEval = false;
        return;
    }
            
    //Display 0 initially
    if (current === '0' || current === '') {
        display.textContent = funcName + '(';
    } else {
        const lastChar = current.slice(-1);
        if (['+', '-', '*', '/', '%', '(', '^'].includes(lastChar) || current === '') {
            display.textContent = current + funcName + '(';
        } else {
            display.textContent = current + '*' + funcName + '(';
        }
    }
    justEval = false;
}

//Add factorial sign
function appendFactorial() {
    let current = display.textContent || '';
    if (current === 'Error') current = '';
            
    if (current === '0' || current === '') {
        return;
    }

    const lastChar = current.slice(-1);
    if (/[\d)]/.test(lastChar)) {
        display.textContent = current + '!';
        justEval = false;
    }
}

function appendToDisplay(input) {
    if (fractionActive) {
        const numInput = document.getElementById('fraction-num');
        const denInput = document.getElementById('fraction-den');
        const target = (fractionTarget === 'den') ? denInput : numInput;

        if (!/^[0-9.]$/.test(input)) return;
        if (input === '.' && target.value.includes('.')) return;

        target.value += input;
        return;
    }

    let current = display.textContent || '';
    if (current === 'Error') current = '';

    if (current === '0' && (/\d/.test(input) || input === '.')) {
        display.textContent = (input === '.') ? '0.' : String(input);
        justEval = false;
        return;
    }

    if (justEval) {
        if (isOp(input)) { 
            display.textContent = current + input; 
        } else {
            display.textContent = (input === '.') ? '0.' : String(input);
        }
        justEval = false;
        return;
    }

    //Speical sign (from allowed keys)
    if (input === 'π' || input === 'e') {
        if (current === '0' || current === '') {
            display.textContent = input;
        } else {
            const lastChar = current.slice(-1);
            if (/[\d)]/.test(lastChar)) {
                display.textContent = current + '*' + input;
            } else {
                display.textContent = current + input;
            }
        }
        justEval = false;
        return;
    }

    if (input === '^') {
        display.textContent = current + '^';
        justEval = false;
        return;
    }

    //Default
    display.textContent = current + String(input);
    justEval = false;
}

function clearDisplay() {
    display.textContent = "0";
    justEval = false;
    if (fractionActive) {
        cancelFraction();
    }
}

//Preprocessed expressions
function preprocessExpression(expr) {
    let processed = expr;
            
    //Replace pie and e
    processed = processed.replace(/π/g, 'Math.PI');
    processed = processed.replace(/e/g, 'Math.E');
            
    //Factorial process
    processed = processed.replace(/(\d+(?:\.\d+)?)!/g, (match, num) => {
        const n = parseFloat(num);
        return `factorial(${n})`;
    });
            
    //Exponentiation process
    processed = processed.replace(/\^/g, '**');
            
    //Square root process
    processed = processed.replace(/√\(/g, 'Math.sqrt(');
            
    //Trig process
    processed = processed.replace(/sin\(/g, 'Math.sin(');
    processed = processed.replace(/cos\(/g, 'Math.cos(');
    processed = processed.replace(/tan\(/g, 'Math.tan(');
    processed = processed.replace(/log\(/g, 'Math.log10(');
    processed = processed.replace(/ln\(/g, 'Math.log(');
            
    //Bracket close
    let openCount = (processed.match(/\(/g) || []).length;
    let closeCount = (processed.match(/\)/g) || []).length;
            
    if (openCount > closeCount) {
        processed += ')'.repeat(openCount - closeCount);
    }
            
    return processed;
}

//Evaluate expression
function evaluateExpression(expr) {
    try {
        const safeEval = new Function('Math', 'factorial', `
            try {
                with(Math) {
                    return ${expr};
                }
            } catch(e) {
                throw new Error('Calculation Error: ' + e.message);
            }
        `);
                
        const result = safeEval(Math, factorial);
                
        if (typeof result === 'number') {
            if (Number.isInteger(result)) {
                return result.toString();
            }
            return parseFloat(result.toFixed(10)).toString();
        }
                
        return result.toString();
    } catch (error) {
        throw new Error(`Invaild Expression: ${error.message}`);
    }
}

function calculate() {
    try {
        let expression = display.textContent.trim();
        const fracResult = tryFractionExpression(expression);
                
        if (fracResult !== null) {
            display.textContent = fracResult;
            if (typeof calcHistory !== 'undefined') {
                calcHistory.addRecord(expression, fracResult);
            }
        } else {
            const processedExpr = preprocessExpression(expression);
            const result = evaluateExpression(processedExpr);
            display.textContent = result;
                    
            if (typeof calcHistory !== 'undefined') {
                calcHistory.addRecord(expression, result);
            }
        }
    } catch (error) {
        console.error('Calculation error:', error);
        display.textContent = "Error";
    } finally {
        justEval = true;
    }
}

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

function makeFraction(num, den) {
    if (den === 0) throw new Error("Zero denominator");
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

function fractionToString(f) {
    if (f.den === 1) return String(f.num);
    return `${f.num}/${f.den}`;
}

function tryFractionExpression(expr) {
    expr = expr.trim();
    if (!expr.includes('/')) return null;
            
    const tokens = tokenizeFractionExpr(expr);
    if (!tokens) return null;
            
    try {
        const result = evalFractionTokens(tokens);
        return fractionToString(result);
    } catch (e) {
        return null;
    }
}

function tokenizeFractionExpr(str) {
    const tokens = [];
    const re = /\(\s*\d+\s*\/\s*\d+\s*\)|\d+\s*\/\s*\d+|[+\-*\/]/g;
            
    let match;
    while ((match = re.exec(str)) !== null) {
        const tokStr = match[0];
                
        if (/^[+\-*\/]$/.test(tokStr)) {
            tokens.push({ type: 'op', value: tokStr });
        } else {
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
            
    if (tokens.length === 0) return null;
    if (tokens[0].type !== 'frac') return null;
    if (tokens.length % 2 === 0) return null;
            
    for (let i = 1; i < tokens.length; i += 2) {
        if (tokens[i].type !== 'op') return null;
        if (i + 1 >= tokens.length || tokens[i + 1].type !== 'frac') return null;
    }
            
    return tokens;
}

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

function showFractionEditor() {
    const editor = document.getElementById('fraction-editor');
    const numInput = document.getElementById('fraction-num');
    const denInput = document.getElementById('fraction-den');
            
    numInput.value = '';
    denInput.value = '';
            
    numInput.onfocus = () => { fractionTarget = 'num'; };
    denInput.onfocus = () => { fractionTarget = 'den'; };
            
    editor.classList.add('active');
    fractionActive = true;
    fractionTarget = 'num';
            
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
