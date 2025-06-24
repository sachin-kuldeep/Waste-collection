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

    // Create a distance matrix
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

    // DFS recursive function to explore all paths
    const dfs = (currentNode, visited, path, cost) => {
      // Base case: if all nodes are visited, return cost + distance to start
      if (visited.size === n) {
        const returnCost = dist[currentNode][0]; // Return to start
        if (returnCost === Infinity) return { cost: Infinity, path: null }; // No valid path back
        return { cost: cost + returnCost, path: [...path, start] };
      }

      let minCost = Infinity;
      let bestPath = null;

      // Try all unvisited nodes
      for (let nextNode = 0; nextNode < n; nextNode++) {
        if (!visited.has(nextNode)) {
          visited.add(nextNode);
          const { cost: newCost, path: newPath } = dfs(
            nextNode,
            visited,
            [...path, allPoints[nextNode]],
            cost + dist[currentNode][nextNode]
          );
          if (newCost < minCost) {
            minCost = newCost;
            bestPath = newPath;
          }
          visited.delete(nextNode); // Backtrack
        }
      }

      return { cost: minCost, path: bestPath };
    };

    // Start DFS from the initial node (start)
    const visited = new Set([0]);
    const result = dfs(0, visited, [start], 0);

    if (result.path === null) {
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
              // Skip rendering the last marker as it's the same as the first (DMC)
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
