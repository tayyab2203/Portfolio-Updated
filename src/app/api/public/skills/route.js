import { NextResponse } from 'next/server';
import { getSkillsForPublic } from '@/lib/skillsDb';

export async function GET() {
  try {
    const categories = await getSkillsForPublic();
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error('Error fetching skills from MongoDB:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

