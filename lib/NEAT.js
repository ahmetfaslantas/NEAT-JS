/*
	Author: ExtensionShoe
	Date: 24/06/2019
	License: MIT
*/

"use strict";

function NEAT(network, popsize, mutationrate, activationfunc) {

	let fs;
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') fs = require('fs');

	console.time('Creating Network Took: ');

	// Check if constructor has only 1 value assigned meaning we are parsing the network previously exported from export().
	if (popsize === undefined) {
		console.log('Parsing...');

		try { // Try to parse the previously exported network.
			network = JSON.parse(network);
			if (network.length === 6) { // Check if the length of the parsed array is valid.
				this.network = network[0];
				this.popsize = network[1];
				this.mutationrate = network[2];
				this.activationfunc = network[3];
				this.population = network[4];
			} else {
				throw "Wrong input length!"; // Self explanatory.
			}
		} catch (error) {
			throw "Parsing the network failed! Did you set the constructor correctly? " + error;
		}

		console.log('Parsing complete.');


	} else {  // If we are creating a network from scratch use all constructor values.
		this.network = network;
		if (popsize <= 1) {
			console.error('Population size must be at least 2!');
			console.error('Setting population size to 2!');
			popsize = 2;
		}
		if (activationfunc !== 'sigmoid' && activationfunc !== 'tanh') {
			console.error('Invalid activation function has been set!');
			console.error('Setting activation function to sigmoid!');
			activationfunc = 'sigmoid';
		}

		this.popsize = popsize;
		this.mutationrate = mutationrate;
		this.population = [];
		this.activationfunc = activationfunc;


		// Generating creatures.
		for (let y = 0; y < this.popsize; y++) {

			let weights = [];
			let vals = [];
			let bias_weights = [];


			// Generating random bias neuron weights.
			for (let i = 0; i < this.network.length - 1; i++) {
				let temp = [];
				for (let q = 0; q < this.network[i + 1]; q++) {
					temp.push((Math.random() * (-1 - 1) + 1));
				}
				bias_weights.push(temp);
			}



			// Generating random weights.
			for (let i = 0; i < this.network.length; i++) {
				if (i !== this.network.length - 1) {
					let temp = [];
					for (let q = 0; q < this.network[i]; q++) {
						let a = [];
						for (let w = 0; w < this.network[i + 1]; w++) {
							a.push((Math.random() * (-1 - 1) + 1));
						}
						temp.push(a);
					}
					weights.push(temp);
				}
			}



			// Set all nodes' value to zeros.
			for (let i = 0; i < this.network.length; i++) {
				let a = [];
				for (let q = 0; q < this.network[i]; q++) {
					a.push(0);
				}
				vals.push(a);
			}



			// Set temporary values for prediction and fitness for now.
			let prediction = -1;
			let fitness = 0;
			let score = 0;



			// Add the creature to the array.
			this.population.push([weights, vals, bias_weights, prediction, fitness, score]);
		}
	}

	// Initalize the generation count at 0 and initalize this.oldPopulation which is required for crossover to work correctly.
	this.oldPopulation = [];
	this.generation = 0;

	console.timeEnd('Creating Network Took: ');

	// Output some information about the network population etc. on the console.
	console.log('Network Created: ' + '\n' + 'Network Configuration: ' + this.network + '\n' + 'Population Size: ' + this.popsize + '\n' + 'Mutation Rate: ' + this.mutationrate + '\n' + 'Activation Function: ' + this.activationfunc);



	// Setting the specified creature's input node values.
	this.setInputs = function (input, index) {
		if (this.population[index][1][0].length === input.length) {
			this.population[index][1][0] = input;
		} else {
			console.log('invalid input array length!');
		}
	}



	// Updates all creatures output layers.
	this.predict = function () {
		for (let p = 0; p < this.popsize; p++) { // Go through every creature.
			for (let layer = 1; layer < this.network.length; layer++) { // Go through every layers from 1 to the last one.
				for (let lnode = 0; lnode < this.network[layer]; lnode++) { // Go through every node.
					for (let inode = 0; inode < this.network[layer - 1]; inode++) { // Go through every node from the last layer.
						this.population[p][1][layer][lnode] += (this.population[p][1][layer - 1][inode] * this.population[p][0][layer - 1][inode][lnode]);
					}
					this.population[p][1][layer][lnode] += this.population[p][2][layer - 1][lnode];
					if (this.activationfunc === 'sigmoid') { // Applying sigmoid activation function.
						this.population[p][1][layer][lnode] = 1 / (1 + Math.exp(-this.population[p][1][layer][lnode]));
					} else if (this.activationfunc === 'tanh') { // Applying tanh activation function.
						this.population[p][1][layer][lnode] = Math.tanh(this.population[p][1][layer][lnode]);
					}
				}
			}
		}



		// Select creatures choice of action using softmax on the output layer.
		for (let i = 0; i < this.popsize; i++) {
			this.population[i][3] = this.indexOfMax(this.softmax(this.population[i][1][this.population[i][1].length - 1]));
		}
	}


	// Mutates every creatures every gene according to the mutation rate.
	this.mutate = function () {
		// Go through every creature's every weight and randomly change them to a random value.
		for (let i = 0; i < this.popsize; i++) {
			for (let q = 0; q < this.population[i][0].length; q++) {
				for (let w = 0; w < this.population[i][0][q].length; w++) {
					for (let e = 0; e < this.population[i][0][q][w].length; e++) {
						if (Math.random() <= this.mutationrate) {
							this.population[i][0][q][w][e] = (Math.random() * (-1 - 1) + 1);
						}
					}
				}
			}
		}

		for (let i = 0; i < this.popsize; i++) {
			for (let q = 0; q < this.population[i][2].length; q++) {
				for (let w = 0; w < this.population[i][2][q].legth; w++) {
					if (Math.random() <= this.mutationrate) {
						this.population[i][2][q][w] = (Math.random() * (-1 - 1) + 1);
					}
				}
			}
		}
	}




	// Evaluate every creature based on their fitness and return one.
	this.selectOne = function () {

		// Normalize all creatures' fitness values.
		let sum = 0;
		for (let i = 0; i < this.popsize; i++) {
			sum += this.oldPopulation[i][5] * this.oldPopulation[i][5];
		}


		for (let i = 0; i < this.popsize; i++) {
			this.oldPopulation[i][4] = ((this.oldPopulation[i][5] * this.oldPopulation[i][5]) / sum);
			this.population[i][4] = ((this.oldPopulation[i][5] * this.oldPopulation[i][5]) / sum);
		}

		// Randomly select a creature based on its fitness.
		let index = 0;
		let r = Math.random();

		while (r > 0) {
			r -= this.oldPopulation[index][4];
			index++;
		}
		index--;


		// Return a copy of the creature.
		return JSON.parse(JSON.stringify(this.oldPopulation[index]));
	}



	// Update every creatures genes with the genes from 2 randomly selected parent creatures based on their fitness.
	this.crossover = function () {
		this.oldPopulation = JSON.parse(JSON.stringify(this.population));
		for (let i = 0; i < this.popsize; i++) {
			let parentA = this.selectOne();
			let parentB = this.selectOne();
			let dnaA = parentA[0];
			let dnaB = parentB[0];
			let dnaA_bias = parentA[2];
			let dnaB_bias = parentB[2];
			let newDNA = [];
			let newDNA_bias = [];

			// Do crossover on normal nodes' weights.
			for (let q = 0; q < dnaA.length; q++) {
				newDNA.push([]);
				for (let w = 0; w < dnaA[q].length; w++) {
					newDNA[q].push([]);
					for (let e = 0; e < dnaA[q][w].length; e++) {
						if (Math.random() < 0.5) newDNA[q][w][e] = dnaA[q][w][e];
						else newDNA[q][w][e] = dnaB[q][w][e];
					}
				}
			}

			// Do crossover on bias nodes' weights.
			for (let q = 0; q < dnaA_bias.length; q++) {
				newDNA_bias.push([]);
				for (let w = 0; w < dnaA_bias[q].length; w++) {
					if (Math.random() < 0.5) newDNA_bias[q][w] = dnaA_bias[q][w];
					else newDNA_bias[q][w] = dnaB_bias[q][w];
				}
			}
			this.population[i][0] = JSON.parse(JSON.stringify(newDNA));
			this.population[i][2] = JSON.parse(JSON.stringify(newDNA_bias));
		}
	}



	// Returns the index of the best creature from the last generation.
	this.bestCreature = function () {
		let maxFitness = -Infinity;
		let index = 0;
		for (let i = 0; i < this.popsize; i++) {
			if (this.population[i][4] > maxFitness) {
				index = i;
				maxFitness = this.population[i][4];
			}
		}
		return index;
	}



	// Returns a random integer value so we can select a random parent from the mating pool or select a random gene etc.
	this.getRandomInt = function (min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}



	// Sets the fitness value of the creature indexed as: index.
	this.setFitness = function (fitness, index) {
		this.population[index][5] = fitness;
	}


	// Return the creature indexed as 'index' desicion.
	this.desicion = function (index) {
		return this.population[index][3];
	}



	// Takes an array and returns their values between 0 and 1. We use this algorithm in the output layer of every creature.
	this.softmax = function (arr) {
		return arr.map(function (value, index) {
			return Math.exp(value) / arr.map(function (y) { return Math.exp(y) }).reduce(function (a, b) { return a + b })
		});
	}



	// Returns the index value of the highest value in an array.
	this.indexOfMax = function (arr) {
		if (arr.length === 0) {
			return -1;
		}
		let max = arr[0];
		let maxIndex = 0;
		for (let i = 1; i < arr.length; i++) {
			if (arr[i] > max) {
				maxIndex = i;
				max = arr[i];
			}
		}
		return maxIndex;
	}

	// Does 1 generation rapidly.
	this.doGen = function () {
		this.crossover();
		this.mutate();
		this.generation++;
		console.log('Generation: ' + this.generation);
	}


	// Exports the current state of the NEAT instance so we can parse it and use it for later training.
	this.exportNet = function () {
		if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') { // Check for Node.js if so use fs to write the net.
			fs.writeFile("./net.json", JSON.stringify([this.network, this.popsize, this.mutationrate, this.activationfunc, this.population]), function (err) {
				if (err) {
					return console.log(err);
				}
				console.log("The file was saved!");
			});
		} else { // If using browser download the file.
			let a = document.createElement("a");
			let file = new Blob([JSON.stringify([this.network, this.popsize, this.mutationrate, this.activationfunc, this.population])], { type: 'text/plain' });
			a.href = URL.createObjectURL(file);
			a.download = 'net.json';
			a.click();
		}
	}
}


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') // Export the module if using Node.js
	module.exports = NEAT;
else // If using JavaScript.
	window.NEAT = NEAT;