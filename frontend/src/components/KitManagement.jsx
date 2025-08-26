import { useState } from 'react';
import AddKitModal from './Modals/AddKitModal';

const KitManagement = ({ kits, setKits }) => {
  const [showAddKit, setShowAddKit] = useState(false);
  const [editingKit, setEditingKit] = useState(null);

  const handleEditKit = (kit) => {
    setEditingKit(kit);
    setShowAddKit(true);
  };

  const handleDeleteKit = (kitId) => {
    if (window.confirm("Are you sure you want to delete this kit?")) {
      setKits(kits.filter(kit => kit.id !== kitId));
    }
  };

  const handleSaveKit = (kitData) => {
    if (editingKit) {
      // Update existing kit
      const updatedKits = kits.map(kit => 
        kit.id === editingKit.id 
          ? { 
              ...kit, 
              ...kitData,
              id: editingKit.id,
              image: kitData.image || "https://placehold.co/300x200/3a6df0/white?text=Pi+Kit"
            } 
          : kit
      );
      setKits(updatedKits);
    } else {
      // Add new kit
      const newKit = {
        id: Math.max(...kits.map(k => k.id), 0) + 1,
        ...kitData,
        image: kitData.image || "https://placehold.co/300x200/3a6df0/white?text=Pi+Kit"
      };
      setKits([...kits, newKit]);
    }
    setEditingKit(null);
    setShowAddKit(false);
  };

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