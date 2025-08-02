import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const OAuth2Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store token in localStorage
      localStorage.setItem('auth_token', token);
      
      toast({
        title: 'Welcome!',
        description: 'You have been successfully signed in with Google.',
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      toast({
        title: 'Sign-in failed',
        description: 'No authentication token received.',
        variant: 'destructive',
      });
      
      // Redirect to login
      navigate('/login');
    }
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Completing sign-in...</p>
      </div>
    </div>
  );
};

export default OAuth2Success;