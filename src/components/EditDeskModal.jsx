import { useEffect, useEffectEvent, useState } from 'react';

function EditDeskModal({ desk, roomLabel, onClose, onSave }) {
  const [formState, setFormState] = useState(() => ({
    employee: desk.employee,
    status: desk.status,
  }));

  const closeOnEscape = useEffectEvent((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  });

  useEffect(() => {
    document.body.classList.add('modal-open');
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setFormState((previousState) => ({
      ...previousState,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      ...desk,
      ...formState,
    });
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="desk-editor-title">
        <header className="modal-card__header">
          <div className="modal-card__title-group">
            <p className="modal-card__eyebrow">{roomLabel}</p>
            <h2 id="desk-editor-title">Edit Desk {desk.desk_id}</h2>
            <p className="modal-card__subnote">Saved locally on this device.</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close editor">
            &times;
          </button>
        </header>

        <form className="desk-form" onSubmit={handleSubmit}>
          <label className="desk-form__field">
            <span>Desk ID</span>
            <input type="text" value={desk.desk_id} disabled />
          </label>

          <label className="desk-form__field">
            <span>Employee Name</span>
            <input
              type="text"
              name="employee"
              value={formState.employee}
              onChange={handleFieldChange}
              placeholder="Leave blank if unassigned"
            />
          </label>

          <label className="desk-form__field">
            <span>Status</span>
            <select name="status" value={formState.status} onChange={handleFieldChange}>
              <option value="occupied">Occupied</option>
              <option value="available">Available</option>
            </select>
          </label>

          <div className="desk-form__actions">
            <button type="button" className="button button--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button--primary">
              Save Desk
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default EditDeskModal;
