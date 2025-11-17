import { useState, useCallback, useRef } from 'react';
import { t } from '@/lib/i18n';

interface UploadResponse {
  success: boolean;
  imagePath?: string;
  error?: string;
}

interface UseImageUploadReturn {
  imageFile: File | null;
  imagePreview: string | null;
  uploadedImageUrl: string | null;
  isUploading: boolean;
  errorMessage: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadImage: (e: React.FormEvent) => Promise<void>;
  resetUpload: () => void;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setErrorMessage(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const uploadImage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!imageFile) return;

      setIsUploading(true);
      setErrorMessage(null);

      try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        const data: UploadResponse = await response.json();

        if (response.ok && data.success) {
          setUploadedImageUrl(data.imagePath || null);
        } else {
          setErrorMessage(data.error || t('imageUpload.error.generic'));
        }
      } catch (error) {
        console.error('Upload error:', error);
        setErrorMessage(t('imageUpload.error.network'));
      } finally {
        setIsUploading(false);
      }
    },
    [imageFile]
  );

  const resetUpload = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
    setErrorMessage(null);
    setIsUploading(false);

    // Reset file input using ref
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return {
    imageFile,
    imagePreview,
    uploadedImageUrl,
    isUploading,
    errorMessage,
    fileInputRef,
    handleImageChange,
    uploadImage,
    resetUpload,
  };
};
