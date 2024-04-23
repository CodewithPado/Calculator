// Create user input variables
let number1 = "";
let number2 = "";
let operator = null;
let result = 0;
const maxLength = 10;
let isEqualPressed = false;
let display = document.querySelector("#display");

/*
Function populateDisplay() ensures the display text does not overflow.
1. Shorten the display text if its length exceeds maxLength.
*/
function populateDisplay() {
  if (display.textContent.length > maxLength) {
    display.textContent = display.textContent.substring(0, maxLength);
  }
}

/*
Create function appendNumberOrDecimal(input) to handle number and decimal input.
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
Create function inputOperator(userOp) to handle operator input.
1. If the first number (number1) is invalid, do nothing.
2. If the operator is null, set it to the user's input (userOp).
3. If the equals operation was just triggered, chain the operation:
    - Update number1 to the result for a new calculation.
    - Reset number2, operator, and isEqualPressed.
*/
function inputOperator(userOp) {
  // Exit function if number1 is not a valid number
  if (number1 === "" || number1 === ".") {
    return;
  }
  // Set operator if it hasn't been set yet
  if (operator === null) {
    operator = userOp;
  } // Handle operation chaining if the equals button has been pressed
  else if (isEqualPressed === true) {
    isEqualPressed = false;
    number1 = result.toString();
    number2 = "";
  }
  // Update operator for the next calculation
  operator = userOp;
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
  result = num1 / num2;
  return result;
}

// Create function operate that takes two numbers and an operator, then based on the operator it calls one of the arithmetic functions.
function operate(num1, op, num2) {
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
    default:
      result = null;
  }
  display.textContent = result;
}

// Create function clearAll(), if triggered, reset the entire calculator's state
function clearAll() {
  display.textContent = "";
  number1 = "";
  number2 = "";
  operator = null;
  result = 0;
  isEqualPressed = false;
}
