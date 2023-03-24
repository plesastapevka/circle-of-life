class Fox extends Entity {
  constructor(x, y, ageExpectancy) {
    super(x, y, ageExpectancy, "FOX");
    this.gender = 0;
    this.speed = 0.02;
    this.hunger = 30;
    this.thirst = 100;
    this.reproduction = 100;
    this.closeDistance = 3;
    this.direction = [0, 0];
    this.action = "IDLE";
    this.foodDistance = 100;
    this.mateDistance = 130;
    this.waterDistance = 30;
    this.target = 0;
    console.log("Fox created!");
  }

  // Move fox around
  move(dt) {
    this.getAction();
    if (this.action == "CHASE") {
      /*
       Chasing bunnies
      */
      this.chase(dt);
    } else {
      /*
       Random walking
      */
      this.randomWalk(dt);
    }
  }
  
  // Increase stats overtime
  increaseBar(bar) {
    if (bar == 0) {
      this.reproduction = 100;
    } else if (bar == 1) {
      //hunger
      this.hunger = 100;
    } else if (bar == 2) {
      // thirst
      this.thirst = 100;
    }
  }
  
  // Get current behavior
  getAction() {
    let closeRabbit = this.getClosestRabbit();
    if (closeRabbit != 0 && this.hunger < 30) {
      this.target = closeRabbit;
      this.action = "CHASE";
    } else if (this.action == "MATING" || this.action == "DRINKING" || this.action == "EATING") {
      return;
    } else if (this.reproduction < 50) {
      this.action = "PROCREATE";
      return;
    } else if (this.thirst < 50) {
      this.action = "THIRST";
      return;
    } else if (this.hunger < 50) {
      this.action = "HUNGRY";
      return;
    } else {
      this.action = "IDLE";
    }
  }

  // Chase after nearest bunny if hungry
  chase(dt) {
    if (!doesExist(bunnies, this.target.id)){
      this.action = "IDLE";
      return;
    }
    if (this.target == 0) {
      this.action = "IDLE";
      return;
    }
    let distance = [this.target.x - this.x, this.target.y - this.y];
    let absDistance = sqrt(pow(distance[0], 2) + pow(distance[1], 2));
    if (absDistance < this.closeDistance) {
      this.action = "IDLE";
      removeElement(this.target.id, "BUNNY");
      this.target = 0;
      this.increaseBar(1);
      return;
    }
    let norm = sqrt(pow(distance[0], 2) + pow(distance[1], 2));
    let direction = [distance[0]/norm, distance[1]/norm];
    let newX = ceil(this.x + this.speed * dt * 2 * direction[0]);
    let newY = ceil(this.y + this.speed * dt * 2 * direction[1]);
    if (newX >= 0 && newX < x && newY >= 0 && newY < y) {
      if (map[newX][newY] != 0) {
        this.x = newX;
        this.y = newY;
      }
    }
  }

  // Gets nearest rabbit, used for chase()
  getClosestRabbit() {
    let closestRabbit = 0;
    for (i = 0; i < bunnies.length; i++) {
      let distance = calculateEuclideanDistance(bunnies[i].x, bunnies[i].y, this.x, this.y);
      if (distance < this.foodDistance) {
        closestRabbit = bunnies[i];
      }
    }
    return closestRabbit;
  }

  // TODO: improve this logic
  randomWalk(dt) {
    while (true) {
      this.direction.x = random(-3, 3);
      this.direction.y = random(-3, 3);
      let newX = round(this.x + (this.direction.x * this.speed ) * dt);
      let newY = round(this.y + (this.direction.y * this.speed ) * dt);
      //console.log("(New X, New Y): [" + newX + ", " + newY + "]");
      if (newX >= 0 && newX < x && newY >= 0 && newY < y) {
        if (map[newX][newY] == 0) {
          continue;
        }
        this.x = newX;
        this.y = newY;
        break;
      }
    }
  }
}
