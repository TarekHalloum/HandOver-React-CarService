import React, { useState } from 'react';
import '../styles/PendingRequests.css';
import { FileSearch, Check, X } from 'lucide-react';

const PendingRequests = ({ requests, onAccept, onReject, onViewDetails }) => {
  const [rejectionReasons, setRejectionReasons] = useState({});

  const handleReject = (id) => {
    const reason = rejectionReasons[id] || "Request rejected without specific reason";
    onReject(id, reason);
  };

  const handleReasonChange = (id, reason) => {
    setRejectionReasons(prev => ({
      ...prev,
      [id]: reason
    }));
  };

  return (
    <div className="pending-requests-container">
      {requests.length > 0 ? (
        <div className="table-wrapper">
          <table className="pending-table">
            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>VEHICLE</th>
                <th>DATE</th>
                <th>DESCRIPTION</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <div className="customer-info">
                      <div className="avatar-circle">{request.userName.charAt(0)}</div>
                      <div>
                        <p className="customer-name">{request.userName}</p>
                        <p className="customer-contact">{request.userContact}</p>
                      </div>
                    </div>
                  </td>
                  <td>{request.carModel}</td>
                  <td>{new Date(request.dateRequested).toLocaleDateString('en-US')}</td>
                  <td className="truncate">{request.damageDescription}</td>
                  <td>
                    <div className="action-buttons">
                      <div className="top-buttons">
                        <button className="btn-outline" onClick={() => onViewDetails(request)}>
                          <FileSearch size={14} className="mr-1" /> Details
                        </button>
                        <button className="btn-accept" onClick={() => onAccept(request.id)}>
                          <Check size={14} className="mr-1" /> Accept
                        </button>
                      </div>
                      <div className="bottom-reject">
                        <input
                          type="text"
                          placeholder="Reason for rejection..."
                          className="reject-input"
                          value={rejectionReasons[request.id] || ''}
                          onChange={(e) => handleReasonChange(request.id, e.target.value)}
                        />
                        <button className="btn-reject" onClick={() => handleReject(request.id)}>
                          <X size={14} className="mr-1" /> Reject
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-requests">No pending requests</div>
      )}
    </div>
  );
};

export default PendingRequests;
