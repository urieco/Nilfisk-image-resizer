function downloadOutputImage() {
  const outputImages = document.querySelectorAll('.outputImage');

  outputImages.forEach((image) => {
    const link = document.createElement('a');

    link.href = image.src;
    const name = image.getAttribute('alt');

    link.setAttribute(
      'download', 
      name
    );

    link.style.display = 'none';

    document.body.appendChild(link);
  
    link.click();
  })
}

export default downloadOutputImage;