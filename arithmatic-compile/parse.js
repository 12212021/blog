//文法中的一些基本概念
/* 
1、终结符：能够派生出其他符号的符号，一般用大写的字母来代表
非终结符：不能够派生出其他符号的符号，一般用小写的字母来代替
2、文法中的左递归：在文法表达式中是否在最左边出现了它自己本身
 */

// 一个四则运算的词法表达式
/* 
Expr -> Expr + Term (左递归)
      | Expr - Term (左递归)
      | Term

Term -> Term * Factor (左递归)
      | Term / Factor (左递归)
      | Factor

Factor -> (Expr) 
        | num
 */
// 在程序设计语言中，左递归很难处理，需要程序进行回溯处理
// 在编译原理的理论方法中存在一种消除左递归文法的方式

// 基本的理论
/* 
A -> Ab
   | a
(词串的表现为ab...b)
可以通过下面的方法变换，消除左递归
A -> aB
B -> bB 
   | null
(词串的表现仍然为ab...b)
 */

// 采用这种理论方法，可以将上面存在左递归的四则运算文法描述转化为下面的一种文法描述
// 消除左递归文法并不是没有代价的，代价是引入了新的非终结符，复杂了文法
/* 
Expr -> Term ExprTail
ExprTail -> + Term ExprTail
          | - Term ExprTail
          | null

Term -> Factor TermTail
TermTail -> * Factor TermTail
          | / Factor TermTail
          | null

Factor -> (Expr)
        | num 
*/
class ParseArithMatic {
    constructor(tokens) {
        this.tokens = tokens;
        this.index = 0;
    }
    // 返回一个AST的node节点
    parseExpr() {
        const left = this.parseTerm();
        const right = this.parseExprTail();
        const node = new SelfNode(left, right, 'expr');
        return node;
    }
    // 这个文法自己本身是一个right类型的节点
    parseExprTail() {
        if (this.tokens.length <= this.index) {
            return null;
        }
        const currentToken = this.tokens[this.index];
        this.consumeToken();
        const left = this.parseTerm();
        const right = this.parseExprTail();
        return new SelfNode(left, right, 'exprTail', currentToken.value);
    }
    // 返回一个AST node节点
    parseTerm() {
        const left = this.parseFactor();
        const right = this.parseTermTail();
        return new SelfNode(left, right, 'term');
    }

    // 这个文法返回一个right类型的节点
    parseTermTail() {
        if (this.tokens.length <= this.index) {
            return null;
        }
        const currentToken = this.tokens[this.index];
        this.consumeToken();
        const left = this.parseFactor();
        const right = this.parseTermTail();
        return new SelfNode(left, right, 'termTail', currentToken.value);
    }

    // 这个文法返回一个left类型的节点
    parseFactor() {
        if (this.tokens.length <= this.index) {
            return null;
        }
        const currentToken = this.tokens[this.index];
        if (currentToken.type === 'number') {
            this.consumeToken();
            // 去除右括号实际上是在这里去除的
            let nextToken = this.tokens[this.index];
            if (nextToken && nextToken.type === 'rightBrackle') {
                this.consumeToken();
            }
            return currentToken.value;
        }
        // 不是number类型的值的话， Factor只能是一个带括号的expr

        // 去掉左括号
        this.consumeToken();

        let node = this.parseExpr();

        return node;
    }

    consumeToken() {
        this.index = this.index + 1;
    }

    run() {
        return this.parseExpr();
    }
}

class SelfNode {
    constructor(left, right, type, op = 'none') {
        this.left = left;
        this.right = right;
        this.type = type;
        this.op = op;
    }
}

module.exports = ParseArithMatic;
