import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Package, Settings } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  const { data: orders } = useQuery({
    queryKey: ['my-orders', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleDownload = async (filePath: string, productName: string) => {
    try {
      const { data, error } = await supabase.storage.from('product-files').createSignedUrl(filePath, 300);
      if (error) throw error;
      window.open(data.signedUrl, '_blank');
    } catch {
      toast.error('Download failed');
    }
  };

  const isAdmin = user?.email === 'admin@example.com'; // Placeholder — will use roles table

  if (loading) return null;

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </Link>
          )}
        </div>

        <p className="mt-2 text-muted-foreground">Welcome, {user?.email}</p>

        <h2 className="mt-8 text-xl font-semibold">Your Purchases</h2>

        {!orders || orders.length === 0 ? (
          <Card className="mt-4">
            <CardContent className="py-12 text-center">
              <Package className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No purchases yet</p>
              <Link to="/products">
                <Button className="mt-4">Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-4 space-y-4">
            {orders.map((order: unknown) => (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Order #{order.id.slice(0, 8)}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.order_items?.map((item: unknown) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <span className="text-sm">{item.products?.name || 'Product'}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">${item.price?.toFixed(2)}</span>
                          {item.products?.file_path && order.status === 'completed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(item.products.file_path, item.products.name)}
                            >
                              <Download className="mr-1 h-3 w-3" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between border-t pt-3 text-sm">
                    <span className="capitalize text-muted-foreground">{order.status}</span>
                    <span className="font-semibold">Total: ${order.total?.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
