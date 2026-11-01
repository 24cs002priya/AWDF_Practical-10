import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';
export default function AuthPage({ mode, onLogin }) {
    const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [name, setName] = useState(''), [role, setRole] = useState('buyer'), [error, setError] = useState(''), [busy, setBusy] = useState(false);
    const navigate = useNavigate();
    async function submit(e) {
        e.preventDefault();
        setBusy(true);
        setError('');
        try {
            if (mode === 'register') {
                await register({ name, email, password, role });
                navigate('/login');
            }
            else {
                const result = await login({ email, password });
                localStorage.setItem('nextrip_token', result.token);
                onLogin(result.user);
                navigate('/dashboard');
            }
        }
        catch (e) {
            setError(e.message);
        }
        finally {
            setBusy(false);
        }
    }
    return <form className="panel stack" onSubmit={submit}><h1>{mode === 'register' ? 'Create account' : 'Login'}</h1>{mode === 'register' && <><label>Name<input required value={name} onChange={e => setName(e.target.value)}/></label><label>Role<select value={role} onChange={e => setRole(e.target.value)}><option value="buyer">Buyer</option><option value="dealer">Dealer</option></select></label></>}<label>Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)}/></label><label>Password<input required minLength="8" type="password" value={password} onChange={e => setPassword(e.target.value)}/></label>{error && <p className="notice error" role="alert">{error}</p>}<button disabled={busy}>{busy ? 'Please wait…' : mode === 'register' ? 'Register' : 'Login'}</button><p>{mode === 'register' ? <Link to="/login">Already registered? Login</Link> : <Link to="/register">Need an account? Register</Link>}</p></form>;
}
