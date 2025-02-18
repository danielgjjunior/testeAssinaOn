import { Area } from "react-easy-crop";

// cropImageHelper.ts
export const getCroppedImg = async (imageSrc: string, crop: Area): Promise<Blob | null> => {
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve) => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx?.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => resolve(blob), 'image/jpeg');
    };
  });
};
