import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MyScans.css';
import { AuthContext } from '../contexts/AuthContext';

function MyScans() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scans, setScans] = useState([]);
  const [allScans, setAllScans] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [selectedScanId, setSelectedScanId] = useState(null);
  const [matchingRepairers, setMatchingRepairers] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [successMessages, setSuccessMessages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterDate, setSelectedFilterDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchScans(token);
      fetchRepairRequests(token);
    }
  }, []);

const fetchScans = async (token) => {
  try {
    const response = await fetch('http://localhost:5000/api/scan', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const text = await response.text(); // Get raw response
    console.log('RAW scan response:', text);

    const data = JSON.parse(text); // Parse it manually
    console.log('Parsed scan data:', data);

    if (Array.isArray(data)) {
      setScans(data);
      setAllScans(data);
    } else {
      console.error('Scan data is not an array:', data);
      setError('Unexpected scan data format received.');
    }
  } catch (error) {
    console.error('Error fetching scans:', error);
    setError('Failed to fetch scans. Please try again later.');
  }
};


  const fetchRepairRequests = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/repair-requests/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching repair requests:', error);
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString();
  };

  const fetchRepairersForBrand = async (brand, scanId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/repairers?brand=${brand}`);
      const data = await response.json();
      setMatchingRepairers(data);
      setSelectedScanId(scanId);
      setSelectedCity('');
    } catch (error) {
      console.error('Error fetching repairers:', error);
    }
  };

  const submitRepairRequest = async (repairerId, scanId, repairerName) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/repair-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ repairerId, scanId }),
      });

      if (response.ok) {
        setSuccessMessages(prev => ({
          ...prev,
          [`${scanId}_${repairerId}`]: `✅ Repair request sent successfully to ${repairerName}.`
        }));
        fetchRepairRequests(token);
      } else {
        alert('Failed to send repair request.');
      }
    } catch (error) {
      console.error('Error sending repair request:', error);
    }
  };

  // 🔍 Filter on search term and date
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = allScans.filter(scan => {
      const matchesSearch =
        (!term || (scan.brand && scan.brand.toLowerCase().includes(term))) ||
        (scan.damagedParts && scan.damagedParts.join(', ').toLowerCase().includes(term));

      const matchesDate =
        !selectedFilterDate || scan.scanDate?.startsWith(selectedFilterDate);

      return matchesSearch && matchesDate;
    });

    setScans(filtered);
  }, [searchTerm, selectedFilterDate, allScans]);

  if (!isLoggedIn) {
    return (
      <div className="my-scans-page">
        <div className="form-container">
          <h2>My Scans</h2>
          <p>You must <span className="login-link" onClick={() => navigate('/login')}>log in</span> to view your scan history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-scans-page">
      <div className="form-container">
        <h2>My Scans</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* 🔎 Search + Date Filter */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="form-control"
              placeholder="Search by brand or part..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-icon-button">
              <img src="/assets/search.png" alt="Search" />
            </button>
          </div>

          <div className="filter-controls">
            <input
              type="date"
              className="form-control"
              value={selectedFilterDate}
              onChange={(e) => setSelectedFilterDate(e.target.value)}
            />
          </div>

          <div className="reset-text">
            Not seeing all scans?
            <button className="reset-button" onClick={() => {
              setScans(allScans);
              setSearchTerm('');
              setSelectedFilterDate('');
            }}>
              <img src="/assets/reset.png" alt="Reset" /> Reset
            </button>
          </div>
        </div>

        {/* 🔧 Scans List */}
        {scans.length > 0 ? (
          <ul className="scan-list">
            {scans.map((scan, index) => {
              const scanRequests = requests.filter((r) => r.scanId === scan._id);
              const cities = [...new Set(matchingRepairers.map(r => r.city))];

              return (
                <li key={index} className="scan-card">
                  {scan.imageUrl && (
                    <img src={scan.imageUrl} alt={`Scan ${index}`} className="scan-image" />
                  )}
                  <p><strong>Date:</strong> {formatDate(scan.scanDate)}</p>
                  {scan.brand && <p><strong>Brand:</strong> {scan.brand}</p>}
                  {scan.damagedParts?.length > 0 && (
                    <p><strong>Parts to Replace:</strong> {scan.damagedParts.join(', ')}</p>
                  )}

                  {scanRequests.length > 0 && (
                    <div>
                      <strong>Repair Request Status:</strong>
                      <ul className="mt-2 mb-2">
                        {scanRequests.map((req) => (
                          <li key={req._id}>
                            Sent to {req.repairerName || 'Repairer'} – Status: {req.status}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {scan.brand && (
                    <div className="repairer-actions">
                      <button
                        className="find-repairer-btn btn btn-outline-dark"
                        onClick={() => fetchRepairersForBrand(scan.brand, scan._id)}
                        disabled={selectedScanId && selectedScanId !== scan._id}
                      >
                        Find Repairer
                      </button>

                      {selectedScanId === scan._id && matchingRepairers.length > 0 && (
                        <div className="repairer-list mt-3">
                          <p><strong>Select a Repairer:</strong></p>

                          {cities.length > 1 && (
                            <div className="mb-3">
                              <select
                                className="form-select"
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                              >
                                <option value="">All Locations</option>
                                {cities.map(city => (
                                  <option key={city} value={city}>{city}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          <ul className="list-unstyled">
                            {matchingRepairers
                              .filter(r => !selectedCity || r.city === selectedCity)
                              .map((r) => {
                                const messageKey = `${scan._id}_${r._id}`;
                                return (
                                  <li
                                    key={r._id}
                                    className="repairer-option d-flex justify-content-between align-items-center mb-2"
                                  >
                                    <span className="repairer-name">
                                      <i className="fas fa-map-marker-alt me-2"></i> {r.full_name} ({r.city})
                                    </span>
                                    <div className="text-end">
                                      <button
                                        className="btn btn-sm btn-outline-primary mb-1"
                                        onClick={() => submitRepairRequest(r._id, scan._id, r.full_name)}
                                      >
                                        Choose
                                      </button>
                                      {successMessages[messageKey] && (
                                        <div className="text-success small mt-1">
                                          {successMessages[messageKey]}
                                        </div>
                                      )}
                                    </div>
                                  </li>
                                );
                              })}
                          </ul>

                          <button
                            className="btn btn-secondary mt-2"
                            onClick={() => setSelectedScanId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No scans found.</p>
        )}
      </div>
    </div>
  );
}

export default MyScans;
