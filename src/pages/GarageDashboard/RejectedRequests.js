import React from 'react';
import '../styles/RejectedRequests.css';
import { FileSearch } from "lucide-react";

const RejectedRequests = ({ requests, onViewDetails }) => {
  return (
    <div className="rejected-requests-container">
      {requests.length > 0 ? (
        <div className="table-wrapper">
          <table className="rejected-table">
            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>VEHICLE</th>
                <th>DATE</th>
                <th>REJECTION REASON</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <div className="customer-info">
                      <div className="avatar-circle">
                        {request.userName.charAt(0)}
                      </div>
                      <div className="customer-details">
                        <p className="customer-name">{request.userName}</p>
                        <p className="customer-contact">{request.userContact}</p>
                      </div>
                    </div>
                  </td>
                  <td>{request.carModel}</td>
                  <td>{new Date(request.dateRequested).toLocaleDateString('en-US')}</td>
                  <td>{request.rejectionReason || "No reason provided"}</td>
                  <td>
                    <button className="details-button" onClick={() => onViewDetails(request)}>
                      <FileSearch size={14} className="icon" />
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-requests">No rejected requests</div>
      )}
    </div>
  );
};

export default RejectedRequests;
