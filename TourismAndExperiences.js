class Island {
  constructor(name, resources = { ulu: 0, uala: 0, kalo: 0 }, population = 0, experiences = []) {
    this.name = name;
    this.resources = resources;
    this.population = population;
    this.experiences = experiences;
    this.neighbors = new Map();
  }

  addNeighbor(neighbor, distance) {
    this.neighbors.set(neighbor, distance);
  }
}

class Graph {
  constructor() {
    this.islands = {
      'Hawaii': new Island('Hawaii', { ulu: 0, uala: 0, kalo: 0 }, 1500, ['Surfing', 'Volcano Tours']),
      'Tahiti': new Island('Tahiti', { ulu: 0, uala: 0, kalo: 0 }, 1000, ['Pearl Diving', 'Polynesian Dance']),
      'Rapa Nui': new Island('Rapa Nui', { ulu: 0, uala: 0, kalo: 0 }, 600, ['Moai Statues', 'Cultural Dances']),
      'Ecuador': new Island('Ecuador', { ulu: 0, uala: 100, kalo: 0 }, 0, []), // Origin of 'Uala
      'Malaysia': new Island('Malaysia', { ulu: 0, uala: 0, kalo: 100 }, 0, []), // Origin of Kalo
      'Papua New Guinea': new Island('Papua New Guinea', { ulu: 100, uala: 0, kalo: 0 }, 0, []) // Origin of Ulu
    };

    this.distances = {
      'Hawaii': { 'Tahiti': 10, 'Rapa Nui': 12 },
      'Tahiti': { 'Hawaii': 10, 'Rapa Nui': 8, 'Malaysia': 15, 'Papua New Guinea': 25 },
      'Rapa Nui': { 'Tahiti': 8, 'Ecuador': 20, 'Hawaii': 12 },
      'Ecuador': { 'Rapa Nui': 20 },
      'Malaysia': { 'Tahiti': 15 },
      'Papua New Guinea': { 'Tahiti': 25 }
    };

    this.setupConnections();
  }

  setupConnections() {
    for (let fromIsland in this.distances) {
      for (let toIsland in this.distances[fromIsland]) {
        let distance = this.distances[fromIsland][toIsland];
        this.islands[fromIsland].addNeighbor(toIsland, distance);
      }
    }
  }

  findShortestPath(destinations) {
    let bestPath = null;
    let bestDistance = Infinity;

    for (let startIsland in this.islands) {
      let dp = new Map();

      const tsp = (current, visited) => {
        if (visited.size === destinations.length + 1) {
          let returnDistance = this.islands[current].neighbors.get(startIsland);
          if (returnDistance !== undefined) {
            return { distance: returnDistance, path: [startIsland] };
          }
          return { distance: 0, path: [] };
        }

        let key = `${current},${Array.from(visited).sort().join()}`;

        if (dp.has(key)) {
          return dp.get(key);
        }

        let minDistance = null;
        let minPath = [];

        for (let [neighbor, distance] of this.islands[current].neighbors) {
          if (!visited.has(neighbor)) {
            let newVisited = new Set(visited);
            newVisited.add(neighbor);
            let result = tsp(neighbor, newVisited);
            let pathDistance = distance + result.distance;

            if (minDistance === null || pathDistance < minDistance) {
              minDistance = pathDistance;
              minPath = [neighbor, ...result.path];
            }
          }
        }

        dp.set(key, { distance: minDistance, path: minPath });
        return { distance: minDistance, path: minPath };
      };

      let initialVisited = new Set();
      initialVisited.add(startIsland);
      let result = tsp(startIsland, initialVisited);

      if (result.distance < bestDistance) {
        bestDistance = result.distance;
        bestPath = result.path;
      }
    }

    return { distance: bestDistance, path: bestPath };
  }
}

// Example
let graph = new Graph();

// Define destinations
let destinations = ["Hawaii", "Tahiti", "Rapa Nui"];

// Find shortest path starting from an undefined initial island
let result = graph.findShortestPath(destinations);

console.log("Shortest path distance:", result.distance);
console.log("Shortest Route Forward and Back:", result.path.join(' -> '));

// Test cases
function testFindShortestPath() {
  let graph = new Graph();

  let destinations1 = ["Hawaii", "Tahiti", "Rapa Nui"];
  let result1 = graph.findShortestPath(destinations1);
  console.log("Test Case 1 - Shortest path distance:", result1.distance);
  console.log("Test Case 1 - Shortest Route:", result1.path.join(' -> '));

  let destinations2 = ["Tahiti", "Rapa Nui", "Malaysia"];
  let result2 = graph.findShortestPath(destinations2);
  console.log("Test Case 2 - Shortest path distance:", result2.distance);
  console.log("Test Case 2 - Shortest Route:", result2.path.join(' -> '));

  let destinations3 = ["Hawaii"];
  let result3 = graph.findShortestPath(destinations3);
  console.log("Test Case 3 - Shortest path distance:", result3.distance);
  console.log("Test Case 3 - Shortest Route:", result3.path.join(' -> '));
}

testFindShortestPath();
