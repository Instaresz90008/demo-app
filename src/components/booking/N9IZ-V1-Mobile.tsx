
import React, { useState, useEffect } from 'react';

interface N9IZV1MobileProps {
  consultantName?: string;
  consultantTitle?: string;
  consultantCompany?: string;
  consultantLocation?: string;
  consultantRating?: number;
  consultantReviewCount?: number;
  serviceName?: string;
  serviceDescription?: string;
  onBookingComplete?: (bookingData: any) => void;
}

const N9IZV1Mobile: React.FC<N9IZV1MobileProps> = ({
  consultantName = "Sarah Chen",
  consultantTitle = "Senior Business Strategy Consultant",
  consultantCompany = "Strategic Growth Partners",
  consultantLocation = "San Francisco, CA",
  consultantRating = 4.9,
  consultantReviewCount = 247,
  serviceName = "Business Strategy",
  serviceDescription = "Former McKinsey consultant helping startups scale from seed to Series B with deep expertise in go-to-market strategy and scaling operations.",
  onBookingComplete
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState({
    type: 'video',
    icon: '📹',
    title: 'Video Call',
    price: '$149',
    duration: '30'
  });
  const [selectedDate, setSelectedDate] = useState(18);
  const [selectedTime, setSelectedTime] = useState('9:30 AM');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    stage: '',
    industry: '',
    website: '',
    timezone: 'pst',
    language: 'english',
    challenges: '',
    outcomes: '',
    background: '',
    focusAreas: [] as string[]
  });

  const services = {
    audio: { icon: '🎧', title: 'Audio Call', price: '$99', duration: '30' },
    video: { icon: '📹', title: 'Video Call', price: '$149', duration: '30' },
    person: { icon: '🤝', title: 'In-Person', price: '$249', duration: '45' },
    workshop: { icon: '👥', title: 'Team Workshop', price: '$399', duration: '90' }
  };

  const handleServiceChange = (type: keyof typeof services) => {
    setSelectedService({ type, ...services[type] });
  };

  const handleDateSelect = (date: number) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFocusAreaToggle = (area: string) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(item => item !== area)
        : [...prev.focusAreas, area]
    }));
  };

  const proceedToStep = (step: number) => {
    setCurrentStep(step);
  };

  const focusAreaOptions = [
    'Go-to-Market Strategy',
    'Product-Market Fit',
    'Fundraising Strategy',
    'Scaling Operations',
    'Business Model Innovation',
    'Strategic Partnerships'
  ];

  const handleBookingComplete = () => {
    const bookingData = {
      consultant: {
        name: consultantName,
        title: consultantTitle,
        company: consultantCompany
      },
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      formData
    };
    
    if (onBookingComplete) {
      onBookingComplete(bookingData);
    }
  };

  useEffect(() => {
    if (currentStep === 5 && onBookingComplete) {
      handleBookingComplete();
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Sticky Header with Profile - Mobile Optimized */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-md">
                {consultantName.split(' ').map(n => n[0]).join('')}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900">{consultantName}</h1>
                <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">⭐ Expert</span>
              </div>
              <div className="text-sm text-gray-600">{consultantTitle.split(' ').slice(0, 2).join(' ')} • ⭐ {consultantRating} ({consultantReviewCount})</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-500">{selectedService.price}</div>
              <div className="text-xs text-gray-500">{selectedService.duration} min</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {currentStep >= 2 && (
        <div className="px-4 py-2 bg-white border-b border-gray-100">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map(step => (
              <div
                key={step}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  step < currentStep ? 'bg-green-500' :
                  step === currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="text-xs font-medium text-gray-600 mt-1">
            Step {currentStep} of 4
          </div>
        </div>
      )}

      <div className="px-3 pb-20">
        {/* Service Selection - Only Show on Step 1 */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 my-3">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{serviceName}</h2>
            
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(services).map(([type, service]) => (
                <button
                  key={type}
                  onClick={() => handleServiceChange(type as keyof typeof services)}
                  className={`relative p-4 rounded-xl transition-all duration-200 ${
                    selectedService.type === type
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-2xl mb-2">{service.icon}</div>
                  <div className="text-xs font-bold">{service.title}</div>
                  <div className="text-xs opacity-75 mt-1">{service.price}</div>
                  {selectedService.type === type && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Date & Time Selection */}
        {currentStep === 1 && (
          <div className="space-y-3">
            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">📅 Pick a Date</h2>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                    <span className="text-sm">‹</span>
                  </button>
                  <span className="font-bold text-gray-900 text-sm">June 2025</span>
                  <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                    <span className="text-sm">›</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="text-center py-2 text-xs font-bold text-gray-400">{day}</div>
                ))}
                
                {/* Calendar dates with better mobile optimization */}
                <div className="aspect-square flex items-center justify-center text-gray-300 text-sm">15</div>
                <div className="aspect-square flex items-center justify-center text-gray-300 text-sm">16</div>
                <div className="aspect-square flex items-center justify-center text-gray-300 text-sm">17</div>
                <button
                  onClick={() => handleDateSelect(18)}
                  className="aspect-square rounded-xl bg-blue-500 text-white font-bold text-sm shadow-md flex items-center justify-center relative"
                >
                  18
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                </button>
                <div className="aspect-square flex items-center justify-center text-gray-300 text-sm">19</div>
                <div className="aspect-square flex items-center justify-center text-gray-300 text-sm">20</div>
                <button
                  onClick={() => handleDateSelect(21)}
                  className="aspect-square rounded-xl border-2 border-blue-200 text-blue-600 font-bold text-sm flex items-center justify-center hover:bg-blue-50"
                >
                  21
                </button>

                <div className="aspect-square flex items-center justify-center text-gray-300 text-sm">22</div>
                <div className="aspect-square flex items-center justify-center text-gray-300 text-sm">23</div>
                <div className="aspect-square flex items-center justify-center text-gray-300 text-sm">24</div>
                <button
                  onClick={() => handleDateSelect(25)}
                  className="aspect-square rounded-xl border-2 border-blue-200 text-blue-600 font-bold text-sm flex items-center justify-center hover:bg-blue-50"
                >
                  25
                </button>
                <div className="aspect-square flex items-center justify-center text-gray-300 text-sm">26</div>
                <div className="aspect-square flex items-center justify-center text-gray-300 text-sm">27</div>
                <button
                  onClick={() => handleDateSelect(28)}
                  className="aspect-square rounded-xl border-2 border-blue-200 text-blue-600 font-bold text-sm flex items-center justify-center hover:bg-blue-50"
                >
                  28
                </button>
              </div>
            </div>

            {/* Time Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-bold text-gray-900">⏰ Available Times</h3>
                <div className="flex-1 text-right">
                  <div className="text-sm text-gray-600">Wed, June 18</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2 text-green-800 text-sm font-medium">
                  <span>✨</span>
                  <span>Perfect timing for your timezone</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Morning</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { time: '9:00 AM', selected: false },
                      { time: '9:30 AM', selected: true },
                      { time: '10:00 AM', selected: false },
                      { time: '10:30 AM', selected: false, popular: true },
                      { time: '11:00 AM', selected: false },
                      { time: '11:30 AM', selected: false }
                    ].map(slot => (
                      <button
                        key={slot.time}
                        onClick={() => handleTimeSelect(slot.time)}
                        className={`relative p-4 rounded-xl font-bold text-sm transition-all duration-200 ${
                          selectedTime === slot.time
                            ? 'bg-blue-500 text-white shadow-lg scale-105'
                            : slot.popular
                            ? 'bg-orange-50 border-2 border-orange-200 text-orange-700'
                            : 'bg-gray-50 border-2 border-gray-100 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {slot.time}
                        {selectedTime === slot.time && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Afternoon</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { time: '12:00 PM', selected: false },
                      { time: '12:30 PM', selected: false, popular: true }
                    ].map(slot => (
                      <button
                        key={slot.time}
                        onClick={() => handleTimeSelect(slot.time)}
                        className={`relative p-4 rounded-xl font-bold text-sm transition-all duration-200 ${
                          selectedTime === slot.time
                            ? 'bg-blue-500 text-white shadow-lg scale-105'
                            : slot.popular
                            ? 'bg-orange-50 border-2 border-orange-200 text-orange-700'
                            : 'bg-gray-50 border-2 border-gray-100 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {slot.time}
                        {selectedTime === slot.time && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Steps 2-5 */}
        {currentStep >= 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden my-3">
            
            {/* Step Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                {currentStep === 2 && <>📝 Contact Details</>}
                {currentStep === 3 && <>❓ Session Questions</>}
                {currentStep === 4 && <>✅ Confirm Booking</>}
                {currentStep === 5 && <>🎉 Success!</>}
              </h2>
              <div className="text-gray-600 text-sm">
                {currentStep === 2 && 'Tell us about yourself'}
                {currentStep === 3 && 'Help Sarah prepare for your session'}
                {currentStep === 4 && 'Review your booking details'}
                {currentStep === 5 && 'Your consultation is confirmed'}
              </div>
            </div>

            {/* Step Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
              
              {/* Summary Card */}
              {currentStep >= 2 && currentStep <= 4 && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl mb-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-blue-900 mb-1">
                        {selectedService.icon} {selectedService.title}
                      </h3>
                      <div className="text-gray-700 text-xs">
                        Wed, June 18 • {selectedTime} PST
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">{selectedService.price}</div>
                      <div className="text-xs text-gray-600">{selectedService.duration} min</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        👤 First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        👤 Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      📧 Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="your.email@company.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      📱 Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      🏢 Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      placeholder="Your company name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">📈 Stage</label>
                      <select
                        value={formData.stage}
                        onChange={(e) => handleInputChange('stage', e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      >
                        <option value="">Select stage</option>
                        <option value="idea">Idea Stage</option>
                        <option value="pre-seed">Pre-Seed</option>
                        <option value="seed">Seed</option>
                        <option value="series-a">Series A</option>
                        <option value="series-b">Series B</option>
                        <option value="series-c">Series C+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">🏭 Industry</label>
                      <select
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      >
                        <option value="">Select industry</option>
                        <option value="fintech">Fintech</option>
                        <option value="healthtech">Healthtech</option>
                        <option value="edtech">Edtech</option>
                        <option value="saas">SaaS</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="ai-ml">AI/ML</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Questions */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-sm flex items-center gap-2">
                      🎯 What are your main business challenges?
                    </h4>
                    <p className="text-gray-600 text-xs mb-3">Describe your top 2-3 challenges</p>
                    <textarea
                      value={formData.challenges}
                      onChange={(e) => handleInputChange('challenges', e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none min-h-[100px] text-sm resize-none"
                      placeholder="e.g., Struggling with product-market fit, need help with go-to-market strategy..."
                    />
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-sm flex items-center gap-2">
                      🚀 What outcomes do you want to achieve?
                    </h4>
                    <p className="text-gray-600 text-xs mb-3">Be specific about your goals</p>
                    <textarea
                      value={formData.outcomes}
                      onChange={(e) => handleInputChange('outcomes', e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none min-h-[100px] text-sm resize-none"
                      placeholder="e.g., Increase MRR by 50% in 6 months, successfully raise Series A..."
                    />
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-sm flex items-center gap-2">
                      📋 Focus Areas
                    </h4>
                    <p className="text-gray-600 text-xs mb-3">Select all relevant topics</p>
                    <div className="space-y-2">
                      {focusAreaOptions.map(area => (
                        <button
                          key={area}
                          onClick={() => handleFocusAreaToggle(area)}
                          className={`w-full flex items-center gap-3 p-4 border-2 rounded-xl transition-all ${
                            formData.focusAreas.includes(area)
                              ? 'border-blue-500 bg-blue-50 text-blue-900'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center font-bold ${
                            formData.focusAreas.includes(area)
                              ? 'border-blue-500 bg-blue-500 text-white'
                              : 'border-gray-300'
                          }`}>
                            {formData.focusAreas.includes(area) && '✓'}
                          </div>
                          <span className="text-sm font-medium text-left">{area}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-3 text-base flex items-center gap-2">
                      {selectedService.icon} {selectedService.title} with {consultantName}
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-700">
                      <div><strong>📅 Date:</strong> Wed, June 18, 2025</div>
                      <div><strong>⏰ Time:</strong> {selectedTime} PST</div>
                      <div><strong>⏱️ Duration:</strong> {selectedService.duration} minutes</div>
                      <div><strong>💰 Price:</strong> {selectedService.price}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                      👤 Your Information
                    </h4>
                    <div className="text-xs text-gray-700 space-y-1">
                      <div><strong>Name:</strong> {formData.firstName} {formData.lastName}</div>
                      <div><strong>Email:</strong> {formData.email}</div>
                      <div><strong>Company:</strong> {formData.company}</div>
                      <div><strong>Industry:</strong> {formData.industry}</div>
                    </div>
                  </div>
                  
                  {formData.focusAreas.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                        🎯 Session Focus
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {formData.focusAreas.map(area => (
                          <span key={area} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Success */}
              {currentStep === 5 && (
                <div className="space-y-4 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-white text-3xl">✓</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Booking Confirmed!</h2>
                  <p className="text-gray-600 text-sm">Your consultation with {consultantName} is all set</p>
                  
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border-2 border-green-200 text-left">
                    <h4 className="font-bold text-green-900 mb-3 text-sm flex items-center gap-2">
                      📧 What happens next?
                    </h4>
                    <div className="text-green-800 text-xs space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        <span>Confirmation email sent to {formData.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        <span>Calendar invite arriving within 5 minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        <span>Reminder email 24 hours before</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border-2 border-orange-200 text-left">
                    <h4 className="font-bold text-orange-900 mb-2 text-sm flex items-center gap-2">
                      🚀 Get Ready for Success
                    </h4>
                    <p className="text-orange-800 text-xs">
                      {consultantName.split(' ')[0]} will come prepared with specific insights for your {formData.industry} startup's growth challenges.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Step Actions */}
            {currentStep < 5 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between gap-3">
                <button
                  onClick={() => proceedToStep(currentStep - 1)}
                  className="px-6 py-3 border-2 border-gray-300 bg-white text-gray-700 font-bold rounded-xl hover:bg-gray-50 disabled:opacity-50"
                  disabled={currentStep === 2}
                >
                  ← Back
                </button>
                <button
                  onClick={() => currentStep === 4 ? proceedToStep(5) : proceedToStep(currentStep + 1)}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg"
                >
                  {currentStep === 4 ? '✅ Confirm Booking' : 'Continue →'}
                </button>
              </div>
            )}

            {/* Success Actions */}
            {currentStep === 5 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center">
                <button
                  onClick={() => proceedToStep(1)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg"
                >
                  🏠 Back to Dashboard
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button for Step 1 */}
      {currentStep === 1 && (
        <div className="fixed bottom-4 left-4 right-4 z-20">
          <button
            onClick={() => proceedToStep(2)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl text-lg flex items-center justify-center gap-2"
          >
            <span>✨</span>
            <span>Book {selectedService.title} • {selectedService.price}</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default N9IZV1Mobile;
