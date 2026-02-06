import { NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/projectsDb';
import { projects as fallbackProjects } from '@/data/projects';

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching public projects from MongoDB:', error);
    
    // Fallback to static data if MongoDB fails (for graceful degradation)
    console.warn('Falling back to static projects data due to MongoDB error');
    return NextResponse.json(
      { projects: fallbackProjects || [] },
      { status: 200 }
    );
  }
}

