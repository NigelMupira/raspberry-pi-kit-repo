import { useState, useEffect } from 'react';
import CreateLoanModal from './Modals/CreateLoanModal';
import { loanAPI, kitAPI, studentAPI } from '../services';

const LoanManagement = () => {
  const [loans, setLoans] = useState([]);
  const [kits, setKits] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [returnModal, setReturnModal] = useState(null);
  const [returnData, setReturnData] = useState({
    conditionReturned: 'Excellent',
    componentsReturned: []
  });

  // Load data from API
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [loansData, kitsData, studentsData] = await Promise.all([
        loanAPI.getAll(),
        kitAPI.getAll(),
        studentAPI.getAll()
      ]);
      
      setLoans(loansData);
      setKits(kitsData);
      setStudents(studentsData);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLoan = async (loanData) => {
    try {
      await loanAPI.create(loanData);
      // Reload data to get updated kit statuses
      await loadAllData();
      setShowLoanForm(false);
    } catch (err) {
      setError('Failed to create loan. Please try again.');
      console.error('Error creating loan:', err);
    }
  };

  const handleReturnKit = (loanId) => {
    setReturnModal(loanId);
    const loan = loans.find(l => l.id === loanId);
    const kit = kits.find(k => k.id === loan.kitId);
    
    setReturnData({
      conditionReturned: loan.conditionBorrowed,
      componentsReturned: kit ? kit.components.map(c => c.id) : []
    });
  };

  const confirmReturn = async () => {
    try {
      await loanAPI.return(returnModal, returnData);
      // Reload data to get updated information
      await loadAllData();
      setReturnModal(null);
      setReturnData({
        conditionReturned: 'Excellent',
        componentsReturned: []
      });
    } catch (err) {
      setError('Failed to return kit. Please try again.');
      console.error('Error returning kit:', err);
    }
  };

  const toggleComponentReturn = (componentId) => {
    if (returnData.componentsReturned.includes(componentId)) {
      setReturnData({
        ...returnData,
        componentsReturned: returnData.componentsReturned.filter(id => id !== componentId)
      });
    } else {
      setReturnData({
        ...returnData,
        componentsReturned: [...returnData.componentsReturned, componentId]
      });
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '-';
    const date = new Date(dateTimeStr.replace(' ', 'T'));
    return date.toLocaleString();
  };

  const getStatusBadge = (loan) => {
    if (loan.returned) {
      return <span className="badge bg-success">Returned</span>;
    } else {
      const dueDate = new Date(loan.due.replace(' ', 'T'));
      const now = new Date();
      if (dueDate < now) {
        return <span className="badge bg-danger">Overdue</span>;
      } else {
        return <span className="badge bg-warning">Active</span>;
      }
    }
  };

  const activeLoans = loans.filter(loan => !loan.returned);
  const completedLoans = loans.filter(loan => loan.returned);

  if (loading) return <div className="text-center py-5">Loading data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Loan Management</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowLoanForm(true)}
          disabled={kits.filter(kit => kit.status === 'Available').length === 0}
        >
          Create New Loan
        </button>
      </div>

      <ul className="nav nav-tabs mb-4" id="loanTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button 
            className="nav-link active" 
            id="active-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#active" 
            type="button" 
            role="tab"
          >
            Active Loans <span className="badge bg-warning ms-1">{activeLoans.length}</span>
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button 
            className="nav-link" 
            id="completed-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#completed" 
            type="button" 
            role="tab"
          >
            Loan History <span className="badge bg-secondary ms-1">{completedLoans.length}</span>
          </button>
        </li>
      </ul>

      <div className="tab-content" id="loanTabsContent">
        {/* Active Loans Tab */}
        <div className="tab-pane fade show active" id="active" role="tabpanel">
          {activeLoans.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Loan ID</th>
                    <th>Kit</th>
                    <th>Student</th>
                    <th>Borrowed Date</th>
                    <th>Due Date</th>
                    <th>Condition</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeLoans.map(loan => {
                    const kit = kits.find(k => k.id === loan.kitId);
                    const student = students.find(s => s.id === loan.studentId);
                    return (
                      <tr key={loan.id}>
                        <td><strong>#{loan.id}</strong></td>
                        <td>{kit ? kit.name : 'Unknown Kit'}</td>
                        <td>
                          {student ? student.name : 'Unknown Student'}
                          <div className="text-muted small">{student ? student.studentId : ''}</div>
                        </td>
                        <td>{formatDateTime(loan.borrowed)}</td>
                        <td>{formatDateTime(loan.due)}</td>
                        <td>
                          <span className={`condition-${loan.conditionBorrowed.toLowerCase()}`}>
                            {loan.conditionBorrowed}
                          </span>
                        </td>
                        <td>{getStatusBadge(loan)}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => handleReturnKit(loan.id)}
                          >
                            Return Kit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              No active loans. <strong>Create a new loan</strong> to get started.
            </div>
          )}
        </div>

        {/* Completed Loans Tab */}
        <div className="tab-pane fade" id="completed" role="tabpanel">
          {completedLoans.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Loan ID</th>
                    <th>Kit</th>
                    <th>Student</th>
                    <th>Borrowed Date</th>
                    <th>Returned Date</th>
                    <th>Condition</th>
                    <th>Components</th>
                  </tr>
                </thead>
                <tbody>
                  {completedLoans.map(loan => {
                    const kit = kits.find(k => k.id === loan.kitId);
                    const student = students.find(s => s.id === loan.studentId);
                    const allComponentsReturned = loan.componentsIncluded.length === loan.componentsReturned.length;
                    
                    return (
                      <tr key={loan.id}>
                        <td><strong>#{loan.id}</strong></td>
                        <td>{kit ? kit.name : 'Unknown Kit'}</td>
                        <td>
                          {student ? student.name : 'Unknown Student'}
                          <div className="text-muted small">{student ? student.studentId : ''}</div>
                        </td>
                        <td>{formatDateTime(loan.borrowed)}</td>
                        <td>{formatDateTime(loan.returned)}</td>
                        <td>
                          <div>Borrowed: 
                            <span className={`condition-${loan.conditionBorrowed.toLowerCase()}`}>
                              {loan.conditionBorrowed}
                            </span>
                          </div>
                          <div>Returned: 
                            <span className={`condition-${loan.conditionReturned.toLowerCase()}`}>
                              {loan.conditionReturned}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={allComponentsReturned ? "text-success" : "text-danger"}>
                            {loan.componentsReturned.length}/{loan.componentsIncluded.length} components returned
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              No loan history yet.
            </div>
          )}
        </div>
      </div>
      
      <CreateLoanModal
        show={showLoanForm}
        onClose={() => setShowLoanForm(false)}
        onCreate={handleCreateLoan}
        kits={kits}
        students={students}
      />
      
      {/* Return Kit Modal */}
      {returnModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Return Kit</h5>
                <button type="button" className="btn-close" onClick={() => setReturnModal(null)}></button>
              </div>
              <div className="modal-body">
                {(() => {
                  const loan = loans.find(l => l.id === returnModal);
                  const kit = kits.find(k => k.id === loan.kitId);
                  const student = students.find(s => s.id === loan.studentId);
                  
                  return (
                    <>
                      <div className="row mb-4">
                        <div className="col-md-6">
                          <h6>Kit Information</h6>
                          <p><strong>{kit ? kit.name : 'Unknown Kit'}</strong></p>
                          <p>Borrowed: {formatDateTime(loan.borrowed)}</p>
                          <p>Due: {formatDateTime(loan.due)}</p>
                        </div>
                        <div className="col-md-6">
                          <h6>Student Information</h6>
                          <p><strong>{student ? student.name : 'Unknown Student'}</strong></p>
                          <p>{student ? student.studentId : ''}</p>
                          <p>{student ? student.program : ''}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Condition at Return *</label>
                        <select 
                          className="form-select"
                          value={returnData.conditionReturned}
                          onChange={(e) => setReturnData({...returnData, conditionReturned: e.target.value})}
                          required
                        >
                          <option value="Excellent">Excellent</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                          <option value="Poor">Poor</option>
                        </select>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Components Returned</label>
                        <p className="text-muted small">Check all components that are being returned:</p>
                        
                        {kit && kit.components.map(component => (
                          <div key={component.id} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={returnData.componentsReturned.includes(component.id)}
                              onChange={() => toggleComponentReturn(component.id)}
                              id={`component-${component.id}`}
                            />
                            <label className="form-check-label" htmlFor={`component-${component.id}`}>
                              {component.name} (Qty: {component.quantity})
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setReturnModal(null)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={confirmReturn}>
                  Confirm Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanManagement;