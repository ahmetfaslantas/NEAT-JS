let mutate = {
	RANDOM: function (genes, mutationRate) {
		for (let i = 0; i < genes.length; i++) {
			if (Math.random() < mutationRate) genes[i] = (Math.random() * 2) - 1;
		}

		return genes;
	}
}

module.exports = mutate;