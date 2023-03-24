function calculateEuclideanDistance(xT, yT, x, y) {
  return sqrt(pow((xT - x), 2) + pow((yT - y), 2));
}

function mapRange(value, a, b, c, d) {
  value = (value - a) / (b - a);
  return c + value * (d - c);
}

// Removes element from array by id
function removeElement(id, entity) {
  if (entity == "BUNNY") {
    list = bunnies;
  } else if (entity == "PLANT") {
    list = plants;
  } else if (entity == "FOX") {
    list = foxes;
  }
  var index = list.map(x => {
    return x.id;
  }
  ).indexOf(id);

  list.splice(index, 1);
}

function doesExist(elements, id) {
  if (elements.some(e => e.id === id)) {
    return true;
  }
}
