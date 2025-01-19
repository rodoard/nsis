export function imageDataToDataUrl(imageData) {
  // Create a canvas
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  // Draw the ImageData on the canvas
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);

  // Get Base64 string
  const dataURL = canvas.toDataURL(); // Default is 'image/png'
  return dataUrl
}

export function dataUrlToImageData(dataURL) {
  // Create an Image object
  const img = new Image();
  img.src = dataURL;

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Draw the image on a canvas to extract ImageData
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Extract and return ImageData
      resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
    };

    img.onerror = (error) => {
      reject(error);
    };
  });
}
