/* Token input stream  - tokenizer or lexer

operates on a CHAR INPUT STREAM, and returns a stream object with the same 
interface

values returned by peek()/ next() will be tokens. 
A token is an object with two properties: type and value 

eg tokens 

{ type: "punc", value: "(" }           // punctuation: parens, comma, semicolon etc.
{ type: "num", value: 5 }              // numbers
{ type: "str", value: "Hello World!" } // strings
{ type: "kw", value: "lambda" }        // keywords
{ type: "var", value: "a" }            // identifiers
{ type: "op", value: "!=" }            // operators



whitespace and comment == skip 
 

*/

/*

steps of tokenizing 

1) understand the syntax of the language
2) the looking at the next char with peek(), we can decide what kind of toke to read:

      . skip whitespace
      . if input.eof() then return null
      . if it's # skip comment(and retry after end of line).
      . if quote read string - till the next quote
      .if digit, read number
      . if letter - identifir read   variables  allowed = starts with letter, lambda, _ and can contain futher characters

      . if punctuation, return the punctuation 
      . if op return the op 
      .if none of above, error out with input.croak()

      Also, the read_ident() function will check the identifier against the list of known keywords, and if it's there it will return a "kw" token, instead of a "var" one. 

*/

// read_next is the core of the tokenizer 


function TokenStream(input) {
    var current = null;
    var keywords = " if then else lambda λ true false ";

    return {
        next: next,
        peek: peek,
        eof: eof,
        croak: input.croak
    };

    function is_keyword(x) {
        return keywords.indexOf(" " + x + " ") >= 0;
    };

    function is_digit(ch) {
        return /[0-9]/i.test(ch);
    };

    function is_id_start(ch) {
        return /[a-zλ_]/i.test(ch);
    };

    function is_id(ch) {
        return is_id_start(ch) || "?!-<>=0123456789".indexOf(ch) >= 0;
    };



    function is_op_char(ch) {
        return "+-*/%=&|<>!".indexOf(ch) >= 0;
    };

    function is_punch(ch) {
        return ",;(){}[]".indexOf(ch) >= 0;
    };

    function is_whitespace(ch) {
        return " \t\n".indexOf(ch) >= 0;
    };


    function read_while(predicate) {
        var str = "";
        while (!input.eof() && predicate(input.peek()))
            str += input.next();
        return str;
    };


    // still need to figure it out
    function read_number() {
        var has_dot = false;
        var number = read_while(function(ch) {
            if (ch == ".") {
                if (has_dot) return false;
                has_dot = true;
                return true;
            }
            return is_digit(ch);
        });

        return { type: "number", number: parseFloat(number) };
    }

    // read variable
    function read_ident() {
        var id = read_while(is_id);
        return {
            type: is_keyword(id) ? "kw" : "var",
            value: id
        }
    }

    // 

    function read_escaped(end) {
        var escaped = false,
            str = "";

        input.next();
        while (!input.eof()) {
            var ch = input.next();
            if (escaped) {
                str += ch;
                escaped = false;
            } else if (ch == "\\") {
                escaped = true;
            } else if (ch == end) {
                break;
            } else {
                str += ch;
            }

        }
        return str;
    }

    // read string

    function read_string() {
        return { type: "string", value: read_escaped('"') }
    }


    function skip_comment() {
        read_while(function(ch) { return ch != "\n" });
        inpt.next();
    }

    function read_next() {
        read_while(is_whitespace);
        if (input.eof()) return null;
        var ch = input.peek();
        // comment
        if (ch == "#") {
            skip_comment();
            return read_next();
        }
        //   string
        if (ch == '"') return read_string();
        // numbers 
        if (is_digit(ch)) return read_number();
        // var 
        if (is_id_start(ch)) return read_ident();

        if (is_punc(ch)) return {
            type: "punc",
            value: input.next()
        };
        if (is_op_char(ch)) return {
            type: "op",
            value: read_while(is_op_char)
        };
        input.croak("Can't handle character: " + ch);
    }


    function peek() {
        return current || (current = read_next());

    }

    function next() {
        var tok = current;
        current = null;
        return tok || read_next();
    }

    function eof() {
        return peek() == null
    }





}


/*
The next() function doesn't always call read_next(), because it might have been peeked before (in which case read_next() was already called and the stream advanced). Therefore we need a current variable which keeps track of the current token.


We only support decimal numbers with the usual notation (no 1E5 stuff, no hex, no octal). But if we ever need more, the changes go only in read_number() and are pretty easy to do






*/