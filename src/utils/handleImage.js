import imageCompression from "browser-image-compression";
import Compress from "compress.js";
import piexif from 'piexifjs'

async function handleImage(file, newWidth, maxSize) {
  if (!file.type.startsWith('image/')) return;
  if (file.size < 1048576) return;

  
  const options = {
    maxWidthOrHeight: newWidth,
    useWebWorker: true,
    preserveExif: true,
  }
  
  let compressedFile = await imageCompression(file, options);
  let blobURL;
  let resizedHeight;
  let resizedWidth;
  let outputSize;

  if (compressedFile.size > 1024576) {
    // compress.js only iterates over an array. 
    compressedFile = [compressedFile];
    const compress = new Compress();
    await compress.compress(compressedFile, {
      size: maxSize,
      quality: 0.95,
      resize: false,
    }).then((result) => {
      const outputImage = result[0];
      blobURL = outputImage.prefix + outputImage.data;
      resizedWidth = outputImage.endWidthInPx;
      resizedHeight = outputImage.endHeightInPx;
      outputSize = outputImage.endSizeInMb.toFixed(3);
    });
  } else {
    blobURL = URL.createObjectURL(compressedFile);
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      const exifObj = piexif.load(e.target.result);
      const exifStr = piexif.dump(exifObj);
      const blobURLWithMetadata = piexif.insert(exifStr, blobURL);
      
      img.onload = () => {
        const fileSize = (file.size / 1048576).toFixed(3);
        const [ , extension ] = file.type.split('/');
        
        const dpi = img.dpi ? img.dpi.toFixed(2) : 'N/A';
        
        resolve({
          name: file.name,
          src: img.src,
          width: img.width,
          height: img.height,
          fileSize: fileSize,
          extension: extension,
          dpi: dpi,
          resizedSrc: blobURLWithMetadata,
          resizedWidth: resizedWidth,
          resizedHeight: resizedHeight,
          outputSize: outputSize
        });
      }
    }

    reader.onerror = (err) => reject(err);

    reader.readAsDataURL(file);
  });
}

export default handleImage;