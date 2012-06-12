
var Sign = function(name, code) {
    this.name = name;
    this.code = code;
    this.messages = [];
    this.latlng = "";
};

var SignList = function(signNames, params) {

    this.setCodedSigns = function(signs) {
        var coded = [];

        for(var i = 0; i < signs.length; i++) {

            var num  = i + 1;
            var code = "CPMV";

            if(num < 100) {
                code += "0";
            }

            if(num < 10) {
                code += "0";
            }

            code += num;

            coded.push(new Sign(signs[i], code));
        } 

        return coded;
    };

    this.getSigns = function() {
        return this.coded;
    };

    this.parseMessages = function(params) {
        var messages = {};

        for(var key in params) {
            var tmp = key.split("_");
            var code = tmp[0];
            var i = tmp[1] - 1;

            if(typeof i == "undefined" || tmp[2] == "Ico") {
                continue;
            }

            // Hack
            if(code == "CPMV05 " || code == "CPMV08 " ) {
                code = code.replace("CPMV0", "CPMV00").replace(" ", "");
            }

            if(typeof messages[code] == "undefined") {
                messages[code] = [];
            } 

            if(typeof messages[code][i] == "undefined") {
                messages[code][i] = params[key] + "\n"; 
            } else {
                messages[code][i] += params[key] + "\n"; 
            }   
        }

        return messages;
    };

    this.setMessages = function(messages) {
        for(var k in this.coded) {
            if(typeof messages[this.coded[k].code] != 'undefined') {
                this.coded[k].messages = messages[this.coded[k].code];  
            } 
        }
    };

    this.signs = signNames;
    this.coded = this.setCodedSigns(signNames);
    this.setMessages(this.parseMessages(params));
 
};

var TrafficStatus = function(url, signNames) {

    var parseParams = function(str) {
        var map = {};
        var params = str.split("&"); 

        for (var i = 0; i < params.length; i++) { 
            var pairs = params[i].split("="); 
            map[pairs[0]] = pairs[1];
        } 

        return map;
    };

    this.getTrafficSigns = function(callback) {
        $.get(url, function(response) {
            var params = parseParams(response);
            var signList = new SignList(signNames, params);
            callback(signList.getSigns());
        });
    };

};







