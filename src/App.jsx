import { useState } from "react";
import "./App.css";

const buttons = [
  { label: "7", type: "number" },
  { label: "8", type: "number" },
  { label: "9", type: "number" },
  { label: "÷", type: "operator", value: "/" },

  { label: "4", type: "number" },
  { label: "5", type: "number" },
  { label: "6", type: "number" },
  { label: "*", type: "operator", value: "*" },

  { label: "1", type: "number" },
  { label: "2", type: "number" },
  { label: "3", type: "number" },
  { label: "-", type: "operator", value: "-" },

  { label: "0", type: "number" },
  { label: "C", type: "clear" },
  { label: "+", type: "operator", value: "+" },
  { label: "=", type: "equals" },
];

export default function App() {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForNumber, setWaitingForNumber] = useState(false);
  const [expression, setExpression] = useState("");

  const fullName = "Aries Alexander C. Chan";

  function formatNumber(number) {
    if (!Number.isFinite(number)) return "Error";
    return String(Number(number.toPrecision(10)));
  }

  function inputNumber(number) {
    if (display === "Error" || waitingForNumber) {
      setDisplay(number);
      setWaitingForNumber(false);
    } else {
      setDisplay((current) =>
        current === "0" ? number : current + number
      );
    }
  }

  function inputOperator(nextOperator) {
    if (display === "Error") return;

    const currentValue = Number(display);

    if (storedValue !== null && operator && !waitingForNumber) {
      const result = calculate(storedValue, currentValue, operator);

      if (!Number.isFinite(result)) {
        setDisplay("Error");
        setStoredValue(null);
        setOperator(null);
        setWaitingForNumber(true);
        setExpression("");
        return;
      }

      const formatted = formatNumber(result);
      setDisplay(formatted);
      setStoredValue(Number(formatted));
      setExpression(`${formatted} ${nextOperator}`);
    } else {
      setStoredValue(currentValue);
      setExpression(`${display} ${nextOperator}`);
    }

    setOperator(nextOperator);
    setWaitingForNumber(true);
  }

  function calculate(a, b, op) {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return b === 0 ? NaN : a / b;
      default:
        return b;
    }
  }

  function equals() {
    if (
      storedValue === null ||
      operator === null ||
      waitingForNumber ||
      display === "Error"
    ) {
      return;
    }

    const currentValue = Number(display);
    const result = calculate(storedValue, currentValue, operator);

    setExpression(`${storedValue} ${operator} ${currentValue} =`);
    setDisplay(formatNumber(result));
    setStoredValue(null);
    setOperator(null);
    setWaitingForNumber(true);
  }

  function clear() {
    setDisplay("0");
    setStoredValue(null);
    setOperator(null);
    setWaitingForNumber(false);
    setExpression("");
  }

  function showName() {
    setDisplay(fullName);
    setStoredValue(null);
    setOperator(null);
    setWaitingForNumber(true);
    setExpression("");
  }

  function handleButton(button) {
    if (button.type === "number") {
      inputNumber(button.label);
    } else if (button.type === "operator") {
      inputOperator(button.value);
    } else if (button.type === "equals") {
      equals();
    } else if (button.type === "clear") {
      clear();
    }
  }

  return (
    <main className="page">
      <section className="calculator">
        <header className="calculator-header">
          <div className="app-icon">✳</div>
          <h1>Calculator of Aries Alexander C. Chan - DA3A</h1>
        </header>

        <div className="display" aria-live="polite">
          <div className="expression">
            {expression || "\u00A0"}
          </div>
          <div className="display-value" title={display}>
            {display}
          </div>
        </div>

        <div className="buttons">
          {buttons.map((button) => (
            <button
              key={button.label}
              type="button"
              className={`calc-button ${button.type}`}
              onClick={() => handleButton(button)}
            >
              {button.label}
            </button>
          ))}
        </div>

        <footer className="calculator-footer">
          <button
            type="button"
            className="name-button"
            onClick={showName}
          >
            CHAN
          </button>
        </footer>
      </section>
    </main>
  );
}