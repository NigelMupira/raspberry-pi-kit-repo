import { useState, useEffect } from 'react';
import AddKitModal from './Modals/AddKitModal';
import { kitAPI } from '../services';

const KitManagement = () => {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddKit, setShowAddKit] = useState(false);
  const [editingKit, setEditingKit] = useState(null);

  // Load kits from API
  useEffect(() => {
    loadKits();
  }, []);

  const loadKits = async () => {
    try {
      setLoading(true);
      const data = await kitAPI.getAll();
      setKits(data);
      setError(null);
    } catch (err) {
      setError('Failed to load kits. Please try again later.');
      console.error('Error loading kits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditKit = (kit) => {
    setEditingKit(kit);
    setShowAddKit(true);
  };

  const handleSaveKit = async (kitData) => {
    try {
      if (editingKit) {
        // Update existing kit
        await kitAPI.update(editingKit.id, kitData);
      } else {
        // Add new kit
        await kitAPI.create(kitData);
      }
      // Reload kits from server
      await loadKits();
      setEditingKit(null);
      setShowAddKit(false);
    } catch (err) {
      setError('Failed to save kit. Please try again.');
      console.error('Error saving kit:', err);
    }
  };

  const handleDeleteKit = async (kitId) => {
    if (window.confirm("Are you sure you want to delete this kit?")) {
      try {
        await kitAPI.delete(kitId);
        // Reload kits from server
        await loadKits();
      } catch (err) {
        setError('Failed to delete kit. Please try again.');
        console.error('Error deleting kit:', err);
      }
    }
  };

  if (loading) return <div className="text-center py-5">Loading kits...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Kit Management</h2>
        <button className="btn btn-primary" onClick={() => setShowAddKit(true)}>
          Add New Kit
        </button>
      </div>
      
      <div className="row">
        {kits.map(kit => (
          <div key={kit.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card kit-card h-100">
              <img src={kit.image} className="card-img-top" alt={kit.name} style={{ height: '200px', objectFit: 'cover' }} />
              <div className="card-body">
                <h5 className="card-title">{kit.name}</h5>
                <p className="card-text">{kit.description}</p>
                <h6 className="card-subtitle mb-2">
                  Condition: <span className={`condition-${kit.condition.toLowerCase()}`}>{kit.condition}</span>
                </h6>
                <h6 className="card-subtitle mb-2 text-muted">Status: {kit.status}</h6>
                
                <div className="mt-3">
                  <h6>Components:</h6>
                  <ul className="list-group list-group-flush">
                    {kit.components.slice(0, 3).map((component, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center p-1 ps-2">
                        {component.name}
                        <span className="badge bg-primary rounded-pill">{component.quantity}</span>
                      </li>
                    ))}
                    {kit.components.length > 3 && (
                      <li className="list-group-item p-1 ps-2 text-muted">
                        +{kit.components.length - 3} more components
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditKit(kit)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteKit(kit.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <AddKitModal
        show={showAddKit}
        onClose={() => {
          setShowAddKit(false);
          setEditingKit(null);
        }}
        onSave={handleSaveKit}
        editingKit={editingKit}
      />
    </div>
  );
};

export default KitManagement;