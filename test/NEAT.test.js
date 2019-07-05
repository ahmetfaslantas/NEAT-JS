const NEAT = require('../lib/NEAT.js');

test('Does network math work correctly?', () => {
	var neat = new NEAT([3, 2], 10, 0, "tanh");


	// Since we are testing let's set all weights to 1 and all the input values to 1.

	for (let i = 0; i < neat.popsize; i++) {
		for (let q = 0; q < neat.population[i][0].length; q++) {
			for (let w = 0; w < neat.population[i][0][q].length; w++) {
				for (let e = 0; e < neat.population[i][0][q][w].length; e++) {
					neat.population[i][0][q][w][e] = 1;
				}
			}
		}
	}

	for (let i = 0; i < neat.popsize; i++) {
		for (let q = 0; q < neat.population[i][2].length; q++) {
			for (let w = 0; w < neat.population[i][2][q].length; w++) {
				neat.population[i][2][q][w] = 1;
			}
		}
	}
	



	for (let i = 0; i < neat.popsize; i++) {
		neat.setInputs([1, 1, 1], i);
	}

	neat.predict();

	var expected_output = 0.999329299739067;


	expect(neat.population[0][1][neat.population[0][1].length - 1][0]).toBe(expected_output);
});