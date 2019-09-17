/*
	Author: ExtensionShoe
	Date: 30/08/2019
	License: MIT
*/

let activation = require('./ActivationFunction.js');
let crossover = require('./Crossover.js');
let mutate = require('./Mutate.js');
let Creature = require('./Creature.js');

function NEAT(config) {
	this.creatures = [];
	this.oldCreatures = [];
	this.model = config.model;
	this.populationSize = config.populationSize;
	this.mutationRate = config.mutationRate;
	this.crossoverMethod = config.crossoverMethod;
	this.mutationMethod = config.mutationMethod;
	this.generation = 0;

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
}

module.exports = {NEAT, activation, crossover, mutate};