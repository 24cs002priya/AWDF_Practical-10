export default function ErrorMessage({ message, onRetry }) { return <div className="panel error" role="alert"><p>{message}</p>{onRetry && <button onClick={onRetry}>Retry</button>}</div>; }
