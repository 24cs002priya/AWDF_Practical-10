import { useEffect, useMemo, useState } from 'react';
import { getCars } from '../services/api';
import CarCard from '../components/CarCard';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
export default function Cars() {
    const [cars, setCars] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState(''), [retry, setRetry] = useState(0), [search, setSearch] = useState('');
    useEffect(() => {
        let live = true;
        setLoading(true);
        setError('');
        getCars().then(x => {
            if (live)
                setCars(x);
        }).catch(e => {
            if (live)
                setError(e.message);
        }).finally(() => {
            if (live)
                setLoading(false);
        });
        return () => { live = false; };
    }, [retry]);
    const filtered = useMemo(() => cars.filter(c => `${c.title} ${c.brand}`.toLowerCase().includes(search.toLowerCase())), [cars, search]);
    return <><h1>Explore cars</h1><label>Search listings<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Brand or model"/></label><section className="section">{loading ? <Spinner /> : error ? <ErrorMessage message={error} onRetry={() => setRetry(x => x + 1)}/> : <><p>{filtered.length} listings</p><div className="grid">{filtered.map(c => <CarCard key={c._id || c.id} car={c}/>)}</div>{!filtered.length && <p>No matching listings yet.</p>}</>}</section></>;
}
