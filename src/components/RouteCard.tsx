'use client';

import Image from "next/image";

interface RouteCardProps {
  id?: string;
  name: string;
  grade: string;
  description: string;
  isNew?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  href?: string;
  image?: string;
  markers?: { x: number; y: number }[];
  onClick?: () => void;
  setterName?: string;
  style?: string[];
  instagram?: string;
}

export default function RouteCard({
  id,
  name,
  grade,
  description,
  isNew = false,
  onEdit,
  onDelete,
  href,
  image,
  markers,
  onClick,
  setterName,
  style,
  instagram,
}: RouteCardProps) {
  if (isNew) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">New Route</h2>
        <p className="mt-2 text-gray-600">Add a new route to your spray wall</p>
        {href ? (
          <a href={href} className="inline-block mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Add Route
          </a>
        ) : (
          <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Add Route
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col h-full cursor-pointer" onClick={onClick}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 text-gray-900">
          {grade}
        </span>
      </div>

      <div className="text-sm text-gray-600 mb-2">
        {setterName && <span>Setter: {setterName}</span>}
        {(setterName || (style && style.length > 0)) && instagram && <span> | </span>}
        {style && style.length > 0 && (
          <span>Style: {style.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}</span>
        )}
        {(setterName || (style && style.length > 0) || instagram) && <br />}
        {instagram && (
          <a 
            href={`https://www.instagram.com/${instagram}/`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:underline"
          >
            @{instagram}
          </a>
        )}
      </div>

      <p className="text-gray-600 flex-grow">{description}</p>
    </div>
  );
} 