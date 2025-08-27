import { useState, useEffect } from 'react'
import { kitAPI, studentAPI, loanAPI } from '../services'

const Dashboard = () => {
  const [kits, setKits] = useState([])
  const [students, setStudents] = useState([])
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)

  // Load data when component mounts
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
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
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Stats calculations
  const totalKits = kits.length
  const availableKits = kits.filter(kit => kit.status === 'Available').length
  const loanedKits = kits.filter(kit => kit.status === 'Loaned').length
  const activeLoans = loans.filter(loan => !loan.returned).length
  const overdueLoans = loans.filter(loan => 
    !loan.returned && new Date(loan.due.replace(' ', 'T')) < new Date()
  ).length

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString.replace(' ', 'T'))
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard Overview</h2>
      
      <div className="row">
        <div className="col-md-3">
          <div className="card stat-card">
            <h5>Total Kits</h5>
            <div className="stat-number text-primary">{totalKits}</div>
            <small className="text-muted">In inventory</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card">
            <h5>Available Kits</h5>
            <div className="stat-number text-success">{availableKits}</div>
            <small className="text-muted">Ready to loan</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card">
            <h5>Loaned Out</h5>
            <div className="stat-number text-warning">{loanedKits}</div>
            <small className="text-muted">Currently borrowed</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card">
            <h5>Active Loans</h5>
            <div className="stat-number text-info">{activeLoans}</div>
            <small className="text-muted">{overdueLoans} overdue</small>
          </div>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Recent Loan Activity</h5>
              <button className="btn btn-sm btn-outline-primary" onClick={loadData}>
                Refresh
              </button>
            </div>
            <div className="card-body">
              {loans.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Kit</th>
                        <th>Student</th>
                        <th>Borrowed</th>
                        <th>Due</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loans.slice(0, 5).map(loan => {
                        const kit = kits.find(k => k.id === loan.kitId)
                        const student = students.find(s => s.id === loan.studentId)
                        const isOverdue = !loan.returned && new Date(loan.due.replace(' ', 'T')) < new Date()
                        
                        return (
                          <tr key={loan.id}>
                            <td>{kit?.name || 'Unknown Kit'}</td>
                            <td>{student?.name || 'Unknown Student'}</td>
                            <td>{formatDate(loan.borrowed)}</td>
                            <td>{formatDate(loan.due)}</td>
                            <td>
                              {loan.returned ? 
                                <span className="badge bg-success">Returned</span> : 
                                isOverdue ? 
                                  <span className="badge bg-danger">Overdue</span> :
                                  <span className="badge bg-warning">Active</span>
                              }
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-3">
                  <p className="text-muted">No loan activity yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Kit Inventory Summary</h5>
            </div>
            <div className="card-body">
              {kits.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Kit Name</th>
                        <th>Condition</th>
                        <th>Status</th>
                        <th>Components</th>
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
                          <td>
                            <span className={`badge bg-${kit.status === 'Available' ? 'success' : 'warning'}`}>
                              {kit.status}
                            </span>
                          </td>
                          <td>{kit.components?.length || 0} items</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-3">
                  <p className="text-muted">No kits in inventory</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h6>Total Students</h6>
              <h3 className="text-primary">{students.length}</h3>
              <small className="text-muted">Registered users</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h6>Completed Loans</h6>
              <h3 className="text-success">{loans.filter(loan => loan.returned).length}</h3>
              <small className="text-muted">Successfully returned</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h6>Overdue Loans</h6>
              <h3 className="text-danger">{overdueLoans}</h3>
              <small className="text-muted">Need attention</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard