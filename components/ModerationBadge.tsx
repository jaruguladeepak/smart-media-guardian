import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface ModerationBadgeProps {
  status: 'safe' | 'flagged' | 'pending' | 'rejected' | 'unknown' | 'review';
}

export default function ModerationBadge({ status }: ModerationBadgeProps) {
  if (status === 'safe') {
    return (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        <ShieldCheck className="w-4 h-4 mr-1.5" />
        Safe
      </div>
    );
  }

  if (status === 'flagged' || status === 'rejected') {
    return (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
        <ShieldAlert className="w-4 h-4 mr-1.5" />
        {status === 'rejected' ? 'Rejected' : 'Flagged'}
      </div>
    );
  }

  if (status === 'pending' || status === 'review') {
    return (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
        <Shield className="w-4 h-4 mr-1.5" />
        {status === 'review' ? 'Needs Review' : 'Pending Review'}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400">
      <Shield className="w-4 h-4 mr-1.5" />
      Unknown
    </div>
  );
}
