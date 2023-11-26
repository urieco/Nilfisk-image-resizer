function handleImage(file, newWidth) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
  
      img.onload = () => {
        const fileSize = (file.size / 1048576).toFixed(3);
        const extension = file.name
          .split(".")
          .pop()
          .toLowerCase();
        const dpi = img.dpi ? img.dpi.toFixed(2) : "N/a";
  
        resolve({
          name: file.name,
          src: img.src,
          width: img.width,
          height: img.height,
          fileSize: fileSize,
          extension: extension,
          dpi: dpi
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