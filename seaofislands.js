// Class representing an Island
class Island {
    constructor(name, resources = { ulu: 0, uala: 0, kalo: 0 }, population = 0, experiences = []) {
        this.name = name;
        this.resources = resources;
        this.population = population;
        this.experiences = experiences;
        this.neighbors = new Map();
    }

    // Method to add a neighbor island and the distance to it outside of the preset islands
    addNeighbor(neighbor, distance) {
        this.neighbors.set(neighbor, distance);
    }
}

// Class representing the Graph of islands
class Graph {
    constructor() {
        // Initialize islands with their respective data
        this.islands = {
            'Hawaii': new Island('Hawaii', { ulu: 0, uala: 0, kalo: 0 }, 1500, ['Surfing', 'Volcano Tours']),
            'Tahiti': new Island('Tahiti', { ulu: 0, uala: 0, kalo: 0 }, 1000, ['Pearl Diving', 'Polynesian Dance']),
            'Rapa Nui': new Island('Rapa Nui', { ulu: 0, uala: 0, kalo: 0 }, 600, ['Moai Statues', 'Cultural Dances']),
            'Ecuador': new Island('Ecuador', { ulu: 0, uala: 100, kalo: 0 }, 0, []), // Origin of 'Uala 
            'Malaysia': new Island('Malaysia', { ulu: 0, uala: 0, kalo: 100 }, 0, []), // Origin of Kalo
            'Papua New Guinea': new Island('Papua New Guinea', { ulu: 100, uala: 0, kalo: 0 }, 0, []) //Origin of Ulu
        };

        // Initialize distances between islands
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

    // Set up connections between islands based on distances
    setupConnections() {
        for (let fromIsland in this.distances) {
            for (let toIsland in this.distances[fromIsland]) {
                let distance = this.distances[fromIsland][toIsland];
                this.islands[fromIsland].addNeighbor(toIsland, distance);
            }
        }
    }

    // Method to find the shortest path using a modified Traveling Salesperson Problem (TSP) approach
    findShortestPath(startIsland, destinations) {
        let dp = new Map(); // Dynamic programming map to store steps

        const tsp = (current, visited) => {
            if (visited.size === destinations.length + 1) {
                let returnDistance = this.islands[current].neighbors.get(startIsland);
                if (returnDistance !== undefined) {
                    return { distance: returnDistance, path: [startIsland] };
                }
                return { distance: 0, path: [] };
            }

            // Create a key for the current state for memoization (DP)
            let key = `${current},${Array.from(visited).sort().join()}`;

            if (dp.has(key)) {
                return dp.get(key);
            }

            let minDistance = null;
            let minPath = [];

            // Iterate over all neighbor islands to find shortest path
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
        return { distance: result.distance, path: [startIsland, ...result.path] };
    }
}

// Example usage:
let graph = new Graph();

// Define destinations
let destinations = ["Hawaii", "Tahiti", "Rapa Nui"];

// Find shortest path starting from Ecuador
let result = graph.findShortestPath('Ecuador', destinations);

console.log("Shortest path distance:", result.distance);
console.log("Shortest Route Forward and Back:", result.path.join(' -> '));
