function DeskGlyph({ status }) {
  return (
    <span className={`desk-glyph desk-glyph--${status}`} aria-hidden="true">
      <span className="desk-glyph__desk-surface" />
      <span className="desk-glyph__notebook" />
      <span className="desk-glyph__cup" />
      <span className="desk-glyph__cup-handle" />
      <span className="desk-glyph__monitor-stand" />
      <span className="desk-glyph__monitor">
        <span className="desk-glyph__screen" />
      </span>
      <span className="desk-glyph__keyboard">
        <span className="desk-glyph__keys" />
      </span>
      <span className="desk-glyph__mouse" />
      <span className="desk-glyph__chair">
        <span className="desk-glyph__chair-back" />
        <span className="desk-glyph__chair-seat" />
        <span className="desk-glyph__armrest desk-glyph__armrest--left" />
        <span className="desk-glyph__armrest desk-glyph__armrest--right" />
      </span>
      <span className="desk-glyph__employee">
        <span className="desk-glyph__shoulders" />
        <span className="desk-glyph__head" />
      </span>
    </span>
  );
}

function DeskBlock({ desk, orientation = 'right', variant = 'room1', onClick }) {
  const employeeLabel = desk.employee.trim() || (desk.status === 'available' ? 'Available' : 'Unassigned');

  return (
    <button
      type="button"
      className={`desk-card desk-card--${variant} desk-card--${orientation} desk-card--${desk.status}`}
      onClick={onClick}
      title={`${desk.desk_id} - ${employeeLabel}`}
    >
      <span className="desk-card__content">
        <span className="desk-card__meta">
          <span className="desk-card__id">{desk.desk_id}</span>
          <span className="desk-card__name">{employeeLabel}</span>
        </span>
        <span className="desk-card__station" aria-hidden="true">
          <span className="desk-card__status" />
          <DeskGlyph status={desk.status} />
        </span>
      </span>
    </button>
  );
}

export default DeskBlock;
