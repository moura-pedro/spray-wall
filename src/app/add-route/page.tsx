'use client';

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';

// Define marker type and colors
type MarkerType = 'start' | 'regular' | 'finish' | 'feet only';

interface Marker {
  x: number;
  y: number;
  type: MarkerType;
}

const markerColors: Record<MarkerType, string> = {
  'start': 'border-green-500', // Adjusted green color for contrast
  'regular': 'border-blue-500', // Adjusted blue color for contrast
  'finish': 'border-red-500', // Adjusted red color for contrast
  'feet only': 'border-yellow-500', // Adjusted yellow color for contrast
};

// Define Route Style types
type RouteStyleType = 'dinamico' | 'regleteira' | 'no match';
const routeStyles: RouteStyleType[] = ['dinamico', 'regleteira', 'no match'];

export default function AddRoutePage() {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [routeName, setRouteName] = useState('');
  const [routeGrade, setRouteGrade] = useState('V1');
  const [setterName, setSetterName] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<RouteStyleType[]>([]); // State for multiple styles
  const [instagramLink, setInstagramLink] = useState(''); // State for Instagram link
  const [selectedMarkerType, setSelectedMarkerType] = useState<MarkerType>('regular');
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingIndex !== null) return; // Prevent adding marker while dragging

    const image = imageRef.current as HTMLDivElement;
    const rect = image.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Store coordinates relative to the image size for responsiveness
    const relativeX = x / rect.width;
    const relativeY = y / rect.height;

    // Add marker with selected type
    setMarkers([...markers, { x: relativeX, y: relativeY, type: selectedMarkerType }]);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    e.stopPropagation(); // Prevent image click handler
    setDraggingIndex(index);
    setIsDragging(false); // Reset dragging flag
    const marker = markers[index];
    const image = imageRef.current as HTMLDivElement;
    const rect = image.getBoundingClientRect();
    // Calculate offset relative to the marker's position
    const offsetX = e.clientX - (rect.left + marker.x * rect.width);
    const offsetY = e.clientY - (rect.top + marker.y * rect.height);
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggingIndex === null || dragOffset === null) return;

    setIsDragging(true); // Set dragging flag

    const image = imageRef.current as HTMLDivElement;
    const rect = image.getBoundingClientRect();

    // Calculate new position relative to the image container
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    // Convert back to relative coordinates
    const newRelativeX = newX / rect.width;
    const newRelativeY = newY / rect.height;

    // Update marker position in state
    setMarkers(markers.map((marker, i) => 
      i === draggingIndex ? { ...marker, x: newRelativeX, y: newRelativeY } : marker
    ));
  };

  const handleMouseUp = () => {
    setDraggingIndex(null);
    setDragOffset(null);
    // isDragging is checked in the onClick handler
  };

  // Add and remove global mousemove and mouseup listeners
  useEffect(() => {
    if (draggingIndex !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    // Cleanup listeners on component unmount
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingIndex]);

  const handleStyleChange = (style: RouteStyleType) => {
    setSelectedStyles(prevStyles => 
      prevStyles.includes(style) 
        ? prevStyles.filter(s => s !== style) 
        : [...prevStyles, style]
    );
  };

  const handleSaveRoute = async () => {
    const newRoute = {
      name: routeName,
      grade: routeGrade,
      setterName: setterName,
      style: selectedStyles, // Use selectedStyles array
      instagram: instagramLink, // Include instagramLink
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
    <div className="container mx-auto px-4 py-8 text-gray-100">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-6">Add New Route</h1>
      
      {/* Marker Type Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-2">Select Hold Type:</label>
        <div className="flex gap-4">
          {markerTypes.map(type => (
            <button
              key={type}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedMarkerType === type ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'
              }`}
              onClick={() => setSelectedMarkerType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full max-w-2xl mx-auto" ref={imageRef} onClick={handleImageClick}>
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
            className={`absolute border-4 rounded-full bg-transparent cursor-pointer ${markerColors[marker.type]}`}
            style={{
              left: `${marker.x * 100}%`,
              top: `${marker.y * 100}%`,
              width: '20px',
              height: '20px',
              transform: 'translate(-50%, -50%)', // Center the marker
              boxShadow: '0 0 0 2px black',
            }}
            onMouseDown={(e) => handleMouseDown(e, index)}
            onClick={(e) => {
              e.stopPropagation(); // Prevent adding a new marker when clicking an existing one
              // Delete marker on click (only if not dragging)
              if (!isDragging) { // Check if not dragging
                const updatedMarkers = markers.filter((_, i) => i !== index);
                setMarkers(updatedMarkers);
              }
            }}
          ></div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">Route Details</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="routeName" className="block text-sm font-medium text-gray-400">Route Name</label>
            <input
              type="text"
              id="routeName"
              className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="routeGrade" className="block text-sm font-medium text-gray-400">V Grade</label>
            <select
              id="routeGrade"
              className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={routeGrade}
              onChange={(e) => setRouteGrade(e.target.value)}
            >
              {vGrades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="setterName" className="block text-sm font-medium text-gray-400">Setter Name</label>
            <input
              type="text"
              id="setterName"
              className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={setterName}
              onChange={(e) => setSetterName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Style</label>
            <div className="flex flex-wrap gap-2">
              {routeStyles.map(style => (
                <button
                  key={style}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedStyles.includes(style) ? 'bg-blue-600 text-white' : 'bg-700 text-gray-100'
                  }`}
                  onClick={() => handleStyleChange(style)}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="instagramLink" className="block text-sm font-medium text-gray-400">Instagram Username (Optional)</label>
            <input
              type="text"
              id="instagramLink"
              className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={instagramLink}
              onChange={(e) => setInstagramLink(e.target.value)}
              placeholder="e.g., your_username"
            />
          </div>
          <div className="flex gap-4">
            <button
              className="mt-4 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 flex-grow"
              onClick={handleSaveRoute}
            >
              Save Route
            </button>
            <button
              className="mt-4 rounded-md bg-gray-700 px-4 py-2 text-gray-100 hover:bg-gray-600 flex-grow"
              onClick={() => router.push('/')}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

    </div>
  );
} 