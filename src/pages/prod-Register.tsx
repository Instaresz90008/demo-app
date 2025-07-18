// import { useEffect, useState, useRef, useCallback } from "react";
// import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
// import { Calendar, Mail, User, ArrowRight, UserCheck, Building2, Briefcase, Target, Rocket, ChevronRight, CheckCircle, ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// interface FormData {
//     name: string;
//     email: string;
//     password: string;
//     confirmPassword: string;
//     companyName: string;
//     industry: string;
//     teamSize: string;
//     profession: string;
//     useCase: string;
// }

// interface ErrorType {
//     password: any;
//     confirmPassword: any;
//     name?: string;
//     email?: string;
//     submit?: string;
//     otp?: string;
//     companyName?: string;
//     industry?: string;
//     teamSize?: string;
//     profession?: string;
//     useCase?: string;

// }
// const API_URL = import.meta.env.VITE_API_URL;

// const ParticleSystem = ({ isActive, formProgress }: { isActive: boolean; formProgress: number }) => {
//     const canvasRef = useRef<HTMLCanvasElement>(null);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;
//         const ctx = canvas.getContext('2d');
//         if (!ctx) return;

//         const resizeCanvas = () => {
//             canvas.width = canvas.offsetWidth * window.devicePixelRatio;
//             canvas.height = canvas.offsetHeight * window.devicePixelRatio;
//             ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
//         };

//         resizeCanvas();
//         window.addEventListener('resize', resizeCanvas);

//         const particles = Array.from({ length: 50 }, () => ({
//             x: Math.random() * canvas.offsetWidth,
//             y: Math.random() * canvas.offsetHeight,
//             vx: (Math.random() - 0.5) * 0.5,
//             vy: (Math.random() - 0.5) * 0.5,
//             size: Math.random() * 2 + 1,
//             opacity: Math.random() * 0.5 + 0.1,
//             hue: 240 + Math.random() * 60,
//             life: Math.random()
//         }));

//         let animationId: number;
//         const animate = () => {
//             ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
//             const intensity = isActive ? 1 : 0.3;
//             const progressMultiplier = 1 + (formProgress / 100) * 2;

//             particles.forEach(particle => {
//                 particle.x += particle.vx * intensity * progressMultiplier;
//                 particle.y += particle.vy * intensity * progressMultiplier;

//                 if (particle.x < 0) particle.x = canvas.offsetWidth;
//                 if (particle.x > canvas.offsetWidth) particle.x = 0;
//                 if (particle.y < 0) particle.y = canvas.offsetHeight;
//                 if (particle.y > canvas.offsetHeight) particle.y = 0;

//                 particle.life += 0.01;
//                 if (particle.life > 1) particle.life = 0;

//                 ctx.save();
//                 ctx.globalAlpha = particle.opacity * intensity * (0.5 + 0.5 * Math.sin(particle.life * Math.PI));
//                 ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`;
//                 ctx.beginPath();
//                 ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
//                 ctx.fill();
//                 ctx.restore();
//             });

//             animationId = requestAnimationFrame(animate);
//         };

//         animate();
//         return () => {
//             window.removeEventListener('resize', resizeCanvas);
//             cancelAnimationFrame(animationId);
//         };
//     }, [isActive, formProgress]);

//     return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ transform: 'translate3d(0, 0, 0)' }} />;
// };

// const FloatingElements = ({ isTyping, formProgress }: { isTyping: boolean; formProgress: number }) => {
//     const elements = [
//         { icon: Calendar, delay: 0, size: 24, position: { top: '20%', left: '10%' } },
//         { icon: UserCheck, delay: 1, size: 20, position: { top: '60%', left: '15%' } },
//         { icon: Building2, delay: 2, size: 28, position: { top: '40%', left: '80%' } },
//     ];

//     return (
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//             {elements.map((element, index) => (
//                 <motion.div
//                     key={index}
//                     className="absolute"
//                     style={{ top: element.position.top, left: element.position.left }}
//                     initial={{ opacity: 0, scale: 0, rotate: -180 }}
//                     animate={{
//                         opacity: [0.1, 0.3, 0.1],
//                         scale: [0.8, 1.2, 0.8],
//                         rotate: [0, 360],
//                         y: [-10, 10, -10],
//                     }}
//                     transition={{ duration: 8, delay: element.delay, repeat: Infinity, ease: "easeInOut" }}
//                 >
//                     <element.icon size={element.size} className="text-white/20" style={{ filter: `hue-rotate(${formProgress * 3.6}deg)` }} />
//                 </motion.div>
//             ))}
//         </div>
//     );
// };

// const Register_V1 = () => {
//     const [OtpBackendCode, setOtpBackendCode] = useState('');
//     const navigate = useNavigate();
//     const [registrationStep, setRegistrationStep] = useState(1);
//     const [isPageLoading, setIsPageLoading] = useState(true);
//     const [isTyping, setIsTyping] = useState(false);
//     const [focusedField, setFocusedField] = useState<string | null>(null);
//     const [formProgress, setFormProgress] = useState(0);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [userType, setUserType] = useState('');
//     const [otpCode, setOtpCode] = useState(['', '', '', '']);
//     const [resendTimer, setResendTimer] = useState(0);
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [formData, setFormData] = useState<FormData>({
//         name: '', email: '', password: '', confirmPassword: '', companyName: '', industry: '', teamSize: '', profession: '', useCase: ''
//     });
//     const [errors, setErrors] = useState<ErrorType>({
//         name: '', email: '', password: '', confirmPassword: '', companyName: '', industry: '', teamSize: '', profession: '', useCase: ''
//     });
//     const shouldReduceMotion = useReducedMotion();

//     useEffect(() => {
//         const timer = setTimeout(() => setIsPageLoading(false), 800);
//         return () => clearTimeout(timer);
//     }, []);

//     useEffect(() => {
//         const step1Fields = [formData.name, formData.email].filter(field => field.length > 0).length;
//         const otpFilled = otpCode.filter(code => code.length > 0).length;
//         const businessFields = [formData.companyName, formData.industry, formData.teamSize].filter(field => field.length > 0).length;
//         const individualFields = [formData.profession, formData.useCase].filter(field => field.length > 0).length;

//         setFormProgress(
//             registrationStep === 1 ? (step1Fields / 2) * 100 :
//                 registrationStep === 2 ? (otpFilled / 4) * 100 :
//                     registrationStep === 3 ? (userType ? 100 : 0) :
//                         registrationStep === 4 ? (userType === 'business' ? (businessFields / 3) * 100 : (individualFields / 2) * 100) : 0
//         );
//     }, [formData, otpCode, userType, registrationStep]);

//     useEffect(() => {
//         if (resendTimer > 0) {
//             const interval = setInterval(() => setResendTimer(timer => timer - 1), 1000);
//             return () => clearInterval(interval);
//         }
//     }, [resendTimer]);

//     const clientValidateEmail = (email: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
//         ? { valid: true, message: '' }
//         : { valid: false, message: 'Please enter a valid email address' };

//     const clientValidateName = (name: string) => {
//         if (name.length < 2) return { valid: false, message: 'Name must be at least 2 characters' };
//         if (name.length > 50) return { valid: false, message: 'Name cannot exceed 50 characters' };
//         if (!/^[a-zA-Z\s]+$/.test(name)) return { valid: false, message: 'Name can only contain letters and spaces' };
//         return { valid: true, message: '' };
//     };

//     const clientValidatePassword = (password: string) => {
//         if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
//         if (!/(?=.*[a-z])/.test(password)) return { valid: false, message: 'Password must contain at least one lowercase letter' };
//         if (!/(?=.*[A-Z])/.test(password)) return { valid: false, message: 'Password must contain at least one uppercase letter' };
//         if (!/(?=.*\d)/.test(password)) return { valid: false, message: 'Password must contain at least one number' };
//         if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) return { valid: false, message: 'Password must contain at least one special character' };
//         return { valid: true, message: '' };
//     };

//     const getPasswordStrength = (password: string) => {
//         let strength = 0;
//         if (password.length >= 8) strength += 1;
//         if (/(?=.*[a-z])/.test(password)) strength += 1;
//         if (/(?=.*[A-Z])/.test(password)) strength += 1;
//         if (/(?=.*\d)/.test(password)) strength += 1;
//         if (/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) strength += 1;
//         return strength;
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         setIsTyping(true);
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));

//         const newErrors: ErrorType = { ...errors };
//         if (name === 'name') {
//             const validation = clientValidateName(value);
//             newErrors.name = validation.valid ? '' : validation.message;
//         } else if (name === 'email') {
//             const validation = clientValidateEmail(value);
//             newErrors.email = validation.valid ? '' : validation.message;
//         }
//         setErrors(newErrors);
//         setTimeout(() => setIsTyping(false), 1000);
//     };

//     const handleOtpChange = (index: number, value: string) => {
//         if (value.length <= 1 && /^[0-9]*$/.test(value)) {
//             const newOtp = [...otpCode];
//             newOtp[index] = value;
//             setOtpCode(newOtp);
//             if (value && index < 3) {
//                 const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`) as HTMLInputElement;
//                 if (nextInput) nextInput.focus();
//             }
//         }
//     };

//     const handleRegistrationStep1 = async () => {
//         const nameValidation = clientValidateName(formData.name);
//         const emailValidation = clientValidateEmail(formData.email);

//         if (!nameValidation.valid || !emailValidation.valid) {
//             setErrors({ ...errors, name: nameValidation.message, email: emailValidation.message });
//             return;
//         }
//         console.log('Sending OTP to:', formData.email);
//         try {
//             const response = await fetch(`${API_URL}/api/otp`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ email: formData.email }),
//             });

//             const data = await response.json();
//             console.log(data);

//             if (data.success) {
//                 setOtpBackendCode(data.otp);
//                 console.log('OTP sent successfully:', data.success);
//                 setRegistrationStep(2);
//                 setResendTimer(90);
//                 setErrors({ ...errors });
//             } else {
//                 // Handle known failure response from API
//                 setErrors({
//                     ...errors, submit: data.message || 'Failed to send OTP. Please try again.',
//                 });
//             }
//         } catch (error) {
//             console.error('Error sending OTP:', error);
//             setErrors({
//                 ...errors, submit: 'Verification failed. Please try again.',
//             });
//         } finally {
//             setIsSubmitting(false);
//         }

//     };

//     const handleOtpVerification = async () => {
//         const email = formData.email;

//         try {
//             const response = await fetch(`${API_URL}/api/otp/otpVerify`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ email: email, otp: otpCode.join('') }),
//             });
//             const data = await response.json();
//             console.log(data);
//             console.log('OTP sent successfully:', data);

//             if (data.success) {
//                 setRegistrationStep(3);
//                 setErrors({ ...errors })
//                 setOtpCode(['', '', '', '']);
//                 setIsSubmitting(true);
//             }
//         }
//         catch (error) {
//             setOtpCode(['', '', '', '']);
//             console.log(error);
//             setErrors({
//                 ...errors, submit: 'Verification failed. Please try again.',
//             })
//             setRegistrationStep(2);
//             setErrors({ ...errors })
//         }
//         finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleUserTypeSelection = (type: string) => {
//         setUserType(type);
//         setTimeout(() => setRegistrationStep(4), 500);
//     };

//     const handleFinalOnboarding = async () => {
//         console.log("final onboarding", formData);
//         try {
//             const response = await fetch(`${API_URL}/api/users/register`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(formData),
//                 credentials: 'include'
//             });

//             const data = await response.json();
//             console.log(data);

//             if (response.ok && data.success) {
//                 setIsSubmitting(true);
//                 navigate('/dashboard');
//             } else {
//                 setErrors({
//                     ...errors, submit: data.message || data.error || 'Registration failed.',
//                 });
//                 await new Promise(resolve => setTimeout(resolve, 2500));
//                 navigate('/register_v1');

//             }
//         } catch (error) {
//             console.error(error);
//             setErrors({
//                 ...errors, submit: 'Setup failed. Please try again.',
//             });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handlePasswordStep = async (e) => {
//         e.preventDefault();[1]
//         // Set a submitting state to disable the button and show a loader
//         setIsSubmitting(true);
//         const { password, confirmPassword } = formData;
//         const newErrors: ErrorType = { ...errors };
//         // 1. Validate Password Strength
//         // This uses a hypothetical validation function. You can build one based on your requirements.
//         const passwordValidation = clientValidatePassword(password);
//         if (!passwordValidation.valid) {
//             newErrors.password = passwordValidation.message;
//         }

//         // 2. Validate that Passwords Match
//         if (password !== confirmPassword) {
//             newErrors.confirmPassword = "Passwords do not match.";
//         }

//         // 3. Check if there are any errors
//         if (Object.keys(newErrors).length > 0) {
//             setErrors(newErrors); // Update the errors state to display messages in the UI
//             setIsSubmitting(false); // Re-enable the form
//             return; // Stop the function execution
//         }

//         // 4. If validation passes, proceed to the next step
//         // Clear any previous errors
//         setErrors({ ...errors });

//         // In a real application, you might make an API call here or at the final step
//         // to save the user's data [1, 5].

//         console.log("Password set successfully.");

//         // Move to the next registration step
//         setRegistrationStep(4);

//         // Reset submitting state
//         setIsSubmitting(false);
//     };



//     const handleResendOtp = async () => {
//         const nameValidation = clientValidateName(formData.name);
//         const emailValidation = clientValidateEmail(formData.email);

//         if (!nameValidation.valid || !emailValidation.valid) {
//             setErrors({ ...errors, name: nameValidation.message, email: emailValidation.message });
//             return;
//         }
//         console.log('Sending New OTP to:', formData.email);
//         try {
//             const response = await fetch(`${API_URL}/api/otp`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ email: formData.email }),
//             });
//             const data = await response.json();
//             console.log(data);
//             setOtpBackendCode(data.otp)
//             console.log('OTP sent successfully:', data);
//         }
//         catch (error) {
//             console.log(error);
//             setErrors({
//                 ...errors, submit: 'Failed to send verification code. Please try again.',
//             })
//         }

//         setIsSubmitting(true);
//         try {
//             await new Promise(resolve => setTimeout(resolve, 1500));
//             setRegistrationStep(2);
//             setResendTimer(60);
//             setErrors({ ...errors });
//         } catch {
//             setErrors({ ...errors, submit: 'Failed to send verification code. Please try again.' });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (isPageLoading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
//                 <ParticleSystem isActive={true} formProgress={50} />
//                 <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center z-10">
//                     <motion.div
//                         className="w-20 h-20 border-4 border-purple-300/30 border-t-purple-400 rounded-full mx-auto mb-6"
//                         animate={{ rotate: 360 }}
//                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                     />
//                     <motion.h2 initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.3 }} className="text-2xl font-bold text-white">
//                         Initializing Experience
//                     </motion.h2>
//                     <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-purple-200">
//                         Preparing your premium workspace...
//                     </motion.p>
//                 </motion.div>
//             </div>
//         );
//     }

//     const renderContent = () => {
//         if (registrationStep === 1) {
//             return (
//                 <div className="space-y-6">
//                     {/* Name Field */}
//                     <motion.div animate={{ scale: focusedField === 'name' ? 1.02 : 1 }}>
//                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                             Full Name
//                             {formData.name && !errors.name && (
//                                 <motion.span
//                                     initial={{ opacity: 0, x: -10 }}
//                                     animate={{ opacity: 1, x: 0 }}
//                                     className="ml-2 text-emerald-600 text-xs font-medium"
//                                 >
//                                     ✅ Perfect
//                                 </motion.span>
//                             )}
//                         </label>

//                         <div className="relative group">
//                             <motion.div
//                                 className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
//                                 animate={{
//                                     color: focusedField === 'name' ? '#8b5cf6' : '#9ca3af',
//                                     scale: focusedField === 'name' ? 1.1 : 1
//                                 }}
//                             >
//                                 <User className="w-5 h-5 transition-all duration-300" />
//                             </motion.div>

//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleInputChange}
//                                 onFocus={() => setFocusedField('name')}
//                                 onBlur={() => setFocusedField(null)}
//                                 placeholder="Enter your full name"
//                                 className="w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl outline-none transition-all duration-300 bg-white"
//                                 style={{
//                                     borderColor: errors.name ? '#ef4444' :
//                                         focusedField === 'name' ? '#8b5cf6' : '#e5e7eb',
//                                     backgroundColor: errors.name ? '#fef2f2' : 'white',
//                                     boxShadow: focusedField === 'name'
//                                         ? '0 0 0 4px rgba(139, 92, 246, 0.1)'
//                                         : '0 1px 3px rgba(0,0,0,0.1)',
//                                 }}
//                             />

//                             {formData.name && !errors.name && (
//                                 <motion.div
//                                     initial={{ scale: 0, rotate: -180 }}
//                                     animate={{ scale: 1, rotate: 0 }}
//                                     className="absolute right-4 top-1/2 transform -translate-y-1/2"
//                                 >
//                                     <CheckCircle className="w-6 h-6 text-emerald-500" />
//                                 </motion.div>
//                             )}
//                         </div>

//                         <AnimatePresence>
//                             {errors.name && (
//                                 <motion.p
//                                     initial={{ opacity: 0, y: -10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -10 }}
//                                     className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200"
//                                 >
//                                     {errors.name}
//                                 </motion.p>
//                             )}
//                         </AnimatePresence>
//                     </motion.div>

//                     {/* Email Field */}
//                     <motion.div animate={{ scale: focusedField === 'email' ? 1.02 : 1 }}>
//                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                             Email Address
//                             {formData.email && !errors.email && (
//                                 <motion.span
//                                     initial={{ opacity: 0, x: -10 }}
//                                     animate={{ opacity: 1, x: 0 }}
//                                     className="ml-2 text-emerald-600 text-xs font-medium"
//                                 >
//                                     ✅ Verified
//                                 </motion.span>
//                             )}
//                         </label>

//                         <div className="relative group">
//                             <motion.div
//                                 className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
//                                 animate={{
//                                     color: focusedField === 'email' ? '#8b5cf6' : '#9ca3af',
//                                     scale: focusedField === 'email' ? 1.1 : 1
//                                 }}
//                             >
//                                 <Mail className="w-5 h-5 transition-all duration-300" />
//                             </motion.div>

//                             <input
//                                 type="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleInputChange}
//                                 onFocus={() => setFocusedField('email')}
//                                 onBlur={() => setFocusedField(null)}
//                                 onKeyDown={(e) => e.key === 'Enter' && handleRegistrationStep1()}
//                                 placeholder="Enter your email address"
//                                 className="w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl outline-none transition-all duration-300 bg-white"
//                                 style={{
//                                     borderColor: errors.email ? '#ef4444' :
//                                         focusedField === 'email' ? '#8b5cf6' : '#e5e7eb',
//                                     backgroundColor: errors.email ? '#fef2f2' : 'white',
//                                     boxShadow: focusedField === 'email'
//                                         ? '0 0 0 4px rgba(139, 92, 246, 0.1)'
//                                         : '0 1px 3px rgba(0,0,0,0.1)',
//                                 }}
//                             />

//                             {formData.email && !errors.email && (
//                                 <motion.div
//                                     initial={{ scale: 0, rotate: -180 }}
//                                     animate={{ scale: 1, rotate: 0 }}
//                                     className="absolute right-4 top-1/2 transform -translate-y-1/2"
//                                 >
//                                     <CheckCircle className="w-6 h-6 text-emerald-500" />
//                                 </motion.div>
//                             )}
//                         </div>

//                         <AnimatePresence>
//                             {errors.email && (
//                                 <motion.p
//                                     initial={{ opacity: 0, y: -10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -10 }}
//                                     className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200"
//                                 >
//                                     {errors.email}
//                                 </motion.p>
//                             )}
//                         </AnimatePresence>
//                     </motion.div>

//                     {/* Continue Button */}
//                     <motion.button
//                         type="button"
//                         disabled={isSubmitting}
//                         onClick={handleRegistrationStep1}
//                         className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
//                         style={{
//                             background: isSubmitting
//                                 ? 'linear-gradient(135deg, #a855f7, #6366f1)'
//                                 : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
//                         }}
//                         whileHover={!isSubmitting ? {
//                             scale: 1.02,
//                             boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)"
//                         } : {}}
//                         whileTap={!isSubmitting ? { scale: 0.98 } : {}}
//                         animate={{
//                             boxShadow: formProgress === 100
//                                 ? "0 0 40px rgba(139, 92, 246, 0.6)"
//                                 : "0 4px 20px rgba(0,0,0,0.1)"
//                         }}
//                     >
//                         <motion.div
//                             className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
//                             animate={{ x: isSubmitting ? ['-100%', '100%'] : '-100%' }}
//                             transition={{
//                                 duration: 1.5,
//                                 repeat: isSubmitting ? Infinity : 0,
//                                 ease: "easeInOut"
//                             }}
//                         />

//                         <span className="relative z-10 flex items-center justify-center">
//                             {isSubmitting ? (
//                                 <>
//                                     <motion.div
//                                         className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
//                                         animate={{ rotate: 360 }}
//                                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                                     />
//                                     Sending verification code...
//                                 </>
//                             ) : (
//                                 <>
//                                     {formProgress === 100 ? "✨ Send Verification Code" : "Continue"}
//                                     <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                                 </>
//                             )}
//                         </span>
//                     </motion.button>
//                 </div>
//             );
//         }


//         if (registrationStep === 2) {
//             return (
//                 <div className="space-y-6">
//                     <div className="text-center mb-8">
//                         <motion.div
//                             initial={{ scale: 0 }}
//                             animate={{ scale: 1 }}
//                             className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
//                         >
//                             <Mail className="w-8 h-8 text-purple-600" />
//                         </motion.div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-2">Check your email</h3>
//                         <p className="text-gray-600">We've sent a verification code to<br /><span className="font-medium text-purple-600">{formData.email}</span></p>
//                     </div>

//                     <div className="space-y-4">
//                         <label className="block text-sm font-semibold text-gray-700 text-center">Enter 4-digit verification code</label>
//                         <div className="flex justify-center space-x-4">
//                             {otpCode.map((digit, index) => (
//                                 <motion.input
//                                     key={index}
//                                     type="text"
//                                     name={`otp-${index}`}
//                                     value={digit}
//                                     onChange={(e) => handleOtpChange(index, e.target.value)}
//                                     onKeyDown={(e) => {
//                                         if (e.key === 'Backspace' && !digit && index > 0) {
//                                             const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`) as HTMLInputElement;
//                                             if (prevInput) prevInput.focus();
//                                         }
//                                         if (e.key === 'Enter' && otpCode.join('').length === 4) handleOtpVerification();
//                                     }}
//                                     className="w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all duration-300"
//                                     style={{
//                                         borderColor: errors.otp ? '#ef4444' : digit ? '#8b5cf6' : '#e5e7eb',
//                                         backgroundColor: errors.otp ? '#fef2f2' : 'white',
//                                         boxShadow: digit ? '0 0 0 4px rgba(139, 92, 246, 0.1)' : '0 1px 3px rgba(0,0,0,0.1)'
//                                     }}
//                                     maxLength={1}
//                                     initial={{ scale: 0, y: 20 }}
//                                     animate={{ scale: 1, y: 0 }}
//                                     transition={{ delay: index * 0.1 }}
//                                 />
//                             ))}
//                         </div>
//                         <AnimatePresence>
//                             {errors.otp && (
//                                 <motion.p
//                                     initial={{ opacity: 0, y: -10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -10 }}
//                                     className="text-center text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200"
//                                 >
//                                     {errors.otp}
//                                 </motion.p>
//                             )}
//                         </AnimatePresence>
//                     </div>

//                     <div className="text-center">
//                         <p className="text-sm text-gray-600 mb-4">Didn't receive the code?</p>
//                         {resendTimer > 0 ? (
//                             <p className="text-sm text-gray-500">Resend code in {resendTimer}s</p>
//                         ) : (
//                             <motion.button
//                                 type="button"
//                                 onClick={handleResendOtp}
//                                 disabled={isSubmitting}
//                                 className="text-sm text-purple-600 hover:text-purple-700 font-medium underline"
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                             >
//                                 Resend verification code
//                             </motion.button>
//                         )}
//                     </div>

//                     <motion.button
//                         type="button"
//                         disabled={isSubmitting || otpCode.join('').length !== 4}
//                         onClick={handleOtpVerification}
//                         className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
//                         style={{
//                             background: isSubmitting || otpCode.join('').length !== 4 ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
//                             opacity: otpCode.join('').length !== 4 ? 0.6 : 1
//                         }}
//                         whileHover={!isSubmitting && otpCode.join('').length === 4 ? { scale: 1.02, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" } : {}}
//                         whileTap={!isSubmitting && otpCode.join('').length === 4 ? { scale: 0.98 } : {}}
//                     >
//                         <span className="relative z-10 flex items-center justify-center">
//                             {isSubmitting ? (
//                                 <>
//                                     <motion.div
//                                         className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
//                                         animate={{ rotate: 360 }}
//                                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                                     />
//                                     Verifying...
//                                 </>
//                             ) : (
//                                 <>
//                                     {otpCode.join('').length === 4 ? "✨ Verify Email" : "Enter 4-digit code"}
//                                     <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                                 </>
//                             )}
//                         </span>
//                     </motion.button>

//                     <div className="text-center text-xs text-gray-500">
//                         💡 Tip: For demo purposes, use code <span className="font-mono bg-gray-100 px-1 rounded">0000</span>
//                     </div>
//                 </div>
//             );
//         }

//         if (registrationStep === 3) {
//             return (
//                 <div className="space-y-6">
//                     <div className="text-center mb-8">
//                         <motion.div
//                             initial={{ scale: 0 }}
//                             animate={{ scale: 1 }}
//                             className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
//                         >
//                             <UserCheck className="w-8 h-8 text-purple-600" />
//                         </motion.div>
//                         <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Your Account</h3>
//                         <p className="text-gray-600">Create a strong password to protect your account</p>
//                     </div>

//                     {/* Password Field */}
//                     <motion.div animate={{ scale: focusedField === 'password' ? 1.02 : 1 }}>
//                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                             Password
//                             {formData.password && !errors.password && (
//                                 <motion.span
//                                     initial={{ opacity: 0, x: -10 }}
//                                     animate={{ opacity: 1, x: 0 }}
//                                     className="ml-2 text-emerald-600 text-xs font-medium"
//                                 >
//                                     ✅ Strong
//                                 </motion.span>
//                             )}
//                         </label>

//                         <div className="relative group">
//                             <motion.div
//                                 className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
//                                 animate={{
//                                     color: focusedField === 'password' ? '#8b5cf6' : '#9ca3af',
//                                     scale: focusedField === 'password' ? 1.1 : 1
//                                 }}
//                             >
//                                 <UserCheck className="w-5 h-5 transition-all duration-300" />
//                             </motion.div>

//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleInputChange}
//                                 onFocus={() => setFocusedField('password')}
//                                 onBlur={() => setFocusedField(null)}
//                                 placeholder="Enter your password"
//                                 className="w-full pl-12 pr-12 py-4 text-lg border-2 rounded-xl outline-none transition-all duration-300 bg-white"
//                                 style={{
//                                     borderColor: errors.password ? '#ef4444' :
//                                         focusedField === 'password' ? '#8b5cf6' : '#e5e7eb',
//                                     backgroundColor: errors.password ? '#fef2f2' : 'white',
//                                     boxShadow: focusedField === 'password'
//                                         ? '0 0 0 4px rgba(139, 92, 246, 0.1)'
//                                         : '0 1px 3px rgba(0,0,0,0.1)',
//                                 }}
//                             />

//                             <button
//                                 type="button"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                             >
//                                 {showPassword ? (
//                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L21.5 21.5m-4.242-4.242L21.5 21.5" />
//                                     </svg>
//                                 ) : (
//                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                     </svg>
//                                 )}
//                             </button>
//                         </div>

//                         {/* Password Strength Indicator */}
//                         {formData.password && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: -10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="mt-3"
//                             >
//                                 <div className="flex items-center space-x-2">
//                                     <span className="text-xs font-medium text-gray-600">Strength:</span>
//                                     <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
//                                         <motion.div
//                                             className="h-full transition-all duration-300"
//                                             style={{
//                                                 width: `${(getPasswordStrength(formData.password) / 5) * 100}%`,
//                                                 backgroundColor: getPasswordStrength(formData.password) < 3 ? '#ef4444' :
//                                                     getPasswordStrength(formData.password) < 4 ? '#f59e0b' : '#10b981'
//                                             }}
//                                             initial={{ width: 0 }}
//                                             animate={{ width: `${(getPasswordStrength(formData.password) / 5) * 100}%` }}
//                                         />
//                                     </div>
//                                     <span className="text-xs font-medium">
//                                         {getPasswordStrength(formData.password) < 3 ? 'Weak' :
//                                             getPasswordStrength(formData.password) < 4 ? 'Good' : 'Strong'}
//                                     </span>
//                                 </div>
//                             </motion.div>
//                         )}

//                         <AnimatePresence>
//                             {errors.password && (
//                                 <motion.p
//                                     initial={{ opacity: 0, y: -10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -10 }}
//                                     className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200"
//                                 >
//                                     {errors.password}
//                                 </motion.p>
//                             )}
//                         </AnimatePresence>
//                     </motion.div>

//                     {/* Confirm Password Field */}
//                     <motion.div animate={{ scale: focusedField === 'confirmPassword' ? 1.02 : 1 }}>
//                         <label className="block text-sm font-semibold text-gray-700 mb-3">
//                             Confirm Password
//                             {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
//                                 <motion.span
//                                     initial={{ opacity: 0, x: -10 }}
//                                     animate={{ opacity: 1, x: 0 }}
//                                     className="ml-2 text-emerald-600 text-xs font-medium"
//                                 >
//                                     ✅ Match
//                                 </motion.span>
//                             )}
//                         </label>

//                         <div className="relative group">
//                             <motion.div
//                                 className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
//                                 animate={{
//                                     color: focusedField === 'confirmPassword' ? '#8b5cf6' : '#9ca3af',
//                                     scale: focusedField === 'confirmPassword' ? 1.1 : 1
//                                 }}
//                             >
//                                 <UserCheck className="w-5 h-5 transition-all duration-300" />
//                             </motion.div>

//                             <input
//                                 type={showConfirmPassword ? "text" : "password"}
//                                 name="confirmPassword"
//                                 value={formData.confirmPassword}
//                                 onChange={handleInputChange}
//                                 onFocus={() => setFocusedField('confirmPassword')}
//                                 onBlur={() => setFocusedField(null)}
//                                 onKeyDown={(e) => e.key === 'Enter' && handlePasswordStep(e)}
//                                 placeholder="Confirm your password"
//                                 className="w-full pl-12 pr-12 py-4 text-lg border-2 rounded-xl outline-none transition-all duration-300 bg-white"
//                                 style={{
//                                     borderColor: errors.confirmPassword ? '#ef4444' :
//                                         focusedField === 'confirmPassword' ? '#8b5cf6' : '#e5e7eb',
//                                     backgroundColor: errors.confirmPassword ? '#fef2f2' : 'white',
//                                     boxShadow: focusedField === 'confirmPassword'
//                                         ? '0 0 0 4px rgba(139, 92, 246, 0.1)'
//                                         : '0 1px 3px rgba(0,0,0,0.1)',
//                                 }}
//                             />

//                             <button
//                                 type="button"
//                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                             >
//                                 {showConfirmPassword ? (
//                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L21.5 21.5m-4.242-4.242L21.5 21.5" />
//                                     </svg>
//                                 ) : (
//                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                     </svg>
//                                 )}
//                             </button>

//                             {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
//                                 <motion.div
//                                     initial={{ scale: 0, rotate: -180 }}
//                                     animate={{ scale: 1, rotate: 0 }}
//                                     className="absolute right-12 top-1/2 transform -translate-y-1/2"
//                                 >
//                                     <CheckCircle className="w-6 h-6 text-emerald-500" />
//                                 </motion.div>
//                             )}
//                         </div>

//                         <AnimatePresence>
//                             {errors.confirmPassword && (
//                                 <motion.p
//                                     initial={{ opacity: 0, y: -10 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -10 }}
//                                     className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200"
//                                 >
//                                     {errors.confirmPassword}
//                                 </motion.p>
//                             )}
//                         </AnimatePresence>
//                     </motion.div>

//                     {/* Set Password Button */}
//                     <motion.button
//                         type="button"
//                         disabled={isSubmitting}
//                         onClick={handlePasswordStep}
//                         className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
//                         style={{
//                             background: isSubmitting
//                                 ? 'linear-gradient(135deg, #a855f7, #6366f1)'
//                                 : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
//                         }}
//                         whileHover={!isSubmitting ? {
//                             scale: 1.02,
//                             boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)"
//                         } : {}}
//                         whileTap={!isSubmitting ? { scale: 0.98 } : {}}
//                         animate={{
//                             boxShadow: formProgress === 100
//                                 ? "0 0 40px rgba(139, 92, 246, 0.6)"
//                                 : "0 4px 20px rgba(0,0,0,0.1)"
//                         }}
//                     >
//                         <motion.div
//                             className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
//                             animate={{ x: isSubmitting ? ['-100%', '100%'] : '-100%' }}
//                             transition={{
//                                 duration: 1.5,
//                                 repeat: isSubmitting ? Infinity : 0,
//                                 ease: "easeInOut"
//                             }}
//                         />

//                         <span className="relative z-10 flex items-center justify-center">
//                             {isSubmitting ? (
//                                 <>
//                                     <motion.div
//                                         className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
//                                         animate={{ rotate: 360 }}
//                                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                                     />
//                                     Securing your account...
//                                 </>
//                             ) : (
//                                 <>
//                                     {formProgress === 100 ? "✨ Secure Account" : "Set Password"}
//                                     <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                                 </>
//                             )}
//                         </span>
//                     </motion.button>

//                     {/* Password Requirements */}
//                     <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="mt-4 p-4 bg-gray-50 rounded-lg"
//                     >
//                         <h4 className="text-sm font-semibold text-gray-700 mb-2">Password Requirements:</h4>
//                         <div className="space-y-1">
//                             {[
//                                 { text: "At least 8 characters", test: formData.password.length >= 8 },
//                                 { text: "One lowercase letter", test: /(?=.*[a-z])/.test(formData.password) },
//                                 { text: "One uppercase letter", test: /(?=.*[A-Z])/.test(formData.password) },
//                                 { text: "One number", test: /(?=.*\d)/.test(formData.password) },
//                                 { text: "One special character", test: /(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password) }
//                             ].map((req, index) => (
//                                 <div key={index} className="flex items-center space-x-2">
//                                     <motion.div
//                                         animate={{
//                                             color: req.test ? '#10b981' : '#6b7280',
//                                             scale: req.test ? 1.1 : 1
//                                         }}
//                                         transition={{ duration: 0.2 }}
//                                     >
//                                         {req.test ? (
//                                             <CheckCircle className="w-4 h-4" />
//                                         ) : (
//                                             <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
//                                         )}
//                                     </motion.div>
//                                     <span className={`text-xs ${req.test ? 'text-emerald-600' : 'text-gray-500'}`}>
//                                         {req.text}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </motion.div>
//                 </div>
//             );
//         }



//         if (registrationStep === 4) {
//             return (
//                 <div className="space-y-6">
//                     <div className="text-center mb-8">
//                         <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-gray-800 mb-3">
//                             How will you use our platform?
//                         </motion.h3>
//                         <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-600">
//                             This helps us customize your experience
//                         </motion.p>
//                     </div>

//                     <div className="grid grid-cols-1 gap-4">
//                         <motion.button
//                             type="button"
//                             onClick={() => handleUserTypeSelection('individual')}
//                             className="p-6 border-2 rounded-xl text-left transition-all duration-300 group"
//                             style={{
//                                 borderColor: userType === 'individual' ? '#8b5cf6' : '#e5e7eb',
//                                 backgroundColor: userType === 'individual' ? '#f3f4f6' : 'white',
//                                 transform: userType === 'individual' ? 'scale(1.02)' : 'scale(1)'
//                             }}
//                             whileHover={{ scale: 1.02, y: -2 }}
//                             whileTap={{ scale: 0.98 }}
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: 0.2 }}
//                         >
//                             <div className="flex items-start space-x-4">
//                                 <div className="flex-shrink-0">
//                                     <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
//                                         <UserCheck className="w-6 h-6 text-white" />
//                                     </div>
//                                 </div>
//                                 <div className="flex-1">
//                                     <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">Individual</h4>
//                                     <p className="text-gray-600 text-sm leading-relaxed">Perfect for personal productivity, freelancers, and solo professionals.</p>
//                                 </div>
//                                 <div className="flex-shrink-0">
//                                     <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
//                                 </div>
//                             </div>
//                         </motion.button>

//                         <motion.button
//                             type="button"
//                             onClick={() => handleUserTypeSelection('business')}
//                             className="p-6 border-2 rounded-xl text-left transition-all duration-300 group"
//                             style={{
//                                 borderColor: userType === 'business' ? '#8b5cf6' : '#e5e7eb',
//                                 backgroundColor: userType === 'business' ? '#f3f4f6' : 'white',
//                                 transform: userType === 'business' ? 'scale(1.02)' : 'scale(1)'
//                             }}
//                             whileHover={{ scale: 1.02, y: -2 }}
//                             whileTap={{ scale: 0.98 }}
//                             initial={{ opacity: 0, x: 20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: 0.3 }}
//                         >
//                             <div className="flex items-start space-x-4">
//                                 <div className="flex-shrink-0">
//                                     <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
//                                         <Building2 className="w-6 h-6 text-white" />
//                                     </div>
//                                 </div>
//                                 <div className="flex-1">
//                                     <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">Business</h4>
//                                     <p className="text-gray-600 text-sm leading-relaxed">Ideal for teams, companies, and organizations.</p>
//                                 </div>
//                                 <div className="flex-shrink-0">
//                                     <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
//                                 </div>
//                             </div>
//                         </motion.button>
//                     </div>

//                     {userType && (
//                         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-4">
//                             <p className="text-sm text-emerald-600 font-medium">✅ Great choice! Setting up your {userType} workspace...</p>
//                         </motion.div>
//                     )}
//                 </div>
//             );
//         }

//         if (registrationStep === 5) {
//             if (userType === 'business') {
//                 return (
//                     <div className="space-y-6">
//                         <div className="text-center mb-6">
//                             <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-bold text-gray-800 mb-2">
//                                 Tell us about your business
//                             </motion.h3>
//                             <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-600">
//                                 Help us customize your team workspace
//                             </motion.p>
//                         </div>

//                         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
//                             <label className="block text-sm font-semibold text-gray-700 mb-3">Company Name</label>
//                             <div className="relative">
//                                 <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                                 <input
//                                     type="text"
//                                     name="companyName"
//                                     value={formData.companyName}
//                                     onChange={handleInputChange}
//                                     placeholder="Enter your company name"
//                                     className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
//                                 />
//                             </div>
//                         </motion.div>

//                         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
//                             <label className="block text-sm font-semibold text-gray-700 mb-3">Industry</label>
//                             <div className="relative">
//                                 <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                                 <select
//                                     name="industry"
//                                     value={formData.industry}
//                                     onChange={handleInputChange}
//                                     className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 appearance-none"
//                                 >
//                                     <option value="">Select your industry</option>
//                                     <option value="technology">Technology</option>
//                                     <option value="healthcare">Healthcare</option>
//                                     <option value="finance">Finance</option>
//                                     <option value="education">Education</option>
//                                     <option value="retail">Retail</option>
//                                     <option value="manufacturing">Manufacturing</option>
//                                     <option value="consulting">Consulting</option>
//                                     <option value="other">Other</option>
//                                 </select>
//                             </div>
//                         </motion.div>

//                         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
//                             <label className="block text-sm font-semibold text-gray-700 mb-3">Team Size</label>
//                             <div className="relative">
//                                 <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                                 <select
//                                     name="teamSize"
//                                     value={formData.teamSize}
//                                     onChange={handleInputChange}
//                                     className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 appearance-none"
//                                 >
//                                     <option value="">Select team size</option>
//                                     <option value="1-5">1-5 people</option>
//                                     <option value="6-20">6-20 people</option>
//                                     <option value="21-50">21-50 people</option>
//                                     <option value="51-200">51-200 people</option>
//                                     <option value="200+">200+ people</option>
//                                 </select>
//                             </div>
//                         </motion.div>

//                         <motion.button
//                             type="button"
//                             disabled={isSubmitting}
//                             onClick={handleFinalOnboarding}
//                             className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
//                             style={{ background: isSubmitting ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
//                             whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" } : {}}
//                             whileTap={!isSubmitting ? { scale: 0.98 } : {}}
//                         >
//                             <span className="relative z-10 flex items-center justify-center">
//                                 {isSubmitting ? (
//                                     <>
//                                         <motion.div
//                                             className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
//                                             animate={{ rotate: 360 }}
//                                             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                                         />
//                                         Setting up your workspace...
//                                     </>
//                                 ) : (
//                                     <>
//                                         Final Step <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                                     </>
//                                 )}
//                             </span>
//                         </motion.button>
//                     </div>
//                 );
//             } else {
//                 return (
//                     <div className="space-y-6">
//                         <div className="text-center mb-6">
//                             <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-bold text-gray-800 mb-2">
//                                 Tell us about yourself
//                             </motion.h3>
//                             <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-600">
//                                 Help us personalize your experience
//                             </motion.p>
//                         </div>

//                         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
//                             <label className="block text-sm font-semibold text-gray-700 mb-3">Profession</label>
//                             <div className="relative">
//                                 <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                                 <input
//                                     type="text"
//                                     name="profession"
//                                     value={formData.profession}
//                                     onChange={handleInputChange}
//                                     placeholder="e.g., Software Developer, Designer, Consultant"
//                                     className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
//                                 />
//                             </div>
//                         </motion.div>

//                         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
//                             <label className="block text-sm font-semibold text-gray-700 mb-3">Primary Use Case</label>
//                             <div className="relative">
//                                 <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                                 <select
//                                     name="useCase"
//                                     value={formData.useCase}
//                                     onChange={handleInputChange}
//                                     className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 appearance-none"
//                                 >
//                                     <option value="">What will you primarily use this for?</option>
//                                     <option value="personal">Personal schedule management</option>
//                                     <option value="freelance">Freelance project tracking</option>
//                                     <option value="client-meetings">Client meeting scheduling</option>
//                                     <option value="productivity">Personal productivity</option>
//                                     <option value="learning">Learning & skill development</option>
//                                     <option value="other">Other</option>
//                                 </select>
//                             </div>
//                         </motion.div>

//                         <motion.button
//                             type="button"
//                             disabled={isSubmitting}
//                             onClick={handleFinalOnboarding}
//                             className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
//                             style={{ background: isSubmitting ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
//                             whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" } : {}}
//                             whileTap={!isSubmitting ? { scale: 0.98 } : {}}
//                         >
//                             <span className="relative z-10 flex items-center justify-center">
//                                 {isSubmitting ? (
//                                     <>
//                                         <motion.div
//                                             className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
//                                             animate={{ rotate: 360 }}
//                                             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                                         />
//                                         Setting up your workspace...
//                                     </>
//                                 ) : (
//                                     <>
//                                         Final Step <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
//                                     </>
//                                 )}
//                             </span>
//                         </motion.button>
//                     </div>
//                 );
//             }
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
//             <ParticleSystem isActive={isTyping} formProgress={formProgress} />
//             <FloatingElements isTyping={isTyping} formProgress={formProgress} />
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="relative max-w-md w-full mx-4 bg-white rounded-2xl shadow-2xl p-8 z-10"
//             >
//                 <motion.div
//                     className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-8"
//                     initial={{ scaleX: 0 }}
//                     animate={{ scaleX: 1 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     <motion.div
//                         className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500"
//                         initial={{ width: 0 }}
//                         animate={{ width: `${formProgress}%` }}
//                         transition={{ duration: 0.5, ease: 'easeOut' }}
//                     />
//                 </motion.div>

//                 <AnimatePresence mode="wait">
//                     <motion.div
//                         key={registrationStep}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         transition={{ duration: 0.3 }}
//                         className="text-center mb-8"
//                     >
//                         <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-4">
//                             <span className="text-xs font-medium text-purple-600">
//                                 {registrationStep === 1 ? "New Adventure" :
//                                     registrationStep === 2 ? "Security First" :
//                                         registrationStep === 3 ? "Tailored Setup" : "Team Ready"}
//                             </span>
//                         </div>
//                         <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                             {registrationStep === 1 ? "Join the Revolution" :
//                                 registrationStep === 2 ? "Verify Your Email" :
//                                     registrationStep === 3 ? "Choose Your Path" : "Final Setup"}
//                         </h2>
//                         <p className="text-gray-600">
//                             {registrationStep === 1 ? "Start your journey to effortless scheduling" :
//                                 registrationStep === 2 ? "We've sent a verification code to secure your account" :
//                                     registrationStep === 3 ? "Personalize your experience based on your needs" :
//                                         userType === 'business' ? "Configure your team workspace" : "Personalize your individual workspace"}
//                         </p>
//                     </motion.div>
//                 </AnimatePresence>

//                 {renderContent()}

//                 <AnimatePresence>
//                     {errors.submit && (
//                         <motion.p
//                             initial={{ opacity: 0, y: -10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -10 }}
//                             className="mt-4 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200 text-center"
//                         >
//                             {errors.submit}
//                         </motion.p>
//                     )}
//                 </AnimatePresence>

//                 {registrationStep === 2 && (
//                     <motion.button
//                         type="button"
//                         onClick={() => setRegistrationStep(prev => prev - 1)}
//                         className="mt-6 flex items-center text-sm text-gray-600 hover:text-purple-600"
//                         whileHover={{ x: -5 }}
//                     >
//                         <ArrowLeft className="w-4 h-4 mr-2" />
//                         Update yor Email
//                     </motion.button>
//                 )}
//                 {registrationStep === 1 && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.3 }}
//                         className="mt-8"
//                     >
//                         <div className="relative">


//                             <div className="absolute inset-0 flex items-center">
//                                 <div className="w-full border-t border-gray-200" />
//                             </div>
//                             <div className="relative flex justify-center text-sm">
//                                 <span className="px-2 bg-white text-gray-500">Or continue with</span>
//                             </div>
//                         </div>
//                         <div className="mt-4 grid grid-cols-2 gap-4">
//                             <button
//                                 type="button"
//                                 // onClick={() => handleSocialAuth('Google')}
//                                 className="flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50"
//                             >
//                                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                                     <path
//                                         fill="#4285F4"
//                                         d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                                     />
//                                     <path
//                                         fill="#34A853"
//                                         d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.31 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                                     />
//                                     <path
//                                         fill="#FBBC05"
//                                         d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                                     />
//                                     <path
//                                         fill="#EA4335"
//                                         d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                                     />
//                                 </svg>
//                                 Google
//                             </button>
//                             <button
//                                 type="button"
//                                 // onClick={() => handleSocialAuth('LinkedIn')}
//                                 className="flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50"
//                             >
//                                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                                     <path
//                                         fill="#0077B5"
//                                         d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.848-3.037-1.852 0-2.136 1.445-2.136 2.939v5.667H9.354V9h3.414v1.561h.048c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h-.003z"
//                                     />
//                                 </svg>
//                                 LinkedIn
//                             </button>
//                         </div>
//                         <motion.div
//                             className="text-center mt-8"
//                             animate={{ y: isTyping ? -5 : 0 }}
//                         >
//                             <span className="text-gray-600">Already have an account? </span>
//                             <motion.button
//                                 className="text-purple-600 hover:text-purple-700 font-semibold"
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 onClick={() => navigate('/prod-login')}
//                             >
//                                 Sign In →
//                             </motion.button>
//                         </motion.div>
//                     </motion.div>
//                 )
//                 }

//             </motion.div>

//         </div>
//     );
// };

// export default Register_V1;

























import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Calendar, Mail, User, ArrowRight, UserCheck, Building2, Briefcase, Target, Rocket, ChevronRight, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    companyName: string;
    industry: string;
    teamSize: string;
    profession: string;
    useCase: string;
}

interface ErrorType {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    submit?: string;
    otp?: string;
    companyName?: string;
    industry?: string;
    teamSize?: string;
    profession?: string;
    useCase?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const ParticleSystem = ({ isActive, formProgress }: { isActive: boolean; formProgress: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles = Array.from({ length: 50 }, () => ({
            x: Math.random() * canvas.offsetWidth,
            y: Math.random() * canvas.offsetHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.1,
            hue: 240 + Math.random() * 60,
            life: Math.random()
        }));

        let animationId: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
            const intensity = isActive ? 1 : 0.3;
            const progressMultiplier = 1 + (formProgress / 100) * 2;

            particles.forEach(particle => {
                particle.x += particle.vx * intensity * progressMultiplier;
                particle.y += particle.vy * intensity * progressMultiplier;

                if (particle.x < 0) particle.x = canvas.offsetWidth;
                if (particle.x > canvas.offsetWidth) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.offsetHeight;
                if (particle.y > canvas.offsetHeight) particle.y = 0;

                particle.life += 0.01;
                if (particle.life > 1) particle.life = 0;

                ctx.save();
                ctx.globalAlpha = particle.opacity * intensity * (0.5 + 0.5 * Math.sin(particle.life * Math.PI));
                ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationId);
        };
    }, [isActive, formProgress]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ transform: 'translate3d(0, 0, 0)' }} />;
};

const FloatingElements = ({ isTyping, formProgress }: { isTyping: boolean; formProgress: number }) => {
    const elements = [
        { icon: Calendar, delay: 0, size: 24, position: { top: '20%', left: '10%' } },
        { icon: UserCheck, delay: 1, size: 20, position: { top: '60%', left: '15%' } },
        { icon: Building2, delay: 2, size: 28, position: { top: '40%', left: '80%' } },
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {elements.map((element, index) => (
                <motion.div
                    key={index}
                    className="absolute"
                    style={{ top: element.position.top, left: element.position.left }}
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{
                        opacity: [0.1, 0.3, 0.1],
                        scale: [0.8, 1.2, 0.8],
                        rotate: [0, 360],
                        y: [-10, 10, -10],
                    }}
                    transition={{ duration: 8, delay: element.delay, repeat: Infinity, ease: "easeInOut" }}
                >
                    <element.icon size={element.size} className="text-white/20" style={{ filter: `hue-rotate(${formProgress * 3.6}deg)` }} />
                </motion.div>
            ))}
        </div>
    );
};

const Register_V1 = () => {
    const [OtpBackendCode, setOtpBackendCode] = useState('');
    const navigate = useNavigate();
    const [registrationStep, setRegistrationStep] = useState(1);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [formProgress, setFormProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userType, setUserType] = useState('');
    const [otpCode, setOtpCode] = useState(['', '', '', '']);
    const [resendTimer, setResendTimer] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '', email: '', password: '', confirmPassword: '', companyName: '', industry: '', teamSize: '', profession: '', useCase: ''
    });
    const [errors, setErrors] = useState<ErrorType>({
        name: '', email: '', password: '', confirmPassword: '', companyName: '', industry: '', teamSize: '', profession: '', useCase: ''
    });
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        const timer = setTimeout(() => setIsPageLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const step1Fields = [formData.name, formData.email].filter(field => field.length > 0).length;
        const step3Fields = [formData.password, formData.confirmPassword].filter(field => field.length > 0).length;
        const otpFilled = otpCode.filter(code => code.length > 0).length;
        const businessFields = [formData.companyName, formData.industry, formData.teamSize].filter(field => field.length > 0).length;
        const individualFields = [formData.profession, formData.useCase].filter(field => field.length > 0).length;

        setFormProgress(
            registrationStep === 1 ? (step1Fields / 2) * 100 :
                registrationStep === 2 ? (otpFilled / 4) * 100 :
                    registrationStep === 3 ? (step3Fields / 2) * 100 :
                        registrationStep === 4 ? (userType ? 100 : 0) :
                            registrationStep === 5 ? (userType === 'business' ? (businessFields / 3) * 100 : (individualFields / 2) * 100) : 0
        );
    }, [formData, otpCode, userType, registrationStep]);

    useEffect(() => {
        if (resendTimer > 0) {
            const interval = setInterval(() => setResendTimer(timer => timer - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [resendTimer]);

    const clientValidateEmail = (email: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
        ? { valid: true, message: '' }
        : { valid: false, message: 'Please enter a valid email address' };

    const clientValidateName = (name: string) => {
        if (name.length < 2) return { valid: false, message: 'Name must be at least 2 characters' };
        if (name.length > 50) return { valid: false, message: 'Name cannot exceed 50 characters' };
        if (!/^[a-zA-Z\s]+$/.test(name)) return { valid: false, message: 'Name can only contain letters and spaces' };
        return { valid: true, message: '' };
    };

    const clientValidatePassword = (password: string) => {
        if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
        if (!/(?=.*[a-z])/.test(password)) return { valid: false, message: 'Password must contain at least one lowercase letter' };
        if (!/(?=.*[A-Z])/.test(password)) return { valid: false, message: 'Password must contain at least one uppercase letter' };
        if (!/(?=.*\d)/.test(password)) return { valid: false, message: 'Password must contain at least one number' };
        if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) return { valid: false, message: 'Password must contain at least one special character' };
        return { valid: true, message: '' };
    };

    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/(?=.*[a-z])/.test(password)) strength += 1;
        if (/(?=.*[A-Z])/.test(password)) strength += 1;
        if (/(?=.*\d)/.test(password)) strength += 1;
        if (/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) strength += 1;
        return strength;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setIsTyping(true);
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        const newErrors: ErrorType = { ...errors };
        if (name === 'name') {
            const validation = clientValidateName(value);
            newErrors.name = validation.valid ? '' : validation.message;
        } else if (name === 'email') {
            const validation = clientValidateEmail(value);
            newErrors.email = validation.valid ? '' : validation.message;
        } else if (name === 'password') {
            const validation = clientValidatePassword(value);
            newErrors.password = validation.valid ? '' : validation.message;
        } else if (name === 'confirmPassword') {
            newErrors.confirmPassword = value === formData.password ? '' : 'Passwords do not match';
        }
        setErrors(newErrors);
        setTimeout(() => setIsTyping(false), 1000);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newOtp = [...otpCode];
            newOtp[index] = value;
            setOtpCode(newOtp);
            if (value && index < 3) {
                const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`) as HTMLInputElement;
                if (nextInput) nextInput.focus();
            }
        }
    };

    const handleRegistrationStep1 = async () => {
        setIsSubmitting(true);
        const nameValidation = clientValidateName(formData.name);
        const emailValidation = clientValidateEmail(formData.email);

        if (!nameValidation.valid || !emailValidation.valid) {
            setErrors({ ...errors, name: nameValidation.message, email: emailValidation.message });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await response.json();
            if (data.success) {
                setOtpBackendCode(data.otp);
                setResendTimer(90);
                setRegistrationStep(2)
                setErrors({ ...errors, submit: '', otp: '' });
            }
            else{
                console.log(data.error);
                setErrors({ ...errors, submit: `${data.message}` });
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            let errorMessage = 'Failed to send verification code. Please try again.';
            console.log(error.response?.status);
            if (error?.status === 409) {
                errorMessage = 'Email already exists. Please use a different email address.';
            } else if (error.response?.status === 400) {
                errorMessage = 'Invalid email format. Please check your email address.';
            } else if (error.response?.status === 429) {
                errorMessage = 'Too many requests. Please try again later.';
            } else if (error.response?.status >= 500) {
                errorMessage = 'Server error. Please try again later.';
            }
            setErrors({ ...errors, submit: 'Failed to send verification code. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOtpVerification = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/api/otp/otpVerify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email, otp: otpCode.join('') }),
            });
            const data = await response.json();
            if (data.success) {
                setRegistrationStep(3);
                setErrors({ ...errors, otp: '', submit: '' });
                setOtpCode(['', '', '', '']);
            } else {
                setOtpCode(['', '', '', '']);
                setErrors({ ...errors, otp: 'Invalid verification code. Please try again.' });
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setOtpCode(['', '', '', '']);
            setErrors({ ...errors, otp: 'Verification failed. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordStep = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const passwordValidation = clientValidatePassword(formData.password);
        const confirmPasswordValidation = formData.password === formData.confirmPassword
            ? { valid: true, message: '' }
            : { valid: false, message: 'Passwords do not match' };

        if (!passwordValidation.valid || !confirmPasswordValidation.valid) {
            setErrors({
                ...errors,
                password: passwordValidation.message,
                confirmPassword: confirmPasswordValidation.message,
            });
            setIsSubmitting(false);
            return;
        }

        setErrors({ ...errors, password: '', confirmPassword: '', submit: '' });
        setRegistrationStep(4);
        setIsSubmitting(false);
    };

    const handleUserTypeSelection = (type: string) => {
        setUserType(type);
        setRegistrationStep(5);
    };

    const handleFinalOnboarding = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, userType }),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok && data.success) {
                navigate('/dashboard');
            } else {
                setErrors({ ...errors, submit: data.message || 'Registration failed.' });
                setTimeout(() => navigate('/register_v1'), 2500);
            }
        } catch (error) {
            console.error('Error during final onboarding:', error);
            setErrors({ ...errors, submit: 'Setup failed. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOtp = async () => {
        setIsSubmitting(true);
        const nameValidation = clientValidateName(formData.name);
        const emailValidation = clientValidateEmail(formData.email);

        if (!nameValidation.valid || !emailValidation.valid) {
            setErrors({ ...errors, name: nameValidation.message, email: emailValidation.message });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email }),
            });
            const data = await response.json();
            if (data.success) {
                setOtpBackendCode(data.otp);
                setResendTimer(90);
                setErrors({ ...errors, submit: '', otp: '' });
            } else {
                setErrors({ ...errors, submit: 'Failed to send verification code. Please try again.' });
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            let errorMessage = 'Failed to send verification code. Please try again.';
            console.log(error.response?.status);
            if (error?.status === 409) {
                errorMessage = 'Email already exists. Please use a different email address.';
            } else if (error.response?.status === 400) {
                errorMessage = 'Invalid email format. Please check your email address.';
            } else if (error.response?.status === 429) {
                errorMessage = 'Too many requests. Please try again later.';
            } else if (error.response?.status >= 500) {
                errorMessage = 'Server error. Please try again later.';
            }
            setErrors({ ...errors, submit: 'Failed to send verification code. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
                <ParticleSystem isActive={true} formProgress={50} />
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center z-10">
                    <motion.div
                        className="w-20 h-20 border-4 border-purple-300/30 border-t-purple-400 rounded-full mx-auto mb-6"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.h2 initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.3 }} className="text-2xl font-bold text-white">
                        Initializing Experience
                    </motion.h2>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-purple-200">
                        Preparing your premium workspace...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    const renderContent = () => {
        if (registrationStep === 1) {
            return (
                <div className="space-y-6">
                    <motion.div animate={{ scale: focusedField === 'name' ? 1.02 : 1 }}>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Full Name
                            {formData.name && !errors.name && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="ml-2 text-emerald-600 text-xs font-medium"
                                >
                                    ✅ Perfect
                                </motion.span>
                            )}
                        </label>
                        <div className="relative group">
                            <motion.div
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                                animate={{
                                    color: focusedField === 'name' ? '#8b5cf6' : '#9ca3af',
                                    scale: focusedField === 'name' ? 1.1 : 1
                                }}
                            >
                                <User className="w-5 h-5 transition-all duration-300" />
                            </motion.div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="Enter your full name"
                                className="w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl outline-none transition-all duration-300 bg-white"
                                style={{
                                    borderColor: errors.name ? '#ef4444' : focusedField === 'name' ? '#8b5cf6' : '#e5e7eb',
                                    backgroundColor: errors.name ? '#fef2f2' : 'white',
                                    boxShadow: focusedField === 'name' ? '0 0 0 4px rgba(139, 92, 246, 0.1)' : '0 1px 3px rgba(0,0,0,0.1)',
                                }}
                            />
                            {formData.name && !errors.name && (
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
                            {errors.name && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200"
                                >
                                    {errors.name}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>

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
                                onKeyDown={(e) => e.key === 'Enter' && handleRegistrationStep1()}
                                placeholder="Enter your email address"
                                className="w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl outline-none transition-all duration-300 bg-white"
                                style={{
                                    borderColor: errors.email ? '#ef4444' : focusedField === 'email' ? '#8b5cf6' : '#e5e7eb',
                                    backgroundColor: errors.email ? '#fef2f2' : 'white',
                                    boxShadow: focusedField === 'email' ? '0 0 0 4px rgba(139, 92, 246, 0.1)' : '0 1px 3px rgba(0,0,0,0.1)',
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

                    <motion.button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleRegistrationStep1}
                        className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
                        style={{
                            background: isSubmitting ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                        }}
                        whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" } : {}}
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                        animate={{ boxShadow: formProgress === 100 ? "0 0 40px rgba(139, 92, 246, 0.6)" : "0 4px 20px rgba(0,0,0,0.1)" }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                            animate={{ x: isSubmitting ? ['-100%', '100%'] : '-100%' }}
                            transition={{ duration: 1.5, repeat: isSubmitting ? Infinity : 0, ease: "easeInOut" }}
                        />
                        <span className="relative z-10 flex items-center justify-center">
                            {isSubmitting ? (
                                <>
                                    <motion.div
                                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    Sending verification code...
                                </>
                            ) : (
                                <>
                                    {formProgress === 100 ? "✨ Send Verification Code" : "Continue"}
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </span>
                    </motion.button>
                </div>
            );
        }

        if (registrationStep === 2) {
            return (
                <div className="space-y-6">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <Mail className="w-8 h-8 text-purple-600" />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Check your email</h3>
                        <p className="text-gray-600">We've sent a verification code to<br /><span className="font-medium text-purple-600">{formData.email}</span></p>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700 text-center">Enter 4-digit verification code</label>
                        <div className="flex justify-center space-x-4">
                            {otpCode.map((digit, index) => (
                                <motion.input
                                    key={index}
                                    type="text"
                                    name={`otp-${index}`}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Backspace' && !digit && index > 0) {
                                            const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`) as HTMLInputElement;
                                            if (prevInput) prevInput.focus();
                                        }
                                        if (e.key === 'Enter' && otpCode.join('').length === 4) handleOtpVerification();
                                    }}
                                    className="w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all duration-300"
                                    style={{
                                        borderColor: errors.otp ? '#ef4444' : digit ? '#8b5cf6' : '#e5e7eb',
                                        backgroundColor: errors.otp ? '#fef2f2' : 'white',
                                        boxShadow: digit ? '0 0 0 4px rgba(139, 92, 246, 0.1)' : '0 1px 3px rgba(0,0,0,0.1)'
                                    }}
                                    maxLength={1}
                                    initial={{ scale: 0, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                />
                            ))}
                        </div>
                        <AnimatePresence>
                            {errors.otp && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-center text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200"
                                >
                                    {errors.otp}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-4">Didn't receive the code?</p>
                        {resendTimer > 0 ? (
                            <p className="text-sm text-gray-500">Resend code in {resendTimer}s</p>
                        ) : (
                            <motion.button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={isSubmitting}
                                className="text-sm text-purple-600 hover:text-purple-700 font-medium underline"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Resend verification code
                            </motion.button>
                        )}
                    </div>

                    <motion.button
                        type="button"
                        disabled={isSubmitting || otpCode.join('').length !== 4}
                        onClick={handleOtpVerification}
                        className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
                        style={{
                            background: isSubmitting || otpCode.join('').length !== 4 ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                            opacity: otpCode.join('').length !== 4 ? 0.6 : 1
                        }}
                        whileHover={!isSubmitting && otpCode.join('').length === 4 ? { scale: 1.02, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" } : {}}
                        whileTap={!isSubmitting && otpCode.join('').length === 4 ? { scale: 0.98 } : {}}
                    >
                        <span className="relative z-10 flex items-center justify-center">
                            {isSubmitting ? (
                                <>
                                    <motion.div
                                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    {otpCode.join('').length === 4 ? "✨ Verify Email" : "Enter 4-digit code"}
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </span>
                    </motion.button>

                    <motion.button
                        type="button"
                        onClick={() => setRegistrationStep(1)}
                        className="mt-6 flex items-center text-sm text-gray-600 hover:text-purple-600"
                        whileHover={{ x: -5 }}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Update your Email
                    </motion.button>

                    <div className="text-center text-xs text-gray-500">
                        💡 Tip: For demo purposes, use code <span className="font-mono bg-gray-100 px-1 rounded">0000</span>
                    </div>
                </div>
            );
        }

        if (registrationStep === 3) {
            return (
                <div className="space-y-6">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <UserCheck className="w-8 h-8 text-purple-600" />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Your Account</h3>
                        <p className="text-gray-600">Create a strong password to protect your account</p>
                    </div>

                    <motion.div animate={{ scale: focusedField === 'password' ? 1.02 : 1 }}>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Password
                            {formData.password && !errors.password && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="ml-2 text-emerald-600 text-xs font-medium"
                                >
                                    ✅ Strong
                                </motion.span>
                            )}
                        </label>
                        <div className="relative group">
                            <motion.div
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                                animate={{
                                    color: focusedField === 'password' ? '#8b5cf6' : '#9ca3af',
                                    scale: focusedField === 'password' ? 1.1 : 1
                                }}
                            >
                                <UserCheck className="w-5 h-5 transition-all duration-300" />
                            </motion.div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="Enter your password"
                                className="w-full pl-12 pr-12 py-4 text-lg border-2 rounded-xl outline-none transition-all duration-300 bg-white"
                                style={{
                                    borderColor: errors.password ? '#ef4444' : focusedField === 'password' ? '#8b5cf6' : '#e5e7eb',
                                    backgroundColor: errors.password ? '#fef2f2' : 'white',
                                    boxShadow: focusedField === 'password' ? '0 0 0 4px rgba(139, 92, 246, 0.1)' : '0 1px 3px rgba(0,0,0,0.1)',
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L21.5 21.5m-4.242-4.242L21.5 21.5" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                            {formData.password && !errors.password && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="absolute right-12 top-1/2 transform -translate-y-1/2"
                                >
                                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                                </motion.div>
                            )}
                        </div>
                        {formData.password && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-3"
                            >
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs font-medium text-gray-600">Strength:</span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full transition-all duration-300"
                                            style={{
                                                width: `${(getPasswordStrength(formData.password) / 5) * 100}%`,
                                                backgroundColor: getPasswordStrength(formData.password) < 3 ? '#ef4444' : getPasswordStrength(formData.password) < 4 ? '#f59e0b' : '#10b981'
                                            }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(getPasswordStrength(formData.password) / 5) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-medium">
                                        {getPasswordStrength(formData.password) < 3 ? 'Weak' : getPasswordStrength(formData.password) < 4 ? 'Good' : 'Strong'}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                        <AnimatePresence>
                            {errors.password && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200"
                                >
                                    {errors.password}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div animate={{ scale: focusedField === 'confirmPassword' ? 1.02 : 1 }}>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Confirm Password
                            {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="ml-2 text-emerald-600 text-xs font-medium"
                                >
                                    ✅ Match
                                </motion.span>
                            )}
                        </label>
                        <div className="relative group">
                            <motion.div
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                                animate={{
                                    color: focusedField === 'confirmPassword' ? '#8b5cf6' : '#9ca3af',
                                    scale: focusedField === 'confirmPassword' ? 1.1 : 1
                                }}
                            >
                                <UserCheck className="w-5 h-5 transition-all duration-300" />
                            </motion.div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                onFocus={() => setFocusedField('confirmPassword')}
                                onBlur={() => setFocusedField(null)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && formData.password && formData.confirmPassword && !errors.password && !errors.confirmPassword) {
                                        handlePasswordStep(e as any);
                                    }
                                }}
                                placeholder="Confirm your password"
                                className="w-full pl-12 pr-12 py-4 text-lg border-2 rounded-xl outline-none transition-all duration-300 bg-white"
                                style={{
                                    borderColor: errors.confirmPassword ? '#ef4444' : focusedField === 'confirmPassword' ? '#8b5cf6' : '#e5e7eb',
                                    backgroundColor: errors.confirmPassword ? '#fef2f2' : 'white',
                                    boxShadow: focusedField === 'confirmPassword' ? '0 0 0 4px rgba(139, 92, 246, 0.1)' : '0 1px 3px rgba(0,0,0,0.1)',
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L21.5 21.5m-4.242-4.242L21.5 21.5" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                            {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="absolute right-12 top-1/2 transform -translate-y-1/2"
                                >
                                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                                </motion.div>
                            )}
                        </div>
                        <AnimatePresence>
                            {errors.confirmPassword && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200"
                                >
                                    {errors.confirmPassword}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.button
                        type="button"
                        disabled={isSubmitting || !formData.password || !formData.confirmPassword}
                        onClick={handlePasswordStep}
                        className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
                        style={{
                            background: isSubmitting || !formData.password || !formData.confirmPassword ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                            opacity: !formData.password || !formData.confirmPassword ? 0.6 : 1
                        }}
                        whileHover={!isSubmitting && formData.password && formData.confirmPassword ? { scale: 1.02, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" } : {}}
                        whileTap={!isSubmitting && formData.password && formData.confirmPassword ? { scale: 0.98 } : {}}
                        animate={{ boxShadow: formProgress === 100 ? "0 0 40px rgba(139, 92, 246, 0.6)" : "0 4px 20px rgba(0,0,0,0.1)" }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                            animate={{ x: isSubmitting ? ['-100%', '100%'] : '-100%' }}
                            transition={{ duration: 1.5, repeat: isSubmitting ? Infinity : 0, ease: "easeInOut" }}
                        />
                        <span className="relative z-10 flex items-center justify-center">
                            {isSubmitting ? (
                                <>
                                    <motion.div
                                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    Securing your account...
                                </>
                            ) : (
                                <>
                                    {formProgress === 100 ? "✨ Secure Account" : "Set Password"}
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </span>
                    </motion.button>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-gray-50 rounded-lg"
                    >
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Password Requirements:</h4>
                        <div className="space-y-1">
                            {[
                                { text: "At least 8 characters", test: formData.password.length >= 8 },
                                { text: "One lowercase letter", test: /(?=.*[a-z])/.test(formData.password) },
                                { text: "One uppercase letter", test: /(?=.*[A-Z])/.test(formData.password) },
                                { text: "One number", test: /(?=.*\d)/.test(formData.password) },
                                { text: "One special character", test: /(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password) }
                            ].map((req, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <motion.div
                                        animate={{ color: req.test ? '#10b981' : '#6b7280', scale: req.test ? 1.1 : 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {req.test ? (
                                            <CheckCircle className="w-4 h-4" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                        )}
                                    </motion.div>
                                    <span className={`text-xs ${req.test ? 'text-emerald-600' : 'text-gray-500'}`}>
                                        {req.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.button
                        type="button"
                        onClick={() => setRegistrationStep(2)}
                        className="mt-6 flex items-center text-sm text-gray-600 hover:text-purple-600"
                        whileHover={{ x: -5 }}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Verification
                    </motion.button>
                </div>
            );
        }

        if (registrationStep === 4) {
            return (
                <div className="space-y-6">
                    <div className="text-center mb-8">
                        <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-gray-800 mb-3">
                            How will you use our platform?
                        </motion.h3>
                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-600">
                            This helps us customize your experience
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <motion.button
                            type="button"
                            onClick={() => handleUserTypeSelection('individual')}
                            className="p-6 border-2 rounded-xl text-left transition-all duration-300 group"
                            style={{
                                borderColor: userType === 'individual' ? '#8b5cf6' : '#e5e7eb',
                                backgroundColor: userType === 'individual' ? '#f3f4f6' : 'white',
                                transform: userType === 'individual' ? 'scale(1.02)' : 'scale(1)'
                            }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <UserCheck className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">Individual</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">Perfect for personal productivity, freelancers, and solo professionals.</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                                </div>
                            </div>
                        </motion.button>

                        <motion.button
                            type="button"
                            onClick={() => handleUserTypeSelection('business')}
                            className="p-6 border-2 rounded-xl text-left transition-all duration-300 group"
                            style={{
                                borderColor: userType === 'business' ? '#8b5cf6' : '#e5e7eb',
                                backgroundColor: userType === 'business' ? '#f3f4f6' : 'white',
                                transform: userType === 'business' ? 'scale(1.02)' : 'scale(1)'
                            }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">Business</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">Ideal for teams, companies, and organizations.</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                                </div>
                            </div>
                        </motion.button>
                    </div>

                    {userType && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-4">
                            <p className="text-sm text-emerald-600 font-medium">✅ Great choice! Setting up your {userType} workspace...</p>
                        </motion.div>
                    )}

                    <motion.button
                        type="button"
                        onClick={() => setRegistrationStep(3)}
                        className="mt-6 flex items-center text-sm text-gray-600 hover:text-purple-600"
                        whileHover={{ x: -5 }}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Password Setup
                    </motion.button>
                </div>
            );
        }

        if (registrationStep === 5) {
            if (userType === 'business') {
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-bold text-gray-800 mb-2">
                                Tell us about your business
                            </motion.h3>
                            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-600">
                                Help us customize your team workspace
                            </motion.p>
                        </div>

                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Company Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    placeholder="Enter your company name"
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                                />
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Industry</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 appearance-none"
                                >
                                    <option value="">Select your industry</option>
                                    <option value="technology">Technology</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="finance">Finance</option>
                                    <option value="education">Education</option>
                                    <option value="retail">Retail</option>
                                    <option value="manufacturing">Manufacturing</option>
                                    <option value="consulting">Consulting</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Team Size</label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    name="teamSize"
                                    value={formData.teamSize}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 appearance-none"
                                >
                                    <option value="">Select team size</option>
                                    <option value="1-5">1-5 people</option>
                                    <option value="6-20">6-20 people</option>
                                    <option value="21-50">21-50 people</option>
                                    <option value="51-200">51-200 people</option>
                                    <option value="200+">200+ people</option>
                                </select>
                            </div>
                        </motion.div>

                        <motion.button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleFinalOnboarding}
                            className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
                            style={{ background: isSubmitting ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
                            whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" } : {}}
                            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                {isSubmitting ? (
                                    <>
                                        <motion.div
                                            className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        Setting up your workspace...
                                    </>
                                ) : (
                                    <>
                                        Final Step <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </motion.button>

                        <motion.button
                            type="button"
                            onClick={() => setRegistrationStep(4)}
                            className="mt-6 flex items-center text-sm text-gray-600 hover:text-purple-600"
                            whileHover={{ x: -5 }}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to User Type
                        </motion.button>
                    </div>
                );
            } else if (userType === 'individual') {
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-xl font-bold text-gray-800 mb-2">
                                Tell us about yourself
                            </motion.h3>
                            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-600">
                                Help us personalize your experience
                            </motion.p>
                        </div>

                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Profession</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="profession"
                                    value={formData.profession}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Software Developer, Designer, Consultant"
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                                />
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Primary Use Case</label>
                            <div className="relative">
                                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    name="useCase"
                                    value={formData.useCase}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl outline-none transition-all duration-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 appearance-none"
                                >
                                    <option value="">What will you primarily use this for?</option>
                                    <option value="personal">Personal schedule management</option>
                                    <option value="freelance">Freelance project tracking</option>
                                    <option value="client-meetings">Client meeting scheduling</option>
                                    <option value="productivity">Personal productivity</option>
                                    <option value="learning">Learning & skill development</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </motion.div>

                        <motion.button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleFinalOnboarding}
                            className="w-full py-4 text-lg font-semibold text-white rounded-xl relative overflow-hidden group"
                            style={{ background: isSubmitting ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)' }}
                            whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" } : {}}
                            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                {isSubmitting ? (
                                    <>
                                        <motion.div
                                            className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        Setting up your workspace...
                                    </>
                                ) : (
                                    <>
                                        Final Step <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </motion.button>

                        <motion.button
                            type="button"
                            onClick={() => setRegistrationStep(4)}
                            className="mt-6 flex items-center text-sm text-gray-600 hover:text-purple-600"
                            whileHover={{ x: -5 }}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to User Type
                        </motion.button>
                    </div>
                );
            }
        }

        return null;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            <ParticleSystem isActive={isTyping} formProgress={formProgress} />
            <FloatingElements isTyping={isTyping} formProgress={formProgress} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative max-w-md w-full mx-4 bg-white rounded-2xl shadow-2xl p-8 z-10"
            >
                <motion.div
                    className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-8"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${formProgress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={registrationStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-4">
                            <span className="text-xs font-medium text-purple-600">
                                {registrationStep === 1 ? "New Adventure" :
                                    registrationStep === 2 ? "Security First" :
                                        registrationStep === 3 ? "Password Setup" :
                                            registrationStep === 4 ? "Tailored Setup" : "Final Setup"}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {registrationStep === 1 ? "Join the Revolution" :
                                registrationStep === 2 ? "Verify Your Email" :
                                    registrationStep === 3 ? "Secure Your Account" :
                                        registrationStep === 4 ? "Choose Your Path" : "Final Setup"}
                        </h2>
                        <p className="text-gray-600">
                            {registrationStep === 1 ? "Start your journey to effortless scheduling" :
                                registrationStep === 2 ? "We've sent a verification code to secure your account" :
                                    registrationStep === 3 ? "Create a strong password to protect your account" :
                                        registrationStep === 4 ? "Personalize your experience based on your needs" :
                                            userType === 'business' ? "Configure your team workspace" : "Personalize your individual workspace"}
                        </p>
                    </motion.div>
                </AnimatePresence>

                {renderContent()}

                <AnimatePresence>
                    {errors.submit && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-4 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200 text-center"
                        >
                            {errors.submit}
                        </motion.p>
                    )}
                </AnimatePresence>

                {registrationStep === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8"
                    >
                        <div className="relative">


                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                // onClick={() => handleSocialAuth('Google')}
                                className="flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.31 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                // onClick={() => handleSocialAuth('LinkedIn')}
                                className="flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path
                                        fill="#0077B5"
                                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.848-3.037-1.852 0-2.136 1.445-2.136 2.939v5.667H9.354V9h3.414v1.561h.048c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h-.003z"
                                    />
                                </svg>
                                LinkedIn
                            </button>
                        </div>
                        <motion.div
                            className="text-center mt-8"
                            animate={{ y: isTyping ? -5 : 0 }}
                        >
                            <span className="text-gray-600">Already have an account? </span>
                            <motion.button
                                className="text-purple-600 hover:text-purple-700 font-semibold"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/prod-login')}
                            >
                                Sign In →
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )
                }

            </motion.div>

        </div>
    );
};

export default Register_V1;