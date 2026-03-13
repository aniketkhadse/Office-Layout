import { startTransition, useEffect, useState } from 'react';
import room2Source from './data/room1_desks.json';
import room1Source from './data/room2_desks.json';
import AdminLoginModal from './components/AdminLoginModal';
import EditDeskModal from './components/EditDeskModal';
import Legend from './components/Legend';
import RoomOnePlan from './components/RoomOnePlan';
import RoomTwoPlan from './components/RoomTwoPlan';
import { fetchAdminSession, loginAdmin, logoutAdmin } from './lib/adminSession';
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
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAdmin: false,
    username: null,
    isConfigured: true,
  });

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
    if (!authState.isAdmin) {
      setIsLoginOpen(true);
      return;
    }

    setSelectedDeskKey(deskId);
  }

  async function handleDeskSave(updatedDesk) {
    const nextRooms = {
      ...rooms,
      [activeRoom]: rooms[activeRoom].map((desk) => {
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

    setRooms(nextRooms);

    try {
      await saveDeskDatabase(nextRooms);
      setSelectedDeskKey(null);
    } catch (error) {
      const latestRooms = await loadDeskDatabase(initialRooms);
      setRooms(latestRooms);

      if (error instanceof Error && error.message.includes('Admin login required')) {
        setAuthState((previousState) => ({
          ...previousState,
          isAdmin: false,
          username: null,
        }));
        setIsLoginOpen(true);
      }

      throw error;
    }
  }

  async function handleAdminLogin(credentials) {
    const session = await loginAdmin(credentials);
    setAuthState({
      isLoading: false,
      isAdmin: Boolean(session.isAdmin),
      username: session.username ?? 'admin',
      isConfigured: true,
    });
    setIsLoginOpen(false);
  }

  async function handleAdminLogout() {
    await logoutAdmin();
    setAuthState((previousState) => ({
      ...previousState,
      isAdmin: false,
      username: null,
    }));
    setSelectedDeskKey(null);
  }

  useEffect(() => {
    let isCancelled = false;

    async function hydrateApp() {
      const [storedRooms, session] = await Promise.all([
        loadDeskDatabase(initialRooms),
        fetchAdminSession().catch(() => ({
          isAdmin: false,
          username: null,
          isConfigured: false,
        })),
      ]);

      if (!isCancelled) {
        setRooms(storedRooms);
        setAuthState({
          isLoading: false,
          isAdmin: Boolean(session.isAdmin),
          username: session.username ?? null,
          isConfigured: session.isConfigured ?? true,
        });
      }
    }

    void hydrateApp();

    return () => {
      isCancelled = true;
    };
  }, []);

  const headerSubtitle = authState.isAdmin
    ? `Admin mode active${authState.username ? ` for ${authState.username}` : ''}. Click any desk to edit and save shared seating changes.`
    : 'View-only mode is active. Admin login is required before any desk changes can be saved.';

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__title-group">
          <p className="app-header__eyebrow">Top-down floor plan editor</p>
          <h1>Office Desk Layout Editor</h1>
          <p className="app-header__subtitle">{headerSubtitle}</p>
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

        <section className="access-panel" aria-label="Admin access">
          <p className="access-panel__eyebrow">Access</p>
          <div className="access-panel__body">
            <div className="access-panel__status">
              <span className={`access-panel__badge${authState.isAdmin ? ' access-panel__badge--admin' : ''}`}>
                {authState.isLoading ? 'Checking' : authState.isAdmin ? 'Admin' : 'View Only'}
              </span>
              <p className="access-panel__text">
                {authState.isAdmin
                  ? 'You can edit and save shared desk assignments.'
                  : authState.isConfigured
                    ? 'Layout is visible to everyone, but only admin can make changes.'
                    : 'Admin login is not configured on the server yet.'}
              </p>
            </div>
            {authState.isAdmin ? (
              <button type="button" className="button button--ghost access-panel__action" onClick={handleAdminLogout}>
                Logout
              </button>
            ) : (
              <button
                type="button"
                className="button button--primary access-panel__action"
                onClick={() => setIsLoginOpen(true)}
                disabled={authState.isLoading}
              >
                Admin Login
              </button>
            )}
          </div>
        </section>

        <Legend
          roomLabel={ROOM_TABS.find((room) => room.key === activeRoom)?.label ?? activeRoom}
          occupiedCount={occupiedCount}
          availableCount={availableCount}
        />
      </header>

      <main className="plan-stage">
        {activeRoom === 'room1' ? (
          <RoomOnePlan desks={activeDesks} onDeskClick={handleDeskOpen} canEdit={authState.isAdmin} />
        ) : (
          <RoomTwoPlan desks={activeDesks} onDeskClick={handleDeskOpen} canEdit={authState.isAdmin} />
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

      {isLoginOpen ? (
        <AdminLoginModal
          isConfigured={authState.isConfigured}
          onClose={() => setIsLoginOpen(false)}
          onLogin={handleAdminLogin}
        />
      ) : null}
    </div>
  );
}

export default App;
