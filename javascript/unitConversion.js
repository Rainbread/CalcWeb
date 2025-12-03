class UnitConverter {
    constructor() {
        this.conversionFactors = {
            //Mass
            'kg': {type: 'mass', factor: 1, display: 'KG'},
            'g': {type: 'mass', factor: 0.001, display: 'G'},
            'mg': {type: 'mass', factor: 0.000001, display: 'MG'},
            'lb': {type: 'mass', factor: 0.453592, display: 'LB'},
            'oz': {type: 'mass', factor: 0.0283495, display: 'OZ'},
            
            //Length
            'm': {type: 'length', factor: 1, display: 'M'},
            'cm': {type: 'length', factor: 0.01, display: 'CM'},
            'mm': {type: 'length', factor: 0.001, display: 'MM'},
            'km': {type: 'length', factor: 1000, display: 'KM'},
            'in': {type: 'length', factor: 0.0254, display: 'IN'},
            'ft': {type: 'length', factor: 0.3048, display: 'FT'},
            'mi': {type: 'length', factor: 1609.34, display: 'MI'},
            
            //Volume
            'L': {type: 'volume', factor: 1, display: 'L'},
            'mL': {type: 'volume', factor: 0.001, display: 'ML'},
            'gal': {type: 'volume', factor: 3.78541, display: 'GAL'},
            
            //Temperature
            'C': {type: 'temperature', display: '°C'},
            'F': {type: 'temperature', display: '°F'},
            'K': {type: 'temperature', display: 'K'}
        };
        
        this.unitDisplayNames = {
            'kg': 'Kilograms (KG)',
            'g': 'Grams (G)',
            'mg': 'Milligrams (MG)',
            'lb': 'Pounds (LB)',
            'oz': 'Ounces (OZ)',
            'm': 'Meters (M)',
            'cm': 'Centimeters (CM)',
            'mm': 'Millimeters (MM)',
            'km': 'Kilometers (KM)',
            'in': 'Inches (IN)',
            'ft': 'Feet (FT)',
            'mi': 'Miles (MI)',
            'L': 'Liters (L)',
            'mL': 'Milliliters (ML)',
            'gal': 'Gallons (GAL)',
            'C': 'Celsius (°C)',
            'F': 'Fahrenheit (°F)',
            'K': 'Kelvin (K)'
        };
        
        this.unitCategories = {
            'mass': ['kg', 'g', 'mg', 'lb', 'oz'],
            'length': ['m', 'cm', 'mm', 'km', 'in', 'ft', 'mi'],
            'volume': ['L', 'mL', 'gal'],
            'temperature': ['C', 'F', 'K']
        };
        this.currentCategory = 'mass';
        this.initialize();
    }
    
    initialize() {
        this.valueInput = document.getElementById('conversion-value');
        this.fromUnitSelect = document.getElementById('conversion-from-unit');
        this.toUnitSelect = document.getElementById('conversion-to-unit');
        this.resultDisplay = document.getElementById('conversion-result');
        this.categoryButtons = document.querySelectorAll('.category-btn');
        this.unitOptionsContainer = document.getElementById('unit-options');
        this.bindEvents();
        this.showCategory('mass');
        this.performConversion();
    }
    
    bindEvents() {
        //Auto convert when number detected
        this.valueInput.addEventListener('input', () => this.performConversion());
        
        //Auto convert and update when unit is changed
        this.fromUnitSelect.addEventListener('change', () => {
            this.updateToUnitOptions();
            this.updateCurrentCategory();
            this.updateUnitOptions();
            this.performConversion();
        });

        this.toUnitSelect.addEventListener('change', () => {
            this.performConversion();
            this.updateUnitOptions();
        });
        
        //Category buttons event
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.showCategory(category);
            });
        });
        
        //Display the result
        this.formatResultDisplay();
    }
    
    showCategory(category) {
        this.currentCategory = category;
        
        //Update category button
        this.categoryButtons.forEach(button => {
            if (button.getAttribute('data-category') === category) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        this.updateUnitOptions(category);
    }
    
    updateUnitOptions(category = null) {
        const targetCategory = category || this.currentCategory;
        const units = this.unitCategories[targetCategory];
        this.unitOptionsContainer.innerHTML = '';
        
        units.forEach(unit => {
            const button = document.createElement('button');
            button.className = 'unit-option';
            button.textContent = this.unitDisplayNames[unit];
            button.setAttribute('data-unit', unit);
            
            if (unit === this.fromUnitSelect.value || unit === this.toUnitSelect.value) {
                button.classList.add('selected');
            }
            
            button.addEventListener('click', (e) => {
                const selectedUnit = e.target.getAttribute('data-unit');
                this.setUnit(selectedUnit);
            });
            
            this.unitOptionsContainer.appendChild(button);
        });
    }
    
    updateSelectOptionsForCategory(category) {
        const units = this.unitCategories[category];
        const fromUnit = this.fromUnitSelect.value;
        const toUnit = this.toUnitSelect.value;
        
        if (!units.includes(fromUnit)) {
            const fromUnitType = this.conversionFactors[fromUnit]?.type;
            const sameTypeUnits = units.filter(u => this.conversionFactors[u].type === fromUnitType);
            
            if (sameTypeUnits.length > 0) {
                this.fromUnitSelect.value = sameTypeUnits[0];
            } else {
                this.fromUnitSelect.value = units[0];
            }
        }
        
        if (!units.includes(toUnit)) {
            //Keep the same type of unit
            const toUnitType = this.conversionFactors[toUnit]?.type;
            const sameTypeUnits = units.filter(u => this.conversionFactors[u].type === toUnitType);
            
            if (sameTypeUnits.length > 0 && !sameTypeUnits.includes(this.fromUnitSelect.value)) {
                this.toUnitSelect.value = sameTypeUnits[0];
            } else {
                const fromUnitType = this.conversionFactors[this.fromUnitSelect.value]?.type;
                const otherSameTypeUnits = units.filter(u => 
                    this.conversionFactors[u].type === fromUnitType && u !== this.fromUnitSelect.value
                );
                if (otherSameTypeUnits.length > 0) {
                    this.toUnitSelect.value = otherSameTypeUnits[0];
                } else {
                    this.toUnitSelect.value = units[1] || units[0];
                }
            }
        }
        this.updateToUnitOptions();
        this.performConversion();
    }
    
    updateToUnitOptions() {
        const fromUnit = this.fromUnitSelect.value;
        const fromUnitType = this.conversionFactors[fromUnit]?.type;
        if (!fromUnitType) return;
        
        //Curent category
        const category = this.getUnitCategory(fromUnit);
        if (!category) return;
        //All unit from current category
        const categoryUnits = this.unitCategories[category];
        //Save current unit
        const currentToUnit = this.toUnitSelect.value;
        //Clear current unit
        this.toUnitSelect.innerHTML = '';
        
        categoryUnits.forEach(unit => {
            const unitType = this.conversionFactors[unit]?.type;
            if (unitType === fromUnitType) {
                const option = document.createElement('option');
                option.value = unit;
                option.textContent = this.unitDisplayNames[unit];
                if (unit === currentToUnit || (unit !== fromUnit && currentToUnit === fromUnit)) {
                    option.selected = true;
                }
                this.toUnitSelect.appendChild(option);
            }
        });
        //If no unit is selected, the first unit will be selected
        if (this.toUnitSelect.selectedIndex === -1 && this.toUnitSelect.options.length > 0) {
            this.toUnitSelect.selectedIndex = 0;
        }
    }
    
    getUnitCategory(unit) {
        for (const [category, units] of Object.entries(this.unitCategories)) {
            if (units.includes(unit)) {
                return category;
            }
        }
        return null;
    }
    
    updateCurrentCategory() {
        const fromUnit = this.fromUnitSelect.value;
        const category = this.getUnitCategory(fromUnit);
        
        if (category && category !== this.currentCategory) {
            this.currentCategory = category;
            
            //Update category
            this.categoryButtons.forEach(button => {
                if (button.getAttribute('data-category') === category) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
            this.updateUnitOptions(category);
        }
    }
    
    setUnit(unit) {
        const fromUnit = this.fromUnitSelect.value;
        const toUnit = this.toUnitSelect.value;
        const unitType = this.conversionFactors[unit]?.type;
        if (!unitType) return;
        
        const unitCategory = this.getUnitCategory(unit);
        if (unitCategory && unitCategory !== this.currentCategory) {
            this.currentCategory = unitCategory;
            
            this.categoryButtons.forEach(button => {
                if (button.getAttribute('data-category') === unitCategory) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
            this.updateUnitOptions(unitCategory);
        }
        
        if (fromUnit === unit) {
            const currentCategory = this.currentCategory;
            const categoryUnits = this.unitCategories[currentCategory];
            const toUnitType = this.conversionFactors[toUnit]?.type;
            
            const sameTypeUnits = categoryUnits.filter(u => 
                this.conversionFactors[u].type === toUnitType && u !== unit
            );
            
            if (sameTypeUnits.length > 0) {
                this.toUnitSelect.value = sameTypeUnits[0];
            }
        } else if (toUnit === unit) {
            const currentCategory = this.currentCategory;
            const categoryUnits = this.unitCategories[currentCategory];
            const fromUnitType = this.conversionFactors[fromUnit]?.type;
            
            const sameTypeUnits = categoryUnits.filter(u => 
                this.conversionFactors[u].type === fromUnitType && u !== unit
            );
            
            if (sameTypeUnits.length > 0) {
                this.fromUnitSelect.value = sameTypeUnits[0];
            }
        } else {
            const currentToUnitType = this.conversionFactors[toUnit]?.type;
            if (unitType === currentToUnitType) {
                this.fromUnitSelect.value = unit;
            } else {
                const currentCategory = this.currentCategory;
                const categoryUnits = this.unitCategories[currentCategory];
                const sameTypeUnits = categoryUnits.filter(u => 
                    this.conversionFactors[u].type === unitType && u !== unit
                );
                
                if (sameTypeUnits.length > 0) {
                    this.fromUnitSelect.value = unit;
                    this.toUnitSelect.value = sameTypeUnits[0];
                }
            }
        }
        this.updateToUnitOptions();
        this.performConversion();
        this.updateUnitOptions();
    }
    
    performConversion() {
        try {
            const value = parseFloat(this.valueInput.value) || 0;
            const fromUnit = this.fromUnitSelect.value;
            const toUnit = this.toUnitSelect.value;
            const fromUnitType = this.conversionFactors[fromUnit]?.type;
            const toUnitType = this.conversionFactors[toUnit]?.type;
            
            if (fromUnitType !== toUnitType) {
                this.resultDisplay.textContent = 'Type Mismatch';
                this.formatResultDisplay();
                return;
            }
            
            if (fromUnit === toUnit) {
                this.resultDisplay.textContent = value.toFixed(6);
                this.formatResultDisplay();
                return;
            }
            let result;
            
            if (fromUnitType === 'temperature') {
                result = this.convertTemperature(value, fromUnit, toUnit);
            } else {
                const valueInBase = value * this.conversionFactors[fromUnit].factor;
                result = valueInBase / this.conversionFactors[toUnit].factor;
            }

            let formattedResult;
            if (Math.abs(result) >= 1000000 || (Math.abs(result) < 0.001 && result !== 0)) {
                formattedResult = result.toExponential(6);
            } else {
                const absResult = Math.abs(result);
                let decimals;
                if (absResult >= 1000) decimals = 0;
                else if (absResult >= 100) decimals = 1;
                else if (absResult >= 10) decimals = 2;
                else if (absResult >= 1) decimals = 3;
                else if (absResult >= 0.1) decimals = 4;
                else if (absResult >= 0.01) decimals = 5;
                else decimals = 6;
                formattedResult = result.toFixed(decimals);
            }
            this.resultDisplay.textContent = formattedResult;
            this.formatResultDisplay();
        } catch (error) {
            console.error('Conversion error:', error);
            this.resultDisplay.textContent = 'Error';
            this.formatResultDisplay();
        }
    }
    
    convertTemperature(value, fromUnit, toUnit) {
        let celsius;

        switch (fromUnit) {
            case 'C':
                celsius = value;
                break;
            case 'F':
                celsius = (value - 32) * 5/9;
                break;
            case 'K':
                celsius = value - 273.15;
                break;
            default:
                throw new Error('Invalid temperature unit');
        }
        
        switch (toUnit) {
            case 'C':
                return celsius;
            case 'F':
                return (celsius * 9/5) + 32;
            case 'K':
                return celsius + 273.15;
            default:
                throw new Error('Invalid temperature unit');
        }
    }
    
    formatResultDisplay() {
        let formatDisplay = document.querySelector('.result-format');
        if (!formatDisplay) {
            formatDisplay = document.createElement('div');
            formatDisplay.className = 'result-format';
            this.unitOptionsContainer.parentNode.insertBefore(formatDisplay, this.unitOptionsContainer.nextSibling);
        }
        
        const value = this.valueInput.value || '0';
        const fromUnit = this.fromUnitSelect.value;
        const toUnit = this.toUnitSelect.value;
        const result = this.resultDisplay.textContent;
        
        const fromUnitDisplay = this.conversionFactors[fromUnit]?.display || fromUnit;
        const toUnitDisplay = this.conversionFactors[toUnit]?.display || toUnit;
        
        formatDisplay.innerHTML = `
            ${value} <span>${fromUnitDisplay}</span> = ${result} <span>${toUnitDisplay}</span>
        `;
    }
}

let unitConverter;
function initUnitConversion() {
    unitConverter = new UnitConverter();
}

function openUnitConversion() {
    const window = document.getElementById('unit-conversion-sidebar');
    const overlay = document.getElementById('unit-conversion-overlay');
    
    if (window && overlay) {
        window.classList.add('active');
        overlay.classList.add('active');
        
        //Set default if unit cannot be converted
        if (!unitConverter) {
            initUnitConversion();
        }

        if (unitConverter) {
            const currentFromUnit = unitConverter.fromUnitSelect.value;
            const unitType = unitConverter.conversionFactors[currentFromUnit]?.type || 'mass';
            
            //Check the category if it is the same
            let category = 'mass';
            if (unitType === 'length') category = 'length';
            else if (unitType === 'volume') category = 'volume';
            else if (unitType === 'temperature') category = 'temperature';
            
            unitConverter.showCategory(category);
        }
    }
}

//Close unit conversion sidebar by click on overlay
function closeUnitConversion() {
    const window = document.getElementById('unit-conversion-sidebar');
    const overlay = document.getElementById('unit-conversion-overlay');
    
    if (window && overlay) {
        window.classList.remove('active');
        overlay.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const unitConversionBtn = document.getElementById('unit-conversion-btn');
    if (unitConversionBtn) {
        unitConversionBtn.addEventListener('click', openUnitConversion);
    }
    
    const closeBtn = document.getElementById('close-unit-conversion');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeUnitConversion);
    }

    const overlay = document.getElementById('unit-conversion-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeUnitConversion);
    }
    initUnitConversion();
});

//Global scope
window.openUnitConversion = openUnitConversion;
window.closeUnitConversion = closeUnitConversion;
window.unitConverter = unitConverter;
