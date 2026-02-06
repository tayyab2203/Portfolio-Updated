import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getSkillsForAdmin, updateSkills } from '@/lib/skillsDb';

export async function GET(request) {
  try {
    const req = await request;
    const token = req.cookies?.get('adminToken')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await getSkillsForAdmin();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const req = await request;
    const token = req.cookies?.get('adminToken')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { categories } = body || {};

    if (!Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'Invalid payload: categories must be an array' },
        { status: 400 }
      );
    }

    const updated = await updateSkills(categories);
    return NextResponse.json(
      { message: 'Skills updated successfully', ...updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating skills:', error);
    return NextResponse.json(
      { error: 'Failed to update skills' },
      { status: 500 }
    );
  }
}

