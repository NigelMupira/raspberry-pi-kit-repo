const CreateLoanModal = ({ kits, students, onClose, onCreateLoan }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Process form data and call onCreateLoan
    onClose()
  }

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Loan</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Select Kit</label>
                <select className="form-select" required>
                  <option value="">Choose a kit</option>
                  {kits.map(kit => (
                    <option key={kit.id} value={kit.id}>{kit.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Select Student</label>
                <select className="form-select" required>
                  <option value="">Choose a student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.studentId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Due Date</label>
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  required 
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Loan</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateLoanModal