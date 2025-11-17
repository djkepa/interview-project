import React, { useState } from 'react';
import Image from 'next/image';
import { t } from '@/lib/i18n';
import { ImageSkeleton } from './ImageSkeleton';

interface ImagePreviewProps {
  src: string;
  alt?: string;
}

export const ImagePreview = ({ src, alt = 'Preview' }: ImagePreviewProps) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="mt-4">
      <p className="mb-2 text-sm font-medium text-gray-300">{t('imageUpload.preview.title')}</p>
      {loading && <ImageSkeleton />}
      <div className={`relative h-48 w-full ${loading ? 'hidden' : 'block'}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="rounded-xl object-cover shadow-xl transition-all duration-300"
          onLoadingComplete={() => setLoading(false)}
          unoptimized
          priority
        />
      </div>
    </div>
  );
};
