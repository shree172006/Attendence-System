import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { GraduationCap, LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore(s => s.login);

  const handleLogin = (e) => {
    e.preventDefault();
    // Default to teacher since student portal is removed
    login({ role: 'teacher', name: 'Instructor', email });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-full)', color: 'var(--primary)', marginBottom: '1rem' }}>
            <GraduationCap size={40} />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Shree Sai Classes</h1>
          <p>Login to your Attendence portal</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="student@edu.com or teacher@edu.com" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
            <LogIn size={20} /> Access Portal
          </button>
        </form>
      </div>
    </div>
  );
}
