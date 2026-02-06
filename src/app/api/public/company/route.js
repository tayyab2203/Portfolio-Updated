import { NextResponse } from 'next/server';
import { getCompanyData } from '@/lib/companyDb';
import {
  companyInfo as fallbackCompanyInfo,
  team as fallbackTeam,
  achievements as fallbackAchievements,
  vision as fallbackVision,
  mission as fallbackMission,
  values as fallbackValues,
  milestones as fallbackMilestones,
} from '@/data/company';

export async function GET() {
  try {
    const data = await getCompanyData();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching company data from MongoDB:', error);
    
    // Fallback to static data if MongoDB fails
    console.warn('Falling back to static company data due to MongoDB error');
    return NextResponse.json(
      {
        companyInfo: fallbackCompanyInfo,
        team: fallbackTeam,
        achievements: fallbackAchievements,
        vision: fallbackVision,
        mission: fallbackMission,
        values: fallbackValues,
        milestones: fallbackMilestones,
      },
      { status: 200 }
    );
  }
}

