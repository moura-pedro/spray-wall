'use client';

import RouteCard from "@/components/RouteCard";
import { useState, useEffect } from 'react';
import Image from "next/image";
import { Range, getTrackBackground } from 'react-range'; // Import Range and getTrackBackground

// Define marker type and colors (should match the definition in add-route/page.tsx)
type MarkerType = 'start' | 'regular' | 'finish' | 'feet only';

const markerColors: Record<MarkerType, string> = {
  'start': 'border-green-500', // Adjusted green color for contrast
  'regular': 'border-blue-500', // Adjusted blue color for contrast
  'finish': 'border-red-500', // Adjusted red color for contrast
  'feet only': 'border-yellow-500', // Adjusted yellow color for contrast
};

interface Marker {
  x: number;
  y: number;
  type: MarkerType;
}

interface Route {
  id: string;
  name: string;
  grade: string;
  description?: string;
  setterName?: string; // Add setterName to interface
  style?: string[]; // Update style to be an array
  instagram?: string; // Add instagram to interface
  markers: Marker[];
  image: string;
  createdAt: string; // Add createdAt field
}

export default function Home() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  // Initialize range values to [1, 17] for V1 to V17
  const [gradeRange, setGradeRange] = useState<number[]>([1, 17]); 

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('/api/routes');
        if (response.ok) {
          const data: Route[] = await response.json();
          setRoutes(data);
        } else {
          console.error('Error fetching routes:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchRoutes();
  }, []);

  const handleEdit = (id: string) => {
    console.log("Edit route:", id);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id: string) => {
    console.log("Delete route:", id);
    // TODO: Implement delete functionality
  };

  const handleRouteClick = (route: Route) => {
    setSelectedRoute(route);
  };

  const handleCloseDetails = () => {
    setSelectedRoute(null);
  };

  // Filter routes based on selected grade range
  const filteredRoutes = routes.filter(route => {
    const gradeNumber = parseInt(route.grade.replace('V', ''), 10);
    return gradeNumber >= gradeRange[0] && gradeNumber <= gradeRange[1];
  });

  return (
    <div className="container mx-auto px-4 py-8 text-gray-100">
      <header className="mb-8">
        <h1 className=" flex justify-center text-3xl sm:text-4xl font-bold text-gray-100">Spray Sesh</h1>
        <p className="flex justify-center mt-2 text-gray-400">Veja as rotas que já foram feitas</p>
      </header>

      {!selectedRoute ? (
        // Display route cards and filter when no route is selected
        <>
          {/* Grade Range Slider Filter */}
          <div className="mb-8">
            <label className="flex justify-center block text-sm font-medium text-gray-400 mb-2">Filter by Grade Range: V{gradeRange[0]} - V{gradeRange[1]}</label>
            <div className="flex justify-center items-center w-full max-w-xs mx-auto">
              <Range
                values={gradeRange}
                step={1}
                min={1}
                max={17}
                onChange={(values) => setGradeRange(values)}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: '6px',
                      width: '100%',
                      backgroundColor: '#555',
                      borderRadius: '3px',
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: '24px',
                      width: '24px',
                      backgroundColor: '#BBB',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: '0px 2px 6px #888',
                    }}
                  />
                )}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <RouteCard
              isNew
              name="New Route"
              grade=""
              description="Add a new route to your spray wall"
              href="/add-route"
            />
            
            {filteredRoutes.map(route => (
              <RouteCard
                key={route.id}
                id={route.id}
                name={route.name}
                grade={route.grade}
                description={route.description || ''}
                setterName={route.setterName}
                style={route.style}
                instagram={route.instagram}
                createdAt={route.createdAt}
                onClick={() => handleRouteClick(route)}
                onEdit={() => handleEdit(route.id)}
                onDelete={() => handleDelete(route.id)}
              />
            ))}
          </div>
        </>
      ) : (
        // Display route details (image with markers) when a route is selected
        <div className="mt-8 text-gray-100">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">{selectedRoute.name}</h2>
          <p className="text-gray-400 mb-2">Grade: {selectedRoute.grade}</p>
          {selectedRoute.setterName && <p className="text-gray-400 mb-2">Setter: {selectedRoute.setterName}</p>}
          {selectedRoute.style && selectedRoute.style.length > 0 && (
             <p className="text-gray-400 mb-2">Style: {selectedRoute.style.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}</p>
          )}
           {selectedRoute.instagram && (
            <p className="text-gray-400 mb-2">
              Instagram: 
              <a 
                href={`https://www.instagram.com/${selectedRoute.instagram}/`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-400 hover:underline ml-1"
              >
                @{selectedRoute.instagram}
              </a>
            </p>
          )}
          <p className="text-gray-400 mb-2">Created: {selectedRoute.createdAt ? new Date(selectedRoute.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
          <p className="text-gray-400 mb-4">{selectedRoute.description}</p>

          {selectedRoute.image && selectedRoute.markers && (
            <div className="relative w-full max-w-2xl mx-auto mb-4">
              <Image
                src={selectedRoute.image}
                alt="Spray Wall Route"
                width={600}
                height={800}
                layout="responsive"
              />
              {selectedRoute.markers.map((marker, index) => (
                <div
                  key={index}
                  className={`absolute border-4 rounded-full bg-transparent ${markerColors[marker.type]}`}
                  style={{
                    left: `${marker.x * 100}%`,
                    top: `${marker.y * 100}%`,
                    width: '20px',
                    height: '20px',
                    transform: 'translate(-50%, -50%)', // Center the marker
                    boxShadow: '0 0 0 2px black',
                  }}
                ></div>
              ))}
            </div>
          )}

          <button
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={handleCloseDetails}
          >
            Back to Routes
          </button>
        </div>
      )}
    </div>
  );
}
