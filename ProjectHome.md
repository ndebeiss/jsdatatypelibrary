That API validates a string against a datatype specified in an object datatype(Uri, LocalName).

It mainly implements two methods :

this.datatypeAllows = function(datatype, paramList, string, context) {

and

this.datatypeEqual = function(datatype, patternString, patternContext, string, context) {

which returns a pattern Empty() if string is valid or a pattern NotAllowed(message, datatype, string) if string is invalid.