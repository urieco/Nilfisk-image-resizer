import idGenerator from "../utils/keyIdGenerator";

function Result({ images }) {

  return (
    <div id="result">
      {images.map((image) => (
        <div 
          key={idGenerator(3)}
          className="imageInfoContainer"
        >
          <img
            className="imageDisplay"
            src={image.src}
            alt={image.name}
          />
          <div>Name: {image.name}</div>
          <div>Resolution: {image.width} x {image.height} pixels</div>
          <div>File Size: {image.fileSize} MB</div>
          <div>Extension: {image.extension}</div>
          <div>DPI: {image.dpi}</div>
        </div>
      ))}
    </div>
  );
}

export default Result;