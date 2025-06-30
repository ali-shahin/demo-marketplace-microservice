import Layout from '../components/Layout';
import { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useRouter } from 'next/router';

export default function RegisterPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');
            login(data.user, data.token); // auto-login after registration
            setSuccess('Registration successful!');
            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout>
            <section style={{ padding: 40, maxWidth: 400, margin: '0 auto' }}>
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 16 }}>
                        <label>Email<br />
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%' }} />
                        </label>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label>Password<br />
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%' }} />
                        </label>
                    </div>
                    <button type="submit" disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </section>
        </Layout>
    );
}
