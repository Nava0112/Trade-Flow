// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('auth');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [response, setResponse] = useState('');
  const BASE_URL = 'http://localhost:2000/api';

  // Common fetch function
  const apiCall = async (endpoint, method = 'GET', body = null) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal: controller.signal,
      };
      if (body) options.body = JSON.stringify(body);

      const res = await fetch(`${BASE_URL}${endpoint}`, options);
      const contentType = res.headers.get('content-type') || '';
      let payload;
      if (contentType.includes('application/json')) {
        payload = await res.json();
      } else {
        payload = await res.text();
      }

      if (!res.ok) {
        const msg = typeof payload === 'string' ? payload : JSON.stringify(payload);
        const err = new Error(`HTTP ${res.status} ${res.statusText}: ${msg}`);
        setResponse(err.message);
        throw err;
      }

      setResponse(typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2));
      return payload;
    } catch (error) {
      const message = error.name === 'AbortError' ? 'Request timed out after 10s' : `Error: ${error.message}`;
      setResponse(message);
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  };

  // Auth Components
  const AuthSection = () => {
    const [signupData, setSignupData] = useState({ email: '', password: '', name: '', balance: 10000 });
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    const handleSignup = async () => {
      const email = signupData.email.trim();
      const password = signupData.password;
      const name = signupData.name.trim();
      const balanceNum = parseFloat(signupData.balance);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setResponse('Invalid email format');
        return;
      }
      if (!password || password.length < 8) {
        setResponse('Password must be at least 8 characters');
        return;
      }
      if (!Number.isFinite(balanceNum) || balanceNum < 0) {
        setResponse('Balance must be a non-negative number');
        return;
      }

      try {
        await apiCall('/auth/signup', 'POST', { email, password, name, balance: balanceNum });
      } catch {}
    };

    return (
      <div className="section">
        <h2>Authentication</h2>
        
        <div className="form-group">
          <h3>Sign Up</h3>
          <input type="email" placeholder="Email" value={signupData.email} 
            onChange={e => setSignupData({...signupData, email: e.target.value})} />
          <input type="password" placeholder="Password" value={signupData.password}
            onChange={e => setSignupData({...signupData, password: e.target.value})} />
          <input type="text" placeholder="Name" value={signupData.name}
            onChange={e => setSignupData({...signupData, name: e.target.value})} />
          <input type="number" placeholder="Balance" value={signupData.balance}
            onChange={e => setSignupData({...signupData, balance: e.target.value})} />
          <button onClick={handleSignup}>Sign Up</button>
        </div>

        <div className="form-group">
          <h3>Login</h3>
          <input type="email" placeholder="Email" value={loginData.email}
            onChange={e => setLoginData({...loginData, email: e.target.value})} />
          <input type="password" placeholder="Password" value={loginData.password}
            onChange={e => setLoginData({...loginData, password: e.target.value})} />
          <button onClick={async () => {
            try {
              const data = await apiCall('/auth/login', 'POST', loginData);
              if (data && typeof data === 'object' && data.user && typeof data.user === 'object') {
                setIsLoggedIn(true);
                setUserData(data.user);
              } else {
                setResponse('Invalid login response');
              }
            } catch (err) {
              // apiCall already setResponse
            }
          }}>Login</button>
        </div>

        <div className="form-group">
          <h3>Token Operations</h3>
          <button onClick={() => apiCall('/auth/refresh-token', 'POST')}>Refresh Token</button>
          <button onClick={async () => {
            await apiCall('/auth/logout', 'POST');
            setIsLoggedIn(false);
            setUserData(null);
          }}>Logout</button>
        </div>
      </div>
    );
  };

  // Stocks Components
  const StocksSection = () => {
    const [stockSymbol, setStockSymbol] = useState('');
    const [stockPrice, setStockPrice] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    return (
      <div className="section">
        <h2>Stock Management</h2>
        
        <div className="form-group">
          <h3>Create Stock (Admin)</h3>
          <input type="text" placeholder="Stock Symbol (e.g., AAPL)" value={stockSymbol}
            onChange={e => setStockSymbol(e.target.value)} />
          <button onClick={() => apiCall('/stocks', 'POST', { symbol: stockSymbol })}>Create Stock</button>
        </div>

        <div className="form-group">
          <h3>Get Stocks</h3>
          <button onClick={() => apiCall('/stocks', 'GET')}>Get All Stocks</button>
          
          <div style={{ marginTop: '10px' }}>
            <input type="number" placeholder="Min Price" value={priceRange.min}
              onChange={e => setPriceRange({...priceRange, min: e.target.value})} />
            <input type="number" placeholder="Max Price" value={priceRange.max}
              onChange={e => setPriceRange({...priceRange, max: e.target.value})} />
            <button onClick={() => {
              const min = parseFloat(priceRange.min);
              const max = parseFloat(priceRange.max);
              if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < 0) {
                setResponse('Please enter valid non-negative min and max prices');
                return;
              }
              if (min > max) {
                setResponse('Min price must be less than or equal to max price');
                return;
              }
              apiCall(`/stocks/price-range?min=${min}&max=${max}`, 'GET');
            }}>
              Get by Price Range
            </button>
          </div>
        </div>

        <div className="form-group">
          <h3>Update Stock Price (Admin)</h3>
          <input type="text" placeholder="Symbol" value={stockSymbol}
            onChange={e => setStockSymbol(e.target.value)} />
          <input type="number" placeholder="New Price" value={stockPrice}
            onChange={e => setStockPrice(e.target.value)} />
          <button onClick={() => apiCall(`/stocks/${stockSymbol}/price`, 'PUT', { price: stockPrice })}>
            Update Price
          </button>
        </div>

        <div className="form-group">
          <h3>Delete Stock (Admin)</h3>
          <input type="text" placeholder="Symbol to Delete" value={stockSymbol}
            onChange={e => setStockSymbol(e.target.value)} />
          <button onClick={() => apiCall(`/stocks/${stockSymbol}`, 'DELETE')}>Delete Stock</button>
        </div>
      </div>
    );
  };

  // Orders Components
  const OrdersSection = () => {
        const handleCreateOrder = async () => {
          const user_id = parseInt(orderData.user_id, 10);
          const quantity = parseInt(orderData.quantity, 10);
          const price = parseFloat(orderData.price);
          const symbol = (orderData.symbol || '').trim();
          const order_type = orderData.order_type;

          if (!Number.isInteger(user_id) || user_id <= 0) {
            setResponse('Invalid user ID');
            return;
          }
          if (!symbol) {
            setResponse('Symbol is required');
            return;
          }
          if (!Number.isInteger(quantity) || quantity <= 0) {
            setResponse('Quantity must be a positive integer');
            return;
          }
          if (!Number.isFinite(price) || price <= 0) {
            setResponse('Price must be a positive number');
            return;
          }

          try {
            await apiCall('/orders', 'POST', { user_id, symbol, quantity, price, order_type });
          } catch {}
        };
    const [orderData, setOrderData] = useState({
      user_id: '', symbol: '', quantity: '', price: '', order_type: 'BUY'
    });
    const [orderId, setOrderId] = useState('');
    const [orderStatus, setOrderStatus] = useState('');

    return (
      <div className="section">
        <h2>Order Management</h2>
        
        <div className="form-group">
          <h3>Create Order (Admin)</h3>
          <input type="number" placeholder="User ID" value={orderData.user_id}
            onChange={e => setOrderData({...orderData, user_id: e.target.value})} />
          <input type="text" placeholder="Symbol" value={orderData.symbol}
            onChange={e => setOrderData({...orderData, symbol: e.target.value})} />
          <input type="number" placeholder="Quantity" value={orderData.quantity}
            onChange={e => setOrderData({...orderData, quantity: e.target.value})} />
          <input type="number" placeholder="Price" value={orderData.price}
            onChange={e => setOrderData({...orderData, price: e.target.value})} />
          <select value={orderData.order_type}
            onChange={e => setOrderData({...orderData, order_type: e.target.value})}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
          <button onClick={handleCreateOrder}>Create Order</button>
        </div>

        <div className="form-group">
          <h3>Get Orders</h3>
          <button onClick={() => apiCall('/orders', 'GET')}>Get All Orders</button>
          <input type="text" placeholder="Order ID" value={orderId}
            onChange={e => setOrderId(e.target.value)} />
          <button onClick={() => apiCall(`/orders/${orderId}`, 'GET')}>Get Order by ID</button>
        </div>

        <div className="form-group">
          <h3>Update Order Status (Admin)</h3>
          <input type="text" placeholder="Order ID" value={orderId}
            onChange={e => setOrderId(e.target.value)} />
          <select value={orderStatus} onChange={e => setOrderStatus(e.target.value)}>
            <option value="">Select Status</option>
            <option value="PENDING">PENDING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          <button onClick={() => apiCall(`/orders/${orderId}/status`, 'PUT', { status: orderStatus })}>
            Update Status
          </button>
        </div>
      </div>
    );
  };

  // Wallet Components
  const WalletSection = () => {
    const [userId, setUserId] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionId, setTransactionId] = useState('');

    return (
      <div className="section">
        <h2>Wallet System</h2>
        
        <div className="form-group">
          <h3>Create Deposit</h3>
          <input type="number" placeholder="User ID" value={userId}
            onChange={e => setUserId(e.target.value)} />
          <input type="number" placeholder="Amount" value={amount}
            onChange={e => setAmount(e.target.value)} />
          <button onClick={() => apiCall(`/wallet/deposit/${userId}`, 'POST', { user_id: userId, amount })}>
            Create Deposit
          </button>
        </div>

        <div className="form-group">
          <h3>Check Balance</h3>
          <input type="number" placeholder="User ID" value={userId}
            onChange={e => setUserId(e.target.value)} />
          <button onClick={() => apiCall(`/wallet/balance/${userId}`, 'GET')}>
            Get Balance
          </button>
        </div>

        <div className="form-group">
          <h3>Confirm Deposit</h3>
          <input type="text" placeholder="Transaction ID" value={transactionId}
            onChange={e => setTransactionId(e.target.value)} />
          <button onClick={() => apiCall(`/wallet/deposit/confirm/${transactionId}`, 'POST')}>
            Confirm Deposit
          </button>
        </div>
      </div>
    );
  };

  // Transactions Components
  const TransactionsSection = () => {
    const [transactionId, setTransactionId] = useState('');
    const [targetUserId, setTargetUserId] = useState('');

    return (
      <div className="section">
        <h2>Transactions</h2>
        
        <div className="form-group">
          <h3>Get Transactions (Admin)</h3>
          <button onClick={() => apiCall('/transactions', 'GET')}>Get All Transactions</button>
        </div>

        <div className="form-group">
          <h3>Get User Transactions</h3>
          <input type="number" placeholder="User ID" value={targetUserId}
            onChange={e => setTargetUserId(e.target.value)} />
          <button onClick={() => apiCall(`/transactions/user/${targetUserId}`, 'GET')}>
            Get User Transactions
          </button>
        </div>

        <div className="form-group">
          <h3>Get/Delete Transaction</h3>
          <input type="text" placeholder="Transaction ID" value={transactionId}
            onChange={e => setTransactionId(e.target.value)} />
          <button onClick={() => apiCall(`/transactions/${transactionId}`, 'GET')}>
            Get Transaction
          </button>
          <button onClick={() => apiCall(`/transactions/${transactionId}`, 'DELETE')}>
            Delete Transaction (Admin)
          </button>
        </div>
      </div>
    );
  };

  // Users Components
  const UsersSection = () => {
    const [userEmail, setUserEmail] = useState('');
    const [targetUserId, setTargetUserId] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [userForm, setUserForm] = useState({
      name: '', email: '', password: '', balance: 5000
    });

    return (
      <div className="section">
        <h2>User Management</h2>
        
        <div className="form-group">
          <h3>Create User</h3>
          <input type="text" placeholder="Name" value={userForm.name}
            onChange={e => setUserForm({...userForm, name: e.target.value})} />
          <input type="email" placeholder="Email" value={userForm.email}
            onChange={e => setUserForm({...userForm, email: e.target.value})} />
          <input type="password" placeholder="Password" value={userForm.password}
            onChange={e => setUserForm({...userForm, password: e.target.value})} />
          <input type="number" placeholder="Balance" value={userForm.balance}
            onChange={e => setUserForm({...userForm, balance: e.target.value})} />
          <button onClick={() => apiCall('/users', 'POST', userForm)}>Create User</button>
        </div>

        <div className="form-group">
          <h3>Get Users (Admin)</h3>
          <button onClick={() => apiCall('/users', 'GET')}>Get All Users</button>
          
          <div style={{ marginTop: '10px' }}>
            <input type="email" placeholder="Email" value={userEmail}
              onChange={e => setUserEmail(e.target.value)} />
            <button onClick={() => apiCall(`/users/email/${userEmail}`, 'GET')}>
              Get User by Email
            </button>
          </div>
        </div>

        <div className="form-group">
          <h3>Update/Delete User</h3>
          <input type="number" placeholder="User ID" value={targetUserId}
            onChange={e => setTargetUserId(e.target.value)} />
          <input type="password" placeholder="New Password" value={newPassword}
            onChange={e => setNewPassword(e.target.value)} />
          <button onClick={() => apiCall(`/users/${targetUserId}/password`, 'PUT', { password: newPassword })}>
            Update Password
          </button>
          <button onClick={() => apiCall(`/users/${targetUserId}`, 'DELETE')}>
            Delete User
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Trade-Flow Backend Tester</h1>
        <div className="status">
          Status: {isLoggedIn ? `Logged in as ${userData?.email}` : 'Not logged in'}
        </div>
      </header>

      <nav className="tabs">
        {['auth', 'stocks', 'orders', 'wallet', 'transactions', 'users'].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </nav>

      <main className="main">
        {activeTab === 'auth' && <AuthSection />}
        {activeTab === 'stocks' && <StocksSection />}
        {activeTab === 'orders' && <OrdersSection />}
        {activeTab === 'wallet' && <WalletSection />}
        {activeTab === 'transactions' && <TransactionsSection />}
        {activeTab === 'users' && <UsersSection />}
      </main>

      <div className="response-panel">
        <h3>API Response</h3>
        <pre className="response">{response || 'No response yet...'}</pre>
      </div>
    </div>
  );
}

export default App;