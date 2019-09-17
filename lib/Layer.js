/*
	Author: ExtensionShoe
	Date: 30/08/2019
	License: MIT
*/

let Node = require('./Node.js');

function Layer(nodeCount, type, activationfunc) { // A layer component of a network with nodes and bias node.
	this.nodes = [];
	this.bias = undefined;
	this.type = type;
	this.activationfunc = activationfunc;

	for (let i = 0; i < nodeCount; i++) { // Inits  nodes.
		this.nodes.push(new Node());
	}

	if (this.type !== "output") this.bias = new Node();

	this.connect = function (count) { // Connects one layer to another.
		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].initWeights(count);
		}

		if (this.bias !== undefined) this.bias.initWeights(count);
	}

	this.feedForward = function (layer) { // Feeds forward the layers values to the specified layer.
		for (let i = 0; i < this.bias.weights.length; i++) {
			layer.nodes[i].value = 0;
		}

		for (let i = 0; i < this.nodes.length; i++) {
			for (let w = 0; w < this.nodes[i].weights.length; w++) {
				layer.nodes[w].value += this.nodes[i].value * this.nodes[i].weights[w];
			}
		}

		for (let w = 0; w < this.bias.weights.length; w++) {
			layer.nodes[w].value += this.bias.weights[w];
		}

		if (layer.activationfunc.name !== "SOFTMAX") for (let w = 0; w < layer.nodes.length; w++) layer.nodes[w].value = layer.activationfunc(layer.nodes[w].value);
		else layer.setValues(layer.activationfunc(layer.getValues()));
	}

	this.getValues = function () { // Returns the values of the nodes in the layer as an array.
		let result = [];
		for (let i = 0; i < this.nodes.length; i++) {
			result.push(this.nodes[i].value);
		}
		return result;
	}

	this.setValues = function (values) { // Sets an array as the nodes values.
		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].value = values[i];
		}
	}
}

module.exports = Layer;