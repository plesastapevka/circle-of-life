function TerrainGenerator(x, y, buckets) {
  this.x = x;
  this.y = y;
  this.buckets = buckets;
  this.mapArray = [];
  this.rgbMap = createImage(x, y);
  for (i = 0; i < x; i++) {
    this.mapArray.push([]);
    for (j = 0; j < y; j++) {
      this.mapArray[i].push(0);
    }
  }

  this.generatePerlin = function() {
    for (i = 0; i < x; i++) {
      for (j = 0; j < y; j++) {
        this.mapArray[i][j] = noise(i/170, j/170);
      }
    }

    for (i = 0; i < x; i++) {
      for (j = 0; j < y; j++) {
        this.mapArray[i][j] = floor(this.mapArray[i][j] * this.buckets);
        if (this.mapArray[i][j] > this.buckets-1) {
          this.mapArray[i][j] = this.buckets-1;
        }
      }
    }
  };


  // Gets buckets for terrain
  // TODO: fix this
  this.perlinBuckets = function() {
    let tiles = this.x * this.y;
    let waterTiles = 0.4 * tiles;
    let grassTiles = 0.35 * tiles;
    let forestTiles = 0.15 * tiles;
    let sandTiles = 0.025 * tiles;
    let peakTiles = 0.025 * tiles;
    let mountainTiles = 0.05 * tiles;
    let free = tiles - waterTiles - grassTiles - forestTiles - sandTiles - peakTiles - mountainTiles;
  };

  // Counts created buckets
  this.countBuckets = function() {
    buckets = [];
    for (i = 0; i < this.buckets; i++) {
      buckets.push(0);
    }
    for (i = 0; i < x; i++) {
      for (j = 0; j < y; j++) {
        if (this.mapArray[i][j] < buckets) {
          buckets[this.mapArray[i][j]] += 1;
        } else {
          buckets[this.mapArray[i][j]] = buckets - 1;
        }
      }
    }
  };

  // Get percentage of each bucket
  this.countBucketPercentage = function() {
    bucketPercentage = [];
    for (i = 0; i < this.buckets; i++) {
      bucketPercentage.push(0);
    }
    for (i = 0; i < this.x; i++) {
      for (j = 0; j < this.y; j++) {
        //console.log(this.mapArray[i][j]);
        bucketPercentage[this.mapArray[i][j]] += 1;
      }
    }

    for (i = 0; i < this.buckets; i++) {
      bucketPercentage[i] = (bucketPercentage[i] / (this.x * this.y)) * 100;
    }
    return bucketPercentage;
  };

  // Get current map state
  this.getMapState = function() {
   return this.mapArray; 
  };

  // Construct RGB image of the map
  this.constructMap = function() {
    rgbWater = [100, 171, 227, 255];
    rgbGrass = [4, 122, 20, 255];
    rgbForest = [0, 54, 7, 255];
    rgbSand = [249, 209, 153, 255];
    rgbPeak = [247, 247, 247, 255];
    rgbMountain = [120, 120, 120, 255];
    this.rgbMap.loadPixels();
    for (i = 0; i < x; i++) {
      for (j = 0; j < y; j++) {
        if (this.mapArray[i][j] == 0) {
          this.rgbMap.set(i, j, rgbWater);
        } else if (this.mapArray[i][j] == 1) {
          this.rgbMap.set(i, j, rgbGrass);
        } else if (this.mapArray[i][j] == 2) {
          this.rgbMap.set(i, j, rgbForest);
        } else if (this.mapArray[i][j] == 3) {
          this.rgbMap.set(i, j, rgbSand);
        } else if (this.mapArray[i][j] == 4) {
          this.rgbMap.set(i, j, rgbMountain);
        } else if (this.mapArray[i][j] == 5) {
          this.rgbMap.set(i, j, rgbPeak);
        } else {
          this.rgbMap.set(i, j, [255, 255, 0, 122]);
        }
      }
    }
    this.rgbMap.updatePixels();

    return this.rgbMap;
  };
}
