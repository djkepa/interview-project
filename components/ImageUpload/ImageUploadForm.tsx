import React from 'react';
import { t } from '@/lib/i18n';
import { ImagePreview } from './ImagePreview';

interface ImageUploadFormProps {
  imagePreview: string | null;
  isUploading: boolean;
  hasImageFile: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ImageUploadForm = ({
  imagePreview,
  isUploading,
  hasImageFile,
  fileInputRef,
  onImageChange,
  onSubmit,
}: ImageUploadFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="image" className="mb-2 block text-sm font-semibold text-gray-200">
          {t('imageUpload.form.selectImage')}
        </label>
        <div className="group relative">
          <input
            ref={fileInputRef}
            id="image"
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="w-full cursor-pointer rounded-xl border-2 border-dashed border-gray-600 bg-gray-700 p-4 text-sm text-gray-300 transition-all file:mr-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-purple-500 file:to-pink-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-purple-400 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-900/50 disabled:cursor-not-allowed disabled:opacity-50"
            required
            disabled={isUploading}
          />
        </div>
      </div>

      {imagePreview && <ImagePreview src={imagePreview} />}

      <button
        type="submit"
        disabled={isUploading || !hasImageFile}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isUploading ? (
            <>
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {t('imageUpload.form.uploadingButton')}
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              {t('imageUpload.form.uploadButton')}
            </>
          )}
        </span>
        <div className="absolute inset-0 -z-0 bg-gradient-to-r from-pink-600 via-red-600 to-purple-600 opacity-0 transition-opacity group-hover:opacity-100" />
      </button>
    </form>
  );
};
