import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
const Cars = lazy(() => import('./pages/Cars'));
const Contact = lazy(() => import('./pages/Contact'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
function NotFound() { return <section className="panel"><h1>404 — Page not found</h1><p>That nexTrip page does not exist.</p></section>; }
export default function App() {
    const [theme, setTheme] = useState('dark');
    const [user, setUser] = useState(null);
    useEffect(() => { document.documentElement.className = theme; }, [theme]);
    useEffect(() => {
        const sync = () => {
            if (!localStorage.getItem('nextrip_token'))
                setUser(null);
            else
                import('./services/api').then(({ getMe }) => getMe().then(setUser).catch(() => setUser(null)));
        };
        sync();
        window.addEventListener('nextrip:unauthorized', sync);
        return () => window.removeEventListener('nextrip:unauthorized', sync);
    }, []);
    return <BrowserRouter><NavBar theme={theme} onToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} authenticated={!!user} onLogout={() => { localStorage.removeItem('nextrip_token'); setUser(null); }}/><main><Suspense fallback={<div className="row" role="status"><span className="spinner"/>Loading page…</div>}><Routes><Route path="/" element={<Home />}/><Route path="/cars" element={<Cars />}/><Route path="/projects" element={<Navigate to="/cars" replace/>}/><Route path="/contact" element={<Contact />}/><Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace/>}/><Route path="/login" element={<AuthPage mode="login" onLogin={setUser}/>}/><Route path="/register" element={<AuthPage mode="register" onLogin={setUser}/>}/><Route path="*" element={<NotFound />}/></Routes></Suspense></main><footer>© {new Date().getFullYear()} nexTrip · Discover your next drive</footer></BrowserRouter>;
}
