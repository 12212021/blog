class Lexer {
    constructor(sourceCode) {
        this.sourceCode = sourceCode;
        this.tokens = [];
        this.innerIndex = 0;
    }

    makeToken(type, value) {
        return {
            type,
            value,
        };
    }

    lexcerSourceCode() {
        while (this.innerIndex < this.sourceCode.length) {
            const char = this.sourceCode[this.innerIndex];
            console.log('inini', this.innerIndex, this.sourceCode.length)
            if (char === '(') {
                this.tokens.push(this.makeToken('leftBrackle', char));
                this.innerIndex += 1;
            } else if (char === ')') {
                this.tokens.push(this.makeToken('rightBrackle', char));
                this.innerIndex += 1;
            } else if (/[\+\-\*\/]/.test(char)) {
                this.tokens.push(this.makeToken('op', char));
                this.innerIndex += 1;
            } else {
                const token = this.lexcerNumber();
                this.tokens.push(this.makeToken(...token));
                this.innerIndex += this.tokens[this.tokens.length - 1].value.length;
            }
        }
        return this.tokens;
    }

    lexcerNumber() {
        let state = 0;
        let index = this.innerIndex;
        let char = this.sourceCode[index];
        let tokenVal = '';
        const update = () => {
            tokenVal += char;
            index += 1;
            char = this.sourceCode[index];
        };
        while (true) {
            switch (state) {
                case 0:
                    if (/[1-9]/.test(char)) {
                        state = 2;
                        update();
                    } else if (char === '0') {
                        state = 1;
                        update();
                    }
                    break;
                case 1:
                    if (char === '.') {
                        state = 3;
                        update();
                    } else if (/[0-9]/.test(char)) {
                        console.log(char, this.tokens);
                        throw 'Syntax error';
                    } else {
                        state = 'end';
                    }
                    break;
                case 2:
                    if (/[0-9]/.test(char)) {
                        state = 2;
                        update();
                    } else if (char === '.') {
                        state = 3;
                        update();
                    } else {
                        state = 'end';
                    }
                    break;
                case 3:
                    if (char === '.') {
                        throw 'Syntax error';
                    } else if (/[0-9]/.test(char)) {
                        state = 3;
                        update();
                    } else {
                        state = 'end';
                    }
                    break;
                case 'end':
                    break;
            }
            if (state === 'end') {
                return ['number', tokenVal];
            }
        }
    }
}

module.exports = Lexer;
