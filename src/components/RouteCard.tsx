'use client';

import Image from "next/image";

interface RouteCardProps {
  id?: string;
  name: string;
  grade: string;
  gradeColor?: string;
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
  createdAt?: string;
}

export default function RouteCard({
  id,
  name,
  grade,
  gradeColor,
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
  createdAt,
}: RouteCardProps) {
  if (isNew) {
    return (
      <div className="rounded-lg border bg-white p-4 md:p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Nova Via</h2>
        <p className="mt-1 text-gray-600">Adicione uma nova via ao seu spray wall</p>
        {href ? (
          <a href={href} className="inline-block mt-3 rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 text-sm">
            Adicionar Via
          </a>
        ) : (
          <button className="mt-3 rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 text-sm">
            Adicionar Via
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-4 md:p-6 shadow-sm flex flex-col h-full cursor-pointer text-gray-900" onClick={onClick}>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">{name}</h2>
        <span className={`rounded-full ${gradeColor || 'bg-gray-100'} px-2 py-0.5 text-xs md:text-sm font-bold `}>
          {grade}
        </span>
      </div>

      <div className="text-xs md:text-sm text-gray-600 mb-1">
        <div>
          {setterName && (
            <span>
              {setterName}
              {instagram && (
                <span>
                  {' '}
                  <a 
                    href={`https://www.instagram.com/${instagram}/`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline"
                  >
                    @{instagram}
                  </a>
                </span>
              )}
            </span>
          )}
          {setterName && style && style.length > 0 && <span> | </span>}
          {style && style.length > 0 && (
            <span>{style.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}</span>
          )}
        </div>
        {createdAt && (
          <div className="text-gray-500">
            {new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 flex-grow">{description}</p>
    </div>
  );
} 