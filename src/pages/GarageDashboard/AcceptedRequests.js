import React from 'react';
import './AcceptedRequests.css';
import { FileSearch, MessageSquare } from 'lucide-react';

const AcceptedRequests = ({ 
  requests,
  onViewDetails
}) => {
  return (
    <div className="accepted-requests-container">
      {requests.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="accepted-requests-table">
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
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="accepted-requests-avatar">
                        {request.userName.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontWeight: '500' }}>{request.userName}</p>
                        <p style={{ fontSize: '0.75rem', color: '#6c757d' }}>{request.userContact}</p>
                      </div>
                    </div>
                  </td>
                  <td>{request.carModel}</td>
                  <td>{new Date(request.dateRequested).toLocaleDateString('en-US')}</td>
                  <td style={{ maxWidth: '200px' }}>
                    <p className="truncate">{request.damageDescription}</p>
                  </td>
                  <td>
                    <div className="accepted-requests-actions">
                      <button
                        className="accepted-requests-button"
                        onClick={() => onViewDetails(request)}
                      >
                        <FileSearch size={14} style={{ marginRight: '5px' }} />
                        Details
                      </button>
                      <button className="accepted-requests-button">
                        <MessageSquare size={14} style={{ marginRight: '5px' }} />
                        Contact
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="accepted-requests-no-data">
          <p>No accepted requests</p>
        </div>
      )}
    </div>
  );
};

export default AcceptedRequests;
