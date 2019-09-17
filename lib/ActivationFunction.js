/*
	Author: ExtensionShoe
	Date: 30/08/2019
	License: MIT
*/

let activation = { // Supported activation functions.
	RELU: function (x) {
		if (x > 0) return x;
		else return 0;
	},
	TANH: function (x) {
		return Math.tanh(x);
	},
	SIGMOID: function (x) {
		return (1 / (1 + Math.exp(-x)));
	},
	LEAKY_RELU: function (x) {
		if (x > 0) return x;
		else return (x * 0.01);
	},
	SOFTMAX: function (array) {
		let sum = 0;
		let result = [];
		for (let i = 0; i < array.length; i++) {
			sum += Math.exp(array[i]);
		}
		for (let i = 0; i < array.length; i++) {
			result.push(Math.exp(array[i]) / sum);
		}
		return result;
	}
}

module.exports = activation;