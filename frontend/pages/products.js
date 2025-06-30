import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            setError(null);
            try {
                // Replace with your actual product-service API endpoint
                const res = await fetch('http://localhost:8081/products');
                if (!res.ok) throw new Error('Failed to fetch products');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    return (
        <Layout>
            <section style={{ padding: 40 }}>
                <h2>Product Listing</h2>
                {loading && <p>Loading products...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <ul>
                    {products.map((product) => (
                        <li key={product.id} style={{ marginBottom: 16 }}>
                            <Link href={`/products/${product.id}`} style={{ fontWeight: 'bold', color: '#0070f3', textDecoration: 'underline' }}>
                                {product.name}
                            </Link> — ${product.price}
                            <br />
                            <span>{product.description}</span>
                        </li>
                    ))}
                </ul>
                {(!loading && products.length === 0) && <p>No products found.</p>}
            </section>
        </Layout>
    );
}
