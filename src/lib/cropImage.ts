export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

const canvasToJpeg = (canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality));

/**
 * Crop `pixelCrop` out of the image and downscale so the longest side is at most `maxSize` px.
 * Keeps uploads small (a phone photo cropped at full resolution can be several MB).
 */
export async function cropAndResize(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  maxSize = 1600,
  quality = 0.86
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const scale = Math.min(1, maxSize / Math.max(pixelCrop.width, pixelCrop.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(pixelCrop.width * scale));
  canvas.height = Math.max(1, Math.round(pixelCrop.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, canvas.width, canvas.height);
  return canvasToJpeg(canvas, quality);
}

/** Downscale a whole image file (no crop) so its longest side is at most `maxSize` px. */
export async function resizeImageFile(file: File, maxSize = 1600, quality = 0.86): Promise<Blob | null> {
  const src = URL.createObjectURL(file);
  try {
    const image = await createImage(src);
    return await cropAndResize(src, { x: 0, y: 0, width: image.naturalWidth, height: image.naturalHeight }, maxSize, quality);
  } finally {
    URL.revokeObjectURL(src);
  }
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');

  if (!croppedCtx) {
    return null;
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // As a blob
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((file) => {
      resolve(file);
    }, 'image/jpeg');
  });
}
