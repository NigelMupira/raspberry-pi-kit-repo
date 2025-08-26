import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [kits, setKits] = useState([
    { id: 1, name: "Raspberry Pi 4 Starter Kit", components: ["Pi 4 Board", "Power Supply", "Case", "SD Card"], condition: "Good", status: "Available" },
    { id: 2, name: "Raspberry Pi 3 B+ Kit", components: ["Pi 3 B+ Board", "Power Supply", "Case"], condition: "Fair", status: "Loaned" },
  ])
  const [students, setStudents] = useState([
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
    const updatedLoans = loans.map(loan => 
      loan.id === loanId ? {...loan, returned: new Date().toLocaleString()} : loan
    )
    
    const loan = loans.find(l => l.id === loanId)
    const updatedKits = kits.map(kit => 
      kit.id === loan.kitId ? {...kit, status: 'Available'} : kit
    )
    
    setLoans(updatedLoans)
    setKits(updatedKits)
  }

  const Dashboard = () => (
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
    </div>
  )

  const Kits = () => (
    <div>
      <h2>Kit Management</h2>
      <div className="row">
        {kits.map(kit => (
          <div key={kit.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card kit-card h-100">
              <div className="card-body">
                <h5 className="card-title">{kit.name}</h5>
                <h6 className="card-subtitle mb-2">
                  Condition: <span className={`condition-${kit.condition.toLowerCase()}`}>{kit.condition}</span>
                </h6>
                <h6 className="card-subtitle mb-2 text-muted">Status: {kit.status}</h6>
                <p className="card-text">
                  <strong>Components:</strong>
                  <ul>
                    {kit.components.map((component, index) => (
                      <li key={index}>{component}</li>
                    ))}
                  </ul>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const Students = () => (
    <div>
      <h2>Student Management</h2>
      <div className="row">
        {students.map(student => (
          <div key={student.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card student-card h-100">
              <div className="card-body">
                <h5 className="card-title">{student.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">ID: {student.studentId}</h6>
                <p className="card-text">
                  <strong>Email:</strong> {student.email}<br/>
                  <strong>Phone:</strong> {student.phone}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const Loans = () => (
    <div>
      <h2>Loan Management</h2>
      <div className="card">
        <div className="card-body">
          {loans.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Kit</th>
                    <th>Student</th>
                    <th>Borrowed Date</th>
                    <th>Return Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map(loan => {
                    const kit = kits.find(k => k.id === loan.kitId)
                    const student = students.find(s => s.id === loan.studentId)
                    return (
                      <tr key={loan.id}>
                        <td>{loan.id}</td>
                        <td>{kit ? kit.name : 'Unknown'}</td>
                        <td>{student ? student.name : 'Unknown'}</td>
                        <td>{loan.borrowed}</td>
                        <td>{loan.returned || '-'}</td>
                        <td>{loan.due}</td>
                        <td>
                          {loan.returned ? 
                            <span className="badge bg-success">Returned</span> : 
                            <span className="badge bg-warning">Active</span>
                          }
                        </td>
                        <td>
                          {!loan.returned && (
                            <button className="btn btn-sm btn-success" onClick={() => handleReturnKit(loan.id)}>
                              Mark Returned
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
  )

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo">
          <h3>Pi Kit Repository</h3>
        </div>
        <div 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </div>
        <div 
          className={`nav-item ${activeTab === 'kits' ? 'active' : ''}`}
          onClick={() => setActiveTab('kits')}
        >
          Kits
        </div>
        <div 
          className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          Students
        </div>
        <div 
          className={`nav-item ${activeTab === 'loans' ? 'active' : ''}`}
          onClick={() => setActiveTab('loans')}
        >
          Loans
        </div>
      </div>
      
      <div className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'kits' && <Kits />}
        {activeTab === 'students' && <Students />}
        {activeTab === 'loans' && <Loans />}
      </div>
    </div>
  )
}

export default App