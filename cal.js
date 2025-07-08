// Global variables for calculator state
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let resetScreen = false;

// DOM elements
const currentOperandElement = document.querySelector('[data-current-operand]');
const previousOperandElement = document.querySelector('[data-previous-operand]');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-equals]');
const clearButton = document.querySelector('[data-clear]');
const toggleSignButton = document.querySelector('[data-toggle-sign]');
const percentageButton = document.querySelector('[data-percentage]');

// Function to append numbers (and decimal point) to the current operand
function appendNumber(number) {
    if (currentOperand === '0' || resetScreen) {
        currentOperand = '';
        resetScreen = false;
    }

    // Prevent multiple decimal points
    if (number === '.' && currentOperand.includes('.')) return;

    // Limit length to prevent overflow (optional, but good practice)
    if (currentOperand.length < 15) { // Arbitrary limit
        currentOperand += number;
    }
    updateDisplay();
}

// Function to choose an operation (+, -, ×, ÷)
function chooseOperation(op) {
    // If no number is entered yet, do nothing
    if (currentOperand === '') return;

    // If there's a previous operand and an operation, calculate first
    if (previousOperand !== '') {
        calculate();
    }

    operation = op;
    previousOperand = currentOperand;
    currentOperand = ''; // Clear current operand for the next number input
    updateDisplay();
}

// Function to perform the calculation
function calculate() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    // If either operand is not a number, do nothing
    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '–': // Using en dash as in the HTML for subtraction
            computation = prev - current;
            break;
        case '×':
            computation = prev * current;
            break;
        case '÷':
            if (current === 0) { // Handle division by zero
                computation = 'Error';
                resetScreen = true; // Allow new input after error
            } else {
                computation = prev / current;
            }
            break;
        default:
            return; // If no valid operation, do nothing
    }

    // Format computation to avoid long decimals, if possible
    if (typeof computation === 'number') {
        computation = parseFloat(computation.toFixed(10)); // Limit decimal places
    }

    currentOperand = computation.toString();
    operation = undefined; // Clear the operation
    previousOperand = ''; // Clear the previous operand
    resetScreen = true; // Set flag to clear screen on next number input
    updateDisplay();
}
// Function to clear all (AC)
function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    resetScreen = false; // Reset the screen flag as well
    updateDisplay();
}

// Function to toggle the sign of the current operand (+/-)
function toggleSign() {
    if (currentOperand === '0' || currentOperand === '' || isNaN(parseFloat(currentOperand))) return;
    currentOperand = (parseFloat(currentOperand) * -1).toString();
    updateDisplay();
}

// Function to calculate percentage
function percentage() {
    if (currentOperand === '0' || currentOperand === '' || isNaN(parseFloat(currentOperand))) return;
    currentOperand = (parseFloat(currentOperand) / 100).toString();
    updateDisplay();
}

// Function to update the display
function updateDisplay() {
    currentOperandElement.textContent = currentOperand;
    if (operation != null) {
        previousOperandElement.textContent = `${previousOperand} ${operation}`;
    } else {
        previousOperandElement.textContent = '';
    }
}

// Event Listeners for buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.textContent);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        chooseOperation(button.textContent);
    });
});

equalsButton.addEventListener('click', () => {
    calculate();
});

clearButton.addEventListener('click', () => {
    clearAll();
});

toggleSignButton.addEventListener('click', () => {
    toggleSign();
});

percentageButton.addEventListener('click', () => {
    percentage();
});

// Initial display update when the page loads
updateDisplay();

