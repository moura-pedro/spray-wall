'use client';

import RouteCard from "@/components/RouteCard";
import { useState, useEffect } from 'react';
import Image from "next/image";
import { Range } from 'react-range'; // Import Range and getTrackBackground

// Define marker type and colors (should match the definition in add-route/page.tsx)
type MarkerType = 'start' | 'regular' | 'finish' | 'feet only';

const markerColors: Record<MarkerType, string> = {
  'start': 'border-green-500', // Adjusted green color for contrast
  'regular': 'border-blue-500', // Adjusted blue color for contrast
  'finish': 'border-red-500', // Adjusted red color for contrast
  'feet only': 'border-yellow-500', // Adjusted yellow color for contrast
};

// Define V grade colors from easiest to hardest
const gradeColors: Record<string, string> = {
  // V1-V2: Grey
  'V1': 'bg-gray-200 text-gray-900',
  'V2': 'bg-gray-400 text-gray-900',
  // V3-V4: Pink
  'V3': 'bg-pink-200 text-gray-900',
  'V4': 'bg-pink-400 text-gray-900',
  // V5-V6: Yellow
  'V5': 'bg-yellow-200 text-gray-900',
  'V6': 'bg-yellow-400 text-gray-900',
  // V7-V8: Blue
  'V7': 'bg-blue-200 text-gray-900',
  'V8': 'bg-blue-400 text-gray-900',
  // V9-V10: Orange
  'V9': 'bg-orange-200 text-gray-900',
  'V10': 'bg-orange-400 text-gray-900',
  // V11-V12: Green
  'V11': 'bg-emerald-200 text-gray-900',
  'V12': 'bg-emerald-400 text-gray-900',
  // V13-V14: Red
  'V13': 'bg-red-200 text-gray-900',
  'V14': 'bg-red-400 text-gray-900',
  // V15-V16: Purple
  'V15': 'bg-purple-200 text-gray-900',
  'V16': 'bg-purple-400 text-gray-900',
  // V17: Black
  'V17': 'bg-gray-800 text-white',
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
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'difficulty'>('recent');

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

  // Sort routes based on selected criteria
  const sortedRoutes = [...filteredRoutes].sort((a, b) => {
    if (sortBy === 'recent') {
      // Sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      // Sort by difficulty (V grade)
      const gradeA = parseInt(a.grade.replace('V', ''), 10);
      const gradeB = parseInt(b.grade.replace('V', ''), 10);
      return gradeA - gradeB;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 text-gray-100">
      <header className="mb-8">
        <div className="flex items-center justify-center gap-4">
          <Image
            src="/app_logo.png"
            alt="Logotipo do Aplicativo Spray Sesh"
            width={50} // Adjust size as needed
            height={50} // Adjust size as needed
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100">Spray Sesh</h1>
        </div>
        <p className="flex justify-center mt-2 text-gray-400">Veja as vias que já foram feitas</p>
      </header>

      {!selectedRoute ? (
        // Display route cards and filter when no route is selected
        <div className="pb-20">
          {/* Grade Range Slider Filter */}
          <div className="mb-8">
            <label className="flex justify-center block text-sm font-medium text-gray-400 mb-2">Filtre por grau: V{gradeRange[0]} - V{gradeRange[1]}</label>
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

          {/* Sort Dropdown */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'name' | 'difficulty')}
                className="block appearance-none bg-gray-700 border border-gray-600 text-gray-100 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500"
              >
                <option value="recent">Mais Recentes</option>
                <option value="name">Ordem Alfabética</option>
                <option value="difficulty">Ordem de Dificuldade</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <RouteCard
              isNew
              name="Nova Via"
              grade=""
              description="Adicione uma nova via ao seu spray wall"
              href="/add-route"
            />
            
            {sortedRoutes.map(route => (
              <RouteCard
                key={route.id}
                id={route.id}
                name={route.name}
                grade={route.grade}
                gradeColor={gradeColors[route.grade]}
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
        </div>
      ) : (
        // Display route details (image with markers) when a route is selected
        <div className="mt-8 text-gray-100 pb-20">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">{selectedRoute.name}</h2>
          <p className="text-gray-400 mb-2">Grau: {selectedRoute.grade}</p>
          {selectedRoute.setterName && <p className="text-gray-400 mb-2">Montador: {selectedRoute.setterName}</p>}
          {selectedRoute.style && selectedRoute.style.length > 0 && (
             <p className="text-gray-400 mb-2">Estilo: {selectedRoute.style.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}</p>
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
                alt="Via no Spray Wall"
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
            Voltar para Vias
          </button>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 w-full bg-gray-900 py-4 text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Spray Sesh. Feito com 🤍 por <a href="https://www.linkedin.com/in/pedroomour/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">Pedro Moura</a>.</p>
        </div>
      </footer>
    </div>
  );
}
