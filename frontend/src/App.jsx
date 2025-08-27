import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import KitManagement from './components/KitManagement'
import StudentManagement from './components/StudentManagement'
import LoanManagement from './components/LoanManagement'
import { kitAPI, studentAPI, loanAPI } from './services'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [kits, setKits] = useState([])
  const [students, setStudents] = useState([])
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)

  // Load all data on component mount
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      const [kitsData, studentsData, loansData] = await Promise.all([
        kitAPI.getAll(),
        studentAPI.getAll(),
        loanAPI.getAll()
      ])
      
      setKits(kitsData)
      setStudents(studentsData)
      setLoans(loansData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Stats for dashboard
  const totalKits = kits.length
  const availableKits = kits.filter(kit => kit.status === 'Available').length
  const loanedKits = kits.filter(kit => kit.status === 'Loaned').length
  const activeLoans = loans.filter(loan => !loan.returned).length

  const handleReturnKit = async (loanId, returnData) => {
    try {
      await loanAPI.return(loanId, returnData)
      // Reload all data to get updated information
      await loadAllData()
    } catch (error) {
      console.error('Error returning kit:', error)
    }
  }

  const handleCreateLoan = async (newLoan) => {
    try {
      await loanAPI.create(newLoan)
      // Reload all data to get updated information
      await loadAllData()
    } catch (error) {
      console.error('Error creating loan:', error)
      throw error // Re-throw to handle in the component
    }
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
            <div className="card-header">
              <h5>Recent Loans</h5>
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
                        <th>Due Date</th>
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
                            <td>
                              {loan.returned ? 
                                <span className="badge bg-success">Returned</span> : 
                                new Date(loan.due.replace(' ', 'T')) < new Date() ? 
                                  <span className="badge bg-danger">Overdue</span> :
                                  <span className="badge bg-warning">Active</span>
                              }
                            </td>
                            <td>{loan.due}</td>
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="sidebar">
          <div className="logo">
            <h3>Pi Kit Repository</h3>
          </div>
          {/* Navigation items */}
        </div>
        <div className="main-content d-flex justify-content-center align-items-center">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading application data...</p>
          </div>
        </div>
      </div>
    )
  }

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
        {activeTab === 'kits' && (
          <KitManagement 
            kits={kits} 
            setKits={setKits} 
            onDataUpdate={loadAllData}
          />
        )}
        {activeTab === 'students' && (
          <StudentManagement 
            students={students} 
            setStudents={setStudents} 
            onDataUpdate={loadAllData}
          />
        )}
        {activeTab === 'loans' && (
          <LoanManagement 
            kits={kits} 
            students={students} 
            loans={loans} 
            setLoans={setLoans}
            onReturnKit={handleReturnKit}
            onCreateLoan={handleCreateLoan}
            onDataUpdate={loadAllData}
          />
        )}
      </div>
    </div>
  )
}

export default App