// Initialize variables for user input and state tracking
let number1 = "";
let number2 = "";
let operator = null;
let result = 0;
const maxLength = 10;
let isEqualPressed = false;
let isAfterEquals = false;
let display = document.querySelector("#display");

/*
Controls the calculator display, ensuring the text does not overflow.
- Trims the display text if its length exceeds the specified maxLength.
*/
function populateDisplay() {
  if (display.textContent.length > maxLength) {
    display.textContent = display.textContent.substring(0, maxLength);
  }
}

// Resets the calculator's state
function clearAll() {
  display.textContent = "";
  number1 = "";
  number2 = "";
  operator = null;
  result = 0;
  isEqualPressed = false;
  isAfterEquals = false;
}

/*
Handles delete functionality:
 - Exits early if the display is empty, contains an error, or matches the previous result.
 - Removes the last character from the display.
 - Updates either number1 or number2 based on the set operator.
 */
function handleDelete() {
  // Exit if display text is empty, contains an error message, or equals the result
  if (
    display.textContent === "" ||
    display.textContent === "ERROR!" ||
    display.textContent === result.toString()
  ) {
    return;
  }
  // Remove the last character from the display
  display.textContent = display.textContent.slice(0, -1);
  // Update number1 or number2 based on whether an operator is set
  if (operator === null) {
    number1 = number1.slice(0, -1);
  } else {
    number2 = number2.slice(0, -1);
  }
}

/*
appendNumberOrDecimal(input) handles number and decimal input from the user.
1. Prevent multiple decimals in the display.
2. If operator is null, append input to number1 and update display, ensuring no overflow.
3. Otherwise, append input to number2 and update display, checking its length.
*/
function appendNumberOrDecimal(input) {
  // Prevent result from being changed via number buttons
  if (isAfterEquals && input != "") {
    return;
  }
  // Prevent multiple decimals in the display
  if (input === "." && display.textContent.includes(".")) {
    return;
  }
  // Check if there is an operator
  if (operator === null) {
    // If number1 is equal to result, return number1 to prevent it from being modified
    if (number1 === result.toString()) {
      return number1;
    }
    // Handle input for the first number
    else if (number1.length < maxLength) {
      number1 += input;
      display.textContent = number1;
    }
  } else {
    if (number2.length < maxLength)
      // Handle input for the second number
      number2 += input;
    display.textContent = number2;
  }
}

/*
inputOperator(op) processes user input for operators.
1. If the first number (number1) is invalid, do nothing.
2. If the operator is null, set it to the user's input (op).
3. If number2 is defined and equals operation was triggered, chain the operation:
    - Update number1 to the result for a new calculation.
    - Reset number2, operator, isEqualPressed, and isAfterEquals.
*/
function inputOperator(op) {
  // Exit function if number1 is not a valid number
  if (number1 === "" || number1 === ".") {
    return;
  }
  // Set operator if it hasn't been set yet
  if (operator === null) {
    operator = op;
    // Handle chaining  operations after equals has been triggered
  } else if (isEqualPressed === true && number2 !== "") {
    // Prepare for a new calculation
    isAfterEquals = false;
    isEqualPressed = false;
    number1 = result.toString();
    number2 = "";
  }
  // Update operator for the next calculation
  operator = op;
}

// Add basic arithmetic functions
function add(num1, num2) {
  result = num1 + num2;
  return result;
}

function subtract(num1, num2) {
  result = num1 - num2;
  return result;
}

function multiply(num1, num2) {
  result = num1 * num2;
  return result;
}

function divide(num1, num2) {
  if (num2 === 0) {
    handleInfinityOrNaN();
    return;
  } else {
    result = num1 / num2;
    return result;
  }
}

function mod(num1, num2) {
  if (num2 === 0) {
    handleInfinityOrNaN();
    return;
  } else {
    result = num1 % num2;
  }
  return result;
}

function power(num1, num2) {
  if (result === Infinity || result === -Infinity || isNaN(result)) {
    handleInfinityOrNaN();
    return;
  }
  result = Math.pow(num1, num2);
  return result;
}

/* Handles Infinity or NaN error cases:
 1. Check if the result is Infinity, -Infinity, or NaN.
 2. If an error condition is detected, display an error message and reset relevant operation variables.
 3. Return true if an error occurred; otherwise, return false.
 */
function handleInfinityOrNaN(result) {
  if (result === Infinity || result === -Infinity || isNaN(result)) {
    display.textContent = "ERROR!";
    number1 = "";
    number2 = "";
    operator = null;
    return true;
  }
  return false;
}

/* 
operate(num1, op, num2) takes 2 number parameters and an operator parameter.
- The operator will determine which arithmetic operation the two numbers will operate on and then return a result.
- Round the result to display it, handle any potential errors.
*/
function operate(num1, op, num2) {
  // Check all inputs before proceeding
  if (isNaN(num1 || op === "" || isNaN(num2))) {
    return;
  }
  num1 = parseFloat(number1);
  num2 = parseFloat(number2);
  // Perform the operation based on the operator
  switch (op) {
    case "+":
      result = add(num1, num2);
      break;
    case "-":
      result = subtract(num1, num2);
      break;
    case "*":
      result = multiply(num1, num2);
      break;
    case "/":
      result = divide(num1, num2);
      break;
    case "%":
      result = mod(num1, num2);
      break;
    case "^":
      result = power(num1, num2);
      break;
    default:
      result = null;
  }
  // Handle potential errors and round the result
  if (!handleInfinityOrNaN(result)) {
    result = round(result, 3);
    display.textContent = result;
  }
}

// Rounds a number to the specified number of decimal places (default is 3)
function round(num, decimalPlaces = 3) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

// Initialize dom button variables to handle event listeners
let numberButtons = document.querySelectorAll(".number");
let operatorButtons = document.querySelectorAll(".operator");
let equalsButton = document.querySelector(".equals");
let deleteButton = document.querySelector(".delete");
let allClearButton = document.querySelector(".all-clear");

// Add event listeners for number buttons
numberButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    let input = e.target.dataset.number;
    appendNumberOrDecimal(input);
    populateDisplay();
  });
});

// Add event listeners for operator buttons
operatorButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    let op = e.target.dataset.operator;
    inputOperator(op);
    populateDisplay();
  });
});

// Add event listener for equals button
equalsButton.addEventListener("click", () => {
  isEqualPressed = true;
  isAfterEquals = true;
  operate(number1, operator, number2);
  populateDisplay();
});

// Add event listener for delete button
deleteButton.addEventListener("click", () => {
  handleDelete();
  populateDisplay();
});

// Add event listener for all-clear button
allClearButton.addEventListener("click", () => {
  clearAll();
  populateDisplay();
});

// Add keyboard support
document.addEventListener("keydown", (e) => {
  const operators = {
    "+": "add",
    "-": "subtract",
    "*": "multiply",
    "/": "divide",
    "%": "mod",
    "^": "power",
  };
  // Handle the keys
  if (e.key >= "0" && e.key <= "9") {
    // Handle number inputs
    appendNumberOrDecimal(e.key);
    populateDisplay();
  } else if (e.key === ".") {
    // Handle decimal point
    appendNumberOrDecimal(e.key);
    populateDisplay();
  } else if (operators.hasOwnProperty(e.key)) {
    // Handle arithmetic operations
    inputOperator(e.key);
    populateDisplay();
  } else if (e.key === "=" || e.key === "Enter") {
    // Handle equals operation
    isEqualPressed = true;
    isAfterEquals = true;
    operate(number1, operator, number2);
    populateDisplay();
  } else if (e.key === "Backspace") {
    handleDelete();
    populateDisplay();
  } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
    // Handle clear all
    clearAll();
    populateDisplay();
  }
});
