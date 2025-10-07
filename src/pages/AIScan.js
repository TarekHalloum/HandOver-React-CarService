import { useState } from 'react';
import '../styles/AIScan.css';

function AIScan() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [resultImage, setResultImage] = useState(null);
  const [brand, setBrand] = useState('');
  const [damagedParts, setDamagedParts] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage('');
      setResultImage(null);
      setBrand('');
      setDamagedParts([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert('Please select an image.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      // Step 1: Upload image to Flask
      const flaskResponse = await fetch('http://localhost:8000/scan', {
        method: 'POST',
        body: formData,
      });

      const flaskData = await flaskResponse.json();

      if (flaskResponse.ok) {
        const resultUrl = flaskData.result_url;
        setResultImage(resultUrl);
        setBrand(flaskData.brand || '');
        setDamagedParts(flaskData.damaged_parts || []);
        setMessage('Scan completed and saved.');

        // Step 2: Send result image and metadata to Node.js
        await fetch('http://localhost:5000/api/scan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            imageUrl: resultUrl,
            brand: flaskData.brand || '',
            damagedParts: flaskData.damaged_parts || [],
          }),
        });
      } else {
        setMessage(`Flask Error: ${flaskData.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong.');
    }
  };

  return (
    <div className="ai-scan-page">
      <div className="form-container">
        <h2>Scan Your Vehicle</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImageChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Upload and Scan
          </button>
        </form>

        {previewUrl && (
          <div className="image-preview-container">
            <h5>Selected Image Preview:</h5>
            <img src={previewUrl} alt="Selected" />
          </div>
        )}

        {message && (
          <div className="mt-3">
            <strong>{message}</strong>
          </div>
        )}

        {resultImage && (
          <div className="image-preview-container mt-4">
            <h5>Detection Result:</h5>
            <img src={resultImage} alt="Detection Result" />
            {brand && <p><strong>Brand:</strong> {brand}</p>}
            {damagedParts.length > 0 && (
              <p><strong>Parts to Replace:</strong> {damagedParts.join(', ')}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AIScan;
