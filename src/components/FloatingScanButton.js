import { Link } from 'react-router-dom';
import '../styles/FloatingScanButton.css';

function FloatingScanButton() {
  return (
    <div className="floating-scan-button">
      <Link to="/ai-scan">
        <img src="/assets/scan.png" alt="Scan" className="scan-icon" />
      </Link>
    </div>
  );
}

export default FloatingScanButton;
