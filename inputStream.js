// stream object - recieves a stream characters - read, write somewhere(destination), 

// this stream has 4 methods 
// peek() - returns the next val withouth removing it from the stream
// next() - next val , and discard it from the stream 
// eof() - returns true if and only if, there are no more vals in the stream'
// croak(msg) - does throw new Error(msg)

// the stream can keep location of the line and column so croak can throw error if there is one 


// peek/ next deals and return with chars, and js does not have chars, so they'll be string containng one char

function inputStream(input) {
    var Pos = 0,
        line = 1,
        col = 0;

    return {
        next: next,
        peek: peek,
        eof: eof,
        croak: croak,
    };

    function next() {
        var ch = input.charAt(Pos++);
        if (ch == "\n") line++, col = 0;
        else col++;
        return ch;
    }

    function peek() {
        return input.charAt(Pos);
    }

    function eof() {
        return peek() == ""
    }

    function croak(msg) {
        throw new Error(msg + "(" + line + ":" + col + ")");
    }
}

var input = "if true then print else dont";
var stream = inputStream(input);



// console.log(stream.next());
// console.log(stream.next());
// console.log(stream.next());
// console.log(stream.next());
// console.log(stream.next());
// console.log(stream.next());
// console.log(stream.next());
console.log(stream.peek());
console.log(stream.eof());