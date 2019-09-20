# NEAT-JS

NeuroEvolution of Augmenting Topologies (NEAT) is a genetic algorithm (GA) for the generation of evolving artificial neural networks.

![code coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg) ![license](https://img.shields.io/badge/license-MIT-brightgreen.svg) ![issues](https://img.shields.io/github/issues/ExtensionShoe/NEAT-JS.svg)

## Getting Started:

### Setting up the library:

If you are using Node.js you can import this library like so:

```js
let { NEAT, activation, crossover, mutate } = require('neat_net-js');
```

If you are planning to use this library on the browser:

```html
<script language="javascript" type="text/javascript" src="./lib/NEAT_browser.js"></script>
```

### Basic Usage:

The basic usage of this library is as follows.

```js
let config = {
	model: [
		{nodeCount: 5, type: "input"},
		{nodeCount: 1, type: "output", activationfunc: activation.RELU}
	],
	mutationRate: 0.05,
	crossoverMethod: crossover.RANDOM,
	mutationMethod: mutate.RANDOM,
	populationSize: 10
};


let neat = new NEAT(config);
```

#### Config parameters:


```js
model: Defines the model your creatures are going to use.
mutationRate: Sets the mutation chance of the creatures. (Default: 0.05)
crossoverMethod: Sets the crossover method. (crossover.RANDOM or crossover.SLICE) (Default: crossover.RANDOM)
mutationMethod: Sets the mutation method. (only mutate.RANDOM for now) (Default: mutate.RANDOM)
populationSize: Sets the population size. (Default: 500)
```

#### Functions:
```js
neat.doGen(); // Does one generation with mutation and crossover.
```
```js
neat.setFitness(fitness, index); { // Sets a creature's score. This will then be normalized for actual fitness value.
```
```js
neat.bestCreature(); // Returns the best creature from the last generation.
```
```js
neat.setInputs(array, index); // Sets the inputs of the creature indexed as "index".
```
```js
neat.getDesicions(); // Returns every creature's desicion in an array.
```
```js
neat.feedForward();  // Feeds forward every creatıre's neural network.
```
```js
neat.export(); // Exports all creatures for later training (See import() below) You can also pass an index to this function.
```
```js
neat.import(data); // Imports creature(s) previously exported.
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
[MIT](https://choosealicense.com/licenses/mit/)