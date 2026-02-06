'use client';
import { Code } from 'lucide-react';

export default function AdminSkillsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-khaki-beige-900 font-comfortaa mb-2">
          Skills
        </h1>
        <p className="text-dry-sage-600">
          Manage your skills and expertise. This section is coming soon.
        </p>
      </div>
      <div className="bg-ebony/60 backdrop-blur-sm p-8 rounded-xl border border-dusty-olive/30 flex flex-col items-center justify-center min-h-[300px] gap-4">
        <Code className="text-dry-sage-600" size={48} />
        <p className="text-dry-sage-600 text-center max-w-md">
          Skills management will allow you to edit categories and skills displayed on your portfolio.
        </p>
      </div>
    </div>
  );
}
