// Global variables
var x = 700;
var y = 700;
var buckets = 6;
var map = 0;
var screens = 0;
var plants = 0;
var rabbits = 0;
var wolves = 0;
var clock = 0;
var bg = 0;
var foxes = [];
var plants = [];
var bunnies = [];
var bgImage;
var PLANTS = 30;
var BUNNIES = 15;
var FOXES = 10;
var id = 0;
var dataManager;
var CHART_SIZE = 300;
var TIME_SIZE = 200;
var BUNNY_AGE = 10;
var PLANT_AGE = 50;
var FOX_AGE = 10;
var curFrame = 0;
var sum = 0;
var sumMove = 0;
var sumRender = 0;
var sumDecay = 0;
var avgTime = 0;

// Called on initialization
function setup() {
  createCanvas(x + CHART_SIZE, y + TIME_SIZE);
  this.tg = new TerrainGenerator(x, y, buckets);
  // Generates perlin noise for terrain generation
  this.tg.generatePerlin();
  // Saves map as image to reduce load on CPU
  bgImage = this.tg.constructMap();
  map = this.tg.getMapState();
  percentage = this.tg.countBucketPercentage();
  var ex, ey;
  // Spawn plants
  for (let i = 0; i < PLANTS; i++) {
    ex = int(random(0, x));
    ey = int(random(0, y));
    var plant = new Plant(ex, ey, PLANT_AGE);
    plants.push(plant);
  }

  // Spawn bunnies
  for (let i = 0; i < BUNNIES; i++) {
    ex = int(random(0, x));
    ey = int(random(0, y));
    var bunny = new Bunny(ex, ey, int(random(7, 26)));
    bunnies.push(bunny);
  }

  // Spawn foxes
  for (let i = 0; i < FOXES; i++) {
    ex = int(random(0, x));
    ey = int(random(0, y));
    var fox = new Fox(ex, ey, int(random(5, 16)));
    foxes.push(fox);
  }

  dataManager = new DataManager();
}

// Called every loop
function draw() {
  let start = millis();
  background(0, 0, 0);
  // Draw background
  image(bgImage, 0, 0);

  for (let i = 0; i < PLANTS; i++) {
    var plant = plants[i];
    if (plant === undefined) {
      continue;
    }
    plant.render(true);
    plant.decay();
  }

  for (let i = 0; i < BUNNIES; i++) {
    var bunny = bunnies[i];
    if (bunny === undefined) {
      continue;
    }
    // Move
    let moveStart = millis();
    bunny.move(deltaTime);
    let moveEnd = millis();
    let moveElapsed = moveEnd - moveStart;
    sumMove = sumMove + moveElapsed;
    avgTime = sumMove / curFrame;
    fill(255);
    stroke(0);
    text("move() avg time elapsed: " + avgTime.toFixed(4) + " ms", 10, y + 80);

    // Render
    let renderStart = millis();
    bunny.render(true);
    let renderEnd = millis();
    let renderElapsed = renderEnd - renderStart;
    sumRender = sumRender + renderElapsed;
    avgTime = sumRender / curFrame;
    fill(255);
    stroke(0);
    text("render() avg time elapsed: " + avgTime.toFixed(4) + " ms", 10, y + 110);
    
    // Decay
    let decayStart = millis();
    bunny.decay();
    let decayEnd = millis();
    let decayElapsed = decayEnd - decayStart;
    sumDecay = sumDecay + decayElapsed;
    avgTime = sumDecay / curFrame;
    fill(255);
    stroke(0);
    text("decay() avg time elapsed: " + avgTime.toFixed(4) + " ms", 10, y + 140);
  }

  for (let i = 0; i < FOXES; i++) {
    var fox = foxes[i];
    if (fox === undefined) {
      continue;
    }
    fox.move(deltaTime);
    fox.render(true);
    fox.decay();
  }
  //dataManager.chart();
  dataManager.populationData();
  curFrame++;

  let fps = frameRate();
  fill(255);
  stroke(0);
  text("FPS: " + fps.toFixed(2), 10, y + 20);

  let end = millis();
  let elapsed = end - start;
  sum = sum + elapsed;
  avgTime = sum / curFrame;
  fill(255);
  stroke(0);
  text("draw() avg time elapsed: " + avgTime.toFixed(4) + " ms", 10, y + 50);
}
