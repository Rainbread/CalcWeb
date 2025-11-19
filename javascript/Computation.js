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
