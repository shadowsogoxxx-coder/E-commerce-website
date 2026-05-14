import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
        navigate('/dashboard');
      } else if (mode === 'signup') {
        await signUp(email, password);
      } else {
        await resetPassword(email);
      }
    } catch (err: unknown) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto flex max-w-md items-center justify-center px-4 py-24">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle>
              {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </CardTitle>
            <CardDescription>
              {mode === 'signin'
                ? 'Welcome back'
                : mode === 'signup'
                ? 'Start shopping for digital products'
                : 'Enter your email to reset your password'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              {mode !== 'reset' && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                </div>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button className="w-full" type="submit" disabled={loading}>
                {loading
                  ? 'Loading...'
                  : mode === 'signin'
                  ? 'Sign In'
                  : mode === 'signup'
                  ? 'Create Account'
                  : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground space-y-1">
              {mode === 'signin' && (
                <>
                  <p>
                    Don't have an account?{' '}
                    <button onClick={() => setMode('signup')} className="text-foreground underline">Sign up</button>
                  </p>
                  <p>
                    <button onClick={() => setMode('reset')} className="text-foreground underline">Forgot password?</button>
                  </p>
                </>
              )}
              {mode === 'signup' && (
                <p>
                  Already have an account?{' '}
                  <button onClick={() => setMode('signin')} className="text-foreground underline">Sign in</button>
                </p>
              )}
              {mode === 'reset' && (
                <p>
                  <button onClick={() => setMode('signin')} className="text-foreground underline">Back to sign in</button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Auth;
