import React, { useState } from 'react';
import '../styles/ScanDetailModal.css';
import { Check, X } from 'lucide-react';

const ScanDetailModal = ({ isOpen, onClose, scan, onAccept, onReject }) => {
  const [rejectionReason, setRejectionReason] = useState(scan.rejectionReason || '');

  const handleAccept = () => {
    onAccept(scan.id);
    onClose();
  };

  const handleReject = () => {
    onReject(scan.id, rejectionReason);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="scan-modal">
        <div className="modal-header">
          <h2 className="modal-title">Scan Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="scan-grid">
          {/* Left */}
          <div className="info-column">
            <div className="card">
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> {scan.userName}</p>
              <p><strong>Contact:</strong> {scan.userContact}</p>
              <p><strong>Vehicle:</strong> {scan.carModel}</p>
              <p><strong>Request Date:</strong> {new Date(scan.dateRequested).toLocaleDateString('en-US')}</p>
            </div>

            <div className="card">
              <h3>Status</h3>
              {scan.status === 'pending' && <span className="badge pending">Pending</span>}
              {scan.status === 'accepted' && <span className="badge accepted">Accepted</span>}
              {scan.status === 'rejected' && <span className="badge rejected">Rejected</span>}
              {scan.status === 'rejected' && scan.rejectionReason && (
                <p className="reason">{scan.rejectionReason}</p>
              )}
            </div>

            {scan.status === 'pending' && (
              <div className="card">
                <h3>Actions</h3>
                <button onClick={handleAccept} className="btn btn-accept">
                  <Check size={16} className="icon" /> Accept Request
                </button>

                <textarea
                  placeholder="Reason for rejection (optional)"
                  className="reject-input"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={2}
                />
                <button onClick={handleReject} className="btn btn-reject">
                  <X size={16} className="icon" /> Reject Request
                </button>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="details-column">
            <div className="card">
              <h3>Damage Description</h3>
              <p>{scan.damageDescription}</p>
            </div>

            <div className="card">
              <h3>AI Analysis</h3>
              <ul>
                {scan.aiAnalysis?.map((item, idx) => (
                  <li key={idx}><span className="dot" /> {item}</li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h3>Vehicle Photos</h3>
              <div className="photo-grid">
                {scan.images?.map((img, idx) => (
                  <div key={idx} className="photo-wrapper">
                    <img src={img} alt={`Damage ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanDetailModal;
