/*

Copyright or � or Copr. Nicolas Debeissat

nicolas.debeissat@gmail.com (http://debeissat.nicolas.free.fr/)

This software is a computer program whose purpose is to validate XML
against a RelaxNG schema.

This software is governed by the CeCILL license under French law and
abiding by the rules of distribution of free software.  You can  use, 
modify and/ or redistribute the software under the terms of the CeCILL
license as circulated by CEA, CNRS and INRIA at the following URL
"http://www.cecill.info". 

As a counterpart to the access to the source code and  rights to copy,
modify and redistribute granted by the license, users are provided only
with a limited warranty  and the software's author,  the holder of the
economic rights,  and the successive licensors  have only  limited
liability. 

In this respect, the user's attention is drawn to the risks associated
with loading,  using,  modifying and/or developing or reproducing the
software by the user in light of its specific status of free software,
that may mean  that it is complicated to manipulate,  and  that  also
therefore means  that it is reserved for developers  and  experienced
professionals having in-depth computer knowledge. Users are therefore
encouraged to load and test the software's suitability as regards their
requirements in conditions enabling the security of their systems and/or 
data to be ensured and,  more generally, to use and operate it in the 
same conditions as regards security. 

The fact that you are presently reading this means that you have had
knowledge of the CeCILL license and that you accept its terms.

*/

/*
implementation of datatypeLibrary="http://www.w3.org/2001/XMLSchema-datatypes"

extract from http://www.w3schools.com/Schema/schema_dtypes_string.asp :

ENTITIES  															KO
ENTITY 	 															KO
ID 	A string that represents the ID attribute in XML (only used with schema attributes)			KO
IDREF 	A string that represents the IDREF attribute in XML (only used with schema attributes)		KO
IDREFS 	 															KO
language 	A string that contains a valid language id									OK
Name 	A string that contains a valid XML name									OK
NCName																OK
NMTOKEN 	A string that represents the NMTOKEN attribute in XML (only used with schema attributes)	KO
NMTOKENS 	 														KO
normalizedString 	A string that does not contain line feeds, carriage returns, or tabs				OK
QName 	 															OK
string 	A string														OK
token 	A string that does not contain line feeds, carriage returns, tabs, leading or trailing spaces, or multiple spaces OK

extract from http://www.w3schools.com/Schema/schema_dtypes_date.asp :

date  	Defines a date value													OK
dateTime 	Defines a date and time value											OK
duration 	Defines a time interval												OK
gDay 	Defines a part of a date - the day (DD)										OK
gMonth 	Defines a part of a date - the month (MM)									OK
gMonthDay 	Defines a part of a date - the month and day (MM-DD)							OK
gYear 	Defines a part of a date - the year (YYYY)									OK
gYearMonth 	Defines a part of a date - the year and month (YYYY-MM)					OK
time 	Defines a time value													OK

extract from http://www.w3schools.com/Schema/schema_dtypes_numeric.asp :

byte  	A signed 8-bit integer													OK
decimal 	A decimal value													OK
int 	A signed 32-bit integer													OK
integer 	An integer value													OK
long 	A signed 64-bit integer													OK
negativeInteger 	An integer containing only negative values ( .., -2, -1.)						OK
nonNegativeInteger 	An integer containing only non-negative values (0, 1, 2, ..)				OK
nonPositiveInteger 	An integer containing only non-positive values (.., -2, -1, 0)				OK
positiveInteger 	An integer containing only positive values (1, 2, ..)						OK
short 	A signed 16-bit integer													OK
unsignedLong 	An unsigned 64-bit integer										OK
unsignedInt 	An unsigned 32-bit integer										OK
unsignedShort 	An unsigned 16-bit integer										OK
unsignedByte 	An unsigned 8-bit integer										OK

extract from http://www.w3schools.com/Schema/schema_dtypes_misc.asp :

anyURI  	 															does not do any validation
base64Binary 	 														OK
boolean 	 															OK
double 	 															OK
float 	                                                                                                                                                                            same as double
hexBinary 	 															OK
NOTATION 	                                                                                                                                                     same as QName 
QName 	                                                                                                                                                                OK

extract from http://www.w3schools.com/Schema/schema_elements_ref.asp :

enumeration  	Defines a list of acceptable values
fractionDigits 	Specifies the maximum number of decimal places allowed. Must be equal to or greater than zero                OK
length 	Specifies the exact number of characters or list items allowed. Must be equal to or greater than zero                  OK but not for list and only length of string
maxExclusive 	Specifies the upper bounds for numeric values (the value must be less than this value)                                  OK
maxInclusive 	Specifies the upper bounds for numeric values (the value must be less than or equal to this value)              OK
maxLength 	Specifies the maximum number of characters or list items allowed. Must be equal to or greater than zero             OK
minExclusive 	Specifies the lower bounds for numeric values (the value must be greater than this value)                            OK
minInclusive 	Specifies the lower bounds for numeric values (the value must be greater than or equal to this value)           OK
minLength 	Specifies the minimum number of characters or list items allowed. Must be equal to or greater than zero                 OK
pattern 	Defines the exact sequence of characters that are acceptable                                                                                    OK
totalDigits 	Specifies the exact number of digits allowed. Must be greater than zero                                                                   OK
whiteSpace 	Specifies how white space (line feeds, tabs, spaces, and carriage returns) is handled                                   KO

*/
function DatatypeLibrary() {

    var languageRegExp = new RegExp("^[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*$");
    var nameStartChar = "A-Z_a-z";
    var nameChar = nameStartChar + "\-\\.0-9";
    var nameRegExp = new RegExp("^[:" + nameStartChar + "][:" + nameChar + "]*$");
    var ncNameRegExp = new RegExp("^[" + nameStartChar + "][" + nameChar + "]*$");

    var whitespaceChar = "\t\n\r";
    var normalizedStringRegExp = new RegExp("^[^" + whitespaceChar + "]*$");
    
    var qNameRegExp = new RegExp("^[" + nameStartChar + "][" + nameChar + "]*(:[" + nameStartChar + "]+)?$");
    
    var tokenRegExp = new RegExp("^[^" + whitespaceChar + " ](?!.*  )[^" + whitespaceChar + " ]$");
    
    var year = "-?([1-9][0-9]*)?[0-9]{4}";
    var month = "[0-9]{2}";
    var dayOfMonth = "[0-9]{2}";
    var time = "[0-9]{2}:[0-9]{2}:[0-9]{2}(\\.[0-9]*)?";
    var timeZone = "(Z|[\-\+][0-9][0-9]:[0-5][0-9])?";
    
    var dateRegExp = new RegExp("^ *" + year + "-" + month + "-" + dayOfMonth + timeZone + " *$");
    
    var dateTimeRegExp = new RegExp("^ *" + year + "-" + month + "-" + dayOfMonth + "T" + time + timeZone + " *$");
    
    var durationRegExp = new RegExp("^ *" + "-?P(?!$)([0-9]+Y)?([0-9]+M)?([0-9]+D)?(T(?!$)([0-9]+H)?([0-9]+M)?([0-9]+(\\.[0-9]+)?S)?)? *$");
    
    var gDayRegExp = new RegExp("^ *" + "---" + dayOfMonth + timeZone + " *$");
    
    var gMonthRegExp = new RegExp("^ *" + "--" + month + timeZone + " *$");
    
    var gMonthDayRegExp = new RegExp("^ *" + "--" + month + "-" + dayOfMonth + timeZone + " *$");
    
    var gYearRegExp = new RegExp("^ *" + year + timeZone + " *$");
    
    var gYearMonthRegExp = new RegExp("^ *" + year + "-" + month + timeZone + " *$");
    
    var timeRegExp = new RegExp("^ *" + time + timeZone + " *$");
    
    var LONG_MAX = 9223372036854775807;
    var LONG_MIN = -9223372036854775808;
    var INT_MAX = 2147483647;
    var INT_MIN = -2147483648;
    var SHORT_MAX = 32767;
    var SHORT_MIN = -32768;
    var BYTE_MAX = 127;
    var BYTE_MIN = -128;

    var UNSIGNED_LONG_MAX = 18446744073709551615;
    var UNSIGNED_INT_MAX = 4294967295;
    var UNSIGNED_SHORT_MAX = 65535;
    var UNSIGNED_BYTE_MAX = 255;
    
    var integer = "[\-\+]?[0-9]+";
    
    var integerRegExp = new RegExp("^ *" + integer + " *$");
    
    var decimal = "[\-\+]?(?!$)[0-9]*(\\.[0-9]*)?";
    
    var decimalRegExp = new RegExp("^ *" + decimal + " *$");
    
    var negativeIntegerRegExp = new RegExp("^ *-[1-9][0-9]* *$");
    
    var nonNegativeIntegerRegExp = new RegExp("^ *(\\+)?[0-9]+ *$");
    
    var nonPositiveIntegerRegExp = new RegExp("^ *-?[0-9]+ *$");
    
    var positiveIntegerRegExp = new RegExp("^ *(\\+)?[1-9][0-9]* *$");
    /*
    Base64Binary  ::=  ((B64S B64S B64S B64S)*
                     ((B64S B64S B64S B64) |
                      (B64S B64S B16S '=') |
                      (B64S B04S '=' #x20? '=')))?

B64S         ::= B64 #x20?

B16S         ::= B16 #x20?

B04S         ::= B04 #x20?

B04         ::=  [AQgw]
B16         ::=  [AEIMQUYcgkosw048]
B64         ::=  [A-Za-z0-9+/] 
*/
    var b64 = "[A-Za-z0-9+/]";
    var b16 = "[AEIMQUYcgkosw048]";
    var b04 = "[AQgw]";
    var b04S = "(" + b04 + " ?)";
    var b16S = "(" + b16 + " ?)";
    var b64S = "(" + b64 + " ?)";
    
    var base64BinaryRegExp = new RegExp("^ *((" + b64S + "{4})*((" + b64S + "{3}" + b64 + ")|(" + b64S + "{2}" + b16S + "=)|(" + b64S + b04S + "= ?=)))? *$");
    
    var booleanRegExp = new RegExp("(^ *true *$)|(^ *false *$)|(^ *0 *$)|(^ *1 *$)", "i");
    
    var doubleRegExp = new RegExp("(^ *-?INF *$)|(^ *NaN *$)|(^ *" + decimal + "([Ee]" + integer + ")? *$)");
    
    var hexBinaryRegExp = new RegExp("^ *" + "[0-9a-fA-F]+" + " *$");
    
    var fractionDigits = "\\.[0-9]";
    
    /*
    datatypeAllows :: Datatype -> ParamList -> String -> Context -> Bool
    datatypeAllows ("",  "string") [] _ _ = True
    datatypeAllows ("",  "token") [] _ _ = True
    */
    this.datatypeAllows = function(datatype, paramList, string, context) {
        if (datatype.uri == "http://www.w3.org/2001/XMLSchema-datatypes") {
            if (datatype.localName == "language") {
                return this.checkRegExpAndParams(languageRegExp, string, datatype, paramList);
            } else if (datatype.localName == "Name") {
                return this.checkRegExpAndParams(nameRegExp, string, datatype, paramList);
            } else if (datatype.localName == "NCName") {
                return this.checkRegExpAndParams(ncNameRegExp, string, datatype, paramList);
            } else if (datatype.localName == "normalizedString") {
                return this.checkRegExpAndParams(normalizedStringRegExp, string, datatype, paramList);
            } else if (datatype.localName == "QName" || datatype.localName == "NOTATION") {
                var result = this.checkRegExpAndParams(qNameRegExp, string, datatype, paramList);
                if (result instanceof NotAllowed) {
                    return result;
                }
                return checkPrefixDeclared(string, context, datatype);
            } else if (datatype.localName == "string") {
                return new Empty();
            } else if (datatype.localName == "token") {
                return this.checkRegExpAndParams(tokenRegExp, string, datatype, paramList);
            } else if (datatype.localName == "date") {
                return this.checkRegExpAndParams(dateRegExp, string, datatype, paramList);
            } else if (datatype.localName == "dateTime") {
                return this.checkRegExpAndParams(dateTimeRegExp, string, datatype, paramList);
            } else if (datatype.localName == "duration") {
                return this.checkRegExpAndParams(durationRegExp, string, datatype, paramList);
            } else if (datatype.localName == "gDay") {
                return this.checkRegExpAndParams(gDayRegExp, string, datatype, paramList);
            } else if (datatype.localName == "gMonth") {
                return this.checkRegExpAndParams(gMonthRegExp, string, datatype, paramList);
            } else if (datatype.localName == "gMonthDay") {
                return this.checkRegExpAndParams(gMonthDayRegExp, string, datatype, paramList);
            } else if (datatype.localName == "gYear") {
                return this.checkRegExpAndParams(gYearRegExp, string, datatype, paramList);
            } else if (datatype.localName == "gYearMonth") {
                return this.checkRegExpAndParams(gYearMonthRegExp, string, datatype, paramList);
            } else if (datatype.localName == "time") {
                return this.checkRegExpAndParams(timeRegExp, string, datatype, paramList);
            } else if (datatype.localName == "byte") {
                return this.checkIntegerRange(BYTE_MIN, BYTE_MAX, string, datatype, paramList);
            } else if (datatype.localName == "decimal") {
                return this.checkRegExpAndParams(decimalRegExp, string, datatype, paramList);
            } else if (datatype.localName == "int") {
                return this.checkIntegerRange(INT_MIN, INT_MAX, string, datatype, paramList);
            } else if (datatype.localName == "integer") {
                return this.checkRegExpAndParams(integerRegExp, string, datatype, paramList);
            } else if (datatype.localName == "long") {
                return this.checkIntegerRange(LONG_MIN, LONG_MAX, string, datatype, paramList);
            } else if (datatype.localName == "negativeInteger") {
                return this.checkRegExpAndParams(negativeIntegerRegExp, string, datatype, paramList);
            } else if (datatype.localName == "nonNegativeInteger") {
                return this.checkRegExpAndParams(nonNegativeIntegerRegExp, string, datatype, paramList);
            } else if (datatype.localName == "nonPositiveInteger") {
                return this.checkRegExpAndParams(nonPositiveIntegerRegExp, string, datatype, paramList);
            } else if (datatype.localName == "positiveInteger") {
                return this.checkRegExpAndParams(positiveIntegerRegExp, string, datatype, paramList);
            } else if (datatype.localName == "short") {
                return this.checkIntegerRange(SHORT_MIN, SHORT_MAX, string, datatype, paramList);
            } else if (datatype.localName == "unsignedLong") {
                return this.checkIntegerRange(0, UNSIGNED_LONG_MAX, string, datatype, paramList);
            } else if (datatype.localName == "unsignedInt") {
                return this.checkIntegerRange(0, UNSIGNED_INT_MAX, string, datatype, paramList);
            } else if (datatype.localName == "unsignedShort") {
                return this.checkIntegerRange(0, UNSIGNED_SHORT_MAX, string, datatype, paramList);
            } else if (datatype.localName == "unsignedByte") {
                return this.checkIntegerRange(0, UNSIGNED_BYTE_MAX, string, datatype, paramList);
            } else if (datatype.localName == "anyURI") {
                return new Empty();
            } else if (datatype.localName == "base64Binary") {
                return this.checkRegExpAndParams(base64BinaryRegExp, string, datatype, paramList);
            } else if (datatype.localName == "boolean") {
                return this.checkRegExpAndParams(booleanRegExp, string, datatype, paramList);
            } else if (datatype.localName == "double") {
                return this.checkRegExpAndParams(doubleRegExp, string, datatype, paramList);
            } else if (datatype.localName == "float") {
                return this.checkRegExpAndParams(doubleRegExp, string, datatype, paramList);
            } else if (datatype.localName == "hexBinary") {
                return this.checkRegExpAndParams(hexBinaryRegExp, string, datatype, paramList);
            } else {
                return new Empty();
            }
        } else {
            return new Empty();
        }
    }

    /*
    datatypeEqual :: Datatype -> String -> Context -> String -> Context -> Bool
    datatypeEqual ("",  "string") s1 _ s2 _ = (s1 == s2)
    datatypeEqual ("",  "token") s1 _ s2 _ = (normalizeWhitespace s1) == (normalizeWhitespace s2)
    */
    this.datatypeEqual = function(datatype, patternString, patternContext, string, context) {
        if (datatype.uri == "") {
            if (datatype.localName == "string") {
                return string1 == string2;
            } else if (datatype.localName == "token") {
                return this.normalizeWhitespace(string1) == this.normalizeWhitespace(string2);
            }
        } else if (!datatypeLibrary) {
            return true;
        } else {
            return datatypeLibrary.datatypeEqual(datatype, string1, context1, string2, context2);
        }
    }

    
    this.checkRegExpAndParams = function(regExp, string, datatype, paramList) {
        var check = checkRegExp(regExp, string, datatype);
        if (check instanceof NotAllowed) {
            return check;
        }
        var enumeration = new Array();
        for (var i in paramList) {
            var param = paramList[i];
            //gathers enumerations before triggering it
            if (param.localName == "enumeration") {
                enumeration.push(param);
            } else {
                check = checkParam(string, param, datatype);
                if (check instanceof NotAllowed) {
                    return check;
                }
            }
        }
        if (enumeration.length > 0) {
            check = checkEnumeration(string, enumeration, datatype);
            if (check instanceof NotAllowed) {
                return check;
            }
        }
        return new Empty();
    }

    this.checkRegExp = function(regExp, string, datatype) {
        if (regExp.test(string)) {
            return new Empty();
        }
        return new NotAllowed("invalid " + datatype.localName, datatype, string);
    }
    
    /*
            negation of checkRegExp
            */
    this.checkExclusiveRegExp = function(regExp, string, datatype) {
        if (regExp.test(string)) {
            return new NotAllowed("invalid " + datatype.localName, datatype, string);
        }
        return new Empty();
    }
    
    this.checkIntegerRange = function(min, max, string, datatype) {
        if (regExp.test(integerRegExp, string, datatype)) {
            return new NotAllowed("invalid " + datatype.localName, datatype, string);
        } else {
            var intValue = parseInt(string);
            if (intValue >= min && intValue <= max) {
                return new Empty();
            }
            return new NotAllowed("invalid integer range, min is " + min + ", max is " + max + " for datatype " + datatype.localName, datatype, string);
        }
    }
    
    this.checkPrefixDeclared = function(string, context, datatype) {
        if (string.match(":")) {
            var prefix = string.split(":")[0];
            if (context.map[prefix] == undefined) {
                return new NotAllowed("prefix " + prefix + " not declared", datatype, string);
            }
        }
        return new Empty();
    }
    
    this.checkParam = function(string, param, datatype) {
        if (param.localName == "fractionDigits") {
            var number = parseInt(param.string);
            var regExp = new RegExp(fractionDigits + "{" + number + "}$");
            var check = this.checkRegExp(regExp, string, datatype);
            //adds an error message
            if (check instanceof NotAllowed) {
                return new NotAllowed("invalid number of fraction digits, expected : " + number, check, string);
            }
        } else if (param.localName == "length") {
            var number = parseInt(param.string);
            if (number != string.length) {
                return new NotAllowed("invalid number of characters digits, expected : " + number + ", found : " + string.length, datatype, string);
            }
        } else if (param.localName == "maxExclusive") {
            var number = parseFloat(param.string);
            var value = parseFloat(string);
            if (value >= number) {
                return new NotAllowed("value too big, " + param.localName + " is : " + number + ", found : " + value, datatype, string);
            }
        } else if (param.localName == "maxInclusive") {
            var number = parseFloat(param.string);
            var value = parseFloat(string);
            if (value > number) {
                return new NotAllowed("value too big, " + param.localName + " is : " + number + ", found : " + value, datatype, string);
            }
        } else if (param.localName == "maxLength") {
            var number = parseInt(param.string);
            if (string.length > number) {
                return new NotAllowed("string too long, " + param.localName + " is : " + number + ", found : " + string.length, datatype, string);
            }
        } else if (param.localName == "minExclusive") {
            var number = parseFloat(param.string);
            var value = parseFloat(string);
            if (value <= number) {
                return new NotAllowed("value too small, " + param.localName + " is : " + number + ", found : " + value, datatype, string);
            }
        } else if (param.localName == "minInclusive") {
            var number = parseFloat(param.string);
            var value = parseFloat(string);
            if (value < number) {
                return new NotAllowed("value too small, " + param.localName + " is : " + number + ", found : " + value, datatype, string);
            }
        } else if (param.localName == "minLength") {
            var number = parseFloat(param.string);
            if (string.length < number) {
                return new NotAllowed("string too small, " + param.localName + " is : " + number + ", found : " + string.length, datatype, string);
            }
        } else if (param.localName == "pattern") {
            var escaped = escapeRegExp(param.string);
            var regExp = new RegExp("^" + escaped + "$");
            var check = this.checkRegExp(regExp, string, datatype);
            //adds an error message
            if (check instanceof NotAllowed) {
                return new NotAllowed("value : " + string + " does not respect pattern : " + param.string, check, string);
            }
        } else if (param.localName == "totalDigits") {
            var number = parseInt(param.string);
            var length = string.replace("/\\./", "").length;
            if (length != number) {
                return new NotAllowed("invalid number of digits, " + param.localName + " is : " + number + ", found : " + length, datatype, string);
            }
        } else if (param.localName == "totalDigits") {
            var number = parseInt(param.string);
            var length = string.replace("/\\./", "").length;
            if (length != number) {
                return new NotAllowed("invalid number of digits, " + param.localName + " is : " + number + ", found : " + length, datatype, string);
            }
        }
        return new Empty();
    }
    
    this.checkEnumeration = function(string, enumeration, datatype) {
        for (var i in enumeration) {
            var value = enumeration[i];
            var escaped = escapeRegExp(value);
            var regExp = new RegExp("^ *" + escaped + " *$");
            var check = this.checkRegExp(regExp, string, datatype);
            if (check instanceof Empty) {
                return check;
            }
        }
        var msg = "invalid value : " + string + ", must be one of : [" + enumeration[0];
        for (var i = 1 ; i < enumeration.length ; i++) {
            var value = enumeration[i];
            msg += "," + value;
        }
        msg += "]";
        return new NotAllowed(msg, datatype, string);
    }
    
}