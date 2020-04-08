/*
	Author: ExtensionShoe
	Date: 30/08/2019
	License: MIT
*/

function NEAT(config) {
	this.creatures = [];
	this.oldCreatures = [];
	this.model = config.model;
	this.exportModel = [];
	this.populationSize = config.populationSize || 500;
	this.mutationRate = config.mutationRate || 0.05;
	this.crossoverMethod = config.crossoverMethod || crossover.RANDOM;
	this.mutationMethod = config.mutationMethod || mutate.RANDOM;
	this.generation = 0;

	for (let i = 0; i < this.model.length; i++) { // Sanitize the model.
		let data = Object.assign({}, this.model[i]);
		if (this.model[i].activationfunc) {
			data.activationfunc = data.activationfunc.name;
			this.exportModel.push(data);
		} else {
			this.exportModel.push(data);
		}
	}

	for (let i = 0; i < this.populationSize; i++) { // Create the creatures.
		this.creatures.push(new Creature(this.model));
	}

	this.mutate = function () { // Parses every creature's genes passes them to the mutation function and sets their new (mutated) genes.
		for (let i = 0; i < this.populationSize; i++) {
			let genes = this.creatures[i].flattenGenes();
			genes = this.mutationMethod(genes, this.mutationRate);
			this.creatures[i].setFlattenedGenes(genes);
		}
	}

	this.crossover = function () { // Takes two creature's genes flattens them and passes them to the crossover function.
		for (let i = 0; i < this.populationSize; i++) {
			this.oldCreatures = Object.assign([], this.creatures);
			let parentx = this.pickCreature();
			let parenty = this.pickCreature();

			let genes = this.crossoverMethod(parentx.flattenGenes(), parenty.flattenGenes());
			this.creatures[i].setFlattenedGenes(genes);
		}
	}

	this.pickCreature = function () { // Normalizes every creature's score (fitness) and and returns a creature based on their fitness value.
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

	this.setFitness = function (fitness, index) { // Sets a creature's score. This will then be normalized for actual fitness value.
		this.creatures[index].score = fitness;
	}

	this.feedForward = function () { // Feeds forward every creature's network.
		for (let i = 0; i < this.creatures.length; i++) {
			this.creatures[i].feedForward();
		}
	}

	this.doGen = function () { // Does 1 fast generation with crossover and mutation.
		this.crossover();
		this.mutate();
		this.generation++;
		console.log('Generation: ' + this.generation);
	}

	this.bestCreature = function () { // Returns the index of the best creature from the previous generation.
		let index = 0;
		let max = -Infinity;
		for (let i = 0; i < this.oldCreatures.length; i++) {
			if (this.oldCreatures[i].fitness > max) {
				max = this.oldCreatures[i].fitness;
				index = i;
			}
		}
		return index;
	}

	this.getDesicions = function () { // Returns every creature's desicion index in an array.
		let result = [];

		for (let i = 0; i < this.creatures.length; i++) {
			result.push(this.creatures[i].desicion());
		}
		return result;
	}

	this.setInputs = function (array, index) { // Sets the inputs of the creature indexed as "index".
		this.creatures[index].setInputs(array);
	}

	this.export = function (index) {
		let data = [];
		data.push(JSON.parse(JSON.stringify(this.exportModel)));
		data.push([]);
		if (index) {
			data[1].push(this.creatures[index].flattenGenes());
		} else {
			for (let i = 0; i < this.populationSize; i++) {
				data[1].push(this.creatures[i].flattenGenes());
			}
		}
		return data;
	}

	this.import = function (data) {
		if (JSON.stringify(data[0]) === JSON.stringify(this.exportModel)) {
			console.log('Importing ' + data[1].length + ' creature(s)');
			for (let i = 0; i < data[1].length; i++) {
				let newCreature = new Creature(this.model);
				newCreature.setFlattenedGenes(data[1][i]);
				this.creatures.push(newCreature);
				this.populationSize++;
			}
		} else {
			throw "Invalid model!";
		}
	}

	this.getTensorflowModel = function(index) { // Generate the requested tensorflow model.
		if (index) {
			// Generate the model for the index provided.
			return this.creatures[index].network.getTensorflowModel();
		} else {
			// Generate the model the best performing creature.
			return this.creatures[this.bestCreature()].network.getTensorflowModel();
		}
	}
}

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

	this.desicion = function () { // Some spaghetti code that returns the desicion of the creature.
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

function Network(model) { // Neural Network.
	this.layers = [];
	this.model = model;

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

	this.getTensorflowModel = function () { // Generates a tensorflow model from the current network.
		
		// Collect the weights from each layer in the network.
		let weights = [];
		for(let i = 0; i < this.layers.length - 1; i++) {
			let weights_ = [];
			for(let j = 0; j < this.layers[i].nodes.length; j++) {
				weights_.push(this.layers[i].nodes[j].weights);
			}
			weights.push(weights_);
		}

		// Initialize the input and hidden layers.
		let input = tf.input({shape: [this.model[0].nodeCount]});
		let previous = input;
		for(let i = 1; i < this.model.length - 1; i++) {
			previous = tf.layers.dense({units: this.model[i].nodeCount, activation: 'relu'}).apply(previous);
		}
		// Initialize the output layer.
		let output = tf.layers.dense({units: this.model[this.model.length - 1].nodeCount, activation: 'softmax'}).apply(previous);

		// Create the model with random weights.
		let model = tf.model({inputs: input, outputs: output});

		// Set the weights of the model to the weights found by NEAT.
		for(let i = 1; i < this.model.length; i++) {
			model.layers[i].setWeights([tf.tensor(weights[i - 1], [weights[i-1].length, weights[i-1][0].length], dtype="float32"), tf.fill([this.model[i].nodeCount],0, dtype="float32")]);
		}

		return model;
	}
}

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

function Node() { // A Node.
	this.value = 0;
	this.weights = [];


	this.initWeights = function (count) { // Randomly initalize weights.
		for (let i = 0; i < count; i++) {
			this.weights.push((Math.random() * 2) - 1);
		}
	}
}

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

let crossover = { // Crossover methods.
	RANDOM: function (genesx, genesy) { // Randomly take genes from parentx or parenty and return newly created genes.
		let newGenes = [];

		for (let i = 0; i < genesx.length; i++) {
			if (Math.random() < 0.5) newGenes.push(genesx[i]);
			else newGenes.push(genesy[i]);
		}

		return newGenes;
	},
	SLICE: function (genesx, genesy) { // Takes a starting and an ending point in parentx's genes removes the genes in between and replaces them with parenty's genes. (How nature does it.)
		let start = Math.floor(Math.random() * (genesx.length));
		let end = Math.floor(Math.random() * (genesx.length - start + 2)) + start + 1;
		let cutPart = genesx.splice(start, end);

		Array.prototype.splice.apply(genesy, [start, cutPart.length].concat(cutPart));

		return genesy;

	}
}

let mutate = { // Mutation function (More to come!).
	RANDOM: function (genes, mutationRate) { // Randomly sets the weights to a completely random value.
		for (let i = 0; i < genes.length; i++) {
			if (Math.random() < mutationRate) genes[i] = (Math.random() * 2) - 1;
		}
		return genes;
	}
}

