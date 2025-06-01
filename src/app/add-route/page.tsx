'use client';

import Image from "next/image";
import { useState } from "react";
import { useRouter } from 'next/navigation';

// Define marker type and colors
type MarkerType = 'start' | 'regular' | 'finish' | 'feet only';

interface Marker {
  x: number;
  y: number;
  type: MarkerType;
}

const markerColors: Record<MarkerType, string> = {
  'start': 'border-green-600', // Green border for start
  'regular': 'border-blue-500', // Blue border for regular
  'finish': 'border-red-600', // Red border for finish
  'feet only': 'border-yellow-500', // Yellow border for feet only
};

export default function AddRoutePage() {
  const [markers, setMarkers] = useState<Marker[]>([]); // Update state type
  const [routeName, setRouteName] = useState('');
  const [routeGrade, setRouteGrade] = useState('V1');
  const [selectedMarkerType, setSelectedMarkerType] = useState<MarkerType>('regular'); // State for selected type
  const router = useRouter();

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const image = e.target as HTMLImageElement;
    const rect = image.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Store coordinates relative to the image size for responsiveness
    const relativeX = x / rect.width;
    const relativeY = y / rect.height;

    // Add marker with selected type
    setMarkers([...markers, { x: relativeX, y: relativeY, type: selectedMarkerType }]);
  };

  const handleSaveRoute = async () => {
    const newRoute = {
      name: routeName,
      grade: routeGrade,
      markers: markers,
      image: '/spray.jpeg',
    };

    try {
      const response = await fetch('/api/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRoute),
      });

      if (response.ok) {
        console.log('Route saved successfully!');
        router.push('/');
      } else {
        console.error('Error saving route:', response.statusText);
        // Handle error
      }
    } catch (error) {
      console.error('Error saving route:', error);
      // Handle error
    }
  };

  const vGrades = Array.from({ length: 17 }, (_, i) => `V${i + 1}`);
  const markerTypes: MarkerType[] = ['start', 'regular', 'finish', 'feet only'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Add New Route</h1>
      
      {/* Marker Type Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Hold Type:</label>
        <div className="flex gap-4">
          {markerTypes.map(type => (
            <button
              key={type}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedMarkerType === type ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
              }`}
              onClick={() => setSelectedMarkerType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full max-w-2xl mx-auto" onClick={handleImageClick}>
        <Image
          src="/spray.jpeg"
          alt="Spray Wall"
          width={600}
          height={800}
          layout="responsive"
        />
        {markers.map((marker, index) => (
          <div
            key={index}
            className={`absolute border-4 rounded-full bg-transparent ${markerColors[marker.type]}`}
            style={{
              left: `${marker.x * 100}%`,
              top: `${marker.y * 100}%`,
              width: '20px',
              height: '20px',
              transform: 'translate(-50%, -50%)', // Center the marker
              boxShadow: '0 0 0 2px black', // Add black outline using box-shadow
            }}
          ></div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Route Details</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="routeName" className="block text-sm font-medium text-gray-700">Route Name</label>
            <input
              type="text"
              id="routeName"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="routeGrade" className="block text-sm font-medium text-gray-700">V Grade</label>
            <select
              id="routeGrade"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900"
              value={routeGrade}
              onChange={(e) => setRouteGrade(e.target.value)}
            >
              {vGrades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
          <button
            className="mt-4 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            onClick={handleSaveRoute}
          >
            Save Route
          </button>
        </div>
      </div>

    </div>
  );
} 