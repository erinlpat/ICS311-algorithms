//island class
class Island {
    constructor(name, population) {
        this.name = name;
        this.population = population;
    }
}

//class for sea of islands
class SeaOfIslands {
    constructor() {
        this.graph = {}; //adjacency list
        this.islands = {}; //island objects
    }

    //function to add island
    addIsland(island) {
        this.islands[island.name] = island;
        this.graph[island.name] = [];
    }

    //function to add routes
    addRoute(fromIsland, toIsland, travelTime) {
        this.graph[fromIsland].push({node: toIsland, travelTime});
    }

    //function to prioritize islands based on population
    prioritizeIslands() {
        let priorityQueue = [];
        for(let islandName in this.islands) {
            let island = this.islands[islandName];
            let priority = {population: island.population};
            priorityQueue.push({islandName, priority});
        }

        //sort the queue by population descending and lastVisit ascending
        priorityQueue.sort((a,b) => {
            return b.priority.population - a.priority.population;
        });
        return priorityQueue;
    } 

    //finds shortest route from starting island, and ends at the starting island
    findRoute(startIsland) {
      let visited = new Set();
      let route = [startIsland];
      visited.add(startIsland);
      let totalTravelTime = 0;
      let currentIsland = startIsland;

      while(route.length < Object.keys(this.islands).length) {
        let neighbors = this.graph[currentIsland];
        let nextIsland = null;
        let minTravelTime = Infinity;

        for(let neighbor of neighbors) {
          if (!visited.has(neighbor.node) && neighbor.travelTime < minTravelTime) {
            minTravelTime = neighbor.travelTime;
            nextIsland = neighbor.node;
          }
        }

        if(nextIsland) {
          route.push(nextIsland);
          visited.add(nextIsland);
          totalTravelTime += minTravelTime; // Add travel time to total
          currentIsland = nextIsland;
        } 
        else {
            break;
        }
    }

    //return to start island
    let returnRoute = route.concat([startIsland]);
    totalTravelTime += this.graph[currentIsland].find(edge => edge.node === startIsland).travelTime;

    return { route: returnRoute, totalTravelTime };
  }

    //function to share knowledge across the islands
   shareKnowledge() {
    let priorityQueue = this.prioritizeIslands();
    let visitedIslands = new Set();
    let shortestRoute = null;

    while(priorityQueue.length) {
        let { islandName } = priorityQueue.shift();
        if (visitedIslands.has(islandName)) {
            continue;
        }

        let { route, totalTravelTime } = this.findRoute(islandName);

        if(!shortestRoute || totalTravelTime < shortestRoute.totalTravelTime) {
            shortestRoute = { route, totalTravelTime };
        }

        visitedIslands.add(islandName);
    }

    if(shortestRoute) {
        console.log("Shortest route to visit all islands and return to start:");
        console.log(shortestRoute.route);
        console.log("Total travel time: " + shortestRoute.totalTravelTime + " hours.");
    }
  }
}

//------testing------//
const sea = new SeaOfIslands();
sea.addIsland(new Island("Hawaii", 500)); 
sea.addIsland(new Island("Tahiti", 300));
sea.addIsland(new Island("Rapa Nui", 150));
sea.addIsland(new Island("New Zealand", 200));
/*
I created 4 islands:
Hawaii, Tahiti, Rapa Nui, and New Zealand
with different population numbers.
*/

console.log("Islands and Graph Initialization:");
console.log(sea.islands);
console.log(sea.graph);
/*checks that the islands have been initialized*/

console.log();

sea.addRoute("Hawaii", "Tahiti", 5);
sea.addRoute("Tahiti", "Rapa Nui", 10);
sea.addRoute("Rapa Nui", "New Zealand", 30);
sea.addRoute("New Zealand", "Hawaii", 45);
/*adds routes from two islands*/

console.log();

console.log("Graph with Routes:");
console.log(sea.graph);
/*shows graph of islands*/

console.log()

console.log("Prioritizing Islands:");
const priorityQueue = sea.prioritizeIslands();
console.log(priorityQueue);
/*shows which islands are prioritized first based on their populations*/

console.log();

console.log("Finding Route from Hawaii:");
const route = sea.findRoute("Hawaii");
console.log(route);
/*
shows what the route is from a starting point. 
in this case, we decided to start from Hawaii.
*/

console.log(); 

console.log("Traveling to share knowledge now..");
sea.shareKnowledge();
/*
shows what the shortest traveling route is
depending on which island we start at first
*/
