import { NextResponse } from 'next/server';
import { getSkillsForPublic } from '@/lib/skillsDb';
import { skills as fallbackSkills } from '@/data/skills';

function normalizeSkillsObject(skillsObj) {
  return Object.entries(skillsObj).map(([key, value]) => ({
    key,
    category: value.category,
    skills: (value.skills || []).map((skill) => ({
      name: skill.name,
      level: skill.level,
      years: skill.years,
      iconKey: skill.icon?.name || null,
    })),
  }));
}

export async function GET() {
  try {
    const categories = await getSkillsForPublic();
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error('Error fetching skills from MongoDB:', error);
    
    // Fallback to static data if MongoDB fails
    console.warn('Falling back to static skills data due to MongoDB error');
    const fallbackCategories = normalizeSkillsObject(fallbackSkills || {});
    return NextResponse.json(
      { categories: fallbackCategories },
      { status: 200 }
    );
  }
}

