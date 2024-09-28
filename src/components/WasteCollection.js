import React, { useState} from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

// Custom icon for the starting point
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const locations = [
  { id: 1, name: 'Connaught Place', coordinates: [28.6289, 77.2065] },
  { id: 2, name: 'India Gate', coordinates: [28.6129, 77.2295] },
  { id: 3, name: 'Lodi Gardens', coordinates: [28.5933, 77.2210] },
  { id: 4, name: 'Karol Bagh', coordinates: [28.6619, 77.1921] },
  { id: 5, name: 'Chandni Chowk', coordinates: [28.6506, 77.2301] },
  { id: 6, name: 'Hauz Khas', coordinates: [28.5494, 77.2001] },
  { id: 7, name: 'Jantar Mantar', coordinates: [28.6270, 77.2167] },
  { id: 8, name: 'Red Fort', coordinates: [28.6562, 77.2410] },
  { id: 9, name: 'Qutub Minar', coordinates: [28.5245, 77.1855] },
  { id: 10, name: 'Akshardham Temple', coordinates: [28.6127, 77.2773] },
  { id: 11, name: 'DMC', coordinates: [28.6139, 77.2090] },
];

const adjacencyList = {
  'DMC': [
    { location: 'Connaught Place', distance: 2 },
    { location: 'India Gate', distance: 4 },
    { location: 'Lodi Gardens', distance: 7 },
    { location: 'Karol Bagh', distance: 4 },
    { location: 'Chandni Chowk', distance: 2 },
    { location: 'Hauz Khas', distance: 10 },
    { location: 'Jantar Mantar', distance: 2 },
    { location: 'Red Fort', distance: 3 },
    { location: 'Qutub Minar', distance: 10 },
    { location: 'Akshardham Temple', distance: 9 }
  ],
  'Connaught Place': [
    { location: 'DMC', distance: 2 },
    { location: 'India Gate', distance: 5 },
    { location: 'Lodi Gardens', distance: 6 },
    { location: 'Karol Bagh', distance: 5 },
    { location: 'Jantar Mantar', distance: 1 },
    { location: 'Chandni Chowk', distance: 4 },
    { location: 'Hauz Khas', distance: 10 },
    { location: 'Red Fort', distance: 5 },
    { location: 'Qutub Minar', distance: 10 },
    { location: 'Akshardham Temple', distance: 10 }
  ],
  'India Gate': [
    { location: 'DMC', distance: 4 },
    { location: 'Connaught Place', distance: 5 },
    { location: 'Lodi Gardens', distance: 3 },
    { location: 'Karol Bagh', distance: 9 },
    { location: 'Chandni Chowk', distance: 7 },
    { location: 'Hauz Khas', distance: 9 },
    { location: 'Jantar Mantar', distance: 5 },
    { location: 'Red Fort', distance: 8 },
    { location: 'Qutub Minar', distance: 10 },
    { location: 'Akshardham Temple', distance: 9 }
  ],
  'Lodi Gardens': [
    { location: 'DMC', distance: 7 },
    { location: 'India Gate', distance: 3 },
    { location: 'Connaught Place', distance: 6 },
    { location: 'Karol Bagh', distance: 9 },
    { location: 'Chandni Chowk', distance: 8 },
    { location: 'Hauz Khas', distance: 7 },
    { location: 'Jantar Mantar', distance: 5 },
    { location: 'Red Fort', distance: 10 },
    { location: 'Qutub Minar', distance: 9 },
    { location: 'Akshardham Temple', distance: 10 }
  ],
  'Karol Bagh': [
    { location: 'DMC', distance: 6 },
    { location: 'Connaught Place', distance: 2 },
    { location: 'India Gate', distance: 9 },
    { location: 'Lodi Gardens', distance: 9 },
    { location: 'Chandni Chowk', distance: 5 },
    { location: 'Hauz Khas', distance: 14 },
    { location: 'Jantar Mantar', distance: 6 },
    { location: 'Red Fort', distance: 8 },
    { location: 'Qutub Minar', distance: 15 },
    { location: 'Akshardham Temple', distance: 14 }
  ],
  'Chandni Chowk': [
    { location: 'DMC', distance: 2 },
    { location: 'Connaught Place', distance: 4 },
    { location: 'India Gate', distance: 6 },
    { location: 'Lodi Gardens', distance: 9 },
    { location: 'Karol Bagh', distance: 5 },
    { location: 'Hauz Khas', distance: 15 },
    { location: 'Jantar Mantar', distance: 4 },
    { location: 'Red Fort', distance: 2 },
    { location: 'Qutub Minar', distance: 18 },
    { location: 'Akshardham Temple', distance: 10 }
  ],
  'Hauz Khas': [
    { location: 'DMC', distance: 12 },
    { location: 'Connaught Place', distance: 10 },
    { location: 'India Gate', distance: 9 },
    { location: 'Lodi Gardens', distance: 6 },
    { location: 'Karol Bagh', distance: 15 },
    { location: 'Chandni Chowk', distance: 14 },
    { location: 'Jantar Mantar', distance: 10 },
    { location: 'Red Fort', distance: 15 },
    { location: 'Qutub Minar', distance: 4 },
    { location: 'Akshardham Temple', distance: 14 }
  ],
  'Jantar Mantar': [
    { location: 'DMC', distance: 3 },
    { location: 'Connaught Place', distance: 1 },
    { location: 'India Gate', distance: 4 },
    { location: 'Lodi Gardens', distance: 5 },
    { location: 'Karol Bagh', distance: 6 },
    { location: 'Chandni Chowk', distance: 5 },
    { location: 'Hauz Khas', distance: 10 },
    { location: 'Red Fort', distance: 5 },
    { location: 'Qutub Minar', distance: 13 },
    { location: 'Akshardham Temple', distance: 11 }
  ],
  'Red Fort': [
    { location: 'DMC', distance: 3 },
    { location: 'Connaught Place', distance: 5 },
    { location: 'India Gate', distance: 7 },
    { location: 'Lodi Gardens', distance: 10 },
    { location: 'Karol Bagh', distance: 7 },
    { location: 'Chandni Chowk', distance: 2 },
    { location: 'Hauz Khas', distance: 16 },
    { location: 'Jantar Mantar', distance: 5 },
    { location: 'Qutub Minar', distance: 17 },
    { location: 'Akshardham Temple', distance: 9 }
  ],
  'Qutub Minar': [
    { location: 'DMC', distance: 15 },
    { location: 'Connaught Place', distance: 14 },
    { location: 'India Gate', distance: 13 },
    { location: 'Lodi Gardens', distance: 9 },
    { location: 'Karol Bagh', distance: 18 },
    { location: 'Chandni Chowk', distance: 17 },
    { location: 'Hauz Khas', distance: 4 },
    { location: 'Jantar Mantar', distance: 14 },
    { location: 'Red Fort', distance: 18 },
    { location: 'Akshardham Temple', distance: 19 }
  ],
  'Akshardham Temple': [
    { location: 'DMC', distance: 8 },
    { location: 'Connaught Place', distance: 8 },
    { location: 'India Gate', distance: 8 },
    { location: 'Lodi Gardens', distance: 10 },
    { location: 'Karol Bagh', distance: 12 },
    { location: 'Chandni Chowk', distance: 9 },
    { location: 'Hauz Khas', distance: 16 },
    { location: 'Jantar Mantar', distance: 8 },
    { location: 'Red Fort', distance: 8 },
    { location: 'Qutub Minar', distance: 19 }
  ]
};



const WasteCollectionApp = () => {
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [shortestPath, setShortestPath] = useState([]);

  const handleLocationSelect = (location) => {
    if (selectedLocations.includes(location)) {
      setSelectedLocations(selectedLocations.filter(loc => loc.id !== location.id));
    } else {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const findShortestPath = () => {
    if (selectedLocations.length > 0) {
      const path = calculateShortestPath(
        'DMC',
        selectedLocations.map(loc => loc.name)
      );
      setShortestPath(path);
    }
  };

  
  ///new
  const calculateShortestPath = (start, points) => {
    const allPoints = [start, ...points];
    const n = allPoints.length;

    // Create a distance matrix
    const dist = Array(n).fill().map(() => Array(n).fill(Infinity));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                const edge = adjacencyList[allPoints[i]].find(e => e.location === allPoints[j]);
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
                const { cost: newCost, path: newPath } = dfs(nextNode, visited, [...path, allPoints[nextNode]], cost + dist[currentNode][nextNode]);
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

    return result.path.map(loc => locations.find(l => l.name === loc));
  };



  return (
    <div className="container min-h-screen flex flex-col justify-center items-center p-4 bg-gray-200">
      <h1 className="text-3xl font-bold bg-blue-500 text-white p-4 rounded-lg">Delhi Waste Collection Optimization System</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold m-3">Select Locations:</h2>
        <div className="flex flex-wrap gap-4">
          {locations.filter(loc => loc.id !== 11).map(location => (
            <div key={location.id} className="flex flex-col items-center">
              <input
                type="checkbox"
                checked={selectedLocations.some(loc => loc.id === location.id)}
                onChange={() => handleLocationSelect(location)}
                className="mr-2"
              />
              <span>{location.name}</span>
            </div>
          ))}
        </div>
        <button
          onClick={findShortestPath}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Find Shortest Path
        </button>
      </div>
      <div className="mb-4 self-start ml-52">
        <h2 className="text-xl font-semibold text-left w-full m-4">Selected Locations:</h2>
        <div className="flex flex-wrap gap-2">
          {selectedLocations.map((dest, index) => (
            <div key={index} className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-300">
              {dest.name}
            </div>
          ))}
        </div>
      </div>
        
      <MapContainer center={locations.find(loc => loc.id === 11).coordinates} zoom={12} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {shortestPath.map((location, idx) => {
        // Skip rendering the last marker if it's the same as the first (DMC)
        if (idx === shortestPath.length - 1 && idx !== 0 && location.id === shortestPath[0].id) {
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
      <Polyline positions={shortestPath.map(loc => loc.coordinates)} color="red" />
    </MapContainer>

    </div>
  );
};

export default WasteCollectionApp;
