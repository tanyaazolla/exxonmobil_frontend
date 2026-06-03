import React, { useState } from 'react';
import './Tracker.css';

// Sample ESD Library
const ESD_LIBRARY = [
  { id: 'esd-001', name: 'Premium Hull Paint', category: 'HULL', saving: 2.3, capex: 100000 },
  { id: 'esd-002', name: 'Hull Additives', category: 'HULL', saving: 1.5, capex: 50000 },
  { id: 'esd-003', name: 'Optimised Propeller', category: 'PROPULSION', saving: 4.2, capex: 250000 },
  { id: 'esd-004', name: 'Pre-Swirl Device', category: 'PROPULSION', saving: 3.3, capex: 150000 },
  { id: 'esd-005', name: 'Post-Swirl (PBC)', category: 'PROPULSION', saving: 2.8, capex: 180000 },
  { id: 'esd-006', name: 'Ultrasonic Propeller', category: 'PROPULSION', saving: 1.2, capex: 80000 },
  { id: 'esd-007', name: 'ME Power Optimisation', category: 'ENGINE', saving: 3.5, capex: 200000 },
  { id: 'esd-008', name: 'Trim Optimisation', category: 'OPERATIONS', saving: 2.1, capex: 50000 },
  { id: 'esd-009', name: 'Auto-pilot Upgrade', category: 'OPERATIONS', saving: 1.8, capex: 120000 },
  { id: 'esd-010', name: 'VFD', category: 'AUXILIARY', saving: 0.8, capex: 180000 },
  { id: 'esd-011', name: 'LED Lighting', category: 'AUXILIARY', saving: 0.9, capex: 80000 },
  { id: 'esd-012', name: 'Data Auto-logging', category: 'MONITORING', saving: 1.3, capex: 150000 },
];

// Sample vessel data
const SAMPLE_VESSELS = [
  {
    id: 'v001',
    month: 1,
    year: 2026,
    dockMonth: 3,
    owner: 'NYK Line',
    vesselName: 'MV Horizon Star',
    vesselType: 'Bulk Carrier',
    buildYear: 2009,
    flag: 'Panama',
    classificationSociety: 'ABS',
    imoNumber: '9876543',
    grossTonnage: 82000,
    deadWeight: 82000,
    sailingDays: 207,
    nonSteamingDays: 158,
    euPct: 10,
    euaCost: 70,
    costDO: 876,
    costLFO: 580,
    costHFO: 499,
    costLPGP: 0,
    costLPGB: 0,
    costLNG: 0,
    feumPenalty: 45000,
    ciiRating: 'D',
    selectedEsds: [],
  },
];

// Sample tracker data
// const SAMPLE_TRACKER = [
//   {
//     id: 't001',
//     vesselId: 'v001',
//     name: 'Air Lubrication System',
//     category: 'hull',
//     status: 'completed',
//     startDate: '2025-01-15',
//     endDate: '2025-03-20',
//     realisedSave: 8,
//     notes: 'Hull optimization completed',
//   },
//   {
//     id: 't002',
//     vesselId: 'v001',
//     name: 'Waste Heat Recovery Unit',
//     category: 'engine',
//     status: 'in_progress',
//     startDate: '2025-02-01',
//     endDate: null,
//     realisedSave: null,
//     notes: 'Installation in progress',
//   },
// ];

function Tracker({ userEmail, onLogout }) {
  const [activeTab, setActiveTab] = useState('vessels');
  const [vessels, setVessels] = useState(SAMPLE_VESSELS);
  // const [trackerData] = useState(SAMPLE_TRACKER);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [simulatingId, setSimulatingId] = useState(null);
  const [selectedEsds, setSelectedEsds] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    month: '',
    year: new Date().getFullYear(),
    dockMonth: '',
    owner: '',
    vesselName: '',
    vesselType: '',
    buildYear: '',
    flag: '',
    classificationSociety: '',
    imoNumber: '',
    grossTonnage: '',
    deadWeight: '',
    sailingDays: '',
    nonSteamingDays: '',
    euPct: '',
    euaCost: '',
    costDO: '',
    costLFO: '',
    costHFO: '',
    costLPGP: '',
    costLPGB: '',
    costLNG: '',
    feumPenalty: '',
    ciiRating: 'D',
  });

  const openOnboardModal = (vesselId = null) => {
    if (vesselId) {
      const vessel = vessels.find(v => v.id === vesselId);
      if (vessel) {
        setFormData(vessel);
        setEditingId(vesselId);
      }
    } else {
      setFormData({
        month: '',
        year: new Date().getFullYear(),
        dockMonth: '',
        owner: '',
        vesselName: '',
        vesselType: '',
        buildYear: '',
        flag: '',
        classificationSociety: '',
        imoNumber: '',
        grossTonnage: '',
        deadWeight: '',
        sailingDays: '',
        nonSteamingDays: '',
        euPct: '',
        euaCost: '',
        costDO: '',
        costLFO: '',
        costHFO: '',
        costLPGP: '',
        costLPGB: '',
        costLNG: '',
        feumPenalty: '',
        ciiRating: 'D',
      });
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveVessel = () => {
    if (!formData.vesselName || !formData.owner || !formData.imoNumber) {
      alert('Please fill in required fields');
      return;
    }

    if (editingId) {
      // Update existing
      setVessels(vessels.map(v => 
        v.id === editingId ? { ...formData, id: editingId } : v
      ));
    } else {
      // Add new
      const newVessel = {
        ...formData,
        id: 'v' + Date.now(),
        selectedEsds: []
      };
      setVessels([...vessels, newVessel]);
    }
    closeModal();
  };

  const deleteVessel = (vesselId) => {
    if (window.confirm('Are you sure you want to delete this vessel?')) {
      setVessels(vessels.filter(v => v.id !== vesselId));
    }
  };

  const openSimulator = (vesselId) => {
    setSimulatingId(vesselId);
    setActiveTab('simulator');
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  const getCategoryColor = (category) => {
    const colors = {
      HULL: '#1D9E75',
      ENGINE: '#D97706',
      PROPULSION: '#2C6FBF',
      OPERATIONS: '#8B5CF6',
      AUXILIARY: '#F59E0B',
      MONITORING: '#EC4899',
    };
    return colors[category] || '#9CA3AF';
  };

  const toggleEsd = (esdId) => {
    setSelectedEsds(prev => 
      prev.includes(esdId) 
        ? prev.filter(id => id !== esdId)
        : [...prev, esdId]
    );
  };

  const totalSaving = selectedEsds.reduce((sum, esdId) => {
    const esd = ESD_LIBRARY.find(e => e.id === esdId);
    return sum + (esd?.saving || 0);
  }, 0);

  const getSimulatingVessel = () => vessels.find(v => v.id === simulatingId);

  return (
    <div className="tracker-wrapper">
      {/* Navigation */}
      <nav className="nav">
        <a href="#" className="nav-brand">
          <span style={{ fontSize: '18px' }}></span>
          <span>Azolla ESD Platform</span>
          <span className="nav-badge">Decarbonisation Suite</span>
        </a>
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'vessels' ? 'on' : ''}`}
            onClick={() => setActiveTab('vessels')}
          >
            Vessels
          </button>
          {/* <button
            className={`nav-tab ${activeTab === 'tracker' ? 'on' : ''}`}
            onClick={() => setActiveTab('tracker')}
          >
            Tracker
          </button> */}
         
            <button
              className={`nav-tab ${activeTab === 'simulator' ? 'on' : ''}`}
              onClick={() => setActiveTab('simulator')}
            >
              ESD Simulator
            </button>
          
        </div>
        <div className="nav-right">
          <span className="user-email">{userEmail}</span>
          <button className="btn btn-secondary" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container">
        {/* ===== VESSELS PAGE ===== */}
        {activeTab === 'vessels' && (
          <div className="page-content">
            <div className="sec-hd">
              <div>
                <div className="sec-title">Vessel Fleet</div>
                <div className="sec-sub">Manage and track vessels onboarded to the platform</div>
              </div>
              <button className="btn btn-primary" onClick={() => openOnboardModal()}>
                + Onboard Vessel
              </button>
            </div>

            <div className="card">
              <div className="card-hd">
                <span className="card-title">Vessels ({vessels.length})</span>
              </div>
              <div className="card-body">
                {vessels.length === 0 ? (
                  <div className="empty-state">
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🚢</div>
                    No vessels onboarded yet
                    <br />
                    Click <strong>+ Onboard Vessel</strong> to get started
                  </div>
                ) : (
                  <table className="vessel-table">
                    <thead>
                      <tr>
                        <th>Vessel</th>
                        <th>Type</th>
                        <th>IMO</th>
                        <th>DWT</th>
                        <th>Annual Fuel</th>
                        <th>CII</th>
                        <th>FEUM Penalty</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vessels.map((vessel) => {
                        const ageYrs = new Date().getFullYear() - vessel.buildYear;
                        const annualFuel = (vessel.costDO || 0) + (vessel.costLFO || 0) + (vessel.costHFO || 0);
                        return (
                          <tr key={vessel.id}>
                            <td>
                              <div className="vessel-row-name">{vessel.vesselName}</div>
                              <div className="vessel-row-sub">
                                {vessel.owner} · {vessel.flag} · Built {vessel.buildYear} ({ageYrs}yr)
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-blue">{vessel.vesselType}</span>
                            </td>
                            <td className="mono">{vessel.imoNumber}</td>
                            <td>{formatNumber(vessel.deadWeight)} t</td>
                            <td>{formatNumber(annualFuel)} MT/yr</td>
                            <td>
                              <span
                                className="cii-rating"
                                style={{
                                  color: {
                                    A: '#059669',
                                    B: '#65A30D',
                                    C: '#D97706',
                                    D: '#DC2626',
                                    E: '#991B1B',
                                  }[vessel.ciiRating],
                                }}
                              >
                                {vessel.ciiRating}
                              </span>
                            </td>
                            <td style={{ color: '#DC2626' }}>
                              ${formatNumber(vessel.feumPenalty)}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button 
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => openOnboardModal(vessel.id)}
                                >
                                  ✏️ Edit
                                </button>
                                <button 
                                  className="btn btn-primary btn-sm"
                                  onClick={() => openSimulator(vessel.id)}
                                >
                                  ⚙️ Simulate
                                </button>
                                <button 
                                  className="btn btn-danger btn-sm"
                                  onClick={() => deleteVessel(vessel.id)}
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== TRACKER PAGE ===== */}
        {/* {activeTab === 'tracker' && (
          <div className="page-content">
            <div className="sec-hd">
              <div>
                <div className="sec-title">Installation Tracker</div>
                <div className="sec-sub">Track ESD installation progress across your fleet</div>
              </div>
            </div>

            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-label">Completed</div>
                <div className="kpi-value" style={{ color: '#1D9E75' }}>
                  {trackerData.filter((t) => t.status === 'completed').length}
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">In Progress</div>
                <div className="kpi-value" style={{ color: '#D97706' }}>
                  {trackerData.filter((t) => t.status === 'in_progress').length}
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">Planned</div>
                <div className="kpi-value" style={{ color: '#9CA3AF' }}>
                  {trackerData.filter((t) => t.status === 'planned').length}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {trackerData.map((entry) => (
                <div key={entry.id} className="card">
                  <div className="card-body">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', color: '#9CA3AF', fontFamily: 'monospace' }}>
                            {entry.id}
                          </span>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: `${entry.status === 'completed' ? '#1D9E75' : entry.status === 'in_progress' ? '#D97706' : '#9CA3AF'}18`,
                              color: entry.status === 'completed' ? '#1D9E75' : entry.status === 'in_progress' ? '#D97706' : '#9CA3AF',
                            }}
                          >
                            {entry.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#1A1A1A', marginBottom: '2px' }}>
                          {entry.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{entry.notes}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {entry.realisedSave ? (
                          <>
                            <div style={{ fontSize: '18px', fontWeight: '600', color: '#1D9E75' }}>
                              {entry.realisedSave}%
                            </div>
                            <div style={{ fontSize: '9px', color: '#9CA3AF' }}>realised saving</div>
                          </>
                        ) : (
                          <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Pending</div>
                        )}
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${entry.status === 'completed' ? 100 : entry.status === 'in_progress' ? 55 : 0}%`,
                          backgroundColor: entry.status === 'completed' ? '#1D9E75' : entry.status === 'in_progress' ? '#D97706' : '#9CA3AF',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* ===== SIMULATOR PAGE ===== */}
        {activeTab === 'simulator' && simulatingId && (
          <div className="page-content">
            <div className="sec-hd">
              <div>
                <div className="sec-title">ESD Simulator</div>
                <div className="sec-sub">Select a vessel and model energy-saving device combinations</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 260px', gap: '14px', alignItems: 'start' }}>
              {/* LEFT: ESD Library */}
              <div className="card" style={{ overflow: 'hidden' }}>
                <div className="card-hd"><span className="card-title">ESD Library</span></div>
                <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                  {ESD_LIBRARY.reduce((acc, esd) => {
                    const catIdx = acc.findIndex(g => g.category === esd.category);
                    if (catIdx === -1) {
                      acc.push({ category: esd.category, items: [esd] });
                    } else {
                      acc[catIdx].items.push(esd);
                    }
                    return acc;
                  }, []).map((group) => (
                    <div key={group.category} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <div style={{ padding: '8px 12px', fontWeight: '600', fontSize: '10px', color: getCategoryColor(group.category), backgroundColor: '#f9fafb' }}>
                        • {group.category}
                      </div>
                      {group.items.map((esd) => (
                        <label key={esd.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: '0.5px solid #E5E7EB', cursor: 'pointer', gap: '6px' }}>
                          <input
                            type="checkbox"
                            checked={selectedEsds.includes(esd.id)}
                            onChange={() => toggleEsd(esd.id)}
                          />
                          <div style={{ flex: 1, fontSize: '11px' }}>
                            <div style={{ fontWeight: '500' }}>{esd.name}</div>
                            <div style={{ fontSize: '9px', color: '#9CA3AF' }}>+{esd.saving}% · ${(esd.capex / 1000).toFixed(0)}K</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* CENTER: Ship + KPIs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="card">
                  <div style={{ padding: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                      {getSimulatingVessel()?.vesselName}
                    </div>
                    <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '12px' }}>
                      {selectedEsds.length} ESDs selected
                    </div>
                    <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: '8px', padding: '40px', textAlign: 'center', color: '#059669', fontSize: '12px' }}>
                      🚢 Ship Diagram (Visual Placeholder)
                      <br />
                      Selected ESDs shown on vessel
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: KPIs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="kpi-card">
                  <div className="kpi-label">Total Saving</div>
                  <div className="kpi-value" style={{ color: '#1D9E75' }}>{totalSaving.toFixed(1)}%</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Annual Value</div>
                  <div className="kpi-value" style={{ color: '#2C6FBF' }}>$0K</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-label">Total CAPEX</div>
                  <div className="kpi-value" style={{ color: '#D97706' }}>$0K</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== MODAL: Onboard Vessel ===== */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-hd">
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>
                  {editingId ? 'Edit Vessel' : 'Onboard New Vessel'}
                </div>
                <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                  Fill in the vessel details. Yellow-highlighted fields are required.
                </div>
              </div>
              <button className="btn btn-ghost" onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              {/* Analysis Period */}
              <div className="form-section">
                <div className="form-section-title">📅 Analysis Period</div>
                <div className="form-grid form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Analysis Month <span className="req">*</span></label>
                    <select
                      name="month"
                      value={formData.month}
                      onChange={handleFormChange}
                      className="form-input"
                      style={{ background: '#FFFBEB' }}
                    >
                      <option value="">Select month</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Analysis Year <span className="req">*</span></label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleFormChange}
                      className="form-input"
                      style={{ background: '#FFFBEB' }}
                      min="2020"
                      max="2040"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Docking Month <span className="req">*</span></label>
                    <select
                      name="dockMonth"
                      value={formData.dockMonth}
                      onChange={handleFormChange}
                      className="form-input"
                      style={{ background: '#FFFBEB' }}
                    >
                      <option value="">Select month</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <hr className="divider" />

              {/* Vessel Identification */}
              <div className="form-section">
                <div className="form-section-title">🏷️ Vessel Identification</div>
                <div className="form-grid form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Name of Owner <span className="req">*</span></label>
                    <input
                      type="text"
                      name="owner"
                      value={formData.owner}
                      onChange={handleFormChange}
                      placeholder="e.g. NYK Line"
                      className="form-input"
                      style={{ background: '#FFFBEB' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vessel Name <span className="req">*</span></label>
                    <input
                      type="text"
                      name="vesselName"
                      value={formData.vesselName}
                      onChange={handleFormChange}
                      placeholder="e.g. Tenjun"
                      className="form-input"
                      style={{ background: '#FFFBEB' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vessel Type <span className="req">*</span></label>
                    <select
                      name="vesselType"
                      value={formData.vesselType}
                      onChange={handleFormChange}
                      className="form-input"
                      style={{ background: '#FFFBEB' }}
                    >
                      <option value="">Select type</option>
                      <option>Tanker</option>
                      <option>Bulk Carrier</option>
                      <option>Container</option>
                      <option>General Cargo</option>
                      <option>LNG Carrier</option>
                      <option>RORO</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Build Year <span className="req">*</span></label>
                    <input
                      type="number"
                      name="buildYear"
                      value={formData.buildYear}
                      onChange={handleFormChange}
                      placeholder="2008"
                      className="form-input"
                      style={{ background: '#FFFBEB' }}
                      min="1960"
                      max="2030"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Flag <span className="req">*</span></label>
                    <input
                      type="text"
                      name="flag"
                      value={formData.flag}
                      onChange={handleFormChange}
                      placeholder="e.g. Panama"
                      className="form-input"
                      style={{ background: '#FFFBEB' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Classification Society <span className="req">*</span></label>
                    <select
                      name="classificationSociety"
                      value={formData.classificationSociety}
                      onChange={handleFormChange}
                      className="form-input"
                      style={{ background: '#FFFBEB' }}
                    >
                      <option value="">Select</option>
                      <option>ABS</option>
                      <option>DNV</option>
                      <option>Lloyds</option>
                      <option>BV</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">IMO Number <span className="req">*</span></label>
                    <input
                      type="text"
                      name="imoNumber"
                      value={formData.imoNumber}
                      onChange={handleFormChange}
                      placeholder="9343390"
                      className="form-input"
                      style={{ background: '#FFFBEB' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gross Tonnage (GT) <span className="req">*</span></label>
                    <input
                      type="number"
                      name="grossTonnage"
                      value={formData.grossTonnage}
                      onChange={handleFormChange}
                      placeholder="159927"
                      className="form-input"
                      style={{ background: '#FFFBEB' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dead Weight (DWT) <span className="req">*</span></label>
                    <input
                      type="number"
                      name="deadWeight"
                      value={formData.deadWeight}
                      onChange={handleFormChange}
                      placeholder="302107"
                      className="form-input"
                      style={{ background: '#FFFBEB' }}
                    />
                  </div>
                </div>
              </div>

              <hr className="divider" />

              {/* Vessel Condition Profile */}
              <div className="form-section">
                <div className="form-section-title">📊 Vessel Condition Profile</div>
                <div className="form-grid form-grid-4">
                  <div className="form-group">
                    <label className="form-label">Sailing Days/Year <span className="req">*</span></label>
                    <input
                      type="number"
                      name="sailingDays"
                      value={formData.sailingDays}
                      onChange={handleFormChange}
                      placeholder="207"
                      className="form-input"
                    />
                    <div className="form-hint">Total operating days at sea</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Non-steaming Days/Year <span className="req">*</span></label>
                    <input
                      type="number"
                      name="nonSteamingDays"
                      value={formData.nonSteamingDays}
                      onChange={handleFormChange}
                      placeholder="158"
                      className="form-input"
                    />
                    <div className="form-hint">At port / idle</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">% EU Voyages <span className="req">*</span></label>
                    <input
                      type="number"
                      name="euPct"
                      value={formData.euPct}
                      onChange={handleFormChange}
                      placeholder="10"
                      className="form-input"
                    />
                    <div className="form-hint">For ETS / EUA calculation</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cost of 1 EUA (USD) <span className="req">*</span></label>
                    <input
                      type="number"
                      name="euaCost"
                      value={formData.euaCost}
                      onChange={handleFormChange}
                      placeholder="70"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <hr className="divider" />

              {/* Fuel Particulars */}
              <div className="form-section">
                <div className="form-section-title">⛽ Fuel Particulars</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '12px' }}>
                  Enter costs for fuels used. Leave blank if not applicable.
                </div>
                <div className="form-grid form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Diesel/Gas Oil (USD/MT) <span className="req">*</span></label>
                    <input
                      type="number"
                      name="costDO"
                      value={formData.costDO}
                      onChange={handleFormChange}
                      placeholder="876"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">LFO (USD/MT) <span className="req">*</span></label>
                    <input
                      type="number"
                      name="costLFO"
                      value={formData.costLFO}
                      onChange={handleFormChange}
                      placeholder="580"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">HFO (USD/MT) <span className="req">*</span></label>
                    <input
                      type="number"
                      name="costHFO"
                      value={formData.costHFO}
                      onChange={handleFormChange}
                      placeholder="499"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">LPG Propane (USD/MT)</label>
                    <input
                      type="number"
                      name="costLPGP"
                      value={formData.costLPGP}
                      onChange={handleFormChange}
                      placeholder="—"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">LPG Butane (USD/MT)</label>
                    <input
                      type="number"
                      name="costLPGB"
                      value={formData.costLPGB}
                      onChange={handleFormChange}
                      placeholder="—"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">LNG (USD/MT)</label>
                    <input
                      type="number"
                      name="costLNG"
                      value={formData.costLNG}
                      onChange={handleFormChange}
                      placeholder="—"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <hr className="divider" />

              {/* FEUM Penalty */}
              <div className="form-section">
                <div className="form-section-title">⚠️ FEUM Penalty</div>
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label className="form-label">FEUM Penalty (USD/yr) <span className="req">*</span></label>
                    <input
                      type="number"
                      name="feumPenalty"
                      value={formData.feumPenalty}
                      onChange={handleFormChange}
                      placeholder="83828"
                      className="form-input"
                    />
                    <div className="form-hint">From FEUM Calculations sheet</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current CII Rating</label>
                    <select
                      name="ciiRating"
                      value={formData.ciiRating}
                      onChange={handleFormChange}
                      className="form-input"
                    >
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                      <option>D</option>
                      <option>E</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={saveVessel}>
                  ✓ Save Vessel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tracker;
