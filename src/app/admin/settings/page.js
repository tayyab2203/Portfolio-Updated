'use client';
import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-khaki-beige-900 font-comfortaa mb-2">
          Settings
        </h1>
        <p className="text-dry-sage-600">
          Admin panel settings. This section is coming soon.
        </p>
      </div>
      <div className="bg-ebony/60 backdrop-blur-sm p-8 rounded-xl border border-dusty-olive/30 flex flex-col items-center justify-center min-h-[300px] gap-4">
        <Settings className="text-dry-sage-600" size={48} />
        <p className="text-dry-sage-600 text-center max-w-md">
          Settings will include profile, security, and panel preferences.
        </p>
      </div>
    </div>
  );
}
