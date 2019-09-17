/*
	Author: ExtensionShoe
	Date: 30/08/2019
	License: MIT
*/

let Layer = require('./Layer.js');

function Network(model) { // Neural Network.
	this.layers = [];

	for (let i = 0; i < model.length; i++) { // Init all the layers.
		this.layers.push(new Layer(model[i].nodeCount, model[i].type, model[i].activationfunc));
	}

	for (let i = 0; i < this.layers.length - 1; i++) { // Connect the layers to each other.
		this.layers[i].connect(this.layers[i + 1].nodes.length);
	}

	this.feedForward = function () { // Feeds forward the network.
		for (let i = 0; i < this.layers.length - 1; i++) {
			this.layers[i].feedForward(this.layers[i + 1]);
		}
	}
}

module.exports = Network;