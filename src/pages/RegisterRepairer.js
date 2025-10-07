import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterRepairer.css';
import { AuthContext } from '../contexts/AuthContext'; 

function RegisterRepairer() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    brand: '',
    city: '',
    address: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); //access context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const url = isLogin
      ? 'http://localhost:5000/api/repairer/login'
      : 'http://localhost:5000/api/repairer/register';

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token || '');
        login('repairer'); //set role
        alert(`${isLogin ? 'Login' : 'Registration'} successful!`);
        navigate('/repairer-dashboard'); //go to dashboard
      } else {
        setError(data.message || `${isLogin ? 'Login' : 'Registration'} failed`);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      brand: '',
      city: '',
      address: '',
      password: ''
    });

    //Scroll to top on toggle
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="register-page">
      <img src="/assets/mecanist.png" alt="Repair Icon" className="form-icon" />
      <div className="form-container">
        <h2>{isLogin ? 'Login as Repairer' : 'Register as Repairer'}</h2>
        {error && <div className="text-danger text-center mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="full_name"
                  placeholder="Full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="brand"
                  placeholder="Brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="switch-link mt-3 text-center">
          <span>{isLogin ? "Don't have an account?" : "Already registered?"}</span>
          <br />
          <button className="switch-btn" type="button" onClick={toggleMode}>
            {isLogin ? 'Register as Repairer' : 'Login as Repairer'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterRepairer;
