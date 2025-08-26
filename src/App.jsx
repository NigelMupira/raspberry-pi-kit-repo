import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import KitManagement from './components/KitManagement'
import StudentManagement from './components/StudentManagement'
import LoanManagement from './components/LoanManagement'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [kits, setKits] = useState([
    { 
      id: 1, 
      name: "Raspberry Pi 4 Starter Kit", 
      description: "Beginner-friendly kit for learning Raspberry Pi",
      components: [
        { id: 101, name: "Raspberry Pi 4", quantity: 1 },
        { id: 102, name: "Power Supply", quantity: 1 },
        { id: 103, name: "MicroSD Card", quantity: 1 },
        { id: 104, name: "Case", quantity: 1 },
      ], 
      condition: "Good", 
      status: "Available",
      image: "https://placehold.co/300x200/4caf50/white?text=Pi+4+Kit"
    },
    { 
      id: 2, 
      name: "Raspberry Pi Pico Advanced Kit", 
      description: "Complete kit for advanced IoT and embedded systems projects",
      components: [
        { id: 1, name: "Raspberry Pi Pico", quantity: 1 },
        { id: 2, name: "Breadboard", quantity: 1 },
        { id: 3, name: "Jumper Wires", quantity: 40 },
        { id: 4, name: "LEDs (Various Colors)", quantity: 20 },
        { id: 5, name: "Resistors (Assorted)", quantity: 50 },
      ], 
      condition: "Excellent", 
      status: "Loaned",
      image: "https://placehold.co/300x200/3a6df0/white?text=Pi+Pico+Kit"
    }
  ])
  
  const [students, setStudents] = useState([
    { 
      id: 1, 
      name: "John Smith", 
      studentId: "S12345", 
      phone: "555-1234", 
      email: "john@university.edu",
      program: "Computer Science",
      createdAt: "2023-05-10"
    },
    { 
      id: 2, 
      name: "Maria Garcia", 
      studentId: "S23456", 
      phone: "555-5678", 
      email: "maria@university.edu",
      program: "Electrical Engineering",
      createdAt: "2023-05-15"
    }
  ])
  
  const [loans, setLoans] = useState([
    { 
      id: 1, 
      kitId: 2, 
      studentId: 1, 
      borrowed: "2023-05-10 10:30:00", 
      returned: null, 
      due: "2023-05-17 10:30:00",
      conditionBorrowed: "Good",
      conditionReturned: null,
      componentsIncluded: [1, 2, 3, 4, 5],
      componentsReturned: []
    },
    { 
      id: 2, 
      kitId: 1, 
      studentId: 2, 
      borrowed: "2023-06-01 14:15:00", 
      returned: "2023-06-08 11:20:00", 
      due: "2023-06-08 14:15:00",
      conditionBorrowed: "Excellent",
      conditionReturned: "Excellent",
      componentsIncluded: [101, 102, 103, 104],
      componentsReturned: [101, 102, 103, 104]
    }
  ])

  // Stats for dashboard
  const totalKits = kits.length
  const availableKits = kits.filter(kit => kit.status === 'Available').length
  const loanedKits = kits.filter(kit => kit.status === 'Loaned').length
  const activeLoans = loans.filter(loan => loan.returned === null).length

  const handleReturnKit = (loanId, returnData) => {
    const updatedLoans = loans.map(loan => 
      loan.id === loanId 
        ? {
            ...loan, 
            returned: new Date().toLocaleString('sv').replace('T', ' ').substring(0, 19),
            conditionReturned: returnData.conditionReturned,
            componentsReturned: returnData.componentsReturned
          } 
        : loan
    )
    
    const loan = loans.find(l => l.id === loanId)
    
    // Update kit status and condition if changed
    const updatedKits = kits.map(kit => 
      kit.id === loan.kitId 
        ? {
            ...kit, 
            status: 'Available',
            condition: returnData.conditionReturned
          } 
        : kit
    )
    
    setLoans(updatedLoans)
    setKits(updatedKits)
  }

  const handleCreateLoan = (newLoan) => {
    const kit = kits.find(k => k.id === parseInt(newLoan.kitId));
    
    const loan = {
      id: loans.length + 1,
      kitId: parseInt(newLoan.kitId),
      studentId: parseInt(newLoan.studentId),
      borrowed: new Date().toLocaleString('sv').replace('T', ' ').substring(0, 19),
      returned: null,
      due: newLoan.due,
      conditionBorrowed: newLoan.conditionBorrowed,
      conditionReturned: null,
      componentsIncluded: kit ? kit.components.map(c => c.id) : [],
      componentsReturned: []
    };
    
    // Update kit status
    const updatedKits = kits.map(kit => 
      kit.id === parseInt(newLoan.kitId) ? {...kit, status: 'Loaned'} : kit
    );
    
    setLoans([...loans, loan]);
    setKits(updatedKits);
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
                        const isOverdue = !loan.returned && new Date(loan.due.replace(' ', 'T')) < new Date();
                        
                        return (
                          <tr key={loan.id}>
                            <td>{kit ? kit.name : 'Unknown'}</td>
                            <td>{student ? student.name : 'Unknown'}</td>
                            <td>{loan.borrowed}</td>
                            <td>
                              {loan.returned ? 
                                <span className="badge bg-success">Returned</span> : 
                                isOverdue ? 
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
          />
        )}
        {activeTab === 'students' && (
          <StudentManagement 
            students={students} 
            setStudents={setStudents} 
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
          />
        )}
      </div>
    </div>
  )
}

export default App