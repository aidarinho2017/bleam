import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import FormField from '@/components/ui/form-field';
import { authAPI } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    const validateToken = async () => {
      const resetToken = searchParams.get('token');
      if (!resetToken) {
        toast({
          title: 'Invalid reset link',
          description: 'This password reset link is invalid or has expired.',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }

      setToken(resetToken);
      setIsValidatingToken(true);

      try {
        await authAPI.validateResetToken(resetToken);
        setIsTokenValid(true);
      } catch (error: any) {
        toast({
          title: 'Invalid reset link',
          description: error.message,
          variant: 'destructive',
        });
        navigate('/login');
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [searchParams, navigate, toast]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !token) return;
    
    setIsLoading(true);
    try {
      await authAPI.resetPassword(token, formData.password);
      
      setIsPasswordReset(true);
      toast({
        title: 'Password reset successful!',
        description: 'Your password has been reset successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to reset password',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPasswordReset) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="flex items-center justify-between mb-8">
            <Link 
              to="/login" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
            <ThemeToggle />
          </div>

          <div className="p-8 rounded-lg border bg-card">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Password reset successful!
            </h1>
            
            <p className="text-muted-foreground mb-6">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            
            <Link to="/login">
              <Button className="w-full">
                Continue to login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Header with back button and theme toggle */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/login" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>
          <ThemeToggle />
        </div>

        <div className="p-8 rounded-lg border bg-card">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">Bleam</span>
            </Link>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Reset your password
            </h1>
            <p className="text-muted-foreground">
              Enter your new password below
            </p>
          </div>

          {/* Loading state while validating token */}
          {isValidatingToken ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-primary" />
              <p className="text-muted-foreground">Validating reset link...</p>
            </div>
          ) : isTokenValid ? (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                label="New Password"
                type="password"
                placeholder="Enter your new password"
                value={formData.password}
                onChange={(value) => setFormData({ ...formData, password: value })}
                error={errors.password}
                required
              />

              <FormField
                label="Confirm New Password"
                type="password"
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
                error={errors.confirmPassword}
                required
              />

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  'Reset password'
                )}
              </Button>
            </form>
          ) : null}

          {/* Back to login */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-primary hover:text-accent transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;