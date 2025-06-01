import dbConnect from '@/lib/dbConnect';
import Route from '@/lib/models/Route';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    await dbConnect(); // Connect to the database

    const newRouteData = await request.json();
    const newRoute = await Route.create(newRouteData); // Create a new route document

    return NextResponse.json({ message: 'Route saved successfully', route: newRoute });
  } catch (error) {
    console.error('Error saving route:', error);
    return NextResponse.json({ message: 'Error saving route' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect(); // Connect to the database

    const routes = await Route.find({}); // Fetch all routes

    return NextResponse.json(routes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    return NextResponse.json({ message: 'Error fetching routes' }, { status: 500 });
  }
} 