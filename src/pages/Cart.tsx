import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';

const Cart = () => {
  const { items, removeItem, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
        },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      toast.error(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Browse our products and find something you love.</p>
          <Link to="/products">
            <Button className="mt-6">Browse Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Cart</h1>

        <div className="mt-8 space-y-4">
          {items.map(({ product }) => (
            <div key={product.id} className="flex items-center gap-4 rounded-lg border p-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">—</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${product.id}`} className="font-medium hover:underline">
                  {product.name}
                </Link>
                <p className="text-sm text-muted-foreground">Digital download</p>
              </div>
              <span className="font-semibold">${product.price.toFixed(2)}</span>
              <Button variant="ghost" size="icon" onClick={() => removeItem(product.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border p-6">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <Button className="mt-4 w-full" size="lg" onClick={handleCheckout} disabled={loading}>
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
