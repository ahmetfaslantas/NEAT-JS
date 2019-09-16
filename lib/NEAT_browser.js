/*
	Author: ExtensionShoe
	Date: 30/08/2019
	License: MIT
*/

/*
	Author: ExtensionShoe
	Date: 30/08/2019
	License: MIT
*/

function NEAT(config) {
	this.creatures = [];
	this.oldCreatures = [];
	this.model = config.model;
	this.populationSize = config.populationSize;
	this.mutationRate = config.mutationRate;
	this.crossoverMethod = config.crossoverMethod;
	this.mutationMethod = config.mutationMethod;
	this.generation = 0;

	for (let i = 0; i < this.populationSize; i++) {
		this.creatures.push(new Creature(this.model));
	}

	this.mutate = function () {
		for (let i = 0; i < this.populationSize; i++) {
			let genes = this.creatures[i].flattenGenes();
			genes = this.mutationMethod(genes, this.mutationRate);
			this.creatures[i].setFlattenedGenes(genes);
		}
	}

	this.crossover = function () {
		for (let i = 0; i < this.populationSize; i++) {
			this.oldCreatures = Object.assign([], this.creatures);
			let parentx = this.pickCreature();
			let parenty = this.pickCreature();
			//console.log(parentx.fitness);


			let genes = this.crossoverMethod(parentx.flattenGenes(), parenty.flattenGenes());
			this.creatures[i].setFlattenedGenes(genes);
		}
	}

	this.pickCreature = function () {
		let sum = 0;
		for (let i = 0; i < this.oldCreatures.length; i++) {
			sum += Math.pow(this.oldCreatures[i].score, 2);
		}

		for (let i = 0; i < this.oldCreatures.length; i++) {
			this.oldCreatures[i].fitness = Math.pow(this.oldCreatures[i].score, 2) / sum;
		}
		let index = 0;
		let r = Math.random();
		while (r > 0) {
			r -= this.oldCreatures[index].fitness;
			index += 1;
		}
		index -= 1;
		return this.oldCreatures[index];
	}

	this.setFitness = function (fitness, index) {
		this.creatures[index].score = fitness;
	}

	this.feedForward = function () {
		for (let i = 0; i < this.creatures.length; i++) {
			this.creatures[i].feedForward();
		}
	}

	this.doGen = function () {
		this.crossover();
		this.mutate();
		this.generation++;
		console.log('Generation: ' + this.generation);
	}

	this.bestCreature = function () {
		let index = 0; 
		let max = -Infinity;
		for (let i = 0; i < this.creatures.length; i++) {
			if (this.creatures[i].fitness > max) {
				max = this.creatures[i].fitness;
				index = i;
			}
		}
		return index;
	}

	this.getDesicions = function () {
		let result = [];

		for (let i = 0; i < this.creatures.length; i++) {
			result.push(this.creatures[i].desicion());
		}
		return result;
	}
	
	this.setInputs = function (array, index) {
		this.creatures[index].setInputs(array);
	}
}

function Creature(model) {
	this.network = new Network(model);

	this.fitness = 0;
	this.score = 0;

	this.flattenGenes = function () {
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

	this.setFlattenedGenes = function (genes) {
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

	this.feedForward = function () {
		this.network.feedForward();
	}

	this.setInputs = function (inputs) {
		this.network.layers[0].setValues(inputs);
	}

	this.desicion = function () {
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

function Network(model) {
	this.layers = [];

	for (let i = 0; i < model.length; i++) {
		this.layers.push(new Layer(model[i].nodeCount, model[i].type, model[i].activationfunc));
	}

	for (let i = 0; i < this.layers.length - 1; i++) {
		this.layers[i].connect(this.layers[i + 1].nodes.length);
	}

	this.feedForward = function () {
		for (let i = 0; i < this.layers.length - 1; i++) {
			this.layers[i].feedForward(this.layers[i + 1]);
		}
	}
}

function Layer(nodeCount, type, activationfunc) {
	this.nodes = [];
	this.bias = undefined;
	this.type = type;
	this.activationfunc = activationfunc;

	for (let i = 0; i < nodeCount; i++) {
		this.nodes.push(new Node());
	}

	if (this.type !== "output") this.bias = new Node();

	this.connect = function (count) {
		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].initWeights(count);
		}

		if (this.bias !== undefined) this.bias.initWeights(count);
	}

	this.feedForward = function (layer) {
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

	this.getValues = function () {
		let result = [];
		for (let i = 0; i < this.nodes.length; i++) {
			result.push(this.nodes[i].value);
		}
		return result;
	}

	this.setValues = function (values) {
		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].value = values[i];
		}
	}
}

function Node() {
	this.value = 0;
	this.weights = [];


	this.initWeights = function (count) {
		for (let i = 0; i < count; i++) {
			this.weights.push((Math.random() * 2) - 1);
		}
	}
}

let activation = {
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

let crossover = {
	RANDOM: function (genesx, genesy) {
		let newGenes = [];

		for (let i = 0; i < genesx.length; i++) {
			if (Math.random() < 0.5) newGenes.push(genesx[i]);
			else newGenes.push(genesy[i]);
		}

		return newGenes;
	},
	SLICE: function (genesx, genesy) {
		let start = Math.floor(Math.random() * (genesx.length));
		let end = Math.floor(Math.random() * (genesx.length - start + 2)) + start + 1;
		let cutPart = genesx.splice(start, end);

		Array.prototype.splice.apply(genesy, [start, cutPart.length].concat(cutPart));

		return genesy;

	}
}

let mutate = {
	RANDOM: function (genes, mutationRate) {
		for (let i = 0; i < genes.length; i++) {
			if (Math.random() < mutationRate) genes[i] = (Math.random() * 2) - 1;
		}

		return genes;
	}
}