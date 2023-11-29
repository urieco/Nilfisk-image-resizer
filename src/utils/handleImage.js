import recursiveCompressor from './recursiveCompressor';

function handleImage(file, newWidth) {

  return new Promise((resolve, reject) => {
    const fileSize = (file.size / 1048576).toFixed(3);
    const [ , extension ] = file.type.split('/');

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      
      img.onload = async () => {

        if (img.width <= newWidth && img.size < 1048576) return;
        
        const dpi = img.dpi ? img.dpi.toFixed(2) : "N/a";

        const blobURL = recursiveCompressor(
          file,
          newWidth,
          file.size,
          0.95
        );

        resolve({
          name: file.name,
          src: img.src,
          width: img.width,
          height: img.height,
          fileSize: fileSize,
          extension: extension,
          dpi: dpi,
          resizedSrc: blobURL,
        });
      }
    }

    reader.onerror = (error) => {
      reject(error);
    };
  
    reader.readAsDataURL(file);
  });
}

export default handleImage;