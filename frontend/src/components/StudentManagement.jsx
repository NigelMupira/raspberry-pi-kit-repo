import { useState } from 'react';
import AddStudentModal from './Modals/AddStudentModal';

const StudentManagement = ({ students, setStudents }) => {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowAddStudent(true);
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents(students.filter(student => student.id !== studentId));
    }
  };

  const handleSaveStudent = (studentData) => {
    if (editingStudent) {
      // Update existing student
      const updatedStudents = students.map(student => 
        student.id === editingStudent.id 
          ? { 
              ...student, 
              ...studentData
            } 
          : student
      );
      setStudents(updatedStudents);
    } else {
      // Add new student
      const newStudent = {
        id: Math.max(...students.map(s => s.id), 0) + 1,
        ...studentData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setStudents([...students, newStudent]);
    }
    setEditingStudent(null);
    setShowAddStudent(false);
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
      
      <AddStudentModal
        show={showAddStudent}
        onClose={() => {
          setShowAddStudent(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        editingStudent={editingStudent}
      />
    </div>
  );
};

export default StudentManagement;