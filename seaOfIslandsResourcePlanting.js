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

    // Method to determine the resource requirement based on population
    getResourceRequirement() {
        if (this.population >= 1500) return 3;
        if (this.population >= 1000) return 2;
        return 1;
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
            'Tahiti': { 'Hawaii': 10, 'Rapa Nui': 8 },
            'Rapa Nui': { 'Hawaii': 12, 'Tahiti': 8 },
            'Ecuador': { 'Hawaii': 20, 'Tahiti': 15, 'Rapa Nui': 25 },
            'Malaysia': { 'Hawaii': 25, 'Tahiti': 15, 'Rapa Nui': 25 },
            'Papua New Guinea': { 'Hawaii': 25, 'Tahiti': 25, 'Rapa Nui': 20 }
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
    findShortestPath(startIsland, destinations, resourceType) {
        let dp = new Map(); // Dynamic programming map to store steps

        const tsp = (current, visited, currentInventory) => {
            if (visited.size === destinations.length + 1) {
                let returnDistance = this.islands[current].neighbors.get(startIsland);
                if (returnDistance !== undefined) {
                    return { distance: returnDistance, path: [startIsland] };
                }
                return { distance: 0, path: [] };
            }

            // Create a key for the current state for memoization (DP)
            let key = `${current},${Array.from(visited).sort().join()},${currentInventory}`;

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

                    let resourceRequirement = this.islands[neighbor].getResourceRequirement();
                    let trips = Math.ceil(resourceRequirement / currentInventory);
                    let pathDistance = 0;
                    let path = [];

                    for (let i = 0; i < trips; i++) {
                        if (i > 0) {
                            // Return to origin to restock
                            pathDistance += this.islands[neighbor].neighbors.get(startIsland) * 2;
                            path.push(startIsland);
                            currentInventory = 10; // Reset inventory to full after restocking
                        }
                        pathDistance += distance;
                        path.push(neighbor);
                        currentInventory -= resourceRequirement;
                    }

                    let result = tsp(neighbor, newVisited, currentInventory);

                    pathDistance += result.distance;

                    if (minDistance === null || pathDistance < minDistance) {
                        minDistance = pathDistance;
                        minPath = [...path, ...result.path];
                    }
                }
            }

            dp.set(key, { distance: minDistance, path: minPath });
            return { distance: minDistance, path: minPath };
        };

        let initialVisited = new Set();
        initialVisited.add(startIsland);
        let result = tsp(startIsland, initialVisited, 10); // Start with a full inventory of 10 units
        return { distance: result.distance, path: [startIsland, ...result.path] };
    }

    // Method to distribute resources from multiple origins to all islands
    distributeResources(resources) {
        for (let resource in resources) {
            let origin = resources[resource];
            let destinations = Object.keys(this.islands).filter(island => island !== origin);
            let result = this.findShortestPath(origin, destinations, resource);
            console.log(`Distributing ${resource} from ${origin}:`);
            console.log(`Shortest path distance: ${result.distance}`);
            console.log(`Route: ${result.path.join(' -> ')}`);
        }
    }
}

// Example usage:
let graph = new Graph();

// Define resources and their origins
let resources = {
    'uala': 'Ecuador',
    'kalo': 'Malaysia',
    'ulu': 'Papua New Guinea'
};

// Display Routes
console.log("Problem 3: Planting Resources");
graph.distributeResources(resources);
