import React, { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import adjacencyList from "../data/adjacencyList";
import locations from "../data/locations";

// Default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

// Custom icon for the starting point
const startIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const WasteCollectionApp = () => {
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [shortestPath, setShortestPath] = useState([]);
  const mapRef = useRef(null);

  const handleLocationSelect = (location) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(
        selectedLocations.filter((loc) => loc.id !== location.id)
      );
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const findShortestPath = () => {
    if (selectedLocations.length > 0) {
      const path = calculateShortestPath(
        "DMC",
        selectedLocations.map((loc) => loc.name)
      );
      setShortestPath(path);
      mapRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };


  const calculateShortestPath = (start, points) => {
    const allPoints = [start, ...points];
    const n = allPoints.length;

    //distance matrix
    const dist = Array(n)
      .fill()
      .map(() => Array(n).fill(Infinity));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          const edge = adjacencyList[allPoints[i]].find(
            (e) => e.location === allPoints[j]
          );
          if (edge) {
            dist[i][j] = edge.distance;
          }
        }
      }
    }

    // Memoization table: memo[mask][currentNode] = {cost, path}
    // mask represents which nodes have been visited (bitmask)
    const memo = new Map();
    
    const getMemoKey = (currentNode, visitedMask) => {
        return `${currentNode}_${visitedMask}`;
    };

    const dpTSP = (currentNode, visitedMask) => {
        const memoKey = getMemoKey(currentNode, visitedMask);
        
        if (memo.has(memoKey)) {
            return memo.get(memoKey);
        }
        
        // Base case: if all nodes are visited
        const allVisited = (1 << n) - 1;
        if (visitedMask === allVisited) {
            const returnCost = dist[currentNode][0];
            if (returnCost === Infinity) {
                const result = { cost: Infinity, path: null };
                memo.set(memoKey, result);
                return result;
            }
            const result = { cost: returnCost, path: [allPoints[currentNode], allPoints[0]] };
            memo.set(memoKey, result);
            return result;
        }

        let minCost = Infinity;
        let bestPath = null;

        // Trying all unvisited nodes
        for (let nextNode = 0; nextNode < n; nextNode++) {
            if (!(visitedMask & (1 << nextNode))) {
                const newVisitedMask = visitedMask | (1 << nextNode);
                const edgeCost = dist[currentNode][nextNode];
                
                if (edgeCost !== Infinity) {
                    const subResult = dpTSP(nextNode, newVisitedMask);
                    const totalCost = edgeCost + subResult.cost;
                    
                    if (totalCost < minCost && subResult.path !== null) {
                        minCost = totalCost;
                        bestPath = [allPoints[currentNode], ...subResult.path];
                    }
                }
            }
        }

        const result = { cost: minCost, path: bestPath };
        memo.set(memoKey, result);
        return result;
    };

    const initialMask = 1;
    const result = dpTSP(0, initialMask);

    if (result.path === null || result.cost === Infinity) {
        return "No valid path found";
    }

    return result.path.map((loc) => locations.find((l) => l.name === loc));
};

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-100">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold bg-blue-500 text-white p-4 rounded-lg text-center mb-6">
          Delhi Waste Collection Route Optimization
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Select Collection Points:
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Choose locations to visit. The algorithm will find the shortest
            distance route starting and ending at DMC.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {locations
              .filter((loc) => loc.id !== 11)
              .map((location) => (
                <label
                  key={location.id}
                  className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedLocations.some(
                      (loc) => loc.id === location.id
                    )}
                    onChange={() => handleLocationSelect(location)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium">{location.name}</span>
                </label>
              ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={findShortestPath}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Find Shortest Path
            </button>
          </div>

          {selectedLocations.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">
                Selected Locations ({selectedLocations.length}):
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedLocations.map((loc, index) => (
                  <span
                    key={loc.id}
                    className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full"
                  >
                    {loc.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div ref={mapRef} className="border-sky-500">
          <MapContainer
            center={locations.find((loc) => loc.id === 11).coordinates}
            zoom={12}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {shortestPath.map((location, idx) => {
              if (
                idx === shortestPath.length - 1 &&
                idx !== 0 &&
                location.id === shortestPath[0].id
              ) {
                return null;
              }
              return (
                <Marker
                  key={idx}
                  position={location.coordinates}
                  icon={idx === 0 ? startIcon : new L.Icon.Default()}
                >
                  <Tooltip permanent>{location.name}</Tooltip>
                </Marker>
              );
            })}
            <Polyline
              positions={shortestPath.map((loc) => loc.coordinates)}
              color="red"
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default WasteCollectionApp;
