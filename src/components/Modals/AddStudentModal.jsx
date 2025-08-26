import { useState, useEffect } from 'react';

const AddStudentModal = ({ show, onClose, onSave, editingStudent }) => {
  const [studentData, setStudentData] = useState({
    name: '',
    studentId: '',
    email: '',
    phone: '',
    program: ''
  });

  // Initialize form when modal opens or editingStudent changes
  useEffect(() => {
    if (editingStudent) {
      setStudentData({
        name: editingStudent.name,
        studentId: editingStudent.studentId,
        email: editingStudent.email,
        phone: editingStudent.phone || '',
        program: editingStudent.program || ''
      });
    } else {
      setStudentData({
        name: '',
        studentId: '',
        email: '',
        phone: '',
        program: ''
      });
    }
  }, [show, editingStudent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(studentData);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={studentData.name}
                    onChange={(e) => setStudentData({...studentData, name: e.target.value})}
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Student ID *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={studentData.studentId}
                    onChange={(e) => setStudentData({...studentData, studentId: e.target.value})}
                    required 
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Program/Course *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={studentData.program}
                  onChange={(e) => setStudentData({...studentData, program: e.target.value})}
                  required 
                />
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Email Address *</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={studentData.email}
                    onChange={(e) => setStudentData({...studentData, email: e.target.value})}
                    required 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    value={studentData.phone}
                    onChange={(e) => setStudentData({...studentData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingStudent ? 'Update Student' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;