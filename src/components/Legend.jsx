function Legend({
  roomLabel,
  occupiedCount,
  availableCount,
  combinedOccupiedCount,
  combinedAvailableCount,
  maleCount,
  femaleCount,
}) {
  return (
    <section className="legend" aria-label={`${roomLabel} desk summary`}>
      <div className="legend__group">
        <p className="legend__title">{roomLabel}</p>
        <div className="legend__stats">
          <div className="legend__stat">
            <span className="legend__swatch legend__swatch--occupied" aria-hidden="true" />
            <span className="legend__label">Occupied</span>
            <strong className="legend__value">{occupiedCount}</strong>
          </div>
          <div className="legend__stat">
            <span className="legend__swatch legend__swatch--available" aria-hidden="true" />
            <span className="legend__label">Available</span>
            <strong className="legend__value">{availableCount}</strong>
          </div>
        </div>
      </div>

      <div className="legend__group">
        <p className="legend__title">All Rooms Combined</p>
        <div className="legend__stats">
          <div className="legend__stat">
            <span className="legend__swatch legend__swatch--occupied" aria-hidden="true" />
            <span className="legend__label">Occupied</span>
            <strong className="legend__value">{combinedOccupiedCount}</strong>
          </div>
          <div className="legend__stat">
            <span className="legend__swatch legend__swatch--available" aria-hidden="true" />
            <span className="legend__label">Available</span>
            <strong className="legend__value">{combinedAvailableCount}</strong>
          </div>
        </div>
      </div>

      <div className="legend__group legend__group--gender">
        <p className="legend__title">Employee Colors</p>
        <p className="legend__hint">Blue = Male, Pink = Female</p>
        <div className="legend__mini-stats">
          <div className="legend__mini">
            <span className="legend__swatch legend__swatch--male" aria-hidden="true" />
            <span className="legend__mini-label">Male</span>
            <strong className="legend__mini-value">{maleCount}</strong>
          </div>
          <div className="legend__mini">
            <span className="legend__swatch legend__swatch--female" aria-hidden="true" />
            <span className="legend__mini-label">Female</span>
            <strong className="legend__mini-value">{femaleCount}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Legend;
