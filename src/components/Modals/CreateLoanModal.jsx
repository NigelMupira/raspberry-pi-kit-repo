import { useState, useEffect } from 'react';

const CreateLoanModal = ({ show, onClose, onCreate, kits, students }) => {
  const [loanData, setLoanData] = useState({
    kitId: '',
    studentId: '',
    due: '',
    conditionBorrowed: 'Excellent'
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      setLoanData({
        kitId: '',
        studentId: '',
        due: '',
        conditionBorrowed: 'Excellent'
      });
    }
  }, [show]);

  const availableKits = kits.filter(kit => kit.status === 'Available');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate due date if not set (default 7 days from now)
    let dueDate = loanData.due;
    if (!dueDate) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      dueDate = nextWeek.toISOString().slice(0, 16);
    }
    
    onCreate({
      ...loanData,
      due: dueDate
    });
    
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Loan</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Select Kit *</label>
                <select 
                  className="form-select"
                  value={loanData.kitId}
                  onChange={(e) => setLoanData({...loanData, kitId: e.target.value})}
                  required
                >
                  <option value="">Choose a kit</option>
                  {availableKits.map(kit => (
                    <option key={kit.id} value={kit.id}>
                      {kit.name} ({kit.condition})
                    </option>
                  ))}
                </select>
                <div className="form-text">
                  {availableKits.length === 0 ? 
                    "No kits available for loan" : 
                    `${availableKits.length} kit(s) available`
                  }
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Select Student *</label>
                <select 
                  className="form-select"
                  value={loanData.studentId}
                  onChange={(e) => setLoanData({...loanData, studentId: e.target.value})}
                  required
                >
                  <option value="">Choose a student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.studentId}) - {student.program}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Due Date & Time *</label>
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  value={loanData.due}
                  onChange={(e) => setLoanData({...loanData, due: e.target.value})}
                  min={new Date().toISOString().slice(0, 16)}
                  required 
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Condition at Borrowing</label>
                <select 
                  className="form-select"
                  value={loanData.conditionBorrowed}
                  onChange={(e) => setLoanData({...loanData, conditionBorrowed: e.target.value})}
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
                <div className="form-text">
                  Record the condition of the kit when borrowed
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={availableKits.length === 0}
              >
                Create Loan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLoanModal;