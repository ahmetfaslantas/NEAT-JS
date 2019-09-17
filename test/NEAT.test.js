

test('Does network math work correctly?', () => {
	let { NEAT, activation, crossover, mutate } = require('../lib/NEAT.js');

	let config = {
		model: [
			{ nodeCount: 5, type: "input" },
			{ nodeCount: 5, type: "hidden", activationfunc: activation.RELU },
			{ nodeCount: 1, type: "output", activationfunc: activation.RELU }
		],
		mutationRate: 0.05,
		crossoverMethod: crossover.RANDOM,
		mutationMethod: mutate.RANDOM,
		populationSize: 10
	};


	let neat = new NEAT(config);
	let w = [];

	for (let i = 0; i < 1000; i++) w.push(1);
	neat.creatures[1].setInputs([1, 1, 1, 1, 1]);

	neat.creatures[1].setFlattenedGenes(w);

	neat.feedForward();





	expect(neat.creatures[1].network.layers[2].getValues()[0]).toBe(31);
});