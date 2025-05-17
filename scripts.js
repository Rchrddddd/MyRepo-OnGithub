class Calculator {
    constructor() {
        this.displayEquation = document.querySelector('.equation');
        this.displayCurrent = document.querySelector('.current');
        this.currentValue = '0';
        this.firstOperand = null;
        this.operator = null;
        this.waitingForSecondOperand = false;
        
        this.initEventListeners();
    }

    initEventListeners() {
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => this.handleButton(button.textContent));
        });
    }

    handleButton(value) {
        try {
            if (value >= '0' && value <= '9') this.inputDigit(value);
            else if (value === '.') this.inputDecimal();
            else if (value === 'C') this.clear();
            else if (value === '±') this.toggleSign();
            else if (value === '%') this.percentage();
            else if ('+-×÷'.includes(value)) this.setOperator(value);
            else if (value === '=') this.calculate();
            
            this.updateDisplay();
        } catch (error) {
            this.showErrorAlert(error.message);
            this.clear();
        }
    }

    inputDigit(digit) {
        if (this.currentValue.replace('.', '').length >= 12) {
            throw new Error('Maksimal 12 digit angka');
        }
        
        if (this.waitingForSecondOperand) {
            this.currentValue = digit;
            this.waitingForSecondOperand = false;
        } else {
            this.currentValue = this.currentValue === '0' ? digit : this.currentValue + digit;
        }
    }

    inputDecimal() {
        if (!this.currentValue.includes('.')) {
            this.currentValue += '.';
        }
    }

    clear() {
        this.currentValue = '0';
        this.firstOperand = null;
        this.operator = null;
        this.waitingForSecondOperand = false;
        this.displayEquation.textContent = '';
    }

    toggleSign() {
        this.currentValue = String(parseFloat(this.currentValue) * -1);
    }

    percentage() {
        this.currentValue = String(parseFloat(this.currentValue) / 100);
    }

    setOperator(newOperator) {
        if (isNaN(parseFloat(this.currentValue))) {
            throw new Error('Angka tidak boleh kosong');
        }
        
        const inputValue = parseFloat(this.currentValue);
        
        if (this.operator && !this.waitingForSecondOperand) {
            this.calculate();
        }
        
        this.operator = newOperator;
        this.firstOperand = inputValue;
        this.waitingForSecondOperand = true;
        this.displayEquation.textContent = `${this.firstOperand} ${this.operator}`;
    }

    calculate() {
        if (isNaN(parseFloat(this.currentValue))) {
            throw new Error('Angka kedua tidak boleh kosong');
        }
        
        const secondOperand = parseFloat(this.currentValue);
        
        if (this.operator === '÷' && secondOperand === 0) {
            throw new Error('Tidak bisa dibagi dengan 0');
        }
        
        let result;
        switch (this.operator) {
            case '+': result = this.firstOperand + secondOperand; break;
            case '-': result = this.firstOperand - secondOperand; break;
            case '×': result = this.firstOperand * secondOperand; break;
            case '÷': result = this.firstOperand / secondOperand; break;
            default: return;
        }
        
        this.displayEquation.textContent = `${this.firstOperand} ${this.operator} ${secondOperand} =`;
        this.currentValue = String(result);
        this.firstOperand = result;
        this.waitingForSecondOperand = true;
    }

    showErrorAlert(message) {
        Swal.fire({
            icon: 'error',
            title: 'ERROR!',
            text: message,
            background: '#1a1a2a',
            color: '#00f7ff',
            confirmButtonColor: '#ff00ff',
            allowOutsideClick: false,
            customClass: {
                popup: 'cyberpunk-alert'
            }
        });
    }

    updateDisplay() {
        this.displayCurrent.textContent = this.currentValue;
        if (this.operator && !this.waitingForSecondOperand) {
            this.displayEquation.textContent = `${this.firstOperand} ${this.operator} ${this.currentValue}`;
        }
    }
}

new Calculator();