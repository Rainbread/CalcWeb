



//------Arithmetic-------

function adding(num1, num2) {

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

}



