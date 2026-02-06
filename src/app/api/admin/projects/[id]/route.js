import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import {
  getProjectById,
  updateProject as updateProjectInDb,
  deleteProject as deleteProjectInDb,
} from '@/lib/projectsDb';

// GET single project
export async function GET(request, { params }) {
  try {
    const req = await request;
    const token = req.cookies?.get('adminToken')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // Log for debugging
    console.log('Fetching project with ID:', id, 'Type:', typeof id);
    
    const project = await getProjectById(id);

    if (!project) {
      console.error('Project not found for ID:', id);
      return NextResponse.json(
        { 
          error: 'Project not found',
          details: `No project found with ID: ${id} (type: ${typeof id})`
        },
        { status: 404 }
      );
    }

    console.log('Project found:', project.id, project.title);
    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error('Error fetching project:', error);
    
    let errorMessage = 'Failed to fetch project';
    if (error.message?.includes('MongoServerSelectionError') || error.message?.includes('SSL')) {
      errorMessage = 'Database connection error. Please check MongoDB configuration.';
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// PUT - Update project
export async function PUT(request, { params }) {
  try {
    const req = await request;
    const token = req.cookies?.get('adminToken')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.title || !body.problem || !body.solution) {
      return NextResponse.json(
        { error: 'Missing required fields: title, problem, solution' },
        { status: 400 }
      );
    }

    const updated = await updateProjectInDb(id, body);

    if (!updated) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Project updated successfully', project: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating project:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to update project';
    if (error.message?.includes('MongoServerSelectionError') || error.message?.includes('SSL')) {
      errorMessage = 'Database connection error. Please check MongoDB configuration.';
    } else if (error.message) {
      errorMessage = `Update failed: ${error.message}`;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
export async function DELETE(request, { params }) {
  try {
    const req = await request;
    const token = req.cookies?.get('adminToken')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deleteProjectInDb(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
