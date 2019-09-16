const NEAT = require('../lib/NEAT.js');


test('Does network math work correctlyfor 2 layers?', () => {
	let { NEAT, activation, crossover, mutate } = require('./NEAT.js');

	let config = {
		model: [
			{ nodeCount: 3, type: "input" },
			{ nodeCount: 2, type: "output", activationfunc: activation.SOFTMAX }
		],
		mutationRate: 0.05,
		crossoverMethod: crossover.RANDOM,
		mutationMethod: mutate.RANDOM,
		populationSize: 1000
	};


	let neat = new NEAT(config);


	for (let i = 0; i < neat.popsize; i++) {
		neat.setInputs([1, 1, 1], i);
	}

	neat.predict();

	var expected_output = 0.999329299739067;


	expect(neat.population[0][1][neat.population[0][1].length - 1][0]).toBe(expected_output);
});



