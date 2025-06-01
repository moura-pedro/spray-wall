import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const routesFilePath = path.join(process.cwd(), 'data', 'routes.json');

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
fs.mkdir(dataDir, { recursive: true }).catch(console.error);

export async function POST(request: Request) {
  try {
    const newRoute = await request.json();

    // Read existing routes
    let existingRoutes: any[] = [];
    try {
      const data = await fs.readFile(routesFilePath, 'utf-8');
      existingRoutes = JSON.parse(data);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        console.error('Error reading routes file:', error);
        return NextResponse.json({ message: 'Error reading routes data' }, { status: 500 });
      }
      // File doesn't exist, start with an empty array
    }

    // Assign a simple ID (for demonstration)
    const newId = Date.now().toString(); // Simple timestamp ID
    const routeToSave = { ...newRoute, id: newId };

    // Add the new route
    existingRoutes.push(routeToSave);

    // Write the updated routes back to the file
    await fs.writeFile(routesFilePath, JSON.stringify(existingRoutes, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Route saved successfully', route: routeToSave });
  } catch (error) {
    console.error('Error saving route:', error);
    return NextResponse.json({ message: 'Error saving route' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Read existing routes
    let existingRoutes: any[] = [];
    try {
      const data = await fs.readFile(routesFilePath, 'utf-8');
      existingRoutes = JSON.parse(data);
    } catch (error: any) {
       if (error.code !== 'ENOENT') {
        console.error('Error reading routes file:', error);
        return NextResponse.json({ message: 'Error reading routes data' }, { status: 500 });
      }
      // File doesn't exist, return empty array
    }

    return NextResponse.json(existingRoutes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    return NextResponse.json({ message: 'Error fetching routes' }, { status: 500 });
  }
} 