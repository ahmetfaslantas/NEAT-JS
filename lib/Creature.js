/*
	Author: ExtensionShoe
	Date: 30/08/2019
	License: MIT
*/

let Network = require('./Network.js');

function Creature(model) {
	this.network = new Network(model); // Init the network

	this.fitness = 0;
	this.score = 0;

	this.flattenGenes = function () { // Flattens the genes of the creature's genes and returns them as an array.
		let genes = [];

		for (let i = 0; i < this.network.layers.length - 1; i++) {
			for (let w = 0; w < this.network.layers[i].nodes.length; w++) {
				for (let e = 0; e < this.network.layers[i].nodes[w].weights.length; e++) {
					genes.push(this.network.layers[i].nodes[w].weights[e]);
				}
			}

			for (let w = 0; w < this.network.layers[i].bias.weights.length; w++) {
				genes.push(this.network.layers[i].bias.weights[w]);
			}
		}

		return genes;
	}

	this.setFlattenedGenes = function (genes) { // Sets an array of weights as the creature's genes.
		for (let i = 0; i < this.network.layers.length - 1; i++) {
			for (let w = 0; w < this.network.layers[i].nodes.length; w++) {
				for (let e = 0; e < this.network.layers[i].nodes[w].weights.length; e++) {
					this.network.layers[i].nodes[w].weights[e] = genes[0];
					genes.splice(0, 1);
				}
			}

			for (let w = 0; w < this.network.layers[i].bias.weights.length; w++) {
				this.network.layers[i].bias.weights[w] = genes[0];
				genes.splice(0, 1);
			}
		}
	}

	this.feedForward = function () { // Feeds forward the creature's network.
		this.network.feedForward();
	}

	this.setInputs = function (inputs) { // Sets the inputs of the creature.
		this.network.layers[0].setValues(inputs);
	}

	this.desicion = function () { // Some spaghetti code that returns the desicion of the creature. For SOFTMAX outputs.
		let index = -1; 
		let max = -Infinity;
		for (let i = 0; i < this.network.layers[this.network.layers.length - 1].nodes.length; i++) {
			if (this.network.layers[this.network.layers.length - 1].nodes[i].value > max) {
				max = this.network.layers[this.network.layers.length - 1].nodes[i].value;
				index = i;
			}
		}
		return index;
	}
}

module.exports = Creature;