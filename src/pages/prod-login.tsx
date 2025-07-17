import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Calendar, Mail, Lock, Eye, EyeOff, Users, Shield, CheckCircle, Star, Info, Sparkles, Zap, Globe, ArrowRight } from "lucide-react";
import { ca } from "date-fns/locale";
import { authService } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';


const API_URL=import.meta.env.VITE_API_URL;



// GPU-optimized particle system
const ParticleSystem = ({ isActive, formProgress }) => {
   
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = Array.from({ length: 50 }, (_, i) => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        hue: 240 + Math.random() * 60,
        life: Math.random()
      }));
    };

    initParticles();

    // GPU-optimized animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      const intensity = isActive ? 1 : 0.3;
      const progressMultiplier = 1 + (formProgress / 100) * 2;

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx * intensity * progressMultiplier;
        particle.y += particle.vy * intensity * progressMultiplier;
        
        if (particle.x < 0) particle.x = canvas.offsetWidth;
        if (particle.x > canvas.offsetWidth) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.offsetHeight;
        if (particle.y > canvas.offsetHeight) particle.y = 0;

        particle.life += 0.01;
        if (particle.life > 1) particle.life = 0;

        const dynamicOpacity = particle.opacity * intensity * (0.5 + 0.5 * Math.sin(particle.life * Math.PI));

        ctx.save();
        ctx.globalAlpha = dynamicOpacity;
        ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${particle.hue}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, formProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)',
      }}
    />
  );
};

// Enhanced floating elements component
const FloatingElements = ({ isTyping, formProgress }) => {
  const elements = [
    { icon: Calendar, delay: 0, size: 24, position: { top: '20%', left: '10%' } },
    { icon: Users, delay: 1, size: 20, position: { top: '60%', left: '15%' } },
    { icon: Shield, delay: 2, size: 28, position: { top: '40%', left: '80%' } },
    { icon: Sparkles, delay: 3, size: 16, position: { top: '70%', left: '75%' } },
    { icon: Zap, delay: 4, size: 22, position: { top: '25%', left: '85%' } },
    { icon: Globe, delay: 5, size: 18, position: { top: '80%', left: '20%' } },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            top: element.position.top,
            left: element.position.left,
            willChange: 'transform',
          }}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 360],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 8,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <element.icon 
            size={element.size} 
            className="text-white/20"
            style={{
              filter: `hue-rotate(${formProgress * 3.6}deg)`,
              transform: `scale(${1 + formProgress / 200})`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

const EnhancedLogin = () => {
    interface ErrorType {
        email?: string;
        password?: string;
        submit?: string;
}

 const { login, isAuthenticated, isLoading } = useAuth();
  // State management
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formProgress, setFormProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({ email: '', password: '' });
 const [errors, setErrors] = useState<ErrorType>({});
  const navigate = useNavigate();


  if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }

  const shouldReduceMotion = useReducedMotion();

  // Animation states
  const [formScale, setFormScale] = useState(1);
  const [progressValue, setProgressValue] = useState(0);

  // Update animations based on state
  useEffect(() => {
    setFormScale(focusedField ? 1.02 : 1);
  }, [focusedField]);

  useEffect(() => {
    setProgressValue(formProgress);
  }, [formProgress]);

  // Mouse tracking for interactive effects
  const handleMouseMove = useCallback((e) => {
    if (e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    }
  }, []);

  // Experience steps with enhanced content
  const experienceSteps = [
    {
      title: "Welcome to the Future",
      subtitle: "AI-powered scheduling that adapts to your workflow",
      highlight: "Next-Gen Intelligence",
      gradient: "#8b5cf6, #ec4899, #3b82f6"
    },
    {
      title: "Seamless Collaboration",
      subtitle: "Connect teams across time zones effortlessly",
      highlight: "Global Connectivity",
      gradient: "#3b82f6, #06b6d4, #14b8a6"
    },
    {
      title: "Enterprise Security",
      subtitle: "Bank-level encryption protecting your data",
      highlight: "Fortress Protection",
      gradient: "#14b8a6, #10b981, #059669"
    }
  ];

  // Enhanced validation functions
  const clientValidateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Please enter a valid email address' };
    }
    return { valid: true, message: '' };
  };

  const clientValidatePassword = (password) => {
    
    const checks = {
      length: password.length >= 8 && password.length <= 28,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[_$.!]/.test(password),
      allowed: /^[a-zA-Z0-9_$.!]+$/.test(password)
    };

    const strengthScore = Object.values(checks).filter(Boolean).length;

    if (!checks.length) return { valid: false, message: 'Password must be 8-28 characters long', strength: strengthScore };
    if (!checks.uppercase) return { valid: false, message: 'Add at least 1 uppercase letter', strength: strengthScore };
    if (!checks.lowercase) return { valid: false, message: 'Add at least 1 lowercase letter', strength: strengthScore };
    if (!checks.number) return { valid: false, message: 'Add at least 1 number', strength: strengthScore };
    if (!checks.special) return { valid: false, message: 'Add at least 1 special character (_ $ ! .)', strength: strengthScore };
    if (!checks.allowed) return { valid: false, message: 'Only letters, numbers, and _ $ ! . are allowed', strength: strengthScore };

    return { valid: true, message: '', strength: strengthScore };
  };

  // Effects
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % experienceSteps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filledFields = Object.values(formData).filter(value => value.length > 0).length;
    const newProgress = (filledFields / Object.keys(formData).length) * 100;
    setFormProgress(newProgress);
  }, [formData]);

  // Event handlers
  const handleInputChange = (e) => {
    setIsTyping(true);
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    // if (authError) {
    //   clearError();
    //   setErrors(prev => ({ ...prev, submit: '' }));
    // }
    
    // Real-time validation
    const newErrors = { ...errors };
    if (name === 'email') {
      const validation = clientValidateEmail(value);
      newErrors.email = validation.valid ? '' : validation.message;
    } else if (name === 'password') {
      const validation = clientValidatePassword(value);
      newErrors.password = validation.valid ? '' : validation.message;
    }
    
    setErrors(newErrors);
    setTimeout(() => setIsTyping(false), 1000);
  };

  const handleCreateAccount = () => {
    // In a real app, this would navigate to /register
    console.log('Navigate to register page');
    alert('Redirecting to registration page...');
    navigate('/register');
  };

  const handleForgotPassword = () => {
    // In a real app, this would navigate to /forgot-password
    console.log('Navigate to forgot password page');
    alert('Redirecting to forgot password page...');
     navigate('/forgot-password');
  };

  const handleSocialLogin = (provider) => {
    // In a real app, this would initiate OAuth flow
    console.log(`${provider} login initiated`);
    alert(`Redirecting to ${provider} login...`);
  };

  const handleSubmit = async () => {
    // Validate form
    const emailValidation = clientValidateEmail(formData.email);
    const passwordValidation = clientValidatePassword(formData.password);
    
    if (!emailValidation.valid || !passwordValidation.valid) {
      setErrors({
        email: emailValidation.message,
        password: passwordValidation.message
      });
      return;
    }
    
    setIsSubmitting(true);
    // console.log('Submitting login form with:', formData);
    // try{
    //     const response = await fetch(`${API_URL}/api/auth/login`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },            
    //         body: JSON.stringify(formData),
    //         credentials: 'include'
    //     });
    try{
        const response = await login(formData);
        console.log('Login successful, navigating to dashboard');
        navigate('/dashboard');}
        catch(error){
            console.log(error);
        }
        
    }
    
    // Simulate API call
    // try {
    //   await new Promise(resolve => setTimeout(resolve, 2000));
    //   console.log('Login successful:', formData);
    // } catch (error) {
    //   setErrors({ submit: 'Login failed. Please try again.' });
    // } finally {
    //   setIsSubmitting(false);
    // }

  // Loading screen
  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <ParticleSystem isActive={true} formProgress={50} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10"
        >
          <motion.div
            className="w-20 h-20 border-4 border-purple-300/30 border-t-purple-400 rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ willChange: 'transform' }}
          />
          <motion.h2
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-white mb-2"
          >
            Initializing Experience
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-purple-200"
          >
            Preparing your premium workspace...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col lg:flex-row bg-slate-50 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Left Panel - Enhanced Form */}
      <motion.div 
        className="w-full lg:w-1/2 flex justify-center items-center p-4 sm:p-8 order-1 bg-white relative z-10"
        animate={{ scale: formScale }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{ willChange: 'transform' }}
      >
        {/* Dynamic Progress Bar */}
        <AnimatePresence>
          {formProgress > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-8 left-8 right-8"
            >
              <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-full relative"
                  animate={{ width: `${progressValue}%` }}
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  style={{ willChange: 'width' }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/30 rounded-full"
                    animate={{ x: ['0%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </div>
              <motion.p
                className="text-sm text-gray-600 mt-2 font-medium"
                animate={{ color: formProgress === 100 ? '#059669' : '#6b7280' }}
              >
                {formProgress < 30 ? "Getting started..." : 
                 formProgress < 70 ? "Looking good..." : 
                 formProgress < 100 ? "Almost there..." : "✨ Ready to sign in!"}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="w-full max-w-md"
          style={{ willChange: 'transform' }}
        >
          {/* Enhanced Header */}
          <motion.div className="text-center mb-8">
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 cursor-pointer relative overflow-hidden"
              whileHover={{ 
                scale: 1.1, 
                rotate: [0, -5, 5, 0],
                boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: isTyping 
                  ? "0 0 30px rgba(147, 51, 234, 0.6)" 
                  : "0 10px 30px rgba(0,0,0,0.15)"
              }}
              style={{ willChange: 'transform, box-shadow' }}
            >
              <Calendar className="w-10 h-10 text-white relative z-10" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                animate={{ 
                  scale: isTyping ? [1, 1.2, 1] : 1,
                  opacity: isTyping ? [0.3, 0.6, 0.3] : 0.3
                }}
                transition={{ duration: 2, repeat: isTyping ? Infinity : 0 }}
              />
            </motion.div>

            <motion.h1
              className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent mb-3"
              animate={{
                backgroundPosition: focusedField ? ['0%', '100%'] : '0%'
              }}
              transition={{ duration: 2, repeat: focusedField ? Infinity : 0 }}
            >
              Welcome Back
            </motion.h1>

            <motion.p
              className="text-gray-600"
              animate={{
                y: focusedField ? -2 : 0,
                color: focusedField ? '#7c3aed' : '#6b7280'
              }}
            >
              {focusedField === 'email' ? "✉️ Let's verify your identity" :
               focusedField === 'password' ? "🔐 Enter your secure passphrase" :
               "Sign in to your premium workspace"}
            </motion.p>
          </motion.div>

          {/* Enhanced Form Container */}
          <div className="space-y-6">
            {/* Email Field */}
            <motion.div
              animate={{ scale: focusedField === 'email' ? 1.02 : 1 }}
              style={{ willChange: 'transform' }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Email Address
                {formData.email && !errors.email && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-2 text-emerald-600 text-xs font-medium"
                  >
                    ✅ Verified
                  </motion.span>
                )}
              </label>

              <div className="relative group">
                <motion.div
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                  animate={{
                    color: focusedField === 'email' ? '#8b5cf6' : '#9ca3af',
                    scale: focusedField === 'email' ? 1.1 : 1
                  }}
                >
                  <Mail className="w-5 h-5 transition-all duration-300" />
                </motion.div>

                <motion.input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={(e) => e.key === 'Enter' && formData.password && handleSubmit()}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl outline-none transition-all duration-300 bg-white"
                  style={{
                    borderColor: errors.email ? '#ef4444' : 
                                focusedField === 'email' ? '#8b5cf6' : '#e5e7eb',
                    backgroundColor: errors.email ? '#fef2f2' : 'white',
                    boxShadow: focusedField === 'email' 
                      ? '0 0 0 4px rgba(139, 92, 246, 0.1)' 
                      : '0 1px 3px rgba(0,0,0,0.1)',
                    willChange: 'border-color, box-shadow'
                  }}
                />

                {formData.email && !errors.email && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  </motion.div>
                )}
              </div>

              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Field */}
            <motion.div
              animate={{ scale: focusedField === 'password' ? 1.02 : 1 }}
              style={{ willChange: 'transform' }}
            >
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                  {formData.password && !errors.password && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-2 text-emerald-600 text-xs font-medium"
                    >
                      🛡️ Secure
                    </motion.span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative group">
                <motion.div
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                  animate={{
                    color: focusedField === 'password' ? '#8b5cf6' : '#9ca3af',
                    scale: focusedField === 'password' ? 1.1 : 1
                  }}
                >
                  <Lock className="w-5 h-5 transition-all duration-300" />
                </motion.div>

                <motion.input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-4 text-lg border-2 rounded-xl outline-none transition-all duration-300"
                  style={{
                    borderColor: errors.password ? '#ef4444' : 
                                focusedField === 'password' ? '#8b5cf6' : '#e5e7eb',
                    backgroundColor: errors.password ? '#fef2f2' : 'white',
                    boxShadow: focusedField === 'password' 
                      ? '0 0 0 4px rgba(139, 92, 246, 0.1)' 
                      : '0 1px 3px rgba(0,0,0,0.1)',
                    willChange: 'border-color, box-shadow'
                  }}
                />

                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3"
                >
                  <div className="flex space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((level) => {
                      const validation = clientValidatePassword(formData.password);
                      const strength = validation.strength || 0;
                      return (
                        <motion.div
                          key={level}
                          className="h-2 flex-1 rounded-full"
                          animate={{
                            backgroundColor: strength >= level 
                              ? strength <= 2 ? '#ef4444' 
                                : strength <= 3 ? '#eab308' 
                                : strength <= 4 ? '#3b82f6' 
                                : '#10b981'
                              : '#e5e7eb'
                          }}
                          transition={{ delay: level * 0.1 }}
                        />
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-600">
                    Password strength: {
                      !formData.password ? 'None' :
                      (clientValidatePassword(formData.password).strength || 0) <= 2 ? 'Weak' :
                      (clientValidatePassword(formData.password).strength || 0) <= 3 ? 'Fair' :
                      (clientValidatePassword(formData.password).strength || 0) <= 4 ? 'Good' : 'Excellent'
                    }
                  </p>
                </motion.div>
              )}

              <AnimatePresence>
                {errors.password && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
                  >
                    {errors.password}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Enhanced Submit Button */}
            <motion.button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
              style={{
                background: isSubmitting 
                  ? 'linear-gradient(135deg, #a855f7, #6366f1)' 
                  : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                willChange: 'transform, box-shadow'
              }}
              whileHover={!isSubmitting ? { 
                scale: 1.02, 
                boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" 
              } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              animate={{
                boxShadow: formProgress === 100 
                  ? "0 0 40px rgba(139, 92, 246, 0.6)" 
                  : "0 4px 20px rgba(0,0,0,0.1)"
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                animate={{ x: isSubmitting ? ['-100%', '100%'] : '-100%' }}
                transition={{ 
                  duration: 1.5, 
                  repeat: isSubmitting ? Infinity : 0,
                  ease: "easeInOut"
                }}
              />
              
              <span className="relative z-10 flex items-center justify-center">
                {isSubmitting ? (
                  <>
                    <motion.div
                      className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Signing you in...
                  </>
                ) : (
                  <>
                    {formProgress === 100 ? "✨ Enter Your Workspace" : "Sign In"}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </motion.button>

            {/* Social Login */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  { name: 'Google', icon: '🌟', color: 'hover:bg-red-50 hover:border-red-200' },
                  { name: 'Microsoft', icon: '⚡', color: 'hover:bg-blue-50 hover:border-blue-200' }
                ].map((provider) => (
                  <motion.button
                    key={provider.name}
                    type="button"
                    onClick={() => handleSocialLogin(provider.name)}
                    className={`flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white transition-all duration-300 ${provider.color}`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ willChange: 'transform' }}
                  >
                    <span className="text-lg mr-2">{provider.icon}</span>
                    {provider.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Sign up link */}
          <motion.div 
            className="text-center mt-8"
            animate={{ y: isTyping ? -5 : 0 }}
          >
            <span className="text-gray-600">Don't have an account? </span>
            <motion.button
              className="text-purple-600 hover:text-purple-700 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateAccount}
            >
              Create one now →
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right Panel - Enhanced Experience */}
      <motion.div 
        className="w-full lg:w-1/2 relative min-h-[60vh] lg:min-h-screen order-2 overflow-hidden"
        animate={{
          background: `linear-gradient(135deg, ${experienceSteps[currentStep].gradient})`
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ willChange: 'background' }}
      >
        {/* Particle System */}
        <ParticleSystem isActive={isTyping || formProgress > 50} formProgress={formProgress} />
        
        {/* Floating Elements */}
        <FloatingElements isTyping={isTyping} formProgress={formProgress} />

        {/* Content */}
        <motion.div
          className="relative z-20 h-full p-8 lg:p-12 flex flex-col justify-center text-white"
          animate={{
            x: mousePosition.x * 5,
            y: mousePosition.y * 5
          }}
          transition={{ type: "spring", damping: 50, stiffness: 400 }}
          style={{ willChange: 'transform' }}
        >
          {/* Dynamic Content Slider */}
          <div className="mb-12 relative overflow-hidden">
            <motion.div
              animate={{ x: `${-currentStep * 100}%` }}
              transition={{ duration: 1.2, ease: [0.25, 0.25, 0, 1] }}
              className="flex"
              style={{ width: `${experienceSteps.length * 100}%`, willChange: 'transform' }}
            >
              {experienceSteps.map((step, index) => (
                <div key={index} className="w-full flex-shrink-0 pr-8">
                  <motion.h2 
                    className="text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                    animate={{ 
                      opacity: currentStep === index ? 1 : 0.3,
                      y: currentStep === index ? 0 : 20
                    }}
                    transition={{ delay: 0.2 }}
                  >
                    {step.title}
                  </motion.h2>
                  <motion.p 
                    className="text-xl text-white/90 mb-6"
                    animate={{ 
                      opacity: currentStep === index ? 1 : 0.3,
                      y: currentStep === index ? 0 : 20
                    }}
                    transition={{ delay: 0.4 }}
                  >
                    {step.subtitle}
                  </motion.p>
                  <motion.div
                    className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
                    animate={{ 
                      opacity: currentStep === index ? 1 : 0.3,
                      scale: currentStep === index ? 1 : 0.9
                    }}
                    transition={{ delay: 0.6 }}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    <span className="font-semibold">{step.highlight}</span>
                  </motion.div>
                </div>
              ))}
            </motion.div>

            {/* Progress Dots */}
            <div className="flex space-x-3 mt-8">
              {experienceSteps.map((_, index) => (
                <motion.button
                  key={index}
                  className="w-3 h-3 rounded-full bg-white/30"
                  animate={{
                    backgroundColor: currentStep === index ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
                    scale: currentStep === index ? 1.2 : 1
                  }}
                  whileHover={{ scale: 1.3 }}
                  onClick={() => setCurrentStep(index)}
                />
              ))}
            </div>
          </div>

          {/* Enhanced Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-6 mb-12"
            animate={{ y: formProgress > 50 ? -10 : 0 }}
          >
            {[
              { icon: Users, label: "Active Users", value: "2M+", color: "text-blue-300" },
              { icon: Shield, label: "Uptime", value: "99.9%", color: "text-green-300" },
              { icon: Zap, label: "Performance", value: "⚡ Fast", color: "text-yellow-300" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderColor: "rgba(255,255,255,0.3)"
                }}
                transition={{ delay: index * 0.1 }}
                style={{ willChange: 'transform, background-color' }}
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonial */}
          <motion.div
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            animate={{
              scale: formProgress === 100 ? 1.02 : 1,
              borderColor: formProgress === 100 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)"
            }}
            style={{ willChange: 'transform, border-color' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="text-sm text-white/80">
                <span className="font-semibold">Alex Rivera</span> • Tech Lead
              </div>
            </div>
            <motion.p 
              className="text-white/90 leading-relaxed"
              animate={{ opacity: isTyping ? 1 : 0.9 }}
            >
              "This platform transformed our team's productivity. The AI-powered scheduling is incredibly intuitive and saves us hours every week."
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EnhancedLogin;