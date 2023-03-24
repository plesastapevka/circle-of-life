class Bunny extends Entity {
  constructor(x, y, ageExpectancy) {
    super(x, y, ageExpectancy, "BUNNY");
    this.found = false;
    this.lastSpawn = 0;
    this.gender = int(random(0, 2));
    this.speed = 0.05;
    this.hunger = 100;
    this.thirst = 100;
    this.reproduction = 100;
    this.closeDistance = 3;
    this.direction = [0, 0];

    // Action states
    // 0 idle
    // 1 danger
    // 2 procreate
    // 3 mating
    // 4 thirst
    // 5 drinking
    // 6 hungry
    // 7 eating
    this.action = "IDLE";

    this.dangerDistance = 130;
    this.foodDistance = 130;
    this.mateDistance = 30;
    this.waterDistance = 30;
    this.target = 0;
    this.closeEnemies = [];
    console.log("Bunny created!");
  }

  // Get current behavior
  getAction() {
    if (this.isInDanger().length != 0) {
      this.action = "DANGER";
      return;
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

  // Move bunny based on environment and stats
  move(dt) {
    this.getAction();

    if (this.action == "DANGER") {
      /*
       Danger
       */
      this.run(dt);
    } else if (this.action == "PROCREATE") {
      /*
       Wants to mate
       */
      let mate = this.findMate();
      if (mate.target == this) {
        return;
      }
      if (mate != 0) {
        let request = mate.requestMating(this);
        this.action = "MATING";
        mate.action = "MATING";
        return;
      }
      this.action = "IDLE";
      this.reproduction = 100;
      return;
    } else if (this.action == "MATING") {
      /*
       Mating
       */
      if (this.target == 0) {
        this.action = "IDLE";
        return;
      }

      let distance = calculateEuclideanDistance(this.target.x, this.target.y, this.x, this.y);
      if (distance < this.mateDistance / 2) {
        if (this.gender == 1) {
          // TODO: Spawn bunny on successful mating
          let ex = int(random(0, x));
          let ey = int(random(0, y));
          let bunny = new Bunny(this.x, this.y, int(random(7, 26)));
          this.reproduction = 100;
          this.target.reproduction = 100;
          this.action = "IDLE";
          this.target.action = "IDLE";
          bunnies.push(bunny);
        }
      } else {
        let directionToTarget = [this.target.x - this.x, this.target.y - this.y];
        let newX = this.x + this.speed * dt * directionToTarget[0];
        let newY = this.y + this.speed * dt * directionToTarget[1];
        // TODO: bounds check
      }
    } else if (this.action == "THIRST") {
      /*
       Thirsty
       */
      console.log("Bunny is thirsty");
      this.randomWalk(dt);
      waterCoords = this.lookForWater();
      if (waterCoords != 0) {
        this.action = "DRINKING";
        this.target = waterCoords;
      }
    } else if (this.action == "DRINKING") {
      /*
       Drinking
       */
      console.log("Bunny is drinking");
      if (this.target == 0) {
        this.action = "IDLE";
        return;
      }
      distance = sqrt(pow((this.target[0] - this.x), 2) + pow((this.target[1] - this.y), 2));
      distance = calculateEuclideanDistance(this.target[0], this.target[1], this.x, this.y);
      if (distance > this.closeDistance) {
        this.moveToWater(dt);
      } else {
        this.drink();
      }
    } else if (this.action == "HUNGRY") {
      /*
       Hungry
       */
      console.log("Bunny is hungry");
      this.randomWalk(dt);
      let food = this.isFoodNear();
      if (food != 0) {
        this.action = "EATING";
        this.target = food;
      }
    } else if (this.action == "EATING") {
      /*
       Eating
       */
      console.log("Bunny is eating");
      if (this.target == 0) {
        this.action = "IDLE";
        return;
      }
      let distance = calculateEuclideanDistance(this.target.x, this.target.y, this.x, this.y);
      if (distance > this.closeDistance) {
        this.moveToFood(dt);
      } else {
        this.eat();
      }
    } else {
      /*
       Random walk
       */
      this.randomWalk(dt);
    }
  }

  // Escape from fox, calculates average direction to escape to
  run(dt) {
    let avgDirections = [];
    if (this.hunger < 30) {
      this.speed = 0.02;
    }
    for (i = 0; i < this.closeEnemies.length; i++) {
      let enemy = this.closeEnemies[i];
      let directionToEnemy = [enemy.x - this.x, enemy.y - this.y];
      let normalized = sqrt(pow(directionToEnemy[0], 2) + pow(directionToEnemy[1], 2));
      directionToEnemy = [-directionToEnemy[0]/normalized, -directionToEnemy[1] / normalized];
      avgDirections.push(directionToEnemy);
    }
    let avgDirection = 0;
    if (avgDirections.length == 0) {
      this.action = "IDLE";
      return;
    }
    for (let i = 0; i < avgDirections.length; i++) {
      if (avgDirection == 0) {
        avgDirection = avgDirections[i];
        continue;
      }
      avgDirection[0] += avgDirections[0];
      avgDirection[1] += avgDirections[1];
    }
    if (avgDirection != 0) {
      avgDirection = [(10 * avgDirection[0]) / avgDirections.length, (10 * avgDirection[1]) / avgDirections.length];
      let newX = round (this.x + this.speed * dt * avgDirection[0]);
      let newY = round (this.y + this.speed * dt * avgDirection[1]);
      if (newX >= 0 && newX < x && newY >= 0 && newY < y) {
        if (map[newX][newY] != 0) {
          this.x = newX;
          this.y = newY;
        } else {
          this.randomWalk();
        }
      }
      return;
    }
    this.action = "IDLE";
  }

  // Replenish stats on eating
  eat() {
    console.log("Eating");
    removeElement(this.target.id, "PLANT");
    this.hunger = 100;
    this.action = "IDLE";
    this.target = 0;
  }

  // Replenish stats on drinking
  drink() {
    console.log("Eating");
    this.thirst = 100;
    this.action = "IDLE";
    this.target = 0;
  }

  // Moves bunny closer to food
  moveToFood(dt) {
    let distance = [this.target.x - this.x, this.target.y - this.y];
    let norm = sqrt(pow(distance[0], 2) + pow(distance[1], 2));
    let direction = [distance[0] / norm, distance[1] / norm];
    let newX = round(this.x + this.speed * dt * direction[0]);
    let newY = round(this.y + this.speed * dt * direction[1]);
    if (newX >= 0 && newX < x && newY >= 0 && newY < y) {
      if (map[newX][newY] != 0) {
        this.x = newX;
        this.y = newY;
      }
    }
  }

  // Moves bunny closer to water
  moveToWater(dt) {
    let distance = [this.target[0] - this.x, this.target[1], this.y];
    let norm = sqrt(pow(distance[0], 2) + pow(distance[1], 2));
    let direction = [distance[0] / norm, distance[1] / norm];
    let newX = round (this.x + this.speed * dt * direction[0]);
    let newY = round (this.y + this.speed * dt * direction[1]);
    if (newX >= 0 && newX < x && newY >= 0 && newY < y) {
      if (map[newX][newY] != 0) {
        this.x = newX;
        this.y = newY;
        return;
      }
      this.drink();
    }
  }

  // Bunny looks for water
  lookForWater() {
    let d = round (this.waterDistance / 2);
    for (i = this.x - d; i < this.y + d; i++) {
      for (j = this.y - d; j < this.y + d; j++) {
        if (i >= 0 && i < x && j >= 0 && j < y) {
          if (map[i][j] == 0) {
            return [i, j];
          }
        }
      }
    }
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

  // Find nearest mate
  findMate() {
    let potentialMates = [];
    for (i = 0; i < bunnies.length; i++) {
      if (bunnies[i] != this && bunnies[i].gender !== this.gender) {
        let distance = calculateEuclideanDistance(bunnies[i].x, bunnies[i].y, this.x, this.y);
        if (distance < this.dangerDistance) {
          potentialMates.push(bunnies[i]);
        }
      }
    }
    let best = 0;
    if (potentialMates.length == 0) {
      return 0;
    }
    for (i = 0; i < potentialMates.length; i++) {
      if (best == 0) {
        best = potentialMates[i];
      } else {
        if (potentialMates[i].size > best.size) {
          best = potentialMates[i];
        }
      }
    }
    return best;
  }

  // Consensual sex is important, we don't want our bunnies running around raping eachother
  requestMating(other) {
    let nearby = this.findMate();
    if (nearby != 0) {
      if (nearby == other && this.gender !== other.gender) { // also our bunnies are not gay
        other.target = this;
        other.action = "PROCREATE";
        this.action = "PROCREATE";
        this.target = other;
        return true;
      }
    }
    return false;
  }

  // Gets if bunny's in danger
  isInDanger() {
    let dangers = [];
    for (i = 0; i < foxes.length; i++) {
      let distance = calculateEuclideanDistance(foxes[i].x, foxes[i].y, this.x, this.y);
      if (distance < this.dangerDistance) {
        dangers.push(foxes[i]);
      }
    }
    this.closeEnemies = dangers;
    return dangers;
  }

  // Returns nearest plant
  isFoodNear() {
    for (i = 0; i < plants.length; i++) {
      let distance = calculateEuclideanDistance(plants[i].x, plants[i].y, this.x, this.y);
      if (distance < this.foodDistance) {
        return plants[i];
      }
    }
    return 0;
  }
}
