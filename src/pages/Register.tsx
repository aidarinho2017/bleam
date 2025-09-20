import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, ArrowLeft, Loader2, Check } from 'lucide-react';
import FormField from '@/components/ui/form-field';
import GoogleSignInButton from '@/components/ui/google-signin-button';
import { authAPI } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useLanguage } from '@/contexts/LanguageContext';

const Register = () => {
    const { t } = useLanguage();
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
            newErrors.email = t('emailRequired');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('emailInvalid');
        }

        if (!formData.password) {
            newErrors.password = t('passwordRequired');
        } else if (formData.password.length < 6) {
            newErrors.password = t('passwordMinLength');
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = t('confirmPasswordRequired');
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('passwordsDoNotMatch');
        }

        if (!agreeToTerms) {
            newErrors.terms = t('termsRequired');
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
                title: t('registerSuccessTitle'),
                description: t('registerSuccessDescription'),
            });

            navigate('/login');
        } catch (error: any) {
            toast({
                title: t('registerFailedTitle'),
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
        if (password.length < 6) return { strength: 1, label: t('passwordStrengthWeak') };
        if (password.length < 8) return { strength: 2, label: t('passwordStrengthFair') };
        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
            return { strength: 3, label: t('passwordStrengthStrong') };
        }
        return { strength: 2, label: t('passwordStrengthFair') };
    };

    const { strength, label } = passwordStrength();

    const features = [
        t('featureUnlimitedBots'),
        t('featureConnectPlatforms'),
        t('featureAdvancedAnalytics'),
        t('feature247Support')
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left side - Visual */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 to-accent/20 items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                        <Bot className="w-12 h-12 text-white" />
                    </div>

                    <h2 className="text-2xl font-bold text-foreground mb-4">
                        {t('registerJourneyTitle')}
                    </h2>

                    <p className="text-muted-foreground mb-6">
                        {t('registerJourneySubtitle')}
                    </p>

                    <div className="space-y-3 text-left">
                        {features.map((feature, index) => (
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
                            {t('createAccountTitle')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('createAccountSubtitle')}
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

                        <div>
                            <FormField
                                label={t('passwordLabel')}
                                type="password"
                                placeholder={t('createStrongPassword')}
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
                                        {t('passwordStrengthLabel')} {label}
                                    </p>
                                </div>
                            )}
                        </div>

                        <FormField
                            label={t('confirmPasswordLabel')}
                            type="password"
                            placeholder={t('confirmPasswordPlaceholder')}
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
                                    {t('agreeTo')}{' '}
                                    <Link to="#" className="text-primary hover:text-accent transition-colors">
                                        {t('termsOfService')}
                                    </Link>{' '}
                                    {t('and')}{' '}
                                    <Link to="#" className="text-primary hover:text-accent transition-colors">
                                        {t('privacyPolicy')}
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
                                    {t('creatingAccountButton')}
                                </>
                            ) : (
                                t('createAccountButton')
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

                    {/* Sign in link */}
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        {t('alreadyHaveAccount')}{' '}
                        <Link to="/login" className="text-primary hover:text-accent transition-colors font-medium">
                            {t('signIn')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
