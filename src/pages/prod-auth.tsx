// import { useEffect, useState, useRef, useCallback } from "react";
// import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
// import { 
//   Calendar, Mail, Lock, Eye, EyeOff, Users, Shield, CheckCircle, Star, 
//   Info, Sparkles, Zap, Globe, ArrowRight, User, ArrowLeft, Check, 
//   Building2, UserCheck, Briefcase, Target, Rocket, ChevronRight,
//   Brain, Wand2, Settings, Clock, Link, Copy, Share2, ExternalLink,
//   DollarSign, Timer, Tag, Plus, Minus, Play, CheckCircle2
// } from "lucide-react";

// // GPU-optimized particle system
// const ParticleSystem = ({ isActive, formProgress }) => {
//   const canvasRef = useRef(null);
//   const animationRef = useRef(null);
//   const particlesRef = useRef([]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     const resizeCanvas = () => {
//       canvas.width = canvas.offsetWidth * window.devicePixelRatio;
//       canvas.height = canvas.offsetHeight * window.devicePixelRatio;
//       ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
//     };

//     resizeCanvas();
//     window.addEventListener('resize', resizeCanvas);

//     const initParticles = () => {
//       particlesRef.current = Array.from({ length: 50 }, () => ({
//         x: Math.random() * canvas.offsetWidth,
//         y: Math.random() * canvas.offsetHeight,
//         vx: (Math.random() - 0.5) * 0.5,
//         vy: (Math.random() - 0.5) * 0.5,
//         size: Math.random() * 2 + 1,
//         opacity: Math.random() * 0.5 + 0.1,
//         hue: 240 + Math.random() * 60,
//         life: Math.random()
//       }));
//     };

//     initParticles();

//     const animate = () => {
//       ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
//       const intensity = isActive ? 1 : 0.3;
//       const progressMultiplier = 1 + (formProgress / 100) * 2;

//       particlesRef.current.forEach((particle) => {
//         particle.x += particle.vx * intensity * progressMultiplier;
//         particle.y += particle.vy * intensity * progressMultiplier;
        
//         if (particle.x < 0) particle.x = canvas.offsetWidth;
//         if (particle.x > canvas.offsetWidth) particle.x = 0;
//         if (particle.y < 0) particle.y = canvas.offsetHeight;
//         if (particle.y > canvas.offsetHeight) particle.y = 0;

//         particle.life += 0.01;
//         if (particle.life > 1) particle.life = 0;

//         const dynamicOpacity = particle.opacity * intensity * (0.5 + 0.5 * Math.sin(particle.life * Math.PI));

//         ctx.save();
//         ctx.globalAlpha = dynamicOpacity;
//         ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`;
//         ctx.shadowBlur = 10;
//         ctx.shadowColor = `hsl(${particle.hue}, 70%, 60%)`;
//         ctx.beginPath();
//         ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
//         ctx.fill();
//         ctx.restore();
//       });

//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       window.removeEventListener('resize', resizeCanvas);
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, [isActive, formProgress]);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="absolute inset-0 w-full h-full"
//       style={{
//         willChange: 'transform',
//         transform: 'translate3d(0, 0, 0)',
//       }}
//     />
//   );
// };

// // Enhanced floating elements
// const FloatingElements = ({ isTyping, formProgress, currentMode }) => {
//   const elements = [
//     { icon: Calendar, delay: 0, size: 24, position: { top: '20%', left: '10%' } },
//     { icon: Users, delay: 1, size: 20, position: { top: '60%', left: '15%' } },
//     { icon: Shield, delay: 2, size: 28, position: { top: '40%', left: '80%' } },
//     { icon: Sparkles, delay: 3, size: 16, position: { top: '70%', left: '75%' } },
//     { icon: Zap, delay: 4, size: 22, position: { top: '25%', left: '85%' } },
//     { icon: currentMode === 'register' ? User : Globe, delay: 5, size: 18, position: { top: '80%', left: '20%' } },
//   ];

//   return (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none">
//       {elements.map((element, index) => (
//         <motion.div
//           key={index}
//           className="absolute"
//           style={{
//             top: element.position.top,
//             left: element.position.left,
//             willChange: 'transform',
//           }}
//           initial={{ opacity: 0, scale: 0, rotate: -180 }}
//           animate={{
//             opacity: [0.1, 0.3, 0.1],
//             scale: [0.8, 1.2, 0.8],
//             rotate: [0, 360],
//             y: [-10, 10, -10],
//           }}
//           transition={{
//             duration: 8,
//             delay: element.delay,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         >
//           <element.icon 
//             size={element.size} 
//             className="text-white/20"
//             style={{
//               filter: `hue-rotate(${formProgress * 3.6}deg)`,
//               transform: `scale(${1 + formProgress / 200})`,
//             }}
//           />
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// const EnhancedAuthFlow = () => {
//   // Navigation state
//   const [currentMode, setCurrentMode] = useState('login');
//   const [registrationStep, setRegistrationStep] = useState(1);
  
//   // State management
//   const [isPageLoading, setIsPageLoading] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isTyping, setIsTyping] = useState(false);
//   const [focusedField, setFocusedField] = useState(null);
//   const [formProgress, setFormProgress] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
//   // Registration flow state
//   const [userType, setUserType] = useState('');
//   const [otpCode, setOtpCode] = useState(['', '', '', '']);
//   const [resendTimer, setResendTimer] = useState(0);
//   const [generatedTemplates, setGeneratedTemplates] = useState([]);
//   const [selectedTemplates, setSelectedTemplates] = useState([]);
//   const [configuredServices, setConfiguredServices] = useState([]);
//   const [broadcastSlots, setBroadcastSlots] = useState({
//     monday: { enabled: false, slots: [] },
//     tuesday: { enabled: false, slots: [] },
//     wednesday: { enabled: false, slots: [] },
//     thursday: { enabled: false, slots: [] },
//     friday: { enabled: false, slots: [] },
//     saturday: { enabled: false, slots: [] },
//     sunday: { enabled: false, slots: [] }
//   });
//   const [bookingLink, setBookingLink] = useState('');
  
//   // Form data
//   const [formData, setFormData] = useState({ 
//     name: '', 
//     email: '', 
//     password: '',
//     companyName: '',
//     industry: '',
//     teamSize: '',
//     profession: '',
//     useCase: ''
//   });
//   const [errors, setErrors] = useState({});

//   const shouldReduceMotion = useReducedMotion();

//   // Animation states
//   const [formScale, setFormScale] = useState(1);
//   const [progressValue, setProgressValue] = useState(0);

//   useEffect(() => {
//     setFormScale(focusedField ? 1.02 : 1);
//   }, [focusedField]);

//   useEffect(() => {
//     setProgressValue(formProgress);
//   }, [formProgress]);

//   // Mouse tracking
//   const handleMouseMove = useCallback((e) => {
//     if (e.currentTarget) {
//       const rect = e.currentTarget.getBoundingClientRect();
//       setMousePosition({
//         x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
//         y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
//       });
//     }
//   }, []);

//   // Experience steps based on current state
//   const getExperienceSteps = () => {
//     if (currentMode === 'login') {
//       return [
//         {
//           title: "Welcome Back",
//           subtitle: "Continue your productivity journey",
//           highlight: "Seamless Access",
//           gradient: "#8b5cf6, #ec4899, #3b82f6"
//         },
//         {
//           title: "Secure Login",
//           subtitle: "Your data is protected with enterprise-grade security",
//           highlight: "Bank-Level Security",
//           gradient: "#3b82f6, #06b6d4, #14b8a6"
//         },
//         {
//           title: "Ready to Continue",
//           subtitle: "Pick up right where you left off",
//           highlight: "Instant Access",
//           gradient: "#14b8a6, #10b981, #059669"
//         }
//       ];
//     }

//     switch (registrationStep) {
//       case 1:
//         return [
//           {
//             title: "Join the Revolution",
//             subtitle: "Start your journey to effortless scheduling",
//             highlight: "New Adventure",
//             gradient: "#8b5cf6, #ec4899, #3b82f6"
//           }
//         ];
//       case 2:
//         return [
//           {
//             title: "Verify Your Email",
//             subtitle: "We've sent a verification code to secure your account",
//             highlight: "Security First",
//             gradient: "#8b5cf6, #ec4899, #3b82f6"
//           }
//         ];
//       case 3:
//         return [
//           {
//             title: "Choose Your Path",
//             subtitle: "Personalize your experience based on your needs",
//             highlight: "Tailored Setup",
//             gradient: "#8b5cf6, #ec4899, #3b82f6"
//           }
//         ];
//       case 4:
//         return [
//           {
//             title: "Final Setup",
//             subtitle: userType === 'business' ? "Configure your team workspace" : "Personalize your individual workspace",
//             highlight: userType === 'business' ? "Team Ready" : "Personal Space",
//             gradient: "#8b5cf6, #ec4899, #3b82f6"
//           }
//         ];
//       case 5:
//         return [
//           {
//             title: "AI Magic in Action",
//             subtitle: "Our AI is analyzing your needs and creating personalized service templates",
//             highlight: "Smart Generation",
//             gradient: "#8b5cf6, #ec4899, #3b82f6"
//           }
//         ];
//       case 6:
//         return [
//           {
//             title: "Configure Your Services",
//             subtitle: "Customize pricing, duration, and details for your selected services",
//             highlight: "Your Way",
//             gradient: "#8b5cf6, #ec4899, #3b82f6"
//           }
//         ];
//       case 7:
//         return [
//           {
//             title: "Set Your Availability",
//             subtitle: "Define when clients can book your services",
//             highlight: "Time Control",
//             gradient: "#8b5cf6, #ec4899, #3b82f6"
//           }
//         ];
//       case 8:
//         return [
//           {
//             title: "🎉 Congratulations!",
//             subtitle: "Your booking link is ready and your business is live",
//             highlight: "Success!",
//             gradient: "#8b5cf6, #ec4899, #3b82f6"
//           }
//         ];
//       default:
//         return [];
//     }
//   };

//   const experienceSteps = getExperienceSteps();

//   // Validation functions
//   const clientValidateEmail = (email) => {
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailRegex.test(email)) {
//       return { valid: false, message: 'Please enter a valid email address' };
//     }
//     return { valid: true, message: '' };
//   };

//   const clientValidateName = (name) => {
//     if (name.length < 2) {
//       return { valid: false, message: 'Name must be at least 2 characters' };
//     }
//     if (name.length > 50) {
//       return { valid: false, message: 'Name cannot exceed 50 characters' };
//     }
//     if (!/^[a-zA-Z\s]+$/.test(name)) {
//       return { valid: false, message: 'Name can only contain letters and spaces' };
//     }
//     return { valid: true, message: '' };
//   };

//   const clientValidatePassword = (password) => {
//     const checks = {
//       length: password.length >= 8 && password.length <= 28,
//       uppercase: /[A-Z]/.test(password),
//       lowercase: /[a-z]/.test(password),
//       number: /[0-9]/.test(password),
//       special: /[_$.!]/.test(password),
//       allowed: /^[a-zA-Z0-9_$.!]+$/.test(password)
//     };

//     const strengthScore = Object.values(checks).filter(Boolean).length;

//     if (!checks.length) return { valid: false, message: 'Password must be 8-28 characters long', strength: strengthScore };
//     if (!checks.uppercase) return { valid: false, message: 'Add at least 1 uppercase letter', strength: strengthScore };
//     if (!checks.lowercase) return { valid: false, message: 'Add at least 1 lowercase letter', strength: strengthScore };
//     if (!checks.number) return { valid: false, message: 'Add at least 1 number', strength: strengthScore };
//     if (!checks.special) return { valid: false, message: 'Add at least 1 special character (_ $ ! .)', strength: strengthScore };
//     if (!checks.allowed) return { valid: false, message: 'Only letters, numbers, and _ $ ! . are allowed', strength: strengthScore };

//     return { valid: true, message: '', strength: strengthScore };
//   };

//   // Calculate progress based on current step
//   const calculateProgress = () => {
//     if (currentMode === 'login') {
//       const filledFields = [formData.email, formData.password].filter(field => field.length > 0).length;
//       return (filledFields / 2) * 100;
//     }

//     switch (registrationStep) {
//       case 1:
//         const step1Fields = [formData.name, formData.email].filter(field => field.length > 0).length;
//         return (step1Fields / 2) * 100;
//       case 2:
//         const otpFilled = otpCode.filter(code => code.length > 0).length;
//         return (otpFilled / 4) * 100;
//       case 3:
//         return userType ? 100 : 0;
//       case 4:
//         if (userType === 'business') {
//           const businessFields = [formData.companyName, formData.industry, formData.teamSize].filter(field => field.length > 0).length;
//           return (businessFields / 3) * 100;
//         } else {
//           const individualFields = [formData.profession, formData.useCase].filter(field => field.length > 0).length;
//           return (individualFields / 2) * 100;
//         }
//       case 5:
//         return generatedTemplates.length > 0 ? 100 : 0;
//       case 6:
//         return selectedTemplates.length > 0 ? (configuredServices.length / selectedTemplates.length) * 100 : 0;
//       case 7:
//         const enabledDays = Object.values(broadcastSlots).filter(day => day.enabled).length;
//         return (enabledDays / 7) * 100;
//       case 8:
//         return bookingLink ? 100 : 0;
//       default:
//         return 0;
//     }
//   };

//   // Effects
//   useEffect(() => {
//     const timer = setTimeout(() => setIsPageLoading(false), 800);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide(prev => (prev + 1) % experienceSteps.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [experienceSteps.length]);

//   useEffect(() => {
//     setFormProgress(calculateProgress());
//   }, [formData, otpCode, userType, registrationStep, currentMode, generatedTemplates, selectedTemplates, configuredServices, broadcastSlots, bookingLink]);

//   // Reset form when switching modes
//   useEffect(() => {
//     if (currentMode === 'login') {
//       setRegistrationStep(1);
//       setUserType('');
//       setOtpCode(['', '', '', '']);
//       setGeneratedTemplates([]);
//       setSelectedTemplates([]);
//       setConfiguredServices([]);
//       setBroadcastSlots({
//         monday: { enabled: false, slots: [] },
//         tuesday: { enabled: false, slots: [] },
//         wednesday: { enabled: false, slots: [] },
//         thursday: { enabled: false, slots: [] },
//         friday: { enabled: false, slots: [] },
//         saturday: { enabled: false, slots: [] },
//         sunday: { enabled: false, slots: [] }
//       });
//       setBookingLink('');
//     }
//     setFormData({ 
//       name: '', 
//       email: '', 
//       password: '',
//       companyName: '',
//       industry: '',
//       teamSize: '',
//       profession: '',
//       useCase: ''
//     });
//     setErrors({});
//   }, [currentMode]);

//   // Resend timer effect
//   useEffect(() => {
//     let interval;
//     if (resendTimer > 0) {
//       interval = setInterval(() => {
//         setResendTimer(timer => timer - 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [resendTimer]);

//   // Event handlers
//   const handleInputChange = (e) => {
//     setIsTyping(true);
//     const { name, value } = e.target;
    
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Real-time validation
//     const newErrors = { ...errors };
    
//     if (name === 'name') {
//       const validation = clientValidateName(value);
//       newErrors.name = validation.valid ? '' : validation.message;
//     } else if (name === 'email') {
//       const validation = clientValidateEmail(value);
//       newErrors.email = validation.valid ? '' : validation.message;
//     } else if (name === 'password') {
//       const validation = clientValidatePassword(value);
//       newErrors.password = validation.valid ? '' : validation.message;
//     }
    
//     setErrors(newErrors);
//     setTimeout(() => setIsTyping(false), 1000);
//   };

//   const handleOtpChange = (index, value) => {
//     if (value.length <= 1 && /^[0-9]*$/.test(value)) {
//       const newOtp = [...otpCode];
//       newOtp[index] = value;
//       setOtpCode(newOtp);
      
//       // Auto-focus next input
//       if (value && index < 3) {
//         const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
//         if (nextInput) nextInput.focus();
//       }
//     }
//   };

//   const handleLogin = async () => {
//     const emailValidation = clientValidateEmail(formData.email);
//     const passwordValidation = clientValidatePassword(formData.password);
    
//     if (!emailValidation.valid || !passwordValidation.valid) {
//       setErrors({
//         email: emailValidation.message,
//         password: passwordValidation.message
//       });
//       return;
//     }
    
//     setIsSubmitting(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       console.log('Login successful:', formData);
//       alert('Login successful!');
//     } catch (error) {
//       setErrors({ submit: 'Login failed. Please try again.' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleRegistrationStep1 = async () => {
//     const nameValidation = clientValidateName(formData.name);
//     const emailValidation = clientValidateEmail(formData.email);
    
//     if (!nameValidation.valid || !emailValidation.valid) {
//       setErrors({
//         name: nameValidation.message,
//         email: emailValidation.message
//       });
//       return;
//     }
    
//     setIsSubmitting(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       console.log('Sending OTP to:', formData.email);
//       setRegistrationStep(2);
//       setResendTimer(60);
//       setErrors({});
//     } catch (error) {
//       setErrors({ submit: 'Failed to send verification code. Please try again.' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleOtpVerification = async () => {
//     const enteredOtp = otpCode.join('');
    
//     if (enteredOtp !== '0000') {
//       setErrors({ otp: 'Invalid verification code. Please try again.' });
//       return;
//     }
    
//     setIsSubmitting(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 1500));
//       console.log('OTP verified successfully');
//       setRegistrationStep(3);
//       setErrors({});
//     } catch (error) {
//       setErrors({ submit: 'Verification failed. Please try again.' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleUserTypeSelection = (type) => {
//     setUserType(type);
//     setTimeout(() => {
//       setRegistrationStep(4);
//     }, 500);
//   };

//   const handleFinalOnboarding = async () => {
//     setIsSubmitting(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       console.log('Onboarding completed:', { ...formData, userType });
      
//       // Generate AI templates based on user data
//       await generateAITemplates();
//       setRegistrationStep(5);
//       setErrors({});
//     } catch (error) {
//       setErrors({ submit: 'Setup failed. Please try again.' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const generateAITemplates = async () => {
//     setIsSubmitting(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate AI processing
      
//       let templates = [];
      
//       if (userType === 'business') {
//         // Generate business templates based on industry
//         switch (formData.industry) {
//           case 'technology':
//             templates = [
//               {
//                 id: 1,
//                 name: 'Technical Consultation',
//                 description: 'One-on-one technical advisory session',
//                 duration: 60,
//                 price: 150,
//                 category: 'Consulting',
//                 configured: false
//               },
//               {
//                 id: 2,
//                 name: 'System Architecture Review',
//                 description: 'Comprehensive system design evaluation',
//                 duration: 90,
//                 price: 300,
//                 category: 'Review',
//                 configured: false
//               },
//               {
//                 id: 3,
//                 name: 'Team Training Session',
//                 description: 'Technical skills training for teams',
//                 duration: 120,
//                 price: 500,
//                 category: 'Training',
//                 configured: false
//               }
//             ];
//             break;
//           case 'healthcare':
//             templates = [
//               {
//                 id: 1,
//                 name: 'Initial Consultation',
//                 description: 'Comprehensive health assessment',
//                 duration: 45,
//                 price: 120,
//                 category: 'Consultation',
//                 configured: false
//               },
//               {
//                 id: 2,
//                 name: 'Follow-up Appointment',
//                 description: 'Progress review and adjustment',
//                 duration: 30,
//                 price: 80,
//                 category: 'Follow-up',
//                 configured: false
//               },
//               {
//                 id: 3,
//                 name: 'Wellness Planning',
//                 description: 'Personalized wellness strategy session',
//                 duration: 60,
//                 price: 150,
//                 category: 'Planning',
//                 configured: false
//               }
//             ];
//             break;
//           default:
//             templates = [
//               {
//                 id: 1,
//                 name: 'Business Consultation',
//                 description: 'Strategic business advisory session',
//                 duration: 60,
//                 price: 100,
//                 category: 'Consulting',
//                 configured: false
//               },
//               {
//                 id: 2,
//                 name: 'Project Planning',
//                 description: 'Comprehensive project planning session',
//                 duration: 90,
//                 price: 150,
//                 category: 'Planning',
//                 configured: false
//               },
//               {
//                 id: 3,
//                 name: 'Team Meeting',
//                 description: 'Collaborative team discussion',
//                 duration: 45,
//                 price: 75,
//                 category: 'Meeting',
//                 configured: false
//               }
//             ];
//         }
//       } else {
//         // Generate individual templates based on profession and use case
//         if (formData.profession.toLowerCase().includes('developer') || formData.profession.toLowerCase().includes('engineer')) {
//           templates = [
//             {
//               id: 1,
//               name: 'Code Review Session',
//               description: 'Professional code review and feedback',
//               duration: 60,
//               price: 80,
//               category: 'Review',
//               configured: false
//             },
//             {
//               id: 2,
//               name: 'Technical Mentoring',
//               description: 'One-on-one development mentoring',
//               duration: 45,
//               price: 60,
//               category: 'Mentoring',
//               configured: false
//             },
//             {
//               id: 3,
//               name: 'Project Consultation',
//               description: 'Technical project advisory session',
//               duration: 90,
//               price: 120,
//               category: 'Consulting',
//               configured: false
//             }
//           ];
//         } else if (formData.profession.toLowerCase().includes('designer')) {
//           templates = [
//             {
//               id: 1,
//               name: 'Design Consultation',
//               description: 'Creative design strategy session',
//               duration: 60,
//               price: 90,
//               category: 'Consultation',
//               configured: false
//             },
//             {
//               id: 2,
//               name: 'Portfolio Review',
//               description: 'Professional portfolio evaluation',
//               duration: 45,
//               price: 70,
//               category: 'Review',
//               configured: false
//             },
//             {
//               id: 3,
//               name: 'Brand Identity Session',
//               description: 'Brand design and identity development',
//               duration: 120,
//               price: 200,
//               category: 'Branding',
//               configured: false
//             }
//           ];
//         } else {
//           templates = [
//             {
//               id: 1,
//               name: 'Professional Consultation',
//               description: 'Expert advice and guidance session',
//               duration: 60,
//               price: 75,
//               category: 'Consultation',
//               configured: false
//             },
//             {
//               id: 2,
//               name: '1:1 Coaching Session',
//               description: 'Personalized coaching and development',
//               duration: 45,
//               price: 60,
//               category: 'Coaching',
//               configured: false
//             },
//             {
//               id: 3,
//               name: 'Strategy Planning',
//               description: 'Strategic planning and goal setting',
//               duration: 90,
//               price: 100,
//               category: 'Planning',
//               configured: false
//             }
//           ];
//         }
//       }

//       setGeneratedTemplates(templates);
//       console.log('AI Generated Templates:', templates);
//     } catch (error) {
//       setErrors({ submit: 'Failed to generate templates. Please try again.' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleTemplateSelection = (template) => {
//     if (selectedTemplates.find(t => t.id === template.id)) {
//       setSelectedTemplates(selectedTemplates.filter(t => t.id !== template.id));
//     } else {
//       setSelectedTemplates([...selectedTemplates, template]);
//     }
//   };

//   const proceedToServiceConfiguration = () => {
//     if (selectedTemplates.length === 0) {
//       setErrors({ templates: 'Please select at least one service template.' });
//       return;
//     }
//     setConfiguredServices(selectedTemplates.map(template => ({ ...template, configured: false })));
//     setRegistrationStep(6);
//     setErrors({});
//   };

//   const handleServiceConfiguration = (serviceId, updates) => {
//     setConfiguredServices(prev => 
//       prev.map(service => 
//         service.id === serviceId 
//           ? { ...service, ...updates, configured: true }
//           : service
//       )
//     );
//   };

//   const proceedToBroadcastSlots = () => {
//     const allConfigured = configuredServices.every(service => service.configured);
//     if (!allConfigured) {
//       setErrors({ services: 'Please configure all selected services.' });
//       return;
//     }
//     setRegistrationStep(7);
//     setErrors({});
//   };

//   const handleDayToggle = (day) => {
//     setBroadcastSlots(prev => ({
//       ...prev,
//       [day]: {
//         ...prev[day],
//         enabled: !prev[day].enabled,
//         slots: !prev[day].enabled ? [{ start: '09:00', end: '17:00' }] : []
//       }
//     }));
//   };

//   const generateBookingLink = async () => {
//     setIsSubmitting(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       const username = formData.name.toLowerCase().replace(/\s+/g, '');
//       const randomId = Math.random().toString(36).substr(2, 6);
//       const link = `https://bookings.app/${username}-${randomId}`;
      
//       setBookingLink(link);
//       setRegistrationStep(8);
//       console.log('Registration completed successfully!', {
//         user: formData,
//         userType,
//         services: configuredServices,
//         availability: broadcastSlots,
//         bookingLink: link
//       });
//     } catch (error) {
//       setErrors({ submit: 'Failed to generate booking link. Please try again.' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     setIsSubmitting(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       setResendTimer(60);
//       setOtpCode(['', '', '', '']);
//       console.log('OTP resent to:', formData.email);
//       alert('New verification code sent!');
//     } catch (error) {
//       console.error('Failed to resend OTP');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleModeSwitch = () => {
//     setCurrentMode(currentMode === 'login' ? 'register' : 'login');
//   };

//   const handleBackToLogin = () => {
//     setCurrentMode('login');
//     setRegistrationStep(1);
//   };

//   const handleSocialAuth = (provider) => {
//     console.log(`${provider} ${currentMode} initiated`);
//     alert(`Redirecting to ${provider} ${currentMode}...`);
//   };

//   const handleForgotPassword = () => {
//     alert('Redirecting to forgot password page...');
//   };

//   // Loading screen
//   if (isPageLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
//         <ParticleSystem isActive={true} formProgress={50} />
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="text-center z-10"
//         >
//           <motion.div
//             className="w-20 h-20 border-4 border-purple-300/30 border-t-purple-400 rounded-full mx-auto mb-6"
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             style={{ willChange: 'transform' }}
//           />
//           <motion.h2
//             initial={{ y: 20 }}
//             animate={{ y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="text-2xl font-bold text-white mb-2"
//           >
//             Initializing Experience
//           </motion.h2>
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.6 }}
//             className="text-purple-200"
//           >
//             Preparing your premium workspace...
//           </motion.p>
//         </motion.div>
//       </div>
//     );
//   }

//   // Render different content based on mode and step
//   const renderContent = () => {
//     if (currentMode === 'login') {
//       return (
//         <div className="space-y-6">
//           {/* Email Field */}
//           <motion.div animate={{ scale: focusedField === 'email' ? 1.02 : 1 }}>
//             <label className="block text-sm font-semibold text-gray-700 mb-3">
//               Email Address
//               {formData.email && !errors.email && (
//                 <motion.span
//                   initial={{ opacity: 0, x: -10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   className="ml-2 text-emerald-600 text-xs font-medium"
//                 >
//                   ✅ Verified
//                 </motion.span>
//               )}
//             </label>

//             <div className="relative group">
//               <motion.div
//                 className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
//                 animate={{
//                   color: focusedField === 'email' ? '#8b5cf6' : '#9ca3af',
//                   scale: focusedField === 'email' ? 1.1 : 1
//                 }}
//               >
//                 <Mail className="w-5 h-5 transition-all duration-300" />
//               </motion.div>

//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 onFocus={() => setFocusedField('email')}
//                 onBlur={() => setFocusedField(null)}
//                 placeholder="Enter your email address"
//                 className="w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl outline-none transition-all duration-300 bg-white"
//                 style={{
//                   borderColor: errors.email ? '#ef4444' : 
//                               focusedField === 'email' ? '#8b5cf6' : '#e5e7eb',
//                   backgroundColor: errors.email ? '#fef2f2' : 'white',
//                   boxShadow: focusedField === 'email' 
//                     ? '0 0 0 4px rgba(139, 92, 246, 0.1)' 
//                     : '0 1px 3px rgba(0,0,0,0.1)',
//                 }}
//               />

//               {formData.email && !errors.email && (
//                 <motion.div
//                   initial={{ scale: 0, rotate: -180 }}
//                   animate={{ scale: 1, rotate: 0 }}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2"
//                 >
//                   <CheckCircle className="w-6 h-6 text-emerald-500" />
//                 </motion.div>
//               )}
//             </div>

//             <AnimatePresence>
//               {errors.email && (
//                 <motion.p
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200"
//                 >
//                   {errors.email}
//                 </motion.p>
//               )}
//             </AnimatePresence>
//           </motion.div>

//           {/* Password Field */}
//           <motion.div animate={{ scale: focusedField === 'password' ? 1.02 : 1 }}>
//             <div className="flex justify-between items-center mb-3">
//               <label className="text-sm font-semibold text-gray-700">
//                 Password
//                 {formData.password && !errors.password && (
//                   <motion.span
//                     initial={{ opacity: 0, scale: 0 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     className="ml-2 text-emerald-600 text-xs font-medium"
//                   >
//                     🛡️ Secure
//                   </motion.span>
//                 )}
//               </label>
//               <button
//                 type="button"
//                 onClick={handleForgotPassword}
//                 className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
//               >
//                 Forgot password?
//               </button>
//             </div>

//             <div className="relative group">
//               <motion.div
//                 className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
//                 animate={{
//                   color: focusedField === 'password' ? '#8b5cf6' : '#9ca3af',
//                   scale: focusedField === 'password' ? 1.1 : 1
//                 }}
//               >
//                 <Lock className="w-5 h-5 transition-all duration-300" />
//               </motion.div>

//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 onFocus={() => setFocusedField('password')}
//                 onBlur={() => setFocusedField(null)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
//                 placeholder="Enter your password"
//                 className="w-full pl-12 pr-12 py-4 text-lg border-2 rounded-xl outline-none transition-all duration-300"
//                 style={{
//                   borderColor: errors.password ? '#ef4444' : 
//                               focusedField === 'password' ? '#8b5cf6' : '#e5e7eb',
//                   backgroundColor: errors.password ? '#fef2f2' : 'white',
//                   boxShadow: focusedField === 'password' 
//                     ? '0 0 0 4px rgba(139, 92, 246, 0.1)' 
//                     : '0 1px 3px rgba(0,0,0,0.1)',
//                 }}
//               />

//               <motion.button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </motion.button>
//             </div>

//             <AnimatePresence>
//               {errors.password && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
//                 >
//                   {errors.password}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>

//           {/* Login Button */}
//           <motion.button
//             type="button"
//             disabled={isSubmitting}
//             onClick={handleLogin}
//             className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
//             style={{
//               background: isSubmitting 
//                 ? 'linear-gradient(135deg, #a855f7, #6366f1)' 
//                 : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
//             }}
//             whileHover={!isSubmitting ? { 
//               scale: 1.02, 
//               boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" 
//             } : {}}
//             whileTap={!isSubmitting ? { scale: 0.98 } : {}}
//             animate={{
//               boxShadow: formProgress === 100 
//                 ? "0 0 40px rgba(139, 92, 246, 0.6)" 
//                 : "0 4px 20px rgba(0,0,0,0.1)"
//             }}
//           >
//             <motion.div
//               className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
//               animate={{ x: isSubmitting ? ['-100%', '100%'] : '-100%' }}
//               transition={{ 
//                 duration: 1.5, 
//                 repeat: isSubmitting ? Infinity : 0,
//                 ease: "easeInOut"
//               }}
//             />
            
//             <span className="relative z-10 flex items-center justify-center">
//               {isSubmitting ? (
//                 <>
//                   <motion.div
//                     className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                   />
//                   Signing you in...
//                 </>
//               ) : (
//                 <>
//                   {formProgress === 100 ? "✨ Enter Your Workspace" : "Sign In"}
//                   <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                 </>
//               )}
//             </span>
//           </motion.button>
//         </div>
//       );
//     }

//     // Registration content based on step
//     if (registrationStep === 1) {
//       return (
//         <div className="space-y-6">
//           {/* Name Field */}
//           <motion.div animate={{ scale: focusedField === 'name' ? 1.02 : 1 }}>
//             <label className="block text-sm font-semibold text-gray-700 mb-3">
//               Full Name
//               {formData.name && !errors.name && (
//                 <motion.span
//                   initial={{ opacity: 0, x: -10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   className="ml-2 text-emerald-600 text-xs font-medium"
//                 >
//                   ✅ Perfect
//                 </motion.span>
//               )}
//             </label>

//             <div className="relative group">
//               <motion.div
//                 className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
//                 animate={{
//                   color: focusedField === 'name' ? '#8b5cf6' : '#9ca3af',
//                   scale: focusedField === 'name' ? 1.1 : 1
//                 }}
//               >
//                 <User className="w-5 h-5 transition-all duration-300" />
//               </motion.div>

//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 onFocus={() => setFocusedField('name')}
//                 onBlur={() => setFocusedField(null)}
//                 placeholder="Enter your full name"
//                 className="w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl outline-none transition-all duration-300 bg-white"
//                 style={{
//                   borderColor: errors.name ? '#ef4444' : 
//                               focusedField === 'name' ? '#8b5cf6' : '#e5e7eb',
//                   backgroundColor: errors.name ? '#fef2f2' : 'white',
//                   boxShadow: focusedField === 'name' 
//                     ? '0 0 0 4px rgba(139, 92, 246, 0.1)' 
//                     : '0 1px 3px rgba(0,0,0,0.1)',
//                 }}
//               />

//               {formData.name && !errors.name && (
//                 <motion.div
//                   initial={{ scale: 0, rotate: -180 }}
//                   animate={{ scale: 1, rotate: 0 }}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2"
//                 >
//                   <CheckCircle className="w-6 h-6 text-emerald-500" />
//                 </motion.div>
//               )}
//             </div>

//             <AnimatePresence>
//               {errors.name && (
//                 <motion.p
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200"
//                 >
//                   {errors.name}
//                 </motion.p>
//               )}
//             </AnimatePresence>
//           </motion.div>

//           {/* Email Field */}
//           <motion.div animate={{ scale: focusedField === 'email' ? 1.02 : 1 }}>
//             <label className="block text-sm font-semibold text-gray-700 mb-3">
//               Email Address
//               {formData.email && !errors.email && (
//                 <motion.span
//                   initial={{ opacity: 0, x: -10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   className="ml-2 text-emerald-600 text-xs font-medium"
//                 >
//                   ✅ Verified
//                 </motion.span>
//               )}
//             </label>

//             <div className="relative group">
//               <motion.div
//                 className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
//                 animate={{
//                   color: focusedField === 'email' ? '#8b5cf6' : '#9ca3af',
//                   scale: focusedField === 'email' ? 1.1 : 1
//                 }}
//               >
//                 <Mail className="w-5 h-5 transition-all duration-300" />
//               </motion.div>

//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 onFocus={() => setFocusedField('email')}
//                 onBlur={() => setFocusedField(null)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleRegistrationStep1()}
//                 placeholder="Enter your email address"
//                 className="w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl outline-none transition-all duration-300 bg-white"
//                 style={{
//                   borderColor: errors.email ? '#ef4444' : 
//                               focusedField === 'email' ? '#8b5cf6' : '#e5e7eb',
//                   backgroundColor: errors.email ? '#fef2f2' : 'white',
//                   boxShadow: focusedField === 'email' 
//                     ? '0 0 0 4px rgba(139, 92, 246, 0.1)' 
//                     : '0 1px 3px rgba(0,0,0,0.1)',
//                 }}
//               />

//               {formData.email && !errors.email && (
//                 <motion.div
//                   initial={{ scale: 0, rotate: -180 }}
//                   animate={{ scale: 1, rotate: 0 }}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2"
//                 >
//                   <CheckCircle className="w-6 h-6 text-emerald-500" />
//                 </motion.div>
//               )}
//             </div>

//             <AnimatePresence>
//               {errors.email && (
//                 <motion.p
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200"
//                 >
//                   {errors.email}
//                 </motion.p>
//               )}
//             </AnimatePresence>
//           </motion.div>

//           {/* Continue Button */}
//           <motion.button
//             type="button"
//             disabled={isSubmitting}
//             onClick={handleRegistrationStep1}
//             className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
//             style={{
//               background: isSubmitting 
//                 ? 'linear-gradient(135deg, #a855f7, #6366f1)' 
//                 : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
//             }}
//             whileHover={!isSubmitting ? { 
//               scale: 1.02, 
//               boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" 
//             } : {}}
//             whileTap={!isSubmitting ? { scale: 0.98 } : {}}
//             animate={{
//               boxShadow: formProgress === 100 
//                 ? "0 0 40px rgba(139, 92, 246, 0.6)" 
//                 : "0 4px 20px rgba(0,0,0,0.1)"
//             }}
//           >
//             <motion.div
//               className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
//               animate={{ x: isSubmitting ? ['-100%', '100%'] : '-100%' }}
//               transition={{ 
//                 duration: 1.5, 
//                 repeat: isSubmitting ? Infinity : 0,
//                 ease: "easeInOut"
//               }}
//             />
            
//             <span className="relative z-10 flex items-center justify-center">
//               {isSubmitting ? (
//                 <>
//                   <motion.div
//                     className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                   />
//                   Sending verification code...
//                 </>
//               ) : (
//                 <>
//                   {formProgress === 100 ? "✨ Send Verification Code" : "Continue"}
//                   <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                 </>
//               )}
//             </span>
//           </motion.button>
//         </div>
//       );
//     }

//     if (registrationStep === 2) {
//       return (
//         <div className="space-y-6">
//           <div className="text-center mb-8">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
//             >
//               <Mail className="w-8 h-8 text-purple-600" />
//             </motion.div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">
//               Check your email
//             </h3>
//             <p className="text-gray-600">
//               We've sent a verification code to<br />
//               <span className="font-medium text-purple-600">{formData.email}</span>
//             </p>
//           </div>

//           {/* OTP Input */}
//           <div className="space-y-4">
//             <label className="block text-sm font-semibold text-gray-700 text-center">
//               Enter 4-digit verification code
//             </label>
            
//             <div className="flex justify-center space-x-4">
//               {otpCode.map((digit, index) => (
//                 <motion.input
//                   key={index}
//                   type="text"
//                   name={`otp-${index}`}
//                   value={digit}
//                   onChange={(e) => handleOtpChange(index, e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Backspace' && !digit && index > 0) {
//                       const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
//                       if (prevInput) prevInput.focus();
//                     }
//                     if (e.key === 'Enter' && otpCode.join('').length === 4) {
//                       handleOtpVerification();
//                     }
//                   }}
//                   className="w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all duration-300"
//                   style={{
//                     borderColor: errors.otp ? '#ef4444' : 
//                                 digit ? '#8b5cf6' : '#e5e7eb',
//                     backgroundColor: errors.otp ? '#fef2f2' : 'white',
//                     boxShadow: digit 
//                       ? '0 0 0 4px rgba(139, 92, 246, 0.1)' 
//                       : '0 1px 3px rgba(0,0,0,0.1)',
//                   }}
//                   maxLength={1}
//                   initial={{ scale: 0, y: 20 }}
//                   animate={{ scale: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                 />
//               ))}
//             </div>

//             <AnimatePresence>
//               {errors.otp && (
//                 <motion.p
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="text-center text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200"
//                 >
//                   {errors.otp}
//                 </motion.p>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Resend Code */}
//           <div className="text-center">
//             <p className="text-sm text-gray-600 mb-4">
//               Didn't receive the code?
//             </p>
//             {resendTimer > 0 ? (
//               <p className="text-sm text-gray-500">
//                 Resend code in {resendTimer}s
//               </p>
//             ) : (
//               <motion.button
//                 type="button"
//                 onClick={handleResendOtp}
//                 disabled={isSubmitting}
//                 className="text-sm text-purple-600 hover:text-purple-700 font-medium underline"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 Resend verification code
//               </motion.button>
//             )}
//           </div>

//           {/* Verify Button */}
//           <motion.button
//             type="button"
//             disabled={isSubmitting || otpCode.join('').length !== 4}
//             onClick={handleOtpVerification}
//             className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
//             style={{
//               background: isSubmitting || otpCode.join('').length !== 4
//                 ? 'linear-gradient(135deg, #a855f7, #6366f1)' 
//                 : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
//               opacity: otpCode.join('').length !== 4 ? 0.6 : 1
//             }}
//             whileHover={!isSubmitting && otpCode.join('').length === 4 ? { 
//               scale: 1.02, 
//               boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" 
//             } : {}}
//             whileTap={!isSubmitting && otpCode.join('').length === 4 ? { scale: 0.98 } : {}}
//             animate={{
//               boxShadow: formProgress === 100 
//                 ? "0 0 40px rgba(139, 92, 246, 0.6)" 
//                 : "0 4px 20px rgba(0,0,0,0.1)"
//             }}
//           >
//             <span className="relative z-10 flex items-center justify-center">
//               {isSubmitting ? (
//                 <>
//                   <motion.div
//                     className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                   />
//                   Verifying...
//                 </>
//               ) : (
//                 <>
//                   {otpCode.join('').length === 4 ? "✨ Verify Email" : "Enter 4-digit code"}
//                   <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                 </>
//               )}
//             </span>
//           </motion.button>

//           <div className="text-center text-xs text-gray-500">
//             💡 Tip: For demo purposes, use code <span className="font-mono bg-gray-100 px-1 rounded">0000</span>
//           </div>
//         </div>
//       );
//     }

//     if (registrationStep === 3) {
//       return (
//         <div className="space-y-6">
//           <div className="text-center mb-8">
//             <motion.h3
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-2xl font-bold text-gray-800 mb-3"
//             >
//               How will you use our platform?
//             </motion.h3>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-gray-600"
//             >
//               This helps us customize your experience
//             </motion.p>
//           </div>

//           <div className="grid grid-cols-1 gap-4">
//             {/* Individual Option */}
//             <motion.button
//               type="button"
//               onClick={() => handleUserTypeSelection('individual')}
//               className="p-6 border-2 rounded-xl text-left transition-all duration-300 group"
//               style={{
//                 borderColor: userType === 'individual' ? '#8b5cf6' : '#e5e7eb',
//                 backgroundColor: userType === 'individual' ? '#f3f4f6' : 'white',
//                 transform: userType === 'individual' ? 'scale(1.02)' : 'scale(1)'
//               }}
//               whileHover={{ scale: 1.02, y: -2 }}
//               whileTap={{ scale: 0.98 }}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//             >
//               <div className="flex items-start space-x-4">
//                 <div className="flex-shrink-0">
//                   <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
//                     <UserCheck className="w-6 h-6 text-white" />
//                   </div>
//                 </div>
//                 <div className="flex-1">
//                   <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
//                     Individual
//                   </h4>
//                   <p className="text-gray-600 text-sm leading-relaxed">
//                     Perfect for personal productivity, freelancers, and solo professionals who want to organize their schedule efficiently.
//                   </p>
//                   <div className="mt-3 flex items-center text-xs text-purple-600">
//                     <Star className="w-3 h-3 mr-1" />
//                     <span>Personal workspace, individual features</span>
//                   </div>
//                 </div>
//                 <div className="flex-shrink-0">
//                   <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
//                 </div>
//               </div>
//             </motion.button>

//             {/* Business Option */}
//             <motion.button
//               type="button"
//               onClick={() => handleUserTypeSelection('business')}
//               className="p-6 border-2 rounded-xl text-left transition-all duration-300 group"
//               style={{
//                 borderColor: userType === 'business' ? '#8b5cf6' : '#e5e7eb',
//                 backgroundColor: userType === 'business' ? '#f3f4f6' : 'white',
//                 transform: userType === 'business' ? 'scale(1.02)' : 'scale(1)'
//               }}
//               whileHover={{ scale: 1.02, y: -2 }}
//               whileTap={{ scale: 0.98 }}
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3 }}
//             >
//               <div className="flex items-start space-x-4">
//                 <div className="flex-shrink-0">
//                   <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
//                     <Building2 className="w-6 h-6 text-white" />
//                   </div>
//                 </div>
//                 <div className="flex-1">
//                   <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
//                     Business
//                   </h4>
//                   <p className="text-gray-600 text-sm leading-relaxed">
//                     Ideal for teams, companies, and organizations that need collaborative scheduling and advanced management features.
//                   </p>
//                   <div className="mt-3 flex items-center text-xs text-purple-600">
//                     <Users className="w-3 h-3 mr-1" />
//                     <span>Team collaboration, advanced analytics</span>
//                   </div>
//                 </div>
//                 <div className="flex-shrink-0">
//                   <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
//                 </div>
//               </div>
//             </motion.button>
//           </div>

//           {userType && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-center pt-4"
//             >
//               <p className="text-sm text-emerald-600 font-medium">
//                 ✅ Great choice! Setting up your {userType} workspace...
//               </p>
//             </motion.div>
//           )}
//         </div>
//       );
//     }

//     if (registrationStep === 4) {
//       if (userType === 'business') {
//         return (
//           <div className="space-y-6">
//             <div className="text-center mb-6">
//               <motion.h3
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="text-xl font-bold text-gray-800 mb-2"
//               >
//                 Tell us about your business
//               </motion.h3>
//               <motion.p
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1 }}
//                 className="text-gray-600"
//               >
//                 Help us customize your team workspace
//               </motion.p>
//             </div>

//             {/* Company Name */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//             >
//               <label className="block text-sm font-semibold text-gray-700 mb-3">
//                 Company Name
//               </label>
//               <div className="relative">
//                 <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   name="companyName"
//                   value={formData.companyName}
//                   onChange={handleInputChange}
//                   placeholder="Enter your company name"
//                   className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
//                 />
//               </div>
//             </motion.div>

//             {/* Industry */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3 }}
//             >
//               <label className="block text-sm font-semibold text-gray-700 mb-3">
//                 Industry
//               </label>
//               <div className="relative">
//                 <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <select
//                   name="industry"
//                   value={formData.industry}
//                   onChange={handleInputChange}
//                   className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 appearance-none"
//                 >
//                   <option value="">Select your industry</option>
//                   <option value="technology">Technology</option>
//                   <option value="healthcare">Healthcare</option>
//                   <option value="finance">Finance</option>
//                   <option value="education">Education</option>
//                   <option value="retail">Retail</option>
//                   <option value="manufacturing">Manufacturing</option>
//                   <option value="consulting">Consulting</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>
//             </motion.div>

//             {/* Team Size */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.4 }}
//             >
//               <label className="block text-sm font-semibold text-gray-700 mb-3">
//                 Team Size
//               </label>
//               <div className="relative">
//                 <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <select
//                   name="teamSize"
//                   value={formData.teamSize}
//                   onChange={handleInputChange}
//                   className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 appearance-none"
//                 >
//                   <option value="">Select team size</option>
//                   <option value="1-5">1-5 people</option>
//                   <option value="6-20">6-20 people</option>
//                   <option value="21-50">21-50 people</option>
//                   <option value="51-200">51-200 people</option>
//                   <option value="200+">200+ people</option>
//                 </select>
//               </div>
//             </motion.div>

//             {/* Complete Setup Button */}
//             <motion.button
//               type="button"
//               disabled={isSubmitting}
//               onClick={handleFinalOnboarding}
//               className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
//               style={{
//                 background: isSubmitting 
//                   ? 'linear-gradient(135deg, #a855f7, #6366f1)' 
//                   : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
//               }}
//               whileHover={!isSubmitting ? { 
//                 scale: 1.02, 
//                 boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" 
//               } : {}}
//               whileTap={!isSubmitting ? { scale: 0.98 } : {}}
//               animate={{
//                 boxShadow: formProgress === 100 
//                   ? "0 0 40px rgba(139, 92, 246, 0.6)" 
//                   : "0 4px 20px rgba(0,0,0,0.1)"
//               }}
//             >
//               <span className="relative z-10 flex items-center justify-center">
//                 {isSubmitting ? (
//                   <>
//                     <motion.div
//                       className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
//                       animate={{ rotate: 360 }}
//                       transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                     />
//                     Setting up your workspace...
//                   </>
//                 ) : (
//                   <>
//                     {formProgress === 100 ? "🚀 Generate AI Templates" : "Complete Business Setup"}
//                     <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                   </>
//                 )}
//               </span>
//             </motion.button>
//           </div>
//         );
//       } else {
//         // Individual onboarding
//         return (
//           <div className="space-y-6">
//             <div className="text-center mb-6">
//               <motion.h3
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="text-xl font-bold text-gray-800 mb-2"
//               >
//                 Tell us about yourself
//               </motion.h3>
//               <motion.p
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1 }}
//                 className="text-gray-600"
//               >
//                 Help us personalize your experience
//               </motion.p>
//             </div>

//             {/* Profession */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.2 }}
//             >
//               <label className="block text-sm font-semibold text-gray-700 mb-3">
//                 Profession
//               </label>
//               <div className="relative">
//                 <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   name="profession"
//                   value={formData.profession}
//                   onChange={handleInputChange}
//                   placeholder="e.g., Software Developer, Designer, Consultant"
//                   className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
//                 />
//               </div>
//             </motion.div>

//             {/* Use Case */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.3 }}
//             >
//               <label className="block text-sm font-semibold text-gray-700 mb-3">
//                 Primary Use Case
//               </label>
//               <div className="relative">
//                 <Target className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <select
//                   name="useCase"
//                   value={formData.useCase}
//                   onChange={handleInputChange}
//                   className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 appearance-none"
//                 >
//                   <option value="">What will you primarily use this for?</option>
//                   <option value="personal">Personal schedule management</option>
//                   <option value="freelance">Freelance project tracking</option>
//                   <option value="client-meetings">Client meeting scheduling</option>
//                   <option value="productivity">Personal productivity</option>
//                   <option value="learning">Learning & skill development</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>
//             </motion.div>

//             {/* Complete Setup Button */}
//             <motion.button
//               type="button"
//               disabled={isSubmitting}
//               onClick={handleFinalOnboarding}
//               className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
//               style={{
//                 background: isSubmitting 
//                   ? 'linear-gradient(135deg, #a855f7, #6366f1)' 
//                   : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
//               }}
//               whileHover={!isSubmitting ? { 
//                 scale: 1.02, 
//                 boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" 
//               } : {}}
//               whileTap={!isSubmitting ? { scale: 0.98 } : {}}
//               animate={{
//                 boxShadow: formProgress === 100 
//                   ? "0 0 40px rgba(139, 92, 246, 0.6)" 
//                   : "0 4px 20px rgba(0,0,0,0.1)"
//               }}
//             >
//               <span className="relative z-10 flex items-center justify-center">
//                 {isSubmitting ? (
//                   <>
//                     <motion.div
//                       className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
//                       animate={{ rotate: 360 }}
//                       transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                     />
//                     Setting up your workspace...
//                   </>
//                 ) : (
//                   <>
//                     {formProgress === 100 ? "🚀 Generate AI Templates" : "Complete Personal Setup"}
//                     <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                   </>
//                 )}
//               </span>
//             </motion.button>
//           </div>
//         );
//       }
//     }

//     if (registrationStep === 5) {
//       return (
//         <div className="space-y-6">
//           <div className="text-center mb-8">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
//             >
//               <Brain className="w-8 h-8 text-purple-600" />
//             </motion.div>
//             <motion.h3
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-xl font-bold text-gray-800 mb-2"
//             >
//               AI-Generated Service Templates
//             </motion.h3>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-gray-600"
//             >
//               Based on your {userType === 'business' ? `${formData.industry} industry` : `${formData.profession} profession`}, 
//               our AI has crafted these personalized service templates
//             </motion.p>
//           </div>

//           {generatedTemplates.length === 0 ? (
//             <div className="text-center py-12">
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                 className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
//               />
//               <p className="text-gray-600">AI is analyzing your needs and generating templates...</p>
//             </div>
//           ) : (
//             <>
//               <div className="space-y-4">
//                 {generatedTemplates.map((template, index) => (
//                   <motion.div
//                     key={template.id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                     className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
//                       selectedTemplates.find(t => t.id === template.id)
//                         ? 'border-purple-500 bg-purple-50'
//                         : 'border-gray-200 hover:border-purple-300'
//                     }`}
//                     onClick={() => handleTemplateSelection(template)}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2">
//                           <h4 className="font-semibold text-gray-800">{template.name}</h4>
//                           <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
//                             {template.category}
//                           </span>
//                         </div>
//                         <p className="text-gray-600 text-sm mb-3">{template.description}</p>
//                         <div className="flex items-center space-x-4 text-sm text-gray-500">
//                           <div className="flex items-center">
//                             <Clock className="w-4 h-4 mr-1" />
//                             <span>{template.duration} min</span>
//                           </div>
//                           <div className="flex items-center">
//                             <DollarSign className="w-4 h-4 mr-1" />
//                             <span>${template.price}</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex-shrink-0 ml-4">
//                         {selectedTemplates.find(t => t.id === template.id) ? (
//                           <CheckCircle2 className="w-6 h-6 text-purple-600" />
//                         ) : (
//                           <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
//                         )}
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>

//               <AnimatePresence>
//                 {errors.templates && (
//                   <motion.p
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -10 }}
//                     className="text-center text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200"
//                   >
//                     {errors.templates}
//                   </motion.p>
//                 )}
//               </AnimatePresence>

//               {selectedTemplates.length > 0 && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="bg-green-50 border border-green-200 rounded-lg p-4"
//                 >
//                   <p className="text-sm text-green-700 font-medium">
//                     ✅ {selectedTemplates.length} template{selectedTemplates.length > 1 ? 's' : ''} selected
//                   </p>
//                   <p className="text-xs text-green-600 mt-1">
//                     You can customize these in the next step
//                   </p>
//                 </motion.div>
//               )}

//               <motion.button
//                 type="button"
//                 onClick={proceedToServiceConfiguration}
//                 className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
//                 style={{
//                   background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
//                 }}
//                 whileHover={{ 
//                   scale: 1.02, 
//                   boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" 
//                 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <span className="relative z-10 flex items-center justify-center">
//                   Configure Selected Services
//                   <Settings className="w-5 h-5 ml-2 group-hover:rotate-90 transition-transform duration-300" />
//                 </span>
//               </motion.button>
//             </>
//           )}
//         </div>
//       );
//     }

//     if (registrationStep === 6) {
//       return (
//         <div className="space-y-6">
//           <div className="text-center mb-6">
//             <motion.h3
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-xl font-bold text-gray-800 mb-2"
//             >
//               Configure Your Services
//             </motion.h3>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-gray-600"
//             >
//               Customize pricing, duration, and details for your services
//             </motion.p>
//           </div>

//           <div className="space-y-4">
//             {configuredServices.map((service, index) => (
//               <motion.div
//                 key={service.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="border rounded-xl p-6 bg-white"
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <h4 className="font-semibold text-gray-800">{service.name}</h4>
//                   {service.configured && (
//                     <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
//                       ✅ Configured
//                     </span>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Duration (minutes)
//                     </label>
//                     <div className="flex items-center space-x-2">
//                       <button
//                         type="button"
//                         onClick={() => handleServiceConfiguration(service.id, { 
//                           duration: Math.max(15, service.duration - 15) 
//                         })}
//                         className="p-2 border rounded-lg hover:bg-gray-50"
//                       >
//                         <Minus className="w-4 h-4" />
//                       </button>
//                       <input
//                         type="number"
//                         value={service.duration}
//                         onChange={(e) => handleServiceConfiguration(service.id, { 
//                           duration: parseInt(e.target.value) || 15 
//                         })}
//                         className="flex-1 text-center border rounded-lg py-2"
//                         min="15"
//                         max="480"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => handleServiceConfiguration(service.id, { 
//                           duration: Math.min(480, service.duration + 15) 
//                         })}
//                         className="p-2 border rounded-lg hover:bg-gray-50"
//                       >
//                         <Plus className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Price ($)
//                     </label>
//                     <div className="flex items-center space-x-2">
//                       <button
//                         type="button"
//                         onClick={() => handleServiceConfiguration(service.id, { 
//                           price: Math.max(10, service.price - 10) 
//                         })}
//                         className="p-2 border rounded-lg hover:bg-gray-50"
//                       >
//                         <Minus className="w-4 h-4" />
//                       </button>
//                       <input
//                         type="number"
//                         value={service.price}
//                         onChange={(e) => handleServiceConfiguration(service.id, { 
//                           price: parseInt(e.target.value) || 10 
//                         })}
//                         className="flex-1 text-center border rounded-lg py-2"
//                         min="10"
//                         max="5000"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => handleServiceConfiguration(service.id, { 
//                           price: Math.min(5000, service.price + 10) 
//                         })}
//                         className="p-2 border rounded-lg hover:bg-gray-50"
//                       >
//                         <Plus className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Category
//                     </label>
//                     <input
//                       type="text"
//                       value={service.category}
//                       onChange={(e) => handleServiceConfiguration(service.id, { 
//                         category: e.target.value 
//                       })}
//                       className="w-full border rounded-lg py-2 px-3"
//                       placeholder="Service category"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <textarea
//                     value={service.description}
//                     onChange={(e) => handleServiceConfiguration(service.id, { 
//                       description: e.target.value,
//                       configured: true 
//                     })}
//                     className="w-full border rounded-lg py-2 px-3"
//                     rows="2"
//                     placeholder="Service description"
//                   />
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           <AnimatePresence>
//             {errors.services && (
//               <motion.p
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 className="text-center text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200"
//               >
//                 {errors.services}
//               </motion.p>
//             )}
//           </AnimatePresence>

//           <motion.button
//             type="button"
//             onClick={proceedToBroadcastSlots}
//             className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
//             style={{
//               background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
//             }}
//             whileHover={{ 
//               scale: 1.02, 
//               boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" 
//             }}
//             whileTap={{ scale: 0.98 }}
//           >
//             <span className="relative z-10 flex items-center justify-center">
//               Set Availability
//               <Clock className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
//             </span>
//           </motion.button>
//         </div>
//       );
//     }

//     if (registrationStep === 7) {
//       return (
//         <div className="space-y-6">
//           <div className="text-center mb-6">
//             <motion.h3
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-xl font-bold text-gray-800 mb-2"
//             >
//               Set Your Availability
//             </motion.h3>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-gray-600"
//             >
//               Choose the days and times when clients can book your services
//             </motion.p>
//           </div>

//           <div className="space-y-3">
//             {Object.entries(broadcastSlots).map(([day, config], index) => (
//               <motion.div
//                 key={day}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className={`p-4 border-2 rounded-xl transition-all duration-300 ${
//                   config.enabled 
//                     ? 'border-purple-500 bg-purple-50' 
//                     : 'border-gray-200'
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <motion.button
//                       type="button"
//                       onClick={() => handleDayToggle(day)}
//                       className="flex items-center space-x-3"
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                     >
//                       <div 
//                         className="w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all duration-300"
//                         style={{
//                           borderColor: config.enabled ? '#8b5cf6' : '#d1d5db',
//                           backgroundColor: config.enabled ? '#8b5cf6' : 'white'
//                         }}
//                       >
//                         {config.enabled && (
//                           <motion.div
//                             initial={{ scale: 0 }}
//                             animate={{ scale: 1 }}
//                             transition={{ type: "spring", stiffness: 500, damping: 30 }}
//                           >
//                             <Check className="w-3 h-3 text-white" />
//                           </motion.div>
//                         )}
//                       </div>
//                       <span className="font-medium text-gray-800 capitalize">
//                         {day}
//                       </span>
//                     </motion.button>
//                   </div>
                  
//                   {config.enabled && (
//                     <motion.div
//                       initial={{ opacity: 0, scale: 0 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       className="flex items-center space-x-2 text-sm text-gray-600"
//                     >
//                       <Clock className="w-4 h-4" />
//                       <span>9:00 AM - 5:00 PM</span>
//                     </motion.div>
//                   )}
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <div className="flex items-center">
//               <Info className="w-5 h-5 text-blue-600 mr-2" />
//               <div>
//                 <p className="text-sm text-blue-700 font-medium">Quick Setup</p>
//                 <p className="text-xs text-blue-600 mt-1">
//                   Default hours are 9:00 AM - 5:00 PM. You can customize these later in your dashboard.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <motion.button
//             type="button"
//             disabled={isSubmitting || Object.values(broadcastSlots).every(day => !day.enabled)}
//             onClick={generateBookingLink}
//             className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
//             style={{
//               background: isSubmitting || Object.values(broadcastSlots).every(day => !day.enabled)
//                 ? 'linear-gradient(135deg, #a855f7, #6366f1)' 
//                 : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
//               opacity: Object.values(broadcastSlots).every(day => !day.enabled) ? 0.6 : 1
//             }}
//             whileHover={!isSubmitting && !Object.values(broadcastSlots).every(day => !day.enabled) ? { 
//               scale: 1.02, 
//               boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" 
//             } : {}}
//             whileTap={!isSubmitting && !Object.values(broadcastSlots).every(day => !day.enabled) ? { scale: 0.98 } : {}}
//           >
//             <span className="relative z-10 flex items-center justify-center">
//               {isSubmitting ? (
//                 <>
//                   <motion.div
//                     className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                   />
//                   Generating your booking link...
//                 </>
//               ) : (
//                 <>
//                   {Object.values(broadcastSlots).some(day => day.enabled) ? 
//                     "🚀 Generate Booking Link" : 
//                     "Select at least one day"
//                   }
//                   <Link className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
//                 </>
//               )}
//             </span>
//           </motion.button>
//         </div>
//       );
//     }

//     if (registrationStep === 8) {
//       return (
//         <div className="space-y-6">
//           <div className="text-center mb-8">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
//             >
//               <CheckCircle2 className="w-10 h-10 text-green-600" />
//             </motion.div>
//             <motion.h3
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-2xl font-bold text-gray-800 mb-3"
//             >
//               🎉 Congratulations!
//             </motion.h3>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-gray-600"
//             >
//               Your booking system is live and ready for clients!
//             </motion.p>
//           </div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6"
//           >
//             <div className="flex items-center justify-between mb-4">
//               <h4 className="font-semibold text-gray-800">Your Booking Link</h4>
//               <div className="flex space-x-2">
//                 <motion.button
//                   onClick={() => {
//                     navigator.clipboard.writeText(bookingLink);
//                     alert('Link copied to clipboard!');
//                   }}
//                   className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <Copy className="w-4 h-4 text-gray-600" />
//                 </motion.button>
//                 <motion.button
//                   onClick={() => {
//                     alert('Share functionality would open here');
//                   }}
//                   className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <Share2 className="w-4 h-4 text-gray-600" />
//                 </motion.button>
//               </div>
//             </div>
            
//             <div className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-sm text-gray-800 break-all">
//               {bookingLink}
//             </div>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="bg-white border border-gray-200 rounded-xl p-4 text-center"
//             >
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <Users className="w-6 h-6 text-blue-600" />
//               </div>
//               <h5 className="font-semibold text-gray-800 mb-1">{configuredServices.length}</h5>
//               <p className="text-sm text-gray-600">Services Configured</p>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//               className="bg-white border border-gray-200 rounded-xl p-4 text-center"
//             >
//               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <Calendar className="w-6 h-6 text-green-600" />
//               </div>
//               <h5 className="font-semibold text-gray-800 mb-1">
//                 {Object.values(broadcastSlots).filter(day => day.enabled).length}
//               </h5>
//               <p className="text-sm text-gray-600">Days Available</p>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               className="bg-white border border-gray-200 rounded-xl p-4 text-center"
//             >
//               <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <Rocket className="w-6 h-6 text-purple-600" />
//               </div>
//               <h5 className="font-semibold text-gray-800 mb-1">Ready!</h5>
//               <p className="text-sm text-gray-600">System Status</p>
//             </motion.div>
//           </div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6 }}
//             className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6"
//           >
//             <h4 className="font-semibold text-gray-800 mb-3">What's Next?</h4>
//             <ul className="space-y-2 text-sm text-gray-600">
//               <li className="flex items-center">
//                 <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
//                 Share your booking link with clients
//               </li>
//               <li className="flex items-center">
//                 <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
//                 Customize your services in the dashboard
//               </li>
//               <li className="flex items-center">
//                 <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
//                 Set up payment integration
//               </li>
//               <li className="flex items-center">
//                 <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
//                 Track bookings and manage your calendar
//               </li>
//             </ul>
//           </motion.div>

//           <motion.button
//             type="button"
//             onClick={() => {
//               alert('Redirecting to dashboard... 🎉\n\nRegistration completed successfully!\n\nUser: ' + formData.name + '\nServices: ' + configuredServices.length + '\nBooking Link: ' + bookingLink);
//             }}
//             className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
//             style={{
//               background: 'linear-gradient(135deg, #10b981, #059669)',
//             }}
//             whileHover={{ 
//               scale: 1.02, 
//               boxShadow: "0 20px 40px rgba(16, 185, 129, 0.4)" 
//             }}
//             whileTap={{ scale: 0.98 }}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.7 }}
//           >
//             <span className="relative z-10 flex items-center justify-center">
//               Go to Dashboard
//               <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//             </span>
//           </motion.button>
//         </div>
//       );
//     }

//     return null;
//   };

//   return (
//     <div 
//       className="min-h-screen flex flex-col lg:flex-row bg-slate-50 relative overflow-hidden"
//       onMouseMove={handleMouseMove}
//     >
//       {/* Left Panel - Enhanced Form */}
//       <motion.div 
//         className="w-full lg:w-1/2 flex justify-center items-center p-4 sm:p-8 order-1 bg-white relative z-10"
//         animate={{ scale: formScale }}
//         transition={{ type: "spring", damping: 25, stiffness: 300 }}
//         style={{ willChange: 'transform' }}
//       >
//         {/* Dynamic Progress Bar */}
//         <AnimatePresence>
//           {formProgress > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="absolute top-8 left-8 right-8"
//             >
//               <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-2 overflow-hidden">
//                 <motion.div
//                   className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-full relative"
//                   animate={{ width: `${progressValue}%` }}
//                   transition={{ type: "spring", damping: 30, stiffness: 400 }}
//                   style={{ willChange: 'width' }}
//                 >
//                   <motion.div
//                     className="absolute inset-0 bg-white/30 rounded-full"
//                     animate={{ x: ['0%', '100%'] }}
//                     transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
//                   />
//                 </motion.div>
//               </div>
//               <motion.p
//                 className="text-sm text-gray-600 mt-2 font-medium"
//                 animate={{ color: formProgress === 100 ? '#059669' : '#6b7280' }}
//               >
//                 {currentMode === 'register' ? (
//                   registrationStep === 1 ? (
//                     formProgress < 50 ? "Welcome! Let's get started..." : 
//                     formProgress < 100 ? "Looking good..." : "✨ Ready for verification!"
//                   ) : registrationStep === 2 ? (
//                     formProgress < 100 ? "Enter the 4-digit code..." : "✨ Ready to verify!"
//                   ) : registrationStep === 3 ? (
//                     formProgress === 0 ? "Choose your path..." : "✨ Perfect choice!"
//                   ) : registrationStep === 4 ? (
//                     formProgress < 50 ? "Tell us more..." : 
//                     formProgress < 100 ? "Almost done..." : "🧠 AI is thinking..."
//                   ) : registrationStep === 5 ? (
//                     generatedTemplates.length === 0 ? "AI is generating templates..." : 
//                     selectedTemplates.length === 0 ? "Select your templates..." : "✨ Templates selected!"
//                   ) : registrationStep === 6 ? (
//                     formProgress < 50 ? "Configure your services..." : 
//                     formProgress < 100 ? "Almost configured..." : "⚙️ Services ready!"
//                   ) : registrationStep === 7 ? (
//                     formProgress === 0 ? "Set your availability..." : 
//                     formProgress < 100 ? "Select more days..." : "📅 Schedule set!"
//                   ) : (
//                     "🎉 You're live and ready!"
//                   )
//                 ) : (
//                   formProgress < 50 ? "Getting started..." : 
//                   formProgress < 100 ? "Almost there..." : "✨ Ready to sign in!"
//                 )}
//               </motion.p>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Back button for registration steps */}
//         {currentMode === 'register' && registrationStep > 1 && registrationStep < 8 && (
//           <motion.button
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             onClick={() => {
//               if (registrationStep === 2) setRegistrationStep(1);
//               else if (registrationStep === 3) setRegistrationStep(2);
//               else if (registrationStep === 4) setRegistrationStep(3);
//               else if (registrationStep === 5) setRegistrationStep(4);
//               else if (registrationStep === 6) setRegistrationStep(5);
//               else if (registrationStep === 7) setRegistrationStep(6);
//               else handleBackToLogin();
//             }}
//             className="absolute top-8 left-8 flex items-center text-gray-600 hover:text-purple-600 transition-colors z-20"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             <span className="text-sm font-medium">Back</span>
//           </motion.button>
//         )}

//         {/* Back to login for registration step 1 */}
//         {currentMode === 'register' && registrationStep === 1 && (
//           <motion.button
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             onClick={handleBackToLogin}
//             className="absolute top-8 left-8 flex items-center text-gray-600 hover:text-purple-600 transition-colors z-20"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             <span className="text-sm font-medium">Back to login</span>
//           </motion.button>
//         )}

//         <motion.div 
//           className="w-full max-w-md"
//           style={{ willChange: 'transform' }}
//         >
//           {/* Enhanced Header */}
//           <motion.div className="text-center mb-8">
//             <motion.div
//               className="w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 cursor-pointer relative overflow-hidden"
//               whileHover={{ 
//                 scale: 1.1, 
//                 rotate: [0, -5, 5, 0],
//                 boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)"
//               }}
//               whileTap={{ scale: 0.95 }}
//               animate={{
//                 boxShadow: isTyping 
//                   ? "0 0 30px rgba(147, 51, 234, 0.6)" 
//                   : "0 10px 30px rgba(0,0,0,0.15)"
//               }}
//               style={{ willChange: 'transform, box-shadow' }}
//             >
//               {currentMode === 'register' ? (
//                 registrationStep === 2 ? <Mail className="w-10 h-10 text-white relative z-10" /> :
//                 registrationStep === 3 ? <Users className="w-10 h-10 text-white relative z-10" /> :
//                 registrationStep === 4 ? <Settings className="w-10 h-10 text-white relative z-10" /> :
//                 registrationStep === 5 ? <Brain className="w-10 h-10 text-white relative z-10" /> :
//                 registrationStep === 6 ? <Wand2 className="w-10 h-10 text-white relative z-10" /> :
//                 registrationStep === 7 ? <Clock className="w-10 h-10 text-white relative z-10" /> :
//                 registrationStep === 8 ? <Rocket className="w-10 h-10 text-white relative z-10" /> :
//                 <User className="w-10 h-10 text-white relative z-10" />
//               ) : (
//                 <Calendar className="w-10 h-10 text-white relative z-10" />
//               )}
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
//                 animate={{ 
//                   scale: isTyping ? [1, 1.2, 1] : 1,
//                   opacity: isTyping ? [0.3, 0.6, 0.3] : 0.3
//                 }}
//                 transition={{ duration: 2, repeat: isTyping ? Infinity : 0 }}
//               />
//             </motion.div>

//             <motion.h1
//               className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent mb-3"
//               key={`${currentMode}-${registrationStep}`}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               {currentMode === 'login' ? "Welcome Back" :
//                registrationStep === 1 ? "Create Account" :
//                registrationStep === 2 ? "Verify Email" :
//                registrationStep === 3 ? "Choose Your Path" :
//                registrationStep === 4 ? "Complete Setup" :
//                registrationStep === 5 ? "AI Templates" :
//                registrationStep === 6 ? "Configure Services" :
//                registrationStep === 7 ? "Set Availability" :
//                "You're Live!"}
//             </motion.h1>

//             <motion.p
//               className="text-gray-600"
//               animate={{
//                 y: focusedField ? -2 : 0,
//                 color: focusedField ? '#7c3aed' : '#6b7280'
//               }}
//             >
//               {currentMode === 'login' ? (
//                 focusedField === 'email' ? "✉️ Let's verify your identity" :
//                 focusedField === 'password' ? "🔐 Enter your secure passphrase" :
//                 "Sign in to your premium workspace"
//               ) : registrationStep === 1 ? (
//                 focusedField === 'name' ? "👤 What should we call you?" :
//                 focusedField === 'email' ? "✉️ Your email for verification" :
//                 "Let's create your account"
//               ) : registrationStep === 2 ? (
//                 "Check your email for the verification code"
//               ) : registrationStep === 3 ? (
//                 "How will you use our platform?"
//               ) : registrationStep === 4 ? (
//                 "Just a few more details to get started"
//               ) : registrationStep === 5 ? (
//                 "Review and select your AI-generated service templates"
//               ) : registrationStep === 6 ? (
//                 "Customize your services to match your needs"
//               ) : registrationStep === 7 ? (
//                 "Set when clients can book your services"
//               ) : (
//                 "Your booking system is ready to go live!"
//               )}
//             </motion.p>
//           </motion.div>

//           {/* Dynamic Form Content */}
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={`${currentMode}-${registrationStep}`}
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.3 }}
//             >
//               {renderContent()}
//             </motion.div>
//           </AnimatePresence>

//           {/* Social Login - Only for login and first registration step */}
//           {(currentMode === 'login' || (currentMode === 'register' && registrationStep === 1)) && (
//             <motion.div 
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="mt-8"
//             >
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-4 bg-white text-gray-500 font-medium">
//                     Or {currentMode === 'register' ? 'sign up' : 'continue'} with
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-6 grid grid-cols-2 gap-4">
//                 {[
//                   { name: 'Google', icon: '🌟', color: 'hover:bg-red-50 hover:border-red-200' },
//                   { name: 'Microsoft', icon: '⚡', color: 'hover:bg-blue-50 hover:border-blue-200' }
//                 ].map((provider) => (
//                   <motion.button
//                     key={provider.name}
//                     type="button"
//                     onClick={() => handleSocialAuth(provider.name)}
//                     className={`flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white transition-all duration-300 ${provider.color}`}
//                     whileHover={{ scale: 1.02, y: -2 }}
//                     whileTap={{ scale: 0.98 }}
//                     style={{ willChange: 'transform' }}
//                   >
//                     <span className="text-lg mr-2">{provider.icon}</span>
//                     {provider.name}
//                   </motion.button>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {/* Toggle between login/signup - Only show on login and first registration step */}
//           {(currentMode === 'login' || (currentMode === 'register' && registrationStep === 1)) && (
//             <motion.div 
//               className="text-center mt-8"
//               animate={{ y: isTyping ? -5 : 0 }}
//             >
//               <span className="text-gray-600">
//                 {currentMode === 'login' ? "Don't have an account? " : "Already have an account? "}
//               </span>
//               <motion.button
//                 className="text-purple-600 hover:text-purple-700 font-semibold"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleModeSwitch}
//               >
//                 {currentMode === 'login' ? "Create one now →" : "Sign in →"}
//               </motion.button>
//             </motion.div>
//           )}
//         </motion.div>
//       </motion.div>

//       {/* Right Panel - Enhanced Experience */}
//       <motion.div 
//         className="w-full lg:w-1/2 relative min-h-[60vh] lg:min-h-screen order-2 overflow-hidden"
//         animate={{
//           background: `linear-gradient(135deg, ${experienceSteps[currentSlide]?.gradient || '#8b5cf6, #3b82f6'})`
//         }}
//         transition={{ duration: 1.5, ease: "easeInOut" }}
//         style={{ willChange: 'background' }}
//       >
//         {/* Particle System */}
//         <ParticleSystem isActive={isTyping || formProgress > 50} formProgress={formProgress} />
        
//         {/* Floating Elements */}
//         <FloatingElements isTyping={isTyping} formProgress={formProgress} currentMode={currentMode} />

//         {/* Content */}
//         <motion.div
//           className="relative z-20 h-full p-8 lg:p-12 flex flex-col justify-center text-white"
//           animate={{
//             x: mousePosition.x * 5,
//             y: mousePosition.y * 5
//           }}
//           transition={{ type: "spring", damping: 50, stiffness: 400 }}
//           style={{ willChange: 'transform' }}
//         >
//           {/* Dynamic Content Slider */}
//           <div className="mb-12 relative overflow-hidden">
//             <motion.div
//               animate={{ x: `${-currentSlide * 100}%` }}
//               transition={{ duration: 1.2, ease: [0.25, 0.25, 0, 1] }}
//               className="flex"
//               style={{ width: `${experienceSteps.length * 100}%`, willChange: 'transform' }}
//             >
//               {experienceSteps.map((step, index) => (
//                 <div key={index} className="w-full flex-shrink-0 pr-8">
//                   <motion.h2 
//                     className="text-4xl lg:text-5xl font-bold mb-4 leading-tight"
//                     animate={{ 
//                       opacity: currentSlide === index ? 1 : 0.3,
//                       y: currentSlide === index ? 0 : 20
//                     }}
//                     transition={{ delay: 0.2 }}
//                   >
//                     {step.title}
//                   </motion.h2>
//                   <motion.p 
//                     className="text-xl text-white/90 mb-6"
//                     animate={{ 
//                       opacity: currentSlide === index ? 1 : 0.3,
//                       y: currentSlide === index ? 0 : 20
//                     }}
//                     transition={{ delay: 0.4 }}
//                   >
//                     {step.subtitle}
//                   </motion.p>
//                   <motion.div
//                     className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
//                     animate={{ 
//                       opacity: currentSlide === index ? 1 : 0.3,
//                       scale: currentSlide === index ? 1 : 0.9
//                     }}
//                     transition={{ delay: 0.6 }}
//                   >
//                     <Sparkles className="w-5 h-5 mr-2" />
//                     <span className="font-semibold">{step.highlight}</span>
//                   </motion.div>
//                 </div>
//               ))}
//             </motion.div>

//             {/* Progress Dots */}
//             <div className="flex space-x-3 mt-8">
//               {experienceSteps.map((_, index) => (
//                 <motion.button
//                   key={index}
//                   onClick={() => setCurrentSlide(index)}
//                   className="w-3 h-3 rounded-full transition-all duration-300"
//                   style={{
//                     backgroundColor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.3)',
//                     transform: currentSlide === index ? 'scale(1.2)' : 'scale(1)'
//                   }}
//                   whileHover={{ scale: 1.3 }}
//                   whileTap={{ scale: 0.9 }}
//                   animate={{
//                     backgroundColor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.3)',
//                     scale: currentSlide === index ? 1.2 : 1
//                   }}
//                   transition={{ duration: 0.3 }}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Key Features */}
//           <motion.div
//             className="grid grid-cols-2 gap-6"
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.8 }}
//           >
//             {[
//               { icon: Shield, title: "Secure", desc: "Bank-grade encryption" },
//               { icon: Zap, title: "Fast", desc: "Lightning quick setup" },
//               { icon: Users, title: "Collaborative", desc: "Team-friendly features" },
//               { icon: Star, title: "Premium", desc: "Professional experience" }
//             ].map((feature, index) => (
//               <motion.div
//                 key={index}
//                 className="flex items-center space-x-3 text-white/80"
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 1 + index * 0.1 }}
//                 whileHover={{ 
//                   scale: 1.05, 
//                   color: '#ffffff',
//                   transition: { duration: 0.2 }
//                 }}
//               >
//                 <div className="flex-shrink-0">
//                   <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
//                     <feature.icon className="w-5 h-5" />
//                   </div>
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-sm">{feature.title}</h4>
//                   <p className="text-xs text-white/70">{feature.desc}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>

//           {/* Bottom Stats */}
//           <motion.div
//             className="absolute bottom-8 left-8 right-8"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1.5 }}
//           >
//             <div className="grid grid-cols-3 gap-4 text-center">
//               <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
//                 <motion.div
//                   className="text-2xl font-bold mb-1"
//                   animate={{ 
//                     scale: [1, 1.1, 1],
//                     color: ['#ffffff', '#fbbf24', '#ffffff']
//                   }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                 >
//                   50K+
//                 </motion.div>
//                 <div className="text-xs text-white/70">Happy Users</div>
//               </div>
//               <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
//                 <motion.div
//                   className="text-2xl font-bold mb-1"
//                   animate={{ 
//                     scale: [1, 1.1, 1],
//                     color: ['#ffffff', '#10b981', '#ffffff']
//                   }}
//                   transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
//                 >
//                   99.9%
//                 </motion.div>
//                 <div className="text-xs text-white/70">Uptime</div>
//               </div>
//               <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
//                 <motion.div
//                   className="text-2xl font-bold mb-1"
//                   animate={{ 
//                     scale: [1, 1.1, 1],
//                     color: ['#ffffff', '#8b5cf6', '#ffffff']
//                   }}
//                   transition={{ duration: 2, repeat: Infinity, delay: 1 }}
//                 >
//                   24/7
//                 </motion.div>
//                 <div className="text-xs text-white/70">Support</div>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default EnhancedAuthFlow;
                