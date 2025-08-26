import { useState, useEffect } from 'react';

const AddKitModal = ({ show, onClose, onSave, editingKit }) => {
  const [kitData, setKitData] = useState({
    name: '',
    description: '',
    condition: 'Excellent',
    status: 'Available',
    image: '',
    components: [{ name: '', quantity: 1 }]
  });

  // Initialize form when modal opens or editingKit changes
  useEffect(() => {
    if (editingKit) {
      setKitData({
        name: editingKit.name,
        description: editingKit.description || '',
        condition: editingKit.condition,
        status: editingKit.status,
        image: editingKit.image || '',
        components: editingKit.components.map(comp => ({
          name: comp.name,
          quantity: comp.quantity
        }))
      });
    } else {
      setKitData({
        name: '',
        description: '',
        condition: 'Excellent',
        status: 'Available',
        image: '',
        components: [{ name: '', quantity: 1 }]
      });
    }
  }, [show, editingKit]);

  const handleComponentChange = (index, field, value) => {
    const updatedComponents = [...kitData.components];
    updatedComponents[index][field] = field === 'quantity' ? parseInt(value) || 1 : value;
    
    setKitData({
      ...kitData,
      components: updatedComponents
    });
  };

  const addComponentField = () => {
    setKitData({
      ...kitData,
      components: [...kitData.components, { name: '', quantity: 1 }]
    });
  };

  const removeComponent = (index) => {
    if (kitData.components.length <= 1) return;
    
    const updatedComponents = [...kitData.components];
    updatedComponents.splice(index, 1);
    
    setKitData({
      ...kitData,
      components: updatedComponents
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty components
    const validComponents = kitData.components.filter(comp => 
      comp.name.trim() !== ''
    );
    
    onSave({
      ...kitData,
      components: validComponents
    });
    
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editingKit ? 'Edit Kit' : 'Add New Kit'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-md-8">
                  <label className="form-label">Kit Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={kitData.name}
                    onChange={(e) => setKitData({...kitData, name: e.target.value})}
                    required 
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select"
                    value={kitData.status}
                    onChange={(e) => setKitData({...kitData, status: e.target.value})}
                  >
                    <option value="Available">Available</option>
                    <option value="Loaned">Loaned</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  value={kitData.description}
                  onChange={(e) => setKitData({...kitData, description: e.target.value})}
                  rows="2"
                />
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Condition</label>
                  <select 
                    className="form-select"
                    value={kitData.condition}
                    onChange={(e) => setKitData({...kitData, condition: e.target.value})}
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Image URL</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={kitData.image}
                    onChange={(e) => setKitData({...kitData, image: e.target.value})}
                    placeholder="Leave empty for default image"
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label">Components *</label>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-primary"
                    onClick={addComponentField}
                  >
                    + Add Component
                  </button>
                </div>
                
                {kitData.components.map((component, index) => (
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
                      {kitData.components.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeComponent(index)}
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
              <button type="button" className="btn btn-secondary" onClick={onClose}>
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
  );
};

export default AddKitModal;