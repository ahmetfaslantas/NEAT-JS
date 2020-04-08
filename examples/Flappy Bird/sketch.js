const TOTAL = 1000;
let birds = [];
let pipes = [];
let counter = 0;
let slider;
let neat;

let config = {
	model: [
		{nodeCount: 5, type: "input"},
		{nodeCount: 2, type: "output", activationfunc: activation.SOFTMAX}
	],
	mutationRate: 0.1,
	crossoverMethod: crossover.RANDOM,
	mutationMethod: mutate.RANDOM,
	populationSize: TOTAL
};

function setup() {
  createCanvas(640, 480);
  slider = createSlider(1, 10, 1);
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
  }
  neat = new NEAT(config);
}

function draw() {
  for (let n = 0; n < slider.value(); n++) {
    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();

      for (let j = birds.length - 1; j >= 0; j--) {
        if (pipes[i].hits(birds[j])) {
          birds[j].dead = true;
        }
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    for (let i = birds.length - 1; i >= 0; i--) {
      if (birds[i].offScreen()) {
        birds[i].dead = true;
      }
    }

    for (let bird of birds) {
      if (!bird.dead) bird.update();
    }

    for (let i = 0; i < TOTAL; i++) {
      neat.setInputs(birds[i].inputss(pipes), i);
    }

    neat.feedForward();

	  let desicions = neat.getDesicions();
    for (let i = 0; i < TOTAL; i++) {
      if (desicions[i] === 1) {
        birds[i].up();
      }
    }

    let finish = true;
    for (let z = 0; z < birds.length; z++) {
      if (!birds[z].dead) {
        finish = false;
        break;
      }
    }
    if (finish) {
      counter = 0;
      pipes = [];
      for (let i = 0; i < TOTAL; i++) {
        neat.setFitness(birds[i].score, i);
        birds[i] = new Bird();

      }
      neat.doGen();
    }
  }

  // All the drawing stuff
  background(0);

  for (let bird of birds) {
    bird.show();
  }

  for (let pipe of pipes) {
    pipe.show();
  }
}