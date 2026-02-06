import { NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/projectsDb';

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching public projects from MongoDB:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

