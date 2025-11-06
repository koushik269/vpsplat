import React, { useState, useEffect } from 'react';

// --- Icon Components ---
// Using inline SVGs for icons to keep it in one file
const VpsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
    <line x1="6" y1="6" x2="6.01" y2="6"></line>
    <line x1="6" y1="18" x2="6.01" y2="18"></line>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const CpuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <rect x="9" y="9" width="6" height="6"></rect>
    <line x1="9" y1="1" x2="9" y2="4"></line>
    <line x1="15" y1="1" x2="15" y2="4"></line>
    <line x1="9" y1="20" x2="9" y2="23"></line>
    <line x1="15" y1="20" x2="15" y2="23"></line>
    <line x1="20" y1="9" x2="23" y2="9"></line>
    <line x1="20" y1="14" x2="23" y2="14"></line>
    <line x1="1" y1="9" x2="4" y2="9"></line>
    <line x1="1" y1="14" x2="4" y2="14"></line>
  </svg>
);

const RamIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12h20M2 6h20M2 18h20"></path>
    <path d="M5 4v16M19 4v16"></path>
  </svg>
);

const StorageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 5v14a9 9 0 0 1-18 0V5"></path>
    <path d="M3 5a9 9 0 0 1 18 0"></path>
  </svg>
);

// --- Main Application ---
function App() {
  // 'page' state acts as a simple router
  const [page, setPage] = useState('login'); // 'login', 'register', 'dashboard', 'order'
  const [user, setUser] = useState(null); // Will store user email
  const [servers, setServers] = useState([]); // List of user's servers

  // --- API/Auth Simulation ---

  // Simulates logging in
  const handleLogin = (email, password) => {
    // In a real app, you'd send this to your REST API
    // POST /api/login
    // For now, we just log the user in
    console.log(`Simulating login for ${email}`);
    setUser({ email });
    setPage('dashboard');
    // After login, you would fetch their existing servers
    // GET /api/servers
    // Simulating finding one existing server
    setServers([
      {
        id: 'sv_123abc',
        cores: 2,
        ram: 4,
        storage: 100,
        status: 'active',
        ip: '192.168.1.50',
        username: 'admin_prev',
        password: 'OldPassword123'
      }
    ]);
  };

  // Simulates registering
  const handleRegister = (email, password) => {
    // POST /api/register
    console.log(`Simulating registration for ${email}`);
    // Automatically log them in after registering
    setUser({ email });
    setPage('dashboard');
    setServers([]); // New user has no servers
  };

  // Simulates logging out
  const handleLogout = () => {
    setUser(null);
    setPage('login');
    setServers([]);
  };

  // Simulates ordering a new VPS
  const handleOrder = (plan) => {
    // This is the core flow
    // 1. Create a "pending" server to show the user
    const newServer = {
      id: `sv_${Math.random().toString(36).substr(2, 9)}`,
      ...plan,
      status: 'pending',
      ip: null,
      username: null,
      password: null
    };
    
    // 2. Add to state
    setServers(prevServers => [...prevServers, newServer]);
    setPage('dashboard'); // Go back to dashboard to see the new server

    // 3. In a real app, you send this to your REST API
    // POST /api/servers (body: { cores, ram, storage })
    // Your API would create a 'pending' entry in the database,
    // then trigger the Terraform/Proxmox worker.

    // 4. SIMULATE THE PROVISIONING DELAY
    console.log(`Simulating provisioning for server ${newServer.id}... This will take 8 seconds.`);
    setTimeout(() => {
      // 5. The worker is "done" and has "called back" to your API
      // to update the server. Now we update the state.
      const generatedDetails = {
        ip: `192.168.1.${Math.floor(Math.random() * 200) + 50}`, // Random IP
        username: `user_${Math.random().toString(36).substr(2, 6)}`,
        password: `P@ss${Math.random().toString(36).substr(2, 10)}`
      };
      
      console.log(`Provisioning complete for ${newServer.id}`, generatedDetails);

      setServers(prevServers => 
        prevServers.map(server => 
          server.id === newServer.id 
            ? { ...server, status: 'active', ...generatedDetails }
            : server
        )
      );
    }, 8000); // 8-second delay
  };

  // --- Render Logic ---
  const renderPage = () => {
    switch (page) {
      case 'login':
        return <LoginPage onLogin={handleLogin} goToRegister={() => setPage('register')} />;
      case 'register':
        return <RegisterPage onRegister={handleRegister} goToLogin={() => setPage('login')} />;
      case 'dashboard':
        return <DashboardPage user={user} servers={servers} onLogout={handleLogout} goToOrder={() => setPage('order')} />;
      case 'order':
        return <OrderPage onOrder={handleOrder} onCancel={() => setPage('dashboard')} />;
      default:
        return <LoginPage onLogin={handleLogin} goToRegister={() => setPage('register')} />;
    }
  };

  return (
    <>
      {/* This style tag is added to manually center the login page 
        because the Tailwind styling is not being applied. 
        This is a direct fix to "make log in portion perfect in middle".
      */}
      <style>{`
        .login-page-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f3f4f6; /* Added a light gray background */
          font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
        }
        .login-box {
          background-color: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          width: 100%;
          max-width: 28rem; /* 448px */
        }
        .login-title {
          font-size: 1.5rem; /* 24px */
          font-weight: 700;
          text-align: center;
          color: #4f46e5; /* indigo-600 */
          margin-bottom: 1.5rem;
        }
        .form-label {
          display: block;
          color: #374151; /* gray-700 */
          margin-bottom: 0.5rem;
        }
        .form-input-container {
          position: relative;
        }
        .form-input-icon {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          display: flex;
          align-items: center;
          padding-left: 0.75rem;
          color: #6b7280; /* gray-500 */
        }
        .form-input {
          width: 100%;
          padding-left: 2.5rem; /* pl-10 */
          padding-right: 0.75rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          border: 1px solid #d1d5db; /* gray-300 */
          border-radius: 0.5rem;
          box-sizing: border-box; /* Ensures padding doesn't affect width */
        }
        .form-input:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          border-color: #818cf8; /* indigo-400 */
        }
        .submit-button {
          width: 100%;
          background-color: #4f46e5; /* indigo-600 */
          color: white;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          font-weight: 500;
          font-size: 1em;
          transition: background-color 0.3s;
        }
        .submit-button:hover {
          background-color: #4338ca; /* indigo-700 */
        }
        .register-text {
          text-align: center;
          color: #4b5563; /* gray-600 */
          margin-top: 1rem;
        }
        .register-link {
          color: #4f46e5; /* indigo-600 */
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 1em;
        }
        .register-link:hover {
          text-decoration: underline;
        }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }

        /* Styles for other pages (to keep them usable) */
        .RegisterPage-container, .OrderPage-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f3f4f6;
          font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
        }
        .RegisterPage-box, .OrderPage-box {
          background-color: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          width: 100%;
          max-width: 28rem; /* 448px */
        }
        .OrderPage-box {
           max-width: 32rem; /* 512px */
        }
        .RegisterPage-title, .OrderPage-title {
          font-size: 1.5rem; /* 24px */
          font-weight: 700;
          text-align: center;
          color: #4f46e5; /* indigo-600 */
          margin-bottom: 1.5rem;
        }
        .RegisterPage-input, .OrderPage-select {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db; /* gray-300 */
          border-radius: 0.5rem;
          box-sizing: border-box; 
        }
        .RegisterPage-input:focus, .OrderPage-select:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          border-color: #818cf8; /* indigo-400 */
        }
        .OrderPage-button-container {
          display: flex;
          justify-content: space-between;
        }
        .cancel-button {
          background-color: #e5e7eb; /* gray-200 */
          color: #1f2937; /* gray-800 */
          padding: 0.5rem 1.5rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          font-weight: 500;
          font-size: 1em;
          transition: background-color 0.3s;
        }
        .cancel-button:hover {
          background-color: #d1d5db; /* gray-300 */
        }
        .error-box {
          background-color: #fee2e2; /* red-100 */
          border: 1px solid #f87171; /* red-400 */
          color: #b91c1c; /* red-700 */
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }

        /* Dashboard Styles */
        .DashboardPage-container {
          padding: 2rem;
          font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
        }
        .DashboardPage-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #d1d5db; /* gray-300 */
        }
        .DashboardPage-title {
          font-size: 1.875rem; /* 3xl */
          font-weight: 700;
          color: #4f46e5; /* indigo-600 */
          display: flex;
          align-items: center;
        }
        .DashboardPage-title svg {
          margin-right: 0.5rem;
        }
        .DashboardPage-user-info {
          display: flex;
          align-items: center;
        }
        .DashboardPage-user-email {
          color: #374151; /* gray-700 */
          margin-right: 1rem;
        }
        .DashboardPage-logout-button {
          background-color: #e5e7eb; /* gray-200 */
          padding: 0.5rem;
          border-radius: 9999px; /* rounded-full */
          border: none;
          cursor: pointer;
        }
        .DashboardPage-logout-button:hover {
          background-color: #d1d5db; /* gray-300 */
        }
        .DashboardPage-order-button {
          background-color: #10b981; /* green-500 */
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 1.125rem; /* text-lg */
          border: none;
          cursor: pointer;
          transition: background-color 0.3s;
          margin-bottom: 1.5rem;
        }
        .DashboardPage-order-button:hover {
          background-color: #059669; /* green-600 */
        }
        .DashboardPage-servers-title {
          font-size: 1.5rem; /* 2xl */
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .DashboardPage-servers-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .DashboardPage-servers-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1024px) {
          .DashboardPage-servers-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        .ServerCard-container {
          background-color: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        .ServerCard-title {
          font-size: 1.25rem; /* xl */
          font-weight: 700;
          margin-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb; /* gray-200 */
          padding-bottom: 0.5rem;
        }
        .ServerCard-specs {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .ServerCard-spec-item {
          display: flex;
          align-items: center;
        }
        .ServerCard-spec-item svg {
          margin-right: 0.5rem;
          color: #6b7280; /* gray-500 */
        }
        .ServerCard-pending-box {
          background-color: #fefce8; /* yellow-100 */
          border-left: 4px solid #f59e0b; /* yellow-500 */
          color: #a16207; /* yellow-700 */
          padding: 1rem;
          border-radius: 0.25rem;
        }
        .ServerCard-pending-flex {
          display: flex;
          align-items: center;
        }
        .ServerCard-spinner {
          animation: spin 1s linear infinite;
          border-radius: 9999px;
          height: 1.25rem; /* h-5 */
          width: 1.25rem; /* w-5 */
          border-bottom-width: 2px;
          border-color: #a16207; /* yellow-700 */
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .ServerCard-pending-text {
          margin-left: 0.75rem;
          font-weight: 600;
        }
        .ServerCard-pending-subtext {
          font-size: 0.875rem; /* sm */
          margin-top: 0.25rem;
        }
        .ServerCard-active-box {
          background-color: #f0fdf4; /* green-100 */
          border-left: 4px solid #22c55e; /* green-500 */
          color: #15803d; /* green-800 */
          padding: 1rem;
          border-radius: 0.25rem;
        }
        .ServerCard-active-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 1.125rem; /* text-lg */
        }
        .ServerCard-active-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.875rem; /* sm */
        }
      `}</style>
      <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
        {renderPage()}
      </div>
    </>
  );
}

// --- Page Components ---

function LoginPage({ onLogin, goToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    onLogin(email, password);
  };

  return (
    <div className="login-page-container">
      <div className="login-box">
        <h2 className="login-title">VPS Portal Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label" htmlFor="email">Email</label>
            <div className="form-input-container">
              <span className="form-input-icon">
                <UserIcon />
              </span>
              <input
                className="form-input"
                id="email" type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="form-input-container">
              <span className="form-input-icon">
                <LockIcon />
              </span>
              <input
                className="form-input"
                id="password" type="password" placeholder="********"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="submit-button"
          >
            Login
          </button>
        </form>
        <p className="register-text">
          Don't have an account?{' '}
          <button onClick={goToRegister} className="register-link">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

function RegisterPage({ onRegister, goToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      // Simple validation
      setError("Passwords do not match.");
      return;
    }
    setError('');
    onRegister(email, password);
  };

  return (
    <div className="RegisterPage-container">
      <div className="RegisterPage-box">
        <h2 className="RegisterPage-title">Create Account</h2>
        <form onSubmit={handleSubmit}>

          {/* Simple error message display */}
          {error && (
            <div className="error-box" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              className="RegisterPage-input"
              id="email" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              className="RegisterPage-input"
              id="password" type="password" placeholder="********"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="form-label" htmlFor="confirm">Confirm Password</label>
            <input
              className="RegisterPage-input"
              id="confirm" type="password" placeholder="********"
              value={confirm} onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="submit-button"
          >
            Register
          </button>
        </form>
        <p className="register-text">
          Already have an account?{' '}
          <button onClick={goToLogin} className="register-link">
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

function DashboardPage({ user, servers, onLogout, goToOrder }) {
  return (
    <div className="DashboardPage-container">
      <header className="DashboardPage-header">
        <h1 className="DashboardPage-title">
          <VpsIcon />
          <span>My VPS Dashboard</span>
        </h1>
        <div className="DashboardPage-user-info">
          <span className="DashboardPage-user-email">Welcome, {user.email}!</span>
          <button
            onClick={onLogout}
            className="DashboardPage-logout-button"
            title="Logout"
          >
            <LogOutIcon />
          </button>
        </div>
      </header>
      
      <div className="mb-6">
        <button
          onClick={goToOrder}
          className="DashboardPage-order-button"
        >
          + Order New VPS
        </button>
      </div>

      <h2 className="DashboardPage-servers-title">Your Servers</h2>
      {servers.length === 0 ? (
        <p className="text-gray-600">You don't have any servers yet. Why not order one?</p>
      ) : (
        <div className="DashboardPage-servers-grid">
          {servers.map(server => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      )}
    </div>
  );
}

function ServerCard({ server }) {
  return (
    <div className="ServerCard-container">
      <h3 className="ServerCard-title">Server {server.id}</h3>
      
      <div className="ServerCard-specs">
        <div className="ServerCard-spec-item">
          <CpuIcon />
          <span>{server.cores} vCores</span>
        </div>
        <div className="ServerCard-spec-item">
          <RamIcon />
          <span>{server.ram} GB RAM</span>
        </div>
        <div className="ServerCard-spec-item">
          <StorageIcon />
          <span>{server.storage} GB SSD</span>
        </div>
      </div>

      {server.status === 'pending' && (
        <div className="ServerCard-pending-box">
          <div className="ServerCard-pending-flex">
            <div className="ServerCard-spinner"></div>
            <span className="ServerCard-pending-text">Provisioning...</span>
          </div>
          <p className="ServerCard-pending-subtext">Your server is being created. This may take a few minutes.</p>
        </div>
      )}

      {server.status === 'active' && (
        <div className="ServerCard-active-box">
          <h4 className="ServerCard-active-title">Server Active!</h4>
          <div className="ServerCard-active-details">
            <p><strong>IP Address:</strong> {server.ip}</p>
            <p><strong>Username:</strong> {server.username}</p>
            <p><strong>Password:</strong> {server.password}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderPage({ onOrder, onCancel }) {
  const [cores, setCores] = useState('2');
  const [ram, setRam] = useState('4');
  const [storage, setStorage] = useState('100');

  const handleSubmit = (e) => {
    e.preventDefault();
    onOrder({
      cores: parseInt(cores),
      ram: parseInt(ram),
      storage: parseInt(storage)
    });
  };

  return (
    <div className="OrderPage-container">
      <div className="OrderPage-box">
        <h2 className="OrderPage-title">Order a New VPS</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="mb-4">
            <label className="form-label" htmlFor="cores">CPU Cores</label>
            <select
              id="cores"
              className="OrderPage-select"
              value={cores} onChange={(e) => setCores(e.target.value)}
            >
              <option value="1">1 vCore</option>
              <option value="2">2 vCores</option>
              <option value="4">4 vCores</option>
              <option value="8">8 vCores</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="ram">RAM</label>
            <select
              id="ram"
              className="OrderPage-select"
              value={ram} onChange={(e) => setRam(e.target.value)}
            >
              <option value="2">2 GB</option>
              <option value="4">4 GB</option>
              <option value="8">8 GB</option>
              <option value="16">16 GB</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="form-label" htmlFor="storage">Storage (SSD)</label>
            <select
              id="storage"
              className="OrderPage-select"
              value={storage} onChange={(e) => setStorage(e.target.value)}
            >
              <option value="50">50 GB</option>
              <option value="100">100 GB</option>
              <option value="200">200 GB</option>
              <option value="500">500 GB</option>
            </select>
          </div>

          <div className="OrderPage-button-container">
            <button
              type="button"
              onClick={onCancel}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
            >
              Place Order
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default App;