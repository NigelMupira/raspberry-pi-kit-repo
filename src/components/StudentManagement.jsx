import { useState } from 'react';

const StudentManagement = () => {
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
    },
    { 
      id: 3, 
      name: "David Kim", 
      studentId: "S34567", 
      phone: "555-9012", 
      email: "david@university.edu",
      program: "Information Technology",
      createdAt: "2023-05-20"
    }
  ]);
  
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    studentId: '',
    phone: '',
    email: '',
    program: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddStudent = (e) => {
    e.preventDefault();
    const student = {
      id: students.length + 1,
      name: newStudent.name,
      studentId: newStudent.studentId,
      phone: newStudent.phone,
      email: newStudent.email,
      program: newStudent.program,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setStudents([...students, student]);
    setNewStudent({
      name: '',
      studentId: '',
      phone: '',
      email: '',
      program: ''
    });
    setShowAddStudent(false);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setNewStudent({
      name: student.name,
      studentId: student.studentId,
      phone: student.phone,
      email: student.email,
      program: student.program
    });
    setShowAddStudent(true);
  };

  const handleUpdateStudent = (e) => {
    e.preventDefault();
    const updatedStudents = students.map(student => 
      student.id === editingStudent.id 
        ? { 
            ...student, 
            name: newStudent.name,
            studentId: newStudent.studentId,
            phone: newStudent.phone,
            email: newStudent.email,
            program: newStudent.program
          } 
        : student
    );
    
    setStudents(updatedStudents);
    setEditingStudent(null);
    setNewStudent({
      name: '',
      studentId: '',
      phone: '',
      email: '',
      program: ''
    });
    setShowAddStudent(false);
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents(students.filter(student => student.id !== studentId));
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Student Management</h2>
        <button className="btn btn-primary" onClick={() => setShowAddStudent(true)}>
          Add New Student
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search students by name, ID, or program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button">
              <i className="bi bi-search"></i> Search
            </button>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <span className="badge bg-info">
            Total Students: {students.length}
          </span>
        </div>
      </div>
      
      <div className="card">
        <div className="card-body">
          {filteredStudents.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Program/Course</th>
                    <th>Contact Info</th>
                    <th>Date Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td>
                        <strong>{student.studentId}</strong>
                      </td>
                      <td>{student.name}</td>
                      <td>{student.program}</td>
                      <td>
                        <div>{student.email}</div>
                        <div className="text-muted small">{student.phone}</div>
                      </td>
                      <td>{student.createdAt}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => handleEditStudent(student)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <p>No students found. {searchTerm && 'Try a different search term.'}</p>
              {!searchTerm && (
                <button className="btn btn-primary" onClick={() => setShowAddStudent(true)}>
                  Add Your First Student
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Add/Edit Student Modal */}
      {showAddStudent && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingStudent ? 'Edit Student' : 'Add New Student'}</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowAddStudent(false);
                  setEditingStudent(null);
                  setNewStudent({
                    name: '',
                    studentId: '',
                    phone: '',
                    email: '',
                    program: ''
                  });
                }}></button>
              </div>
              <form onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}>
                <div className="modal-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Student ID *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={newStudent.studentId}
                        onChange={(e) => setNewStudent({...newStudent, studentId: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Program/Course *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={newStudent.program}
                      onChange={(e) => setNewStudent({...newStudent, program: e.target.value})}
                      required 
                    />
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Email Address *</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        value={newStudent.phone}
                        onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowAddStudent(false);
                    setEditingStudent(null);
                    setNewStudent({
                      name: '',
                      studentId: '',
                      phone: '',
                      email: '',
                      program: ''
                    });
                  }}>
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
      )}
    </div>
  );
};

export default StudentManagement;