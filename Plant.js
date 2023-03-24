class Plant extends Entity {
  constructor(x, y, ageExpectancy) {
    super(x, y, ageExpectancy, "PLANT");
    this.found = false;
    this.lastSpawn = 0;
    this.action = "EXISTING";
  }
}
