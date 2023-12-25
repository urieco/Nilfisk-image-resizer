import imageCompression from "browser-image-compression";
import Compress from "compress.js";
import piexif from "piexifjs";

async function handleImage(file, newWidth, maxSize) {
  try {
    if (!file.type.startsWith('image/')) return;
  
    const isPNG = file.type === 'image/png';
    
    let compressedFile; 
    let blobURL;
    let resizedHeight;
    let resizedWidth;
    let outputSize;

    const JPEGOptions = {
      maxWidthOrHeight: newWidth,
      preserveExif: true,
    }
    
    if (!isPNG) {
      compressedFile = await imageCompression(file, JPEGOptions);
      
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
        outputSize = (compressedFile.size / 1024576).toFixed(3);
        blobURL = await imageCompression.getDataUrlFromFile(compressedFile);
      }
    }

    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
  
        let blobURLWithMetadata;
        if (!isPNG) {
          const exifObj = piexif.load(e.target.result);
          const exifStr = piexif.dump(exifObj);
          blobURLWithMetadata = piexif.insert(exifStr, blobURL);
        } 
        
        img.onload = async () => {
          if (file.size <= 1048576 && img.width <= 3000) {
            resolve ({ isProcessed: false });
            return;
          }

          const fileSize = (file.size / 1048576).toFixed(3);
          const [ , extension ] = file.type.split('/');
          
          const dpi = img.dpi ? img.dpi.toFixed(2) : 'N/A';

          const isWidthLargerThan3000 = img.width > 3000;

          const PNGOptions = {
            maxWidthOrHeight: isWidthLargerThan3000 ? newWidth : undefined,
            preserveExif: true,
            maxSizeMB: maxSize,
            alwaysKeepResolution: isWidthLargerThan3000 ? false : true
          }

          if (isPNG) {
            compressedFile = await imageCompression(file, PNGOptions);
            blobURLWithMetadata = await imageCompression.getDataUrlFromFile(compressedFile);
            outputSize = (compressedFile.size / 1024576).toFixed(3);
            resizedWidth = isWidthLargerThan3000 ? 3000 : img.width;
            resizedHeight = isWidthLargerThan3000 ? 
            ((img.height / img.width) * 3000).toFixed(0) :
            img.height; 
          }
          
          resolve({
            name: file.name,
            src: img.src,
            width: img.width,
            height: img.height,
            fileSize: fileSize,
            extension: extension,
            dpi: dpi,
            resizedSrc: blobURLWithMetadata,
            resizedWidth: resizedWidth ? resizedWidth : 3000,
            resizedHeight: resizedHeight ? 
              resizedHeight : 
              ((img.height / img.width) * 3000).toFixed(0),
            outputSize: outputSize,
            isProcessed: true
          });
        }
      }
  
      reader.onerror = (err) => reject(err);
  
      reader.readAsDataURL(file);
    });
  } catch (err) {
    console.error(err);
  }
}

export default handleImage;