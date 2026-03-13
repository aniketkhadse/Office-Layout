import { startTransition, useEffect, useState } from 'react';
import room2Source from './data/room1_desks.json';
import room1Source from './data/room2_desks.json';
import EditDeskModal from './components/EditDeskModal';
import Legend from './components/Legend';
import RoomOnePlan from './components/RoomOnePlan';
import RoomTwoPlan from './components/RoomTwoPlan';
import { loadDeskDatabase, loadDeskDatabaseSnapshot, saveDeskDatabase } from './lib/deskDatabase';

const ROOM_TABS = [
  { key: 'room1', label: 'Room 1' },
  { key: 'room2', label: 'Room 2' },
];

function normalizeDesk(desk) {
  if (!desk) {
    return null;
  }

  return {
    ...desk,
    employee: desk.employee ?? '',
    status: desk.status === 'occupied' ? 'occupied' : 'available',
  };
}

const initialRooms = {
  room1: room1Source.map(normalizeDesk),
  room2: room2Source.map(normalizeDesk),
};

function App() {
  const [activeRoom, setActiveRoom] = useState('room1');
  const [rooms, setRooms] = useState(() => loadDeskDatabaseSnapshot(initialRooms));
  const [selectedDeskKey, setSelectedDeskKey] = useState(null);

  const activeDesks = rooms[activeRoom];
  const activeDesk = selectedDeskKey
    ? activeDesks.find((desk) => desk?.desk_id === selectedDeskKey) ?? null
    : null;

  const occupiedCount = activeDesks.filter((desk) => desk?.status === 'occupied').length;
  const availableCount = activeDesks.filter((desk) => desk?.status === 'available').length;

  function handleRoomChange(roomKey) {
    startTransition(() => {
      setActiveRoom(roomKey);
      setSelectedDeskKey(null);
    });
  }

  function handleDeskOpen(deskId) {
    setSelectedDeskKey(deskId);
  }

  function handleDeskSave(updatedDesk) {
    setRooms((previousRooms) => {
      const nextRooms = {
        ...previousRooms,
        [activeRoom]: previousRooms[activeRoom].map((desk) => {
          if (!desk || desk.desk_id !== updatedDesk.desk_id) {
            return desk;
          }

          return {
            ...desk,
            employee: updatedDesk.employee.trim(),
            status: updatedDesk.status,
          };
        }),
      };

      void saveDeskDatabase(nextRooms);
      return nextRooms;
    });

    setSelectedDeskKey(null);
  }

  useEffect(() => {
    let isCancelled = false;

    async function hydrateRooms() {
      const storedRooms = await loadDeskDatabase(initialRooms);

      if (!isCancelled) {
        setRooms(storedRooms);
      }
    }

    void hydrateRooms();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__title-group">
          <p className="app-header__eyebrow">Top-down floor plan editor</p>
          <h1>Office Desk Layout Editor</h1>
          <p className="app-header__subtitle">
            Click any desk to edit the assigned employee and occupancy.
          </p>
        </div>

        <nav className="room-tabs" aria-label="Room navigation">
          {ROOM_TABS.map((room) => (
            <button
              key={room.key}
              type="button"
              className={`room-tab${activeRoom === room.key ? ' room-tab--active' : ''}`}
              onClick={() => handleRoomChange(room.key)}
            >
              {room.label}
            </button>
          ))}
        </nav>

        <Legend
          roomLabel={ROOM_TABS.find((room) => room.key === activeRoom)?.label ?? activeRoom}
          occupiedCount={occupiedCount}
          availableCount={availableCount}
        />
      </header>

      <main className="plan-stage">
        {activeRoom === 'room1' ? (
          <RoomOnePlan desks={activeDesks} onDeskClick={handleDeskOpen} />
        ) : (
          <RoomTwoPlan desks={activeDesks} onDeskClick={handleDeskOpen} />
        )}
      </main>

      {activeDesk ? (
        <EditDeskModal
          key={activeDesk.desk_id}
          desk={activeDesk}
          roomLabel={ROOM_TABS.find((room) => room.key === activeRoom)?.label ?? activeRoom}
          onClose={() => setSelectedDeskKey(null)}
          onSave={handleDeskSave}
        />
      ) : null}
    </div>
  );
}

export default App;
