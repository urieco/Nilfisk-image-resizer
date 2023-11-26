import { useState } from 'react';
import Result from './components/Result';

import './App.css';

import handleImage from './utils/handleImage';

function App() {
  const [ images, setImages ] = useState([
    { 
      name: 'Vacuum-VHS110-ATEX.jpg',
      src: '',
      width: 180,
      height: 320,
      fileSize: 0.031,
      extension: 'jpg',
      dpi: 'N/a',
    }
  ]);

  const handleDragOver = (e) => {
    e.preventDefault();
    document.getElementById('dropArea').classList.add('onDragOver');
  }
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    document.getElementById('dropArea').classList.remove('onDragOver');
  }

  const handleDrop = (e) => {
    e.preventDefault();
    console.log('File(s) dropped');
  
    document.getElementById('dropArea').classList.remove('onDragOver');
  
    if (e.dataTransfer.items) {
      const droppedFiles = [...e.dataTransfer.items]
        .filter((item) => item.kind === 'file')
        .map((item) => item.getAsFile());
  
      for (const file of droppedFiles) {
        handleImage(file, 3000);
      }
    }
  }

  const handleInputChange = async (e) => {
    try {
      const input = e.target;
      
      if (!input.files || input.files.length < 1) return;
  
      const result = [];
  
      for (const file of input.files) {
        const imageDetails = await handleImage(file, 3000);
        result.push(imageDetails);
      }
  
      setImages((prev) => [...prev, ...result]);
    } catch(error) {
      console.error(error);
    }
  }

  return (
    <div>
      <label
        id="dropArea"
        htmlFor="imageInput"
        onDragOver={(e) => handleDragOver(e)}
        onDragLeave={(e) => handleDragLeave(e)}
        onDrop={(e) => handleDrop(e)}
      >
        <p>Drag & Drop Images Here</p>
        <input
          type="file"
          name="imageInput"
          id="imageInput"
          accept="image/*"
          onChange={(e) => handleInputChange(e)}
          multiple
        />
      </label>
      <Result images={images}/>
    </div>
  )
}

export default App
