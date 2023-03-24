class Entity {
  constructor(x, y, ageExpectancy, type) {
    this.id = id++;
    this.x = x;
    this.y = y;
    this.lastPrint = millis();
    this.age = 0;
    this.ageExpectancy = ageExpectancy;
    this.type = type;
    this.lastAlive = millis();
    switch (type) {
    case "BUNNY":
      this.bodyColor = [204, 204, 204];
      this.size = 8;
      break;

    case "PLANT":
      this.bodyColor = [196, 255, 249];
      this.size = 15;
      break;

    case "FOX":
      this.bodyColor = [255, 160, 82];
      this.size = 20;
      break;
    }
  }

  render(debug) {
    fill(this.bodyColor[0], this.bodyColor[1], this.bodyColor[2]);
    // Draw a circle
    circle(this.y - this.size/2, this.x - this.size/2, this.size);
    let timeElapsed = millis() - this.lastPrint;
    if (debug && timeElapsed > 1000) {
      this.lastPrint = millis();
      //console.log(this.type + " " + this.id + " (" + this.x + ", " + this.y + "), gender: " + this.gender + ", age: " + this.age + "/" + this.ageExpectancy + ", " + " " + this.action + ", reprod.: " + this.reproduction);
    }
  }

  decay() {
    let timeElapsed = millis() - this.lastAlive;
    if (timeElapsed > 5000) {
      this.lastAlive = millis();
      this.age++;
      if (this.hunger) {
        this.hunger = this.hunger - 5;
      }
      if (this.reproduction) {
        this.reproduction = this.reproduction - 15;
      }
    }
    if (this.age == this.ageExpectancy) {
      removeElement(this.id, this.type);
    }
  }
}
