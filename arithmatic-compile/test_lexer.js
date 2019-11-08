const lexer = require('./lexer');
const lex = new lexer('((1+2)+0.9)/0.20*8-9009*0.0000');
console.log(lex.lexcerSourceCode());
