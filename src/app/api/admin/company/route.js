import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getCompanyData, updateCompanyData } from '@/lib/companyDb';

export async function GET(request) {
  try {
    const req = await request;
    const token = req.cookies?.get('adminToken')?.value;
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await getCompanyData();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching company data (admin):', error);
    return NextResponse.json(
      { error: 'Failed to fetch company data' },
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
    const updated = await updateCompanyData(body || {});

    return NextResponse.json(
      { message: 'Company data updated successfully', ...updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating company data:', error);
    return NextResponse.json(
      { error: 'Failed to update company data' },
      { status: 500 }
    );
  }
}

