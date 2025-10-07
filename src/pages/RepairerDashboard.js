import { useEffect, useState } from 'react';
import '../../styles/GarageDashboard.css';

function GarageDashboard() {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [activeTab, setActiveTab] = useState('pending');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/repair-requests/repairer', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch repairer requests:', err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleRespond = async (id, status) => {
    const reason = rejectionReasons[id] || '';
    try {
      await fetch(`http://localhost:5000/api/repair-requests/${id}/respond`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, reason })
      });
      fetchRequests();
    } catch (err) {
      console.error('Failed to respond to request:', err);
    }
  };

  const filteredRequests = requests
    .filter((r) =>
      r.userId?.email?.toLowerCase().includes(searchTerm)
    )
    .filter((r) => activeTab === r.status || searchTerm); // show all matches if searching

  return (
    <div className="garage-dashboard">
      <h2 className="dashboard-title">Garage Dashboard</h2>

      <input
        type="text"
        placeholder="Search by user email"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      <div className="tab-buttons">
        {['pending', 'accepted', 'declined'].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'selected' : ''}`}
            onClick={() => {
              setActiveTab(tab);
              setSearchTerm('');
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="request-list">
        {filteredRequests.length === 0 ? (
          <p className="empty-message">No matching requests found.</p>
        ) : (
          filteredRequests.map((req) => (
            <div key={req._id} className="request-card">
              <div className="request-header">
                <span className="user-email">{req.userId.email}</span>
                <span className={`status-label ${req.status}`}>
                  {req.status.toUpperCase()}
                </span>
              </div>

              <p><strong>Scan ID:</strong> {req.scanId?._id || 'N/A'}</p>

              {req.status === 'declined' && req.rejectionReason && (
                <p><strong>Reason:</strong> {req.rejectionReason}</p>
              )}

              {req.status === 'pending' && (
                <div className="action-buttons">
                  <button
                    className="btn-accept"
                    onClick={() => handleRespond(req._id, 'accepted')}
                  >
                    Accept
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleRespond(req._id, 'declined')}
                  >
                    Reject
                  </button>
                  <input
                    type="text"
                    placeholder="Rejection reason"
                    className="rejection-input"
                    value={rejectionReasons[req._id] || ''}
                    onChange={(e) =>
                      setRejectionReasons({ ...rejectionReasons, [req._id]: e.target.value })
                    }
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GarageDashboard;
