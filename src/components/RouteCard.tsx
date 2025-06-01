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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{name}</h2>
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 text-gray-900">
          {grade}
        </span>
      </div>

      <p className="mt-2 text-gray-600 flex-grow">{description}</p>
    </div>
  );
} 