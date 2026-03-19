class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0'; // Reset current for next number
    }

    percent() {
        const float = parseFloat(this.currentOperand);
        if (isNaN(float)) return;
        this.currentOperand = (float / 100).toString();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert("Cannot divide by zero");
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const previousOperandTextElement = document.querySelector('.previous-operand');
    const currentOperandTextElement = document.querySelector('.current-operand');
    const buttons = document.querySelectorAll('.btn');

    const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

    const handleAction = (type, value) => {
        if (type === 'number') {
            calculator.appendNumber(value);
        } else if (type === 'operator') {
            calculator.chooseOperation(value);
        } else if (type === 'calculate') {
            calculator.compute();
        } else if (type === 'clear') {
            calculator.clear();
        } else if (type === 'delete') {
            calculator.delete();
        } else if (type === 'percent') {
            calculator.percent();
        }
        calculator.updateDisplay();
    };

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const dataAction = button.getAttribute('data-action');
            const dataValue = button.getAttribute('data-value');

            if (dataValue && !dataAction) {
                handleAction('number', dataValue);
            } else if (dataAction === 'operator') {
                handleAction('operator', dataValue);
            } else {
                handleAction(dataAction);
            }

            // Haptic feed-back style animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
            handleAction('number', e.key);
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            handleAction('operator', e.key);
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            handleAction('calculate');
        } else if (e.key === 'Backspace') {
            handleAction('delete');
        } else if (e.key === 'Escape') {
            handleAction('clear');
        } else if (e.key === '%') {
            handleAction('percent');
        }
    });
});
