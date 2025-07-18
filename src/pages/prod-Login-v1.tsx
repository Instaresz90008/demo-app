import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, CheckCircle, ArrowRight, Sparkles, Zap, Shield, Star, Calendar, Users } from "lucide-react";
import { sub } from "date-fns";
import { useNavigate } from "react-router-dom";

interface FormData {
  email: string;
  password: string;
}

interface ErrorType {
  email?: string;
  password?: string;
  submit?: string;
}

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

    const initParticles = () => {
      particlesRef.current = Array.from({ length: 50 }, () => ({
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

// Enhanced floating elements
const FloatingElements = ({ isTyping, formProgress }) => {
  const elements = [
    { icon: Calendar, delay: 0, size: 24, position: { top: '20%', left: '10%' } },
    { icon: Users, delay: 1, size: 20, position: { top: '60%', left: '15%' } },
    { icon: Shield, delay: 2, size: 28, position: { top: '40%', left: '80%' } },
    { icon: Sparkles, delay: 3, size: 16, position: { top: '70%', left: '75%' } },
    { icon: Zap, delay: 4, size: 22, position: { top: '25%', left: '85%' } },
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

const Login_V1 = () => {
  // State management
  const navigate = useNavigate();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formProgress, setFormProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    submit:''
  });

  const shouldReduceMotion = useReducedMotion();

  // Animation states
  const [formScale, setFormScale] = useState(1);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    setFormScale(focusedField ? 1.02 : 1);
  }, [focusedField]);

  useEffect(() => {
    setProgressValue(formProgress);
  }, [formProgress]);

  // Mouse tracking
  const handleMouseMove = useCallback((e) => {
    if (e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    }
  }, []);

  // Experience steps for login
  const experienceSteps = [
    {
      title: "Welcome Back",
      subtitle: "Continue your productivity journey",
      highlight: "Seamless Access",
      gradient: "#8b5cf6, #ec4899, #3b82f6"
    },
    {
      title: "Secure Login",
      subtitle: "Your data is protected with enterprise-grade security",
      highlight: "Bank-Level Security",
      gradient: "#3b82f6, #06b6d4, #14b8a6"
    },
    {
      title: "Ready to Continue",
      subtitle: "Pick up right where you left off",
      highlight: "Instant Access",
      gradient: "#14b8a6, #10b981, #059669"
    }
  ];

  // Validation functions
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

  // Calculate progress
  const calculateProgress = () => {
    const filledFields = [formData.email, formData.password].filter(field => field.length > 0).length;
    return (filledFields / 2) * 100;
  };

  // Effects
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % experienceSteps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [experienceSteps.length]);

  useEffect(() => {
    setFormProgress(calculateProgress());
  }, [formData]);

  // Event handlers
  const handleInputChange = (e) => {
    setIsTyping(true);
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
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

  const handleLogin = async () => {
    const emailValidation = clientValidateEmail(formData.email);
    const passwordValidation = clientValidatePassword(formData.password);
    
    if (!emailValidation.valid || !passwordValidation.valid) {
      setErrors({
        email: emailValidation.message,
        password: passwordValidation.message,
        submit: 'Login failed. Please try again.'
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Login successful:', formData);
      alert('Login successful!');
    } catch (error) {
      setErrors({ ...errors, submit: 'Login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialAuth = (provider) => {
    console.log(`${provider} login initiated`);
    alert(`Redirecting to ${provider} login...`);
  };

  const handleForgotPassword = () => {
    alert('Redirecting to forgot password page...');
  };

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
      {/* Left Panel - Login Form */}
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
                {formProgress < 50 ? "Getting started..." : 
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
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

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              {/* Email Field */}
              <motion.div animate={{ scale: focusedField === 'email' ? 1.02 : 1 }}>
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

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl outline-none transition-all duration-300 bg-white"
                    style={{
                      borderColor: errors.email ? '#ef4444' : 
                                  focusedField === 'email' ? '#8b5cf6' : '#e5e7eb',
                      backgroundColor: errors.email ? '#fef2f2' : 'white',
                      boxShadow: focusedField === 'email' 
                        ? '0 0 0 4px rgba(139, 92, 246, 0.1)' 
                        : '0 1px 3px rgba(0,0,0,0.1)',
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
              <motion.div animate={{ scale: focusedField === 'password' ? 1.02 : 1 }}>
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

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 text-lg border-2 rounded-xl outline-none transition-all duration-300"
                    style={{
                      borderColor: errors.password ? '#ef4444' : 
                                  focusedField === 'password' ? '#8b5cf6' : '#e5e7eb',
                      backgroundColor: errors.password ? '#fef2f2' : 'white',
                      boxShadow: focusedField === 'password' 
                        ? '0 0 0 4px rgba(139, 92, 246, 0.1)' 
                        : '0 1px 3px rgba(0,0,0,0.1)',
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

              {/* Login Button */}
              <motion.button
                type="button"
                disabled={isSubmitting}
                onClick={handleLogin}
                className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
                style={{
                  background: isSubmitting 
                    ? 'linear-gradient(135deg, #a855f7, #6366f1)' 
                    : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
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
            </div>

            {/* Social Login */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
                                     <motion.button
                                          type="button"
                                          disabled={isSubmitting}
                                          onClick={() => navigate('/prod-login')}
                                          className="w-full py-4 text-lg font-semibold text-gray-700 rounded-xl relative overflow-hidden group"
                                          whileTap={{ scale: 0.9 }}
                                      >
                                          <span className="relative z-10 flex items-center justify-center">
                                              {"SignUp"}
                                              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                          </span>
                                      </motion.button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">
                    Or continue with
                  </span>
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
                    onClick={() => handleSocialAuth(provider.name)}
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
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right Panel - Enhanced Experience */}
      <motion.div 
        className="w-full lg:w-1/2 relative min-h-[60vh] lg:min-h-screen order-2 overflow-hidden"
        animate={{
          background: `linear-gradient(135deg, ${experienceSteps[currentSlide]?.gradient || '#8b5cf6, #3b82f6'})`
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
              animate={{ x: `${-currentSlide * 100}%` }}
              transition={{ duration: 1.2, ease: [0.25, 0.25, 0, 1] }}
              className="flex"
              style={{ width: `${experienceSteps.length * 100}%`, willChange: 'transform' }}
            >
              {experienceSteps.map((step, index) => (
                <div key={index} className="w-full flex-shrink-0 pr-8">
                  <motion.h2 
                    className="text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                    animate={{ 
                      opacity: currentSlide === index ? 1 : 0.3,
                      y: currentSlide === index ? 0 : 20
                    }}
                    transition={{ delay: 0.2 }}
                  >
                    {step.title}
                  </motion.h2>
                  <motion.p 
                    className="text-xl text-white/90 mb-6"
                    animate={{ 
                      opacity: currentSlide === index ? 1 : 0.3,
                      y: currentSlide === index ? 0 : 20
                    }}
                    transition={{ delay: 0.4 }}
                  >
                    {step.subtitle}
                  </motion.p>
                  <motion.div
                    className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
                    animate={{ 
                      opacity: currentSlide === index ? 1 : 0.3,
                      scale: currentSlide === index ? 1 : 0.9
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
                  onClick={() => setCurrentSlide(index)}
                  className="w-3 h-3 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.3)',
                    transform: currentSlide === index ? 'scale(1.2)' : 'scale(1)'
                  }}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    backgroundColor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.3)',
                    scale: currentSlide === index ? 1.2 : 1
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>

          {/* Key Features */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {[
              { icon: Shield, title: "Secure", desc: "Bank-grade encryption" },
              { icon: Zap, title: "Fast", desc: "Lightning quick setup" },
              { icon: Users, title: "Collaborative", desc: "Team-friendly features" },
              { icon: Star, title: "Premium", desc: "Professional experience" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 text-white/80"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  color: '#ffffff',
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                    <feature.icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{feature.title}</h4>
                  <p className="text-xs text-white/70">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Stats */}
          <motion.div
            className="absolute bottom-8 left-8 right-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <motion.div
                  className="text-2xl font-bold mb-1"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    color: ['#ffffff', '#fbbf24', '#ffffff']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  50K+
                </motion.div>
                <div className="text-xs text-white/70">Happy Users</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <motion.div
                  className="text-2xl font-bold mb-1"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    color: ['#ffffff', '#10b981', '#ffffff']
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  99.9%
                </motion.div>
                <div className="text-xs text-white/70">Uptime</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <motion.div
                  className="text-2xl font-bold mb-1"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    color: ['#ffffff', '#8b5cf6', '#ffffff']
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  24/7
                </motion.div>
                <div className="text-xs text-white/70">Support</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login_V1;