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
			console.log(this.oldCreatures[i].fitness);
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

module.exports = {NEAT, activation, crossover, mutate};