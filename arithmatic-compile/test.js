const lexer = require('./lexer');
const parse = require('./parse');


const lex = new lexer('(1+3)*2');
const tokens = lex.lexcerSourceCode();
const parseArithmatic = new parse(tokens);
const astTree = parseArithmatic.run();
console.log(tokens);
console.log(JSON.stringify(astTree));
