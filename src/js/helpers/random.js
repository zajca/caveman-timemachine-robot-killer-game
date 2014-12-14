'use strict';
module.exports = {

    /*
     @return random number
     */
    randomNumber: function() {
        return Math.floor(Math.random());
    },

    /*
     @return random number between min max
     */
    randomNumberBetween: function(min, max) {
        return Math.random() * (max - min) + min;
    },

    /*
     @return random field from array
     */
    randomFromArray: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /*
     @return pos of random field
     */
    randomNumberFromArray: function(array) {
        return Math.floor(Math.random() * array.length);
    },

    /*
     @return random number between min max
     */
    randomIntBetween: function(from, to) {
        return Math.floor(Math.random() * to) + from;
    },

    /*
     @return random number from zero to limit
     */
    randomNumberFromZero: function(limit) {
        return Math.floor(Math.random() * limit);
    },

    /*
     @return random true and false
     */
    randomTF: function() {
        var _ref;
        return (_ref = Math.random() < 0.5) != null ? _ref : {
            "true": false
        };
    },

    /*
     @return randomize array
     */
    randomizeArray: function(arr) {
        var i, j, x;
        j = void 0;
        x = void 0;
        i = arr.length;
        while (i) {
            j = parseInt(Math.random() * i);
            x = arr[--i];
            arr[i] = arr[j];
            arr[j] = x;
        }
        return arr;
    }
};
