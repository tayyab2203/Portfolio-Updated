'use client';
import { Building2 } from 'lucide-react';

export default function AdminCompanyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-khaki-beige-900 font-comfortaa mb-2">
          Company
        </h1>
        <p className="text-dry-sage-600">
          Update company information. This section is coming soon.
        </p>
      </div>
      <div className="bg-ebony/60 backdrop-blur-sm p-8 rounded-xl border border-dusty-olive/30 flex flex-col items-center justify-center min-h-[300px] gap-4">
        <Building2 className="text-dry-sage-600" size={48} />
        <p className="text-dry-sage-600 text-center max-w-md">
          Company info management will allow you to edit the company details shown on your portfolio.
        </p>
      </div>
    </div>
  );
}
