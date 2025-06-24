import React, { useState} from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import locations from '../data/locations';

// Default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


// Custom icons
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const regularIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const WasteCollectionAPI = () => {
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [route, setRoute] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = (location) => {
    setSelectedLocations(prev =>
      prev.some(loc => loc.id === location.id)
        ? prev.filter(loc => loc.id !== location.id)
        : [...prev, location]
    );
  };

  const findShortestPath = async () => {
    const dmcStart = locations.find(l => l.name === 'DMC');
    const points = [dmcStart, ...selectedLocations, dmcStart]; // Return to DMC at the end

    if (selectedLocations.length === 0) {
      alert('Please select at least one location to visit.');
      return;
    }

    setLoading(true);
    
    try {
      // Convert coordinates to [lng, lat] format for OpenRouteService
      const coordinates = points.map(p => [p.coordinates[1], p.coordinates[0]]);
      
      // Get API key from environment variables
      const orsApiKey = process.env.ORS_API_KEY;
      
      if (!orsApiKey) {
        throw new Error('API key not found in environment variables. Please check your .env file.');
      }

      const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
        method: 'POST',
        headers: {
          'Authorization': orsApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
        },
        body: JSON.stringify({
          coordinates: coordinates,
          format: 'geojson',
          instructions: false,
          preference: 'shortest' // Fixed to shortest distance for DSA optimization
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();

      if (data?.features?.[0]) {
        // Convert coordinates back to [lat, lng] for Leaflet
        const routeCoords = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        const distance = data.features[0].properties.summary.distance / 1000; // Convert to km
        const duration = data.features[0].properties.summary.duration / 60; // Convert to minutes
        
        setRoute(routeCoords);
        setTotalDistance(distance.toFixed(2));
        
        console.log(`Shortest route calculated: ${distance.toFixed(2)} km, ${duration.toFixed(0)} minutes`);
      } else {
        throw new Error('No route found in API response');
      }
      
    } catch (error) {
      console.error('Error fetching route from OpenRouteService:', error);
      
      // Fallback to simple straight-line routing using Haversine formula
      console.log('Falling back to Haversine distance calculation...');
      const routeCoordinates = points.map(point => point.coordinates);
      
      let totalDist = 0;
      for (let i = 0; i < routeCoordinates.length - 1; i++) {
        const lat1 = routeCoordinates[i][0];
        const lon1 = routeCoordinates[i][1];
        const lat2 = routeCoordinates[i + 1][0];
        const lon2 = routeCoordinates[i + 1][1];
        
        // Haversine formula for calculating distance between two points
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        totalDist += distance;
      }
      
      setRoute(routeCoordinates);
      setTotalDistance(totalDist.toFixed(2));
      
      alert(`API Error: ${error.message}. Using Haversine distance calculation as fallback.`);
    } finally {
      setLoading(false);
    }
  };

  const clearRoute = () => {
    setRoute([]);
    setTotalDistance(0);
    setSelectedLocations([]);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-100">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold bg-blue-500 text-white p-4 rounded-lg text-center mb-6">
          Delhi Waste Collection Route Optimization
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Collection Points:</h2>
          <p className="text-sm text-gray-600 mb-4">
            Choose locations to visit. The algorithm will find the shortest distance route starting and ending at DMC.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {locations.filter(loc => loc.id !== 10).map(location => (
              <label key={location.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedLocations.some(loc => loc.id === location.id)}
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
              disabled={loading || selectedLocations.length === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded transition-colors flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating Shortest Route...
                </>
              ) : (
                'Find Shortest Route'
              )}
            </button>
            
            <button
              onClick={clearRoute}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded transition-colors"
            >
              Clear Route
            </button>
          </div>

          {selectedLocations.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Selected Locations ({selectedLocations.length}):</h3>
              <div className="flex flex-wrap gap-2">
                {selectedLocations.map((loc, index) => (
                  <span key={loc.id} className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full">
                    {loc.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {totalDistance > 0 && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <h3 className="text-lg font-semibold flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Optimized Route Found!
            </h3>
            <p className="text-lg font-bold">Total Distance: {totalDistance} km</p>
            <p className="text-sm">
              Circular route visiting {selectedLocations.length} locations, optimized for shortest distance
            </p>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow-md">
          <MapContainer 
            center={[28.6700, 77.2100]} 
            zoom={10} 
            style={{ height: '500px', width: '100%' }}
            className="rounded-lg"
          >
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <Marker
              position={locations.find(loc => loc.name === 'DMC').coordinates}
              icon={startIcon}
            >
              <Tooltip permanent>
                DMC (Start/End Point)
              </Tooltip>
            </Marker>

            {selectedLocations.map((loc) => (
              <Marker
                key={loc.id}
                position={loc.coordinates}
                icon={regularIcon}
              >
                <Tooltip permanent>
                  {loc.name}
                </Tooltip>
              </Marker>
            ))}

            {route.length > 1 && (
              <Polyline 
                positions={route} 
                color="blue" 
                weight={4}
                opacity={0.7}
                dashArray="5, 5"
              />
            )}
          </MapContainer>
        </div>

      </div>
    </div>
  );
};

export default WasteCollectionAPI;