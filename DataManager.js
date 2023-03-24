class DataManager {
  constructor(x, y, age) {
    this.lastPrint = millis();
    this.time = 400;
    this.step = y/this.time;
    this.data = [];
    this.count = 0;
    //this.posx = Float32Array.from({ length: this.time }, (_, i) => map(i, 0, this.time, 0, y));
    //this.fy = _ => map(_, 3, 0, y, 10);

    //this.colors = d3.range(y).map(i => d3.interpolateWarm(norm(i, 0, y)));
  }

  populationData() {
    const totalPopulation = bunnies.length + foxes.length + plants.length;
    //console.log("Total ecosystem population: " + totalPopulation);
    //console.log("Bunnies population: " + bunnies.length);
    //console.log("Foxes population: " + foxes.length);
    //console.log("Plants population: " + plants.length);
    this.chart(300);
  }

  chart(diameter) {
    // print text
    let plantsColor = [196, 255, 249];
    let bunniesColor = [204, 204, 204];
    let foxesColor = [255, 160, 82];

    textSize(24);
    fill(bunniesColor);
    text('Bunnies alive: ' + bunnies.length, x + 3, 30);
    fill(foxesColor);
    text('Foxes alive: ' + foxes.length, x + 3, 75);
    fill(plantsColor);
    text('Plants alive: ' + plants.length, x + 3, 120);
    fill(255, 255, 255);
    text('Total population: ' + int(plants.length+bunnies.length+foxes.length), x + 3, 165);


    // pie chart
    let popCount = plants.length + bunnies.length + foxes.length;
    let plantsPercentage = (plants.length / popCount) * 360;
    let bunniesPercentage = (bunnies.length / popCount) * 360;
    let foxesPercentage = (foxes.length / popCount) * 360;
    let percentages = [plantsPercentage, bunniesPercentage, foxesPercentage];
    let lastAngle = 0;
    for (let i = 0; i < percentages.length; i++) {
      let pieColor;
      switch(i) {
      case 0: // plants
        pieColor = plantsColor;
        break;
      case 1: // bunnies
        pieColor = bunniesColor;
        break;
      case 2: // foxes
        pieColor = foxesColor;
        break;
      }
      //let gray = mapRange(i, 0, pop.length, 0, 255);
      fill(pieColor);
      arc(
        x + (CHART_SIZE / 2),
        height / 2,
        diameter,
        diameter,
        lastAngle,
        lastAngle + radians(percentages[i])
        );
      lastAngle += radians(percentages[i]);
    }
  }
}
