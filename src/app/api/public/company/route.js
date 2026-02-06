import { NextResponse } from 'next/server';
import { getCompanyData } from '@/lib/companyDb';

export async function GET() {
  try {
    const data = await getCompanyData();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching company data from MongoDB:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company data' },
      { status: 500 }
    );
  }
}

