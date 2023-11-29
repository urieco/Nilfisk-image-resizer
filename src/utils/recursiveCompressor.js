import Compressor from "compressorjs";

function recursiveCompressor(prevBlob, width, prevSize, prevCompressionRate) {
  return new Promise((resolve, reject) => {
    let iteration = 1;
    let currentBlob = prevBlob;
    let currentSize = prevSize;
    let currentCompressionRate = prevCompressionRate;
    
    do {
      console.log(currentBlob, URL.createObjectURL(currentBlob), currentSize, currentCompressionRate, iteration);
      if (iteration === 20) break;
      new Compressor(currentBlob, {
        retainExif: true,
        width: width,
        // 'image/gif'
        convertTypes: ['image/png', 'image/jpg'],
        quality: currentCompressionRate,
        success(result) {
          iteration++;
          currentBlob = result;
          const increasedRate = (1 - currentCompressionRate)/2;
          currentCompressionRate -= increasedRate;
          currentSize = result.size;
        },
        error(err) {
          reject(err);
        }
      })
    } while (currentSize > 1048576);

    resolve(URL.createObjectURL(currentBlob));
  });
}

export default recursiveCompressor;