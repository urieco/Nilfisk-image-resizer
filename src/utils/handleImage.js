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
  let compressedImage;
  if (compressedFile.size > 1024576) {

    compressedFile = [compressedFile];
    const compress = new Compress();
    await compress.compress(compressedFile, {
      size: 1,
      quality: 0.9,
      resize: false,
    }).then((result) => {
      const img = result[0];
      const base64str = img.data;
      const imgExt = img.ext;
      compressedImage = Compress.convertBase64ToFile(base64str, imgExt);
      console.log(compressedImage);
    })
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
      const testURL = piexif.insert(exifStr, compressedImage);
      console.log(testURL);
      
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
          resizedSrc: blobURL,
        });
      }
    }

    reader.onerror = (err) => reject(err);

    reader.readAsDataURL(file);
  });
}

export default handleImage;