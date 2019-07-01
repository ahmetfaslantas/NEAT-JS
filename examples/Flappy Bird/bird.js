class Bird {
  constructor() {
    this.y = height / 2;
    this.x = 64;
	this.dead = false;

    this.gravity = 0.8;
    this.lift = -12;
    this.velocity = 0;


    this.score = 0;
    this.fitness = 0;

  }

  show() {
	  if (!this.dead) {
    stroke(255);
    fill(255, 100);
    ellipse(this.x, this.y, 32, 32);
	  }
  }

  up() {
    if (!this.dead) this.velocity += this.lift;
  }



  closestP(pipes) {

    // Find the closest pipe
    let closest = null;
    let closestD = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let d = (pipes[i].x + pipes[i].w) - this.x;
      if (d < closestD && d > 0) {
        closest = pipes[i];
        closestD = d;
      }
    }


    
  
	return closest;
  }
  
  inputss(pipes) {
	  let inputs = [];
	  let closest = this.closestP(pipes);
    inputs[0] = map(closest.x, this.x, width, 0, 1);
      // top of closest pipe opening
      inputs[1] = map(closest.top, 0, height, 0, 1);
      // bottom of closest pipe opening
      inputs[2] = map(closest.bottom, 0, height, 0, 1);
      // bird's y position
      inputs[3] = map(this.y, 0, height, 0, 1);
      // bird's y velocity
      inputs[4] = map(this.velocity, -5, 5, 0, 1);
	return inputs;
  }

  offScreen() {
    return (this.y > height || this.y < 0);
  }

  update() {
    this.score++;

    this.velocity += this.gravity;
    //this.velocity *= 0.9;
    this.y += this.velocity;
  }

}
