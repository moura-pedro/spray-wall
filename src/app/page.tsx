'use client';

import RouteCard from "@/components/RouteCard";
import { useState, useEffect } from 'react';
import Image from "next/image";

// Define marker type and colors (should match the definition in add-route/page.tsx)
type MarkerType = 'start' | 'regular' | 'finish' | 'feet only';

const markerColors: Record<MarkerType, string> = {
  'start': 'border-green-600', // Green border for start
  'regular': 'border-blue-500', // Blue border for regular
  'finish': 'border-red-600', // Red border for finish
  'feet only': 'border-yellow-500', // Yellow border for feet only
};

interface Marker {
  x: number;
  y: number;
  type: MarkerType; // Update marker interface
}

interface Route {
  id: string;
  name: string;
  grade: string;
  description?: string;
  markers: Marker[]; // Update markers type
  image: string;
}

export default function Home() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Spray Wall Routes</h1>
        <p className="mt-2 text-gray-600">Track and manage your climbing routes</p>
      </header>

      {!selectedRoute ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <RouteCard
            isNew
            name="New Route"
            grade=""
            description="Add a new route to your spray wall"
            href="/add-route"
          />
          
          {routes.map(route => (
            <RouteCard
              key={route.id}
              id={route.id}
              name={route.name}
              grade={route.grade}
              description={route.description || 'No description provided.'}
              onClick={() => handleRouteClick(route)}
              onEdit={() => handleEdit(route.id)}
              onDelete={() => handleDelete(route.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{selectedRoute.name}</h2>
          <p className="text-gray-600 mb-4">Grade: {selectedRoute.grade}</p>
          <p className="text-gray-600 mb-4">{selectedRoute.description}</p>

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
                    transform: 'translate(-50%, -50%)',
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
