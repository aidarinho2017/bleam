import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, ArrowLeft, Loader2, Check } from 'lucide-react';
import FormField from '@/components/ui/form-field';
import GoogleSignInButton from '@/components/ui/google-signin-button';
import { authAPI } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
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
    
    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await authAPI.register({
        email: formData.email,
        password: formData.password
      });
      
      toast({
        title: 'Account created successfully!',
        description: 'Please sign in with your new account.',
      });
      
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, label: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak' };
    if (password.length < 8) return { strength: 2, label: 'Fair' };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 3, label: 'Strong' };
    }
    return { strength: 2, label: 'Fair' };
  };

  const { strength, label } = passwordStrength();

  return (
    <div className="min-h-screen flex">
      {/* Left side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 to-accent/20 items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
            <Bot className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Start your journey to automated customer success
          </h2>
          
          <p className="text-muted-foreground mb-6">
            Join thousands of businesses that trust Bleam to handle their customer communications.
          </p>

          <div className="space-y-3 text-left">
            {[
              'Create unlimited AI bots',
              'Connect to Telegram & WhatsApp',
              'Advanced analytics & insights',
              '24/7 customer support'
            ].map((feature, index) => (
              <div key={index} className="flex items-center text-sm">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header with back button and theme toggle */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
            <ThemeToggle />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">Bleam</span>
            </Link>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Create your account
            </h1>
            <p className="text-muted-foreground">
              Start building intelligent bots in minutes
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              error={errors.email}
              required
            />

            <div>
              <FormField
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(value) => setFormData({ ...formData, password: value })}
                error={errors.password}
                required
              />
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex space-x-1 mb-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded ${
                          strength >= level
                            ? strength === 1
                              ? 'bg-red-500'
                              : strength === 2
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-border'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password strength: {label}
                  </p>
                </div>
              )}
            </div>

            <FormField
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
              error={errors.confirmPassword}
              required
            />

            {/* Terms checkbox */}
            <div className="space-y-2">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20 mt-0.5"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-muted-foreground">
                  I agree to the{' '}
                  <Link to="#" className="text-primary hover:text-accent transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="#" className="text-primary hover:text-accent transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className="text-sm text-destructive">{errors.terms}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-In */}
          <GoogleSignInButton className="w-full" disabled={isLoading} />

          {/* Sign in link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-accent transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;