import { useEffect, useState } from 'react';
import { createCar, deleteCar, getCars, updateCar, generateDescription } from '../services/api';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import CarCard from '../components/CarCard';
const empty = { title: '', brand: '', description: '', price: '', year: '' };
export default function Dashboard({ ai = false }) {
    const [cars, setCars] = useState([]), [form, setForm] = useState(empty), [editing, setEditing] = useState(null), [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState(''), [aiBusy, setAiBusy] = useState(false), [aiNote, setAiNote] = useState('');
    async function refresh() {
        setLoading(true);
        setError('');
        try {
            setCars(await getCars());
        }
        catch (e) {
            setError(e.message);
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => { refresh(); }, []);
    function change(e) { setForm(p => ({ ...p, [e.target.name]: e.target.value })); }
    async function save(e) {
        e.preventDefault();
        setBusy(true);
        setError('');
        setNotice('');
        try {
            const payload = { ...form, price: Number(form.price), year: Number(form.year) };
            if (editing)
                await updateCar(editing, payload);
            else
                await createCar(payload);
            setForm(empty);
            setEditing(null);
            await refresh();
            setNotice(editing ? 'Listing updated.' : 'Listing created.');
        }
        catch (e) {
            setError(e.message);
        }
        finally {
            setBusy(false);
        }
    }
    function edit(car) { setEditing(car._id || car.id); setForm({ title: car.title, brand: car.brand || '', description: car.description || '', price: String(car.price), year: String(car.year || '') }); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    async function remove(car) {
        if (!window.confirm(`Delete ${car.title}?`))
            return;
        setBusy(true);
        setError('');
        try {
            await deleteCar(car._id || car.id);
            await refresh();
            setNotice('Listing deleted.');
        }
        catch (e) {
            setError(e.message);
        }
        finally {
            setBusy(false);
        }
    }
    async function suggest() {
        if (!form.title.trim())
            return;
        setAiBusy(true);
        setAiNote('');
        try {
            const result = await generateDescription(form.title);
            if (result.fallback) {
                setAiNote(result.message || 'AI unavailable; write the description manually.');
            }
            else {
                setForm(p => ({ ...p, description: result.description }));
                setAiNote('AI-generated suggestion. Please review and edit before saving.');
            }
        }
        catch (e) {
            setAiNote(`AI unavailable: ${e.message}. You can still save manually.`);
        }
        finally {
            setAiBusy(false);
        }
    }
    return <><h1>Manage car listings</h1><form className="panel stack" onSubmit={save}><h2>{editing ? 'Edit' : 'Add'} a car</h2><label>Model / title<input required name="title" maxLength="120" value={form.title} onChange={change}/></label><label>Brand<input name="brand" value={form.brand} onChange={change}/></label><label>Price (INR)<input required min="1" type="number" name="price" value={form.price} onChange={change}/></label><label>Year<input required min="1950" max="2100" type="number" name="year" value={form.year} onChange={change}/></label><label>Description<textarea name="description" value={form.description} onChange={change}/></label>{ai && <><button type="button" disabled={aiBusy || !form.title.trim()} onClick={suggest}>{aiBusy ? 'Generating…' : 'Generate description with AI'}</button><p className="small muted">Only the car title is sent to the external AI provider. Review AI output before use.</p>{aiNote && <p className="notice" role="status">{aiNote}</p>}</>}<div className="row"><button disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Create listing'}</button>{editing && <button type="button" onClick={() => { setEditing(null); setForm(empty); }}>Cancel edit</button>}</div></form>{notice && <p role="status" className="notice">{notice}</p>}{error && <ErrorMessage message={error} onRetry={refresh}/>}<h2>Your car listings</h2>{loading ? <Spinner /> : <div className="grid">{cars.map(c => <CarCard key={c._id || c.id} car={c}><div className="row"><button disabled={busy} onClick={() => edit(c)}>Edit</button><button disabled={busy} className="danger" onClick={() => remove(c)}>Delete</button></div></CarCard>)}</div>}</>;
}
