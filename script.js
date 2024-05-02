// Create user input variables
let number1 = "";
let number2 = "";
let operator = null;
let result = 0;
const maxLength = 10;
let isEqualPressed = false;
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
}

/*
Handles delete functionality: 
- Exits early if the display is empty or if it contains a previous result.
- Removes the last character from the display.
- Update either number1 or number2 based on whether an operator is set.
 */
function handleDelete() {
  if (display.textContent === "" || display.textContent === result.toString()) {
    return;
  }
  // Remove the last character from the display
  display.textContent = display.textContent.slice(0, -1);
  // Update the appropriate number (number1 or number2)
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
  if (input === "." && display.textContent.includes(".")) {
    return;
  }
  if (operator === null) {
    // Handle input for the first number
    if (number1.length < maxLength) {
      number1 += input;
      display.textContent = number1;
    }
  } else if (number2.length < maxLength) {
    // Handle input for the second number
    number2 += input;
    display.textContent = number2;
  }
}

/*
Create function inputOperator(op) to handle operator input.
1. If the first number (number1) is invalid, do nothing.
2. If the operator is null, set it to the user's input (op).
3. If the equals operation was just triggered, chain the operation:
    - Update number1 to the result for a new calculation.
    - Reset number2, operator, and isEqualPressed.
*/
function inputOperator(op) {
  // Exit function if number1 is not a valid number
  if (number1 === "" || number1 === ".") {
    return;
  }
  // Set operator if it hasn't been set yet
  if (operator === null) {
    operator = op;
  } // Handle operation chaining if the equals button has been pressed
  else if (isEqualPressed === true) {
    isEqualPressed = false;
    number1 = result.toString();
    number2 = "";
  }
  // Update operator for the next calculation
  operator = op;
}

// Create basic arithmetic functions
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

/* Handles error cases
 1. Check if the result is NaN, Infinity, or -Infinity.
 2. If so, the function displays an error message and resets current operation variables.
 3. Return true if there is an error, false otherwise.
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

// Create function operate that takes two numbers and an operator, then based on the operator it calls one of the arithmetic functions.
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

// Rounds a number to the specified number of decimal places (default is 3).
function round(num, decimalPlaces = 3) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

// Add dom button variables to handle event listeners
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
