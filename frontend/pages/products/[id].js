import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ProductDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        async function fetchProduct() {
            setLoading(true);
            setError(null);
            try {
                // Replace with your actual product-service API endpoint
                const res = await fetch(`http://localhost:8081/products/${id}`);
                if (!res.ok) throw new Error('Product not found');
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    return (
        <Layout>
            <section style={{ padding: 40 }}>
                {loading && <p>Loading product...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {product && (
                    <div>
                        <h2>{product.name}</h2>
                        <p><strong>Price:</strong> ${product.price}</p>
                        <p><strong>Description:</strong> {product.description}</p>
                        <p><strong>Stock:</strong> {product.stock}</p>
                    </div>
                )}
            </section>
        </Layout>
    );
}
