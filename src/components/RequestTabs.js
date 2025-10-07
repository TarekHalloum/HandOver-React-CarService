import { useState } from 'react';
import '../styles/RequestTabs.css'; // Adjusted path based on styles/ location
import PendingRequests from './PendingRequests';
import AcceptedRequests from './AcceptedRequests';
import RejectedRequests from './RejectedRequests';

function RequestTabs() {
  const [activeTab, setActiveTab] = useState('pending');

  return (
    <div className="dashboard-tabs">
      {/* Tabs */}
      <div className="tab-buttons">
        <button
          className={activeTab === 'pending' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button
          className={activeTab === 'accepted' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('accepted')}
        >
          Accepted
        </button>
        <button
          className={activeTab === 'rejected' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('rejected')}
        >
          Rejected
        </button>
      </div>

      {/* Content */}
      <div className="tab-contents">
        {activeTab === 'pending' && (
          <div id="pending-tab">
            <PendingRequests />
          </div>
        )}
        {activeTab === 'accepted' && (
          <div id="accepted-tab">
            <AcceptedRequests />
          </div>
        )}
        {activeTab === 'rejected' && (
          <div id="rejected-tab">
            <RejectedRequests />
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestTabs;
