import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, ArrowLeft, Loader2 } from 'lucide-react';
import FormField from '@/components/ui/form-field';
import GoogleSignInButton from '@/components/ui/google-signin-button';
import { authAPI } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useLanguage } from '@/contexts/LanguageContext';

const Login = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();
    const { toast } = useToast();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = t('emailRequired');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('emailInvalid');
        }

        if (!formData.password) {
            newErrors.password = t('passwordRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await authAPI.login(formData);

            toast({
                title: t('loginSuccessTitle'),
                description: t('loginSuccessDescription'),
            });

            navigate('/dashboard');
        } catch (error: any) {
            toast({
                title: t('loginFailedTitle'),
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Header with back button and theme toggle */}
                    <div className="flex items-center justify-between mb-8">
                        <Link
                            to="/"
                            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {t('backToHome')}
                        </Link>
                        <ThemeToggle />
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center space-x-2 mb-6">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gradient">{t('company')}</span>
                        </Link>

                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            {t('welcomeBack')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('signInToAccount')}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormField
                            label={t('emailLabel')}
                            type="email"
                            placeholder={t('enterEmail')}
                            value={formData.email}
                            onChange={(value) => setFormData({ ...formData, email: value })}
                            error={errors.email}
                            required
                        />

                        <FormField
                            label={t('passwordLabel')}
                            type="password"
                            placeholder={t('enterPassword')}
                            value={formData.password}
                            onChange={(value) => setFormData({ ...formData, password: value })}
                            error={errors.password}
                            required
                        />

                        {/* Remember me & Forgot password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
                                />
                                <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground">
                                    {t('rememberMe')}
                                </label>
                            </div>

                            <Link
                                to="/forgot-password"
                                className="text-sm text-primary hover:text-accent transition-colors"
                            >
                                {t('forgotPassword')}
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {t('signingIn')}
                                </>
                            ) : (
                                t('signIn')
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">{t('orContinueWith')}</span>
                        </div>
                    </div>

                    {/* Google Sign-In */}
                    <GoogleSignInButton className="w-full" disabled={isLoading} />

                    {/* Sign up link */}
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        {t('noAccount')}{' '}
                        <Link to="/register" className="text-primary hover:text-accent transition-colors font-medium">
                            {t('signUpFree')}
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right side - Visual */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 to-accent/20 items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                        <Bot className="w-12 h-12 text-white" />
                    </div>

                    <h2 className="text-2xl font-bold text-foreground mb-4">
                        {t('welcomeBackVisual')}
                    </h2>

                    <p className="text-muted-foreground">
                        {t('botsWaiting')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;