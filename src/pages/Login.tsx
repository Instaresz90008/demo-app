
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Users, Crown, UserPlus, Building, User, Briefcase, GraduationCap, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
// import { authService } from '@/services/authService';

// Organize demo credentials by categories for better UX
const DEMO_CREDENTIAL_CATEGORIES = {
  platform: {
    title: 'Platform Level',
    icon: Crown,
    users: [
      {
        email: 'admin@platform.com',
        password: 'admin123B.',
        name: 'Platform Admin',
        role: 'platform_admin',
        tier: 'enterprise',
        description: 'Full platform access with all features'
      }
    ]
  },
  organizations: {
    title: 'Organization Admins',
    icon: Building,
    users: [
      {
        email: 'admin@techcorp.com',
        password: 'admin123',
        name: 'Sarah Johnson',
        role: 'org_admin',
        tier: 'professional',
        description: 'TechCorp admin with Professional plan'
      },
      {
        email: 'owner@startup.io',
        password: 'admin123',
        name: 'Mike Chen',
        role: 'org_admin',
        tier: 'advanced',
        description: 'Startup owner with Advanced plan'
      },
      {
        email: 'trial@newcompany.com',
        password: 'trial123',
        name: 'Jennifer Lee',
        role: 'org_admin',
        tier: 'trial',
        description: 'Trial organization admin'
      }
    ]
  },
  teams: {
    title: 'Team Management',
    icon: Users,
    users: [
      {
        email: 'teamlead@techcorp.com',
        password: 'team123',
        name: 'Alex Rodriguez',
        role: 'team_admin',
        tier: 'professional',
        description: 'Team lead at TechCorp'
      },
      {
        email: 'manager@consulting.biz',
        password: 'team123',
        name: 'Emma Wilson',
        role: 'team_admin',
        tier: 'advanced',
        description: 'Consulting team manager'
      },
      {
        email: 'developer@techcorp.com',
        password: 'dev123',
        name: 'James Park',
        role: 'team_member',
        tier: 'professional',
        description: 'Developer team member'
      },
      {
        email: 'designer@startup.io',
        password: 'design123',
        name: 'Lisa Zhang',
        role: 'team_member',
        tier: 'advanced',
        description: 'Designer team member'
      }
    ]
  },
  individuals: {
    title: 'Individual Users',
    icon: User,
    users: [
      {
        email: 'freelancer@gmail.com',
        password: 'freelance123',
        name: 'David Smith',
        role: 'end_user',
        tier: 'advanced',
        description: 'Freelance consultant'
      },
      {
        email: 'consultant@outlook.com',
        password: 'consult123',
        name: 'Maria Garcia',
        role: 'end_user',
        tier: 'professional',
        description: 'Independent consultant'
      },
      {
        email: 'student@university.edu',
        password: 'student123',
        name: 'Tom Anderson',
        role: 'end_user',
        tier: 'free',
        description: 'University student'
      },
      {
        email: 'demo@example.com',
        password: 'demo123',
        name: 'Demo User',
        role: 'end_user',
        tier: 'free',
        description: 'Basic demo account'
      }
    ]
  }
};

const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      console.log('Submitting login form with:', formData.email);
      await login(formData);
      console.log('Login successful, navigating to dashboard');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (email: string, password: string) => {
    setFormData({ email, password });
    setError('');
    setIsSubmitting(true);

    try {
      console.log('Quick login attempt for:', email);
      await login({ email, password });
      console.log('Quick login successful, navigating to dashboard');
      navigate('/dashboard');
    } catch (err) {
      console.error('Quick login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupClick = () => {
    navigate('/register');
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'trial': return 'bg-orange-100 text-orange-800';
      case 'advanced': return 'bg-blue-100 text-blue-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'trial': return Clock;
      case 'enterprise': return Crown;
      case 'professional': return Briefcase;
      case 'free': return GraduationCap;
      default: return User;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={handleSignupClick}
                className="w-full mt-4 flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Create New Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="shadow-lg max-h-[700px] overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Demo Test Accounts
            </CardTitle>
            <CardDescription>
              Click any account to instantly login and test different subscription tiers and user roles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(DEMO_CREDENTIAL_CATEGORIES).map(([categoryKey, category]) => {
              const IconComponent = category.icon;
              return (
                <div key={categoryKey} className="space-y-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    {category.title}
                  </h3>
                  
                  <div className="space-y-2">
                    {category.users.map((user, index) => {
                      const TierIcon = getTierIcon(user.tier);
                      return (
                        <div
                          key={index}
                          className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => handleQuickLogin(user.email, user.password)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-sm">{user.name}</div>
                            <Badge className={getTierColor(user.tier)}>
                              <TierIcon className="h-3 w-3 mr-1" />
                              {user.tier}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div><strong>Email:</strong> {user.email}</div>
                            <div><strong>Password:</strong> {user.password}</div>
                            <div className="text-xs italic">{user.description}</div>
                            <Badge variant="outline" className="text-[10px] py-0 px-1">
                              {user.role.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
