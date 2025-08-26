import { useState } from 'react'
import CreateLoanModal from './Modals/CreateLoanModal'

const Dashboard = () => {
  // Sample data - you'll replace this with state from your backend
  const [kits] = useState([
    { id: 1, name: "Raspberry Pi 4 Starter Kit", components: ["Pi 4 Board", "Power Supply", "Case", "SD Card"], condition: "Good", status: "Available" },
    { id: 2, name: "Raspberry Pi 3 B+ Kit", components: ["Pi 3 B+ Board", "Power Supply", "Case"], condition: "Fair", status: "Loaned" },
  ])
  
  const [students] = useState([
    { id: 1, name: "John Smith", studentId: "S12345", email: "john@university.edu", phone: "555-1234" },
  ])
  
  const [loans, setLoans] = useState([
    { id: 1, kitId: 2, studentId: 1, borrowed: "2023-05-10 10:30:00", returned: null, due: "2023-05-17 10:30:00" }
  ])
  
  const [showLoanForm, setShowLoanForm] = useState(false)

  // Stats for dashboard
  const totalKits = kits.length
  const availableKits = kits.filter(kit => kit.status === 'Available').length
  const loanedKits = kits.filter(kit => kit.status === 'Loaned').length
  const activeLoans = loans.filter(loan => loan.returned === null).length

  const handleReturnKit = (loanId) => {
    // Implement return functionality
    console.log("Return kit with ID:", loanId)
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      
      <div className="row">
        <div className="col-md-3">
          <div className="card stat-card">
            <h5>Total Kits</h5>
            <div className="stat-number text-primary">{totalKits}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card">
            <h5>Available Kits</h5>
            <div className="stat-number text-success">{availableKits}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card">
            <h5>Loaned Out</h5>
            <div className="stat-number text-warning">{loanedKits}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card">
            <h5>Active Loans</h5>
            <div className="stat-number text-info">{activeLoans}</div>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Recent Loans</h5>
              <button className="btn btn-sm btn-primary" onClick={() => setShowLoanForm(true)}>New Loan</button>
            </div>
            <div className="card-body">
              {loans.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Kit</th>
                        <th>Student</th>
                        <th>Borrowed</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans.slice(0, 5).map(loan => {
                        const kit = kits.find(k => k.id === loan.kitId)
                        const student = students.find(s => s.id === loan.studentId)
                        return (
                          <tr key={loan.id}>
                            <td>{kit ? kit.name : 'Unknown'}</td>
                            <td>{student ? student.name : 'Unknown'}</td>
                            <td>{loan.borrowed}</td>
                            <td>{loan.returned ? 'Returned' : 'Active'}</td>
                            <td>
                              {!loan.returned && (
                                <button className="btn btn-sm btn-success" onClick={() => handleReturnKit(loan.id)}>
                                  Return
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No loans recorded yet.</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Kit Status Overview</h5>
            </div>
            <div className="card-body">
              {kits.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Kit Name</th>
                        <th>Condition</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kits.slice(0, 5).map(kit => (
                        <tr key={kit.id}>
                          <td>{kit.name}</td>
                          <td>
                            <span className={`condition-${kit.condition.toLowerCase()}`}>
                              {kit.condition}
                            </span>
                          </td>
                          <td>{kit.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No kits added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showLoanForm && (
        <CreateLoanModal 
          kits={kits.filter(kit => kit.status === 'Available')}
          students={students}
          onClose={() => setShowLoanForm(false)}
          onCreateLoan={(newLoan) => {
            // Handle new loan creation
            console.log("New loan:", newLoan)
            setShowLoanForm(false)
          }}
        />
      )}
    </div>
  )
}

export default Dashboard