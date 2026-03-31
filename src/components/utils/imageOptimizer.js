
export const compressImage = (file, maxWidth = 1200, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Fotoğraf çok büyükse oranını bozmadan küçült (Max Genişlik: 1200px)
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Fotoğrafı JPEG formatında ve belirlediğimiz kalitede (0.7 = %70) sıkıştırarak dışarı aktar
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Sıkıştırma hatası: Canvas boş.'));
              return;
            }
            // Blob'u tekrar File objesine çeviriyoruz ki Firebase kabul etsin
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};