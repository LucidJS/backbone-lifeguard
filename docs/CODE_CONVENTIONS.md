# JavaScript Code Conventions

Code conventions based on internal review and:

[Crockford JavaScript Conventions](http://javascript.crockford.com/code.html)

[Google JavaScript Conventions](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)

## Files

JavaScript should be in a .js file, not in an .html file.

JavaScript should never be 'inline' within html markup.

## Indentation

Use 2 spaces for indentation (it is recommended that you adjust your settings in your code editor to use 2 spaces instead of *tab* when you press the tab key).

When indenting the properties and values within an object, do not try to get the values to line up as this just gets messy over time.

**DO:**

```
var a = {
  one: 1,
  two: 2,
  longpropertyname: 3
}
```

**DO NOT:**

```
var a = {
  one					: 1,
  two					: 2,
  longpropertyname		: 3
}
```

###Exceptions:

There is an exception when you are listing a set of variable declarations.  You can use 4 spaces to line up the variable names in the set.  

**Example:**

```
var foo = 2,
    bar = 3;
```

Also, when writing multiline strings, it is acceptable to indent the new line 4 spaces to match the starting string.

**Example:**

```
var foo = 'here is some text ' +
    followed by more text ' +
    on many lines';
```

## Line Breaks

Group code chunks logically:

```
doSomethingTo(x);
doSomethingElseTo(x);
andThen(x);

nowDoSomethingWith(y);

andNowWith(z);
```

**QUESTION: More? I definitely have some rules I follow, but I haven't codified them before.  Is it worth formalizing?**

## Comments

All code blocks **must** have at least one comment before the start of the block.

Comments should be used liberally, though do not add comments where the code is literally self explanatory.

**DO NOT:**

```
i = 0 //set i to 0
```

Single line comments should use `//`, whereas multine comments should start with `/**` and end with `*/`.  Each line in the comment block should start with `*` and should be indented one space.  The final `*/` should also be indented one line.

**Example:**

```
//single line comment

/**
 * Multiline 
 * comment
 */
```

All variables should be followed by a single line comment describing their purpose, unless it is self explantory (such as `var t = this;` or `var i;` for an inumerator). 

**Example:**

```
var foo = 2 //explain the purpose of foo
```

## Code Documentation

All modules, classes and methods **MUST** be documented using YUIDocs syntax.

[YUIDocs Syntax](http://yui.github.com/yuidoc/syntax/index.html)

## single quotes vs double quotes

Always use single quotes (') instead of double quotes when surrounding a string (").

**DO:**

```
var foo = 'some string';
```

**DO NOT:**

```
var foo = "some string";
```

## Variable Declarations

For a given application, there should only be one global level variable (see - *Namespaces*).

All variables should be declared before they are used.  

Variables should be declared at the top of the logical block they are used within.  This may mean declaring a set of variables at the top of the function or within a for loop.  

All variables declarations that are not self explanatory (such as `var t = this`) should be followed by a single line comment briefly describing their purpose - see *Comments*).

When declaring a set of variables, end the statement with a `,` and declare the next variable indented.  End that last variable in the set with a `;`.

Properties also need to be on their own line.  

**Example:**

```
var foo = function() {
  var a, //a is for this
      b = 0; //b is used for that
	
  //do other stuff
}

var a = {
  one: 1,
  two: 2
}
```

## Function Declarations

All functions should be declared before they are used, directly after the variable declarations within a block. Inner functions should follow the var statement. This helps make it clear what variables are included in its scope. 

There should be no spaces between the name of the function or the `function` keyword and the opening `(`, and there should be one space between the closing `)` and the opening `{`.

**Example:**

```
var foo = function() {
  //do stuff
}
```

or

```
function foo() {
  //do stuff
}
```

## Naming

Names should be formed from the 26 upper and lower case letters (A .. Z, a .. z), the 10 digits (0 .. 9), and _ (underbar).

Function, method, property and variable names should be camel-cased: **namesLikeThis**

Class names should be camel-cased with the first letter capitalized: **ClassNamesLikeThis**

Constant names should be uppercase, with an underscore between words: **SYMBOLIC_CONSTANTS_LIKE_THIS**

Private methods and variables should begin with an underscore: **_privateNameLikeThis**

## Namespaces

Always have a single global variable with a unique name that identifies the project, that all other variables are attached to.  

**Example:**

```
//in global namespace
//'Evri' is the application namespace
Evri = {};
Evri.ClassName = function(){
  //do stuff here
}
```

## this

When inside an object's method, declare `t` as a persistent pointer to the object.  This declaration must be at the top of every method, whether it is currently used or not.

**Example:**

```
var myClass = {
  methodName: function() {
    var t = this;
  }
}
```

## Turtles

See *recursion*.

## Ternary Operators

Ternary operators should not be nested.

## Statements

All statements must end with a `;`.

### Compount Statements

Compound statements contain one or more statement enclosed in `{}`.

When using a compound statement, **never** have it all on one line.

**DO:**

```
if (a === b) {
  alert('foo');
}
```

**DO NOT:**

```
if (a === b) alert('foo');

if (a === b) {alert('foo');}
```

### if Statement

If statements should always be a compount statement (should use `{}`) and when an `else` is present, that `else` statement should be on the same line as the ending `}` from the `if` statement.

**DO:**

```
if (a === b) {
  alert('foo');
} else if (a === c) {
  alert('bar');
} else {
  alert('squee');
}
```

**DO NOT:**

```
if (a === b) {
  alert('foo');
}
else if (a === c) {
  alert('bar');
} 
else {
  alert('squee');
}
```

If the `if` statement becomes too long to easily read on a single line, split the evaluations into vars, declared directly before the `if` statement.

**DO NOT:**

```
if (a !== b || (a !== c && a !== d) {
  //do something
}
```

**DO:**

```
var userIsNotMe = a !== b,
    userIsNotYou = a !== c,
    userIsNotYourMomma = a !== d;

if (userIsNotMe || (userIsNotYou && userIsNotYourMomma) {
  //do something
}
```

**NOTE: COME UP WITH BETTER EXAMPLE FOR THIS ONE!**

### switch Statement

A `switch` should indent based on the nesting.

**Example:**

```
switch (x) {
  case 1:
    //do something
  case 2:
    //do something else
  default:
    //do this if nothing else matched
}
```

### continue Statement

Do not use the `continue` statement, as it will likely result in hair loss and bad teeth.  

### with Statement

See *continue Statement*.

## Whitespace

A variable declaration should have a whitespace before and after the `=`.

**Example:**

```
var foo = 0;
```

A keyword followed by `(` should be separated by a space.

**Example:**

```
while (true) {
  //do something
}
```

A blank space should **not** be used between a function value and its `(`. This helps to distinguish between keywords and function invocations.

**Example:**

```
getSomething();
```

Operators should be separated from their operands by a space.

**DO:**

```
if (a === b) {
  //do something
}
```

**DO NOT:**

```
if (a===b) {
  //do something
}
```

No space should separate a unary operator and its operand except when the operator is a word such as typeof.

**Example:**

```
a++;

--a;

!a;

//typeof exception
if (typeof x == 'object') {
 //do something
}

``` 

Each `;` in the control part of a `for` statement should be followed with a space.

**Example:**

```
for (var i = 10; i > 0; i--) {
  //do something
}
```

Whitespace should follow every `,`.

**Example:**

```
var foo = [1, 2, 6, 10]
```

When using ternary operators, each operator symbol (`?` and `:`) requires a whitespace before and after.  The `()` surrounding the evaluation are optional.

**Example:**

```
var foo = (a !== b) ? c : d;
```

### recursion

See *turtles*.

## Declaring Objects and Arrays

Use {} instead of new Object(). Use [] instead of new Array(). 

**DO:**

```
var foo = {}; //create object
var bar = []; //create array
```

**DO NOT:**

```
var foo = new Object(); //create object
var bar = new Array(); //create array
```

## Assignment Expressions

Do not make an assignment within an `if` statement, though within a `for` statement is ok.

**NO NOT:**

```
if (a = b)
```

**OK:**

```
for (var i = 10; i > 0; i--) {
  //do something
}
```

## === and !== Operators

Always use triple equals to avoid type coercion, unless you explicitly want type coercion.

**DO:**

```
if (a === b) {
 //do something
}
```

**DO NOT:**

```
if (a == b) {
 //do something
}
```

## Callbacks

All callbacks have a required parameter of `error` and an optional second parameter of `response`.

**Example:**

```
getSomething(options, function(error){
  //do something within callback
});

//or

getSomething(options, function(error, response){
  //do something within callback
});
```

Within the callback, the `error` condition should always be handled first, with a return at the end of the block, followed by the non-error condition code.

**Example:**

```
getSomething(options, function(error, response){
  if (error) {
    //do something if there is an error
    return;
  }
  
  //do something if there is no error
});
```

## Multiline String Literals

Use the `+` to concatinate multiline strings, do not use `\`.

**DO NOT:**

```
var foo = 'here is some text \
    followed by more text \
    on many lines';
```

**DO:**

```
var foo = 'here is some text ' +
    followed by more text ' +
    on many lines';
```