import React from 'react';
import { t } from '@/lib/i18n';

interface UploadErrorProps {
  message: string;
}

export const UploadError = ({ message }: UploadErrorProps) => {
  return (
    <div className="animate-shake mt-4 rounded-xl border border-red-400/50 bg-gradient-to-r from-red-900/20 to-pink-900/20 p-4 shadow-lg">
      <div className="flex items-start gap-3">
        <svg
          className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <p className="font-semibold text-red-300">{t('imageUpload.error.title')}</p>
          <p className="mt-1 text-sm text-red-400">{message}</p>
        </div>
      </div>
    </div>
  );
};
