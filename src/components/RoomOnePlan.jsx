import { Fragment } from 'react';
import DeskBlock from './DeskBlock';

const ENTRY_GROUPS = [
  [
    [6, 8],
    [5, 7],
  ],
  [
    [2, 4],
    [1, 3],
  ],
];

const ROOM_ONE_BANKS = [
  {
    key: 'bank-a',
    left: [9, 10, 11, 12, 13, 14, 15, 16, 17],
    right: [26, 25, 24, 23, 22, 21, 20, 19, 18],
  },
  {
    key: 'bank-b',
    left: [27, 28, 29, 30, 31, 32, 33, 34, 35],
    right: [44, 43, 42, 41, 40, 39, 38, 37, 36],
  },
  {
    key: 'bank-c',
    left: [45, 46, 47, 48, 49, 50, 51, 52, 53],
    right: [62, 61, 60, 59, 58, 57, 56, 55, 54],
  },
  {
    key: 'bank-d',
    left: [63, 64, 65, 66, 67, 68, 69, 70, 71],
    right: [80, 79, 78, 77, 76, 75, 74, 73, 72],
  },
];

const EDGE_STACK = [81, 82, 83, 84, 85, 86, 87, 88];

function RoomShell({ title, className, children, furniture }) {
  return (
    <section className={`architect-room ${className}`}>
      {title ? <p className="architect-room__title">{title}</p> : null}
      {children}
      {furniture}
      <span className="architect-room__door" aria-hidden="true" />
    </section>
  );
}

function FurnitureDesk({ compact = false }) {
  return (
    <div className={`furniture-desk${compact ? ' furniture-desk--compact' : ''}`} aria-hidden="true">
      <span className="furniture-desk__table" />
      <span className="furniture-desk__screen" />
      <span className="furniture-desk__chair" />
    </div>
  );
}

function ConferenceFurniture() {
  return (
    <div className="conference-furniture" aria-hidden="true">
      <span className="conference-furniture__table" />
      <span className="conference-furniture__chair conference-furniture__chair--tl" />
      <span className="conference-furniture__chair conference-furniture__chair--tr" />
      <span className="conference-furniture__chair conference-furniture__chair--ml" />
      <span className="conference-furniture__chair conference-furniture__chair--mr" />
      <span className="conference-furniture__chair conference-furniture__chair--bl" />
      <span className="conference-furniture__chair conference-furniture__chair--br" />
    </div>
  );
}

function Aisle({ variant = 'standard' }) {
  return (
    <div className={`room-one-aisle room-one-aisle--${variant}`} aria-hidden="true">
      <span className="room-one-aisle__line" />
    </div>
  );
}

function RoomOnePlan({ desks, onDeskClick }) {
  const deskMap = Object.fromEntries(desks.filter(Boolean).map((desk) => [desk.desk_id, desk]));

  function renderDesk(id, orientation = 'right') {
    const desk = deskMap[String(id)];

    if (!desk) {
      return <div className="desk-slot desk-slot--empty" key={id} />;
    }

    return (
      <DeskBlock
        key={desk.desk_id}
        desk={desk}
        orientation={orientation}
        variant="room1"
        onClick={() => onDeskClick(desk.desk_id)}
      />
    );
  }

  return (
    <section className="floor-plan floor-plan--room1" aria-label="Room 1 floor plan">
      <div className="room-one-shell">
        <aside className="room-one-suite">
          <div className="entry-cluster">
            {ENTRY_GROUPS.map((group, groupIndex) => (
              <Fragment key={`entry-group-${groupIndex}`}>
                <div className="entry-cluster__group">
                  {group.map(([leftId, rightId]) => (
                    <div className="entry-cluster__row" key={`${leftId}-${rightId}`}>
                      {renderDesk(leftId, 'right')}
                      <span className="entry-cluster__spine" aria-hidden="true" />
                      {renderDesk(rightId, 'left')}
                    </div>
                  ))}
                </div>
                {groupIndex < ENTRY_GROUPS.length - 1 ? (
                  <div className="entry-cluster__break" aria-hidden="true" />
                ) : null}
              </Fragment>
            ))}
          </div>

          <RoomShell title="Server Room" className="architect-room--plain" />
          <RoomShell
            title="Sandeep Kotkar Cabin"
            className="architect-room--manager"
            furniture={<FurnitureDesk compact />}
          />
          <RoomShell
            title="Himanshu Desai Cabin"
            className="architect-room--director"
            furniture={<FurnitureDesk />}
          >
            <span className="architect-room__trim architect-room__trim--diagonal-left" aria-hidden="true" />
            <span className="architect-room__trim architect-room__trim--diagonal-right" aria-hidden="true" />
          </RoomShell>
        </aside>

        <div className="room-one-core">
          <section className="room-one-banks" aria-label="Main desk banks">
            <Aisle variant="entry" />
            {ROOM_ONE_BANKS.map((bank, bankIndex) => (
              <Fragment key={bank.key}>
                <div className="desk-bank">
                  <div className="desk-bank__column">
                    {bank.left.map((id) => renderDesk(id, 'right'))}
                  </div>
                  <span className="desk-bank__spine" aria-hidden="true" />
                  <div className="desk-bank__column">
                    {bank.right.map((id) => renderDesk(id, 'left'))}
                  </div>
                </div>
                <Aisle variant={bankIndex === ROOM_ONE_BANKS.length - 1 ? 'outer' : 'standard'} />
              </Fragment>
            ))}

            <div className="edge-stack">
              <span className="edge-stack__spine" aria-hidden="true" />
              <div className="edge-stack__column">
                {EDGE_STACK.map((id) => renderDesk(id, 'right'))}
              </div>
              <span className="edge-stack__rail" aria-hidden="true" />
            </div>
          </section>

          <section className="room-one-bottom" aria-label="Room 1 private rooms">
            <RoomShell title="Sumit Kurani Cabin" className="architect-room--support" furniture={<FurnitureDesk compact />} />
            <RoomShell title="Vishal Sartabe Cabin" className="architect-room--support" furniture={<FurnitureDesk compact />} />
            <RoomShell
              title="Conference Room"
              className="architect-room--conference"
              furniture={<ConferenceFurniture />}
            />
            <RoomShell title="Male Washroom" className="architect-room--support" furniture={<FurnitureDesk compact />} />
            <RoomShell title="Female Washroom" className="architect-room--support" furniture={<FurnitureDesk compact />} />
          </section>
        </div>
      </div>
    </section>
  );
}

export default RoomOnePlan;
