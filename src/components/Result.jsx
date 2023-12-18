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
          <div>Resolution: {image.width} x {image.height} px</div>
          <div>File Size: {image.fileSize} MB</div>
          <div>Extension: {image.extension}</div>
          <div>DPI: {image.dpi}</div>
          <div style={{textAlign: "center"}}>
            <div>----------------</div>
            <b>Output</b>
          </div>
          <div>
            <br />
            <img className="outputImage" src={image.resizedSrc} alt={image.name}/>
            <a href={image.resizedSrc} download={image.name}></a>
          </div>
          <div>New Resolution: {image.resizedWidth} x {image.resizedHeight} px</div>
          <div>New File Size: {image.outputSize} MB</div>
        </div>
      ))}
    </div>
  );
}

export default Result;