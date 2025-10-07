import { useEffect, useState } from 'react';
import '../../styles/GarageDashboard.css';

function GarageDashboard() {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [fullName, setFullName] = useState('');
  const [brand, setBrand] = useState('');
  const [city, setCity] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRequests();
    fetchProfile();
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

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/repairer/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFullName(data.full_name || '');
      setBrand(data.brand || '');
      setCity(data.city || '');
    } catch (err) {
      console.error('Failed to fetch repairer profile:', err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleRespond = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/repair-requests/${id}/respond`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchRequests();
    } catch (err) {
      console.error('Failed to respond to request:', err);
    }
  };

const filteredRequests = requests
  .filter((r) =>
    r.userId?.email?.toLowerCase().includes(searchTerm) ||
    r.userId?.fullName?.toLowerCase().includes(searchTerm) ||
    r.scanId?.damagedParts?.join(', ').toLowerCase().includes(searchTerm)
  )
  .filter((r) => activeTab === r.status || searchTerm);


  return (
    <div className="garage-dashboard">
      <h2 className="dashboard-title">Welcome {fullName}</h2>
      <p className="dashboard-subtitle">{brand} — {city}</p>

      <form className="search-wrapper" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <button type="submit" className="search-icon-button">
          <img src="/assets/search.png" alt="Search" />
        </button>
      </form>

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
                <span className={`status-label ${req.status}`}>{req.status.toUpperCase()}</span>
              </div>

              <p><strong>Full Name:</strong> {req.userId.fullName}</p>
              <p><strong>Damaged Parts:</strong> {req.scanId?.damagedParts?.join(', ') || 'None'}</p>

              {expandedId === req._id && (
                <div className="request-details">
                  <p><strong>Email:</strong> {req.userId.email}</p>
                  <p><strong>Scan ID:</strong> {req.scanId?._id || 'N/A'}</p>
                  <p><strong>Date:</strong> {new Date(req.scanId?.scanDate).toLocaleString()}</p>
                </div>
              )}

              {req.status === 'pending' && (
                <div className="action-buttons">
                  <button className="btn-accept" onClick={() => handleRespond(req._id, 'accepted')}>Accept</button>
                  <button className="btn-reject" onClick={() => handleRespond(req._id, 'declined')}>Reject</button>
                </div>
              )}

              <div className="details-toggle-bottom-right">
                <button
                  className="toggle-details-btn"
                  onClick={() => setExpandedId(expandedId === req._id ? null : req._id)}
                >
                  <img
                    src={expandedId === req._id ? '/assets/less.png' : '/assets/details.png'}
                    alt="Toggle Details"
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GarageDashboard;
