import { useState } from 'react';

const KitManagement = () => {
  const [kits, setKits] = useState([
    { 
      id: 1, 
      name: "Raspberry Pi Pico Advanced Kit", 
      description: "Complete kit for advanced IoT and embedded systems projects",
      components: [
        { id: 1, name: "Raspberry Pi Pico", quantity: 1 },
        { id: 2, name: "Breadboard", quantity: 1 },
        { id: 3, name: "Jumper Wires", quantity: 40 },
        { id: 4, name: "LEDs (Various Colors)", quantity: 20 },
        { id: 5, name: "Resistors (Assorted)", quantity: 50 },
        // Add more components as needed
      ], 
      condition: "Excellent", 
      status: "Available",
      image: "https://placehold.co/300x200/3a6df0/white?text=Pi+Pico+Kit"
    },
    { 
      id: 2, 
      name: "Raspberry Pi 4 Starter Kit", 
      description: "Beginner-friendly kit for learning Raspberry Pi",
      components: [
        { id: 101, name: "Raspberry Pi 4", quantity: 1 },
        { id: 102, name: "Power Supply", quantity: 1 },
        { id: 103, name: "MicroSD Card", quantity: 1 },
        { id: 104, name: "Case", quantity: 1 },
      ], 
      condition: "Good", 
      status: "Loaned",
      image: "https://placehold.co/300x200/4caf50/white?text=Pi+4+Kit"
    }
  ]);
  
  const [showAddKit, setShowAddKit] = useState(false);
  const [editingKit, setEditingKit] = useState(null);
  const [newKit, setNewKit] = useState({
    name: '',
    description: '',
    components: [{ name: '', quantity: 1 }],
    condition: 'Excellent',
    status: 'Available',
    image: ''
  });

  const handleAddComponentField = () => {
    setNewKit({
      ...newKit,
      components: [...newKit.components, { name: '', quantity: 1 }]
    });
  };

  const handleComponentChange = (index, field, value) => {
    const updatedComponents = [...newKit.components];
    updatedComponents[index][field] = field === 'quantity' ? parseInt(value) || 1 : value;
    
    setNewKit({
      ...newKit,
      components: updatedComponents
    });
  };

  const handleRemoveComponent = (index) => {
    const updatedComponents = [...newKit.components];
    updatedComponents.splice(index, 1);
    
    setNewKit({
      ...newKit,
      components: updatedComponents
    });
  };

  const handleAddKit = (e) => {
    e.preventDefault();
    const kit = {
      id: kits.length + 1,
      name: newKit.name,
      description: newKit.description,
      components: newKit.components.filter(comp => comp.name.trim() !== ''),
      condition: newKit.condition,
      status: newKit.status,
      image: newKit.image || "https://placehold.co/300x200/3a6df0/white?text=Pi+Kit"
    };
    
    setKits([...kits, kit]);
    setNewKit({
      name: '',
      description: '',
      components: [{ name: '', quantity: 1 }],
      condition: 'Excellent',
      status: 'Available',
      image: ''
    });
    setShowAddKit(false);
  };

  const handleEditKit = (kit) => {
    setEditingKit(kit);
    setNewKit({
      name: kit.name,
      description: kit.description,
      components: kit.components,
      condition: kit.condition,
      status: kit.status,
      image: kit.image
    });
    setShowAddKit(true);
  };

  const handleUpdateKit = (e) => {
    e.preventDefault();
    const updatedKits = kits.map(kit => 
      kit.id === editingKit.id 
        ? { 
            ...kit, 
            name: newKit.name,
            description: newKit.description,
            components: newKit.components.filter(comp => comp.name.trim() !== ''),
            condition: newKit.condition,
            status: newKit.status,
            image: newKit.image
          } 
        : kit
    );
    
    setKits(updatedKits);
    setEditingKit(null);
    setNewKit({
      name: '',
      description: '',
      components: [{ name: '', quantity: 1 }],
      condition: 'Excellent',
      status: 'Available',
      image: ''
    });
    setShowAddKit(false);
  };

  const handleDeleteKit = (kitId) => {
    if (window.confirm("Are you sure you want to delete this kit?")) {
      setKits(kits.filter(kit => kit.id !== kitId));
    }
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
      
      {/* Add/Edit Kit Modal */}
      {showAddKit && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingKit ? 'Edit Kit' : 'Add New Kit'}</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowAddKit(false);
                  setEditingKit(null);
                  setNewKit({
                    name: '',
                    description: '',
                    components: [{ name: '', quantity: 1 }],
                    condition: 'Excellent',
                    status: 'Available',
                    image: ''
                  });
                }}></button>
              </div>
              <form onSubmit={editingKit ? handleUpdateKit : handleAddKit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Kit Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={newKit.name}
                      onChange={(e) => setNewKit({...newKit, name: e.target.value})}
                      required 
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-control" 
                      value={newKit.description}
                      onChange={(e) => setNewKit({...newKit, description: e.target.value})}
                      rows="2"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={newKit.image}
                      onChange={(e) => setNewKit({...newKit, image: e.target.value})}
                      placeholder="Leave empty for default image"
                    />
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Condition</label>
                      <select 
                        className="form-select"
                        value={newKit.condition}
                        onChange={(e) => setNewKit({...newKit, condition: e.target.value})}
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select 
                        className="form-select"
                        value={newKit.status}
                        onChange={(e) => setNewKit({...newKit, status: e.target.value})}
                      >
                        <option value="Available">Available</option>
                        <option value="Loaned">Loaned</option>
                        <option value="Under Maintenance">Under Maintenance</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="form-label">Components</label>
                      <button type="button" className="btn btn-sm btn-outline-primary" onClick={handleAddComponentField}>
                        Add Component
                      </button>
                    </div>
                    
                    {newKit.components.map((component, index) => (
                      <div key={index} className="row mb-2">
                        <div className="col-7">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Component name"
                            value={component.name}
                            onChange={(e) => handleComponentChange(index, 'name', e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-3">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Qty"
                            min="1"
                            value={component.quantity}
                            onChange={(e) => handleComponentChange(index, 'quantity', e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-2">
                          {newKit.components.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveComponent(index)}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowAddKit(false);
                    setEditingKit(null);
                    setNewKit({
                      name: '',
                      description: '',
                      components: [{ name: '', quantity: 1 }],
                      condition: 'Excellent',
                      status: 'Available',
                      image: ''
                    });
                  }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingKit ? 'Update Kit' : 'Add Kit'}
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

export default KitManagement;