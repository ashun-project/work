/**
 * 1960 => 1960.00
 * @author Lee
 * 
 * ***/



/**
 * one point percent
 * 20 ,100 => 20.0%
 * @author Lee
 * @param {type:int}
 * ***/


import Vue from 'vue';
Vue.filter('doubleNumber', function doubleNumber (num) {
    Number(num)
    return (num / 100).toFixed(2);
})
Vue.filter('percentWithPoint', function percentWithPoint (num1, num2) {
    return ((num1 / num2) * 100).toFixed(2)
})