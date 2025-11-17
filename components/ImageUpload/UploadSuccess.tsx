import React, { useState } from 'react';
import Image from 'next/image';
import { t } from '@/lib/i18n';
import { ImageSkeleton } from './ImageSkeleton';

interface UploadSuccessProps {
  imageUrl: string;
  onReset: () => void;
}

export const UploadSuccess = ({ imageUrl, onReset }: UploadSuccessProps) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="animate-slideIn mt-4 rounded-xl bg-gradient-to-br from-green-900/20 via-emerald-900/20 to-teal-900/20 p-5 shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="h-6 w-6 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="font-semibold text-green-300">{t('imageUpload.success.message')}</p>
        </div>
        <button
          onClick={onReset}
          className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
          type="button"
          aria-label={t('imageUpload.form.uploadAnother')}
        >
          {t('imageUpload.form.uploadAnother')}
        </button>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl">
        {loading && <ImageSkeleton />}
        <div className={`relative h-80 w-full ${loading ? 'hidden' : 'block'}`}>
          <Image
            src={imageUrl}
            alt="Uploaded"
            fill
            className="rounded-xl object-cover shadow-2xl transition-all duration-500"
            onLoad={() => setLoading(false)}
            unoptimized
          />
        </div>
      </div>

      <a
        href={imageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center gap-2 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
        {t('imageUpload.success.viewFullImage')}
      </a>
    </div>
  );
};
