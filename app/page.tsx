'use client';

import { useImageUpload } from '@/hooks/useImageUpload';
import { ImageUploadForm, UploadError, UploadSuccess } from '@/components/ImageUpload';
import { t } from '@/lib/i18n';

export default function Home() {
  const {
    imageFile,
    imagePreview,
    uploadedImageUrl,
    isUploading,
    errorMessage,
    fileInputRef,
    handleImageChange,
    uploadImage,
    resetUpload,
  } = useImageUpload();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="animate-blob absolute -left-4 top-0 h-72 w-72 rounded-full bg-purple-500 opacity-20 blur-3xl" />
        <div className="animation-delay-2000 animate-blob absolute right-4 top-0 h-72 w-72 rounded-full bg-pink-500 opacity-20 blur-3xl" />
        <div className="animation-delay-4000 animate-blob absolute -bottom-8 left-20 h-72 w-72 rounded-full bg-blue-500 opacity-20 blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-4 shadow-2xl">
              <svg
                className="h-12 w-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <h1 className="mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-5xl font-extrabold leading-tight text-transparent">
            {t('imageUpload.title')}
          </h1>
          <p className="text-lg text-gray-300">{t('imageUpload.subtitle')}</p>
          </div>

        {/* Upload Card */}
        <div className="rounded-2xl border border-gray-700/50 bg-gray-800/90 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-white">
            <svg
              className="h-6 w-6 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {t('imageUpload.form.title')}
          </h2>

          <ImageUploadForm
            imagePreview={imagePreview}
            isUploading={isUploading}
            hasImageFile={!!imageFile}
            fileInputRef={fileInputRef}
            onImageChange={handleImageChange}
            onSubmit={uploadImage}
          />

          {errorMessage && <UploadError message={errorMessage} />}

          {uploadedImageUrl && <UploadSuccess imageUrl={uploadedImageUrl} onReset={resetUpload} />}
            </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="rounded-xl bg-gray-800/60 p-4 backdrop-blur-sm">
            <svg
              className="mx-auto mb-2 h-8 w-8 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
          >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
            <div className="text-xl font-bold text-purple-400">10MB</div>
            <div className="text-xs text-gray-400">Max Size</div>
          </div>
          <div className="rounded-xl bg-gray-800/60 p-4 backdrop-blur-sm">
            <svg
              className="mx-auto mb-2 h-8 w-8 text-pink-400"
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
            <div className="text-xl font-bold text-pink-400">Validated</div>
            <div className="text-xs text-gray-400">Type & Size</div>
            </div>
          <div className="rounded-xl bg-gray-800/60 p-4 backdrop-blur-sm">
            <svg
              className="mx-auto mb-2 h-8 w-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div className="text-xl font-bold text-red-400">Secure</div>
            <div className="text-xs text-gray-400">Protected</div>
          </div>
        </div>
      </div>
    </div>
  );
}
