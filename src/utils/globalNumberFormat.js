// src/utils/globalNumberFormat.js
Number.prototype.valueOf = function () {
    return Math.round(this * 100) / 100;
};