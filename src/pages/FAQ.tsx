
import React, { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const faqData: FAQ[] = [
  {
    id: '1',
    question: 'How do I set up my availability?',
    answer: 'You can set up your availability by navigating to the Slot Broadcast page and selecting the days and times you\'re available. You can also set different availability for different services.',
    category: 'Getting Started',
    tags: ['availability', 'setup', 'slots']
  },
  {
    id: '2',
    question: 'How do I manage my bookings?',
    answer: 'All your bookings can be managed from the Event Management dashboard, where you can view, edit, or cancel appointments. You can also reschedule appointments directly from the calendar view.',
    category: 'Booking Management',
    tags: ['bookings', 'management', 'calendar']
  },
  {
    id: '3',
    question: 'Can I integrate with my calendar?',
    answer: 'Yes, Jusbook supports integration with Google Calendar, Microsoft Outlook, and other popular calendar services. Go to Settings > Integrations to connect your calendar.',
    category: 'Integrations',
    tags: ['calendar', 'google', 'outlook', 'sync']
  },
  {
    id: '4',
    question: 'How do I upgrade my account?',
    answer: 'To upgrade your account, click on the "Upgrade now" button in the sidebar or navigate to the billing section in your account settings. We offer various plans to suit different needs.',
    category: 'Account & Billing',
    tags: ['upgrade', 'billing', 'plans']
  },
  {
    id: '5',
    question: 'How do I reset my password?',
    answer: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email. Make sure to check your spam folder if you don\'t see the email within a few minutes.',
    category: 'Account & Billing',
    tags: ['password', 'reset', 'login']
  },
  {
    id: '6',
    question: 'Can I customize my booking form?',
    answer: 'Yes, you can customize your booking forms with custom fields, branding, and specific questions for your clients. Access this feature through Settings > Booking Forms.',
    category: 'Customization',
    tags: ['forms', 'customization', 'branding']
  },
  {
    id: '7',
    question: 'Is there a mobile app available?',
    answer: 'Currently, Jusbook is available as a responsive web application that works great on mobile devices. A dedicated mobile app is in development and will be available soon.',
    category: 'Platform',
    tags: ['mobile', 'app', 'responsive']
  },
  {
    id: '8',
    question: 'How do I add team members?',
    answer: 'You can add team members through Settings > Team Management. Different permission levels are available depending on your subscription plan.',
    category: 'Team Management',
    tags: ['team', 'members', 'permissions']
  },
  {
    id: '9',
    question: 'Can I set up recurring appointments?',
    answer: 'Yes, you can set up recurring appointments for regular clients. This feature is available in the Event Management section under "Recurring Bookings".',
    category: 'Booking Management',
    tags: ['recurring', 'appointments', 'regular']
  },
  {
    id: '10',
    question: 'How do I handle cancellations?',
    answer: 'Cancellations can be managed through your booking dashboard. You can set cancellation policies and automatic notifications for both you and your clients.',
    category: 'Booking Management',
    tags: ['cancellations', 'policies', 'notifications']
  },
  {
    id: '11',
    question: 'What payment methods do you support?',
    answer: 'We support all major credit cards, PayPal, and bank transfers. Payment processing is handled securely through Stripe.',
    category: 'Payments',
    tags: ['payments', 'stripe', 'credit cards']
  },
  {
    id: '12',
    question: 'How do I set up notifications?',
    answer: 'Notifications can be configured in Settings > Notifications. You can set up email and SMS notifications for bookings, cancellations, and reminders.',
    category: 'Notifications',
    tags: ['notifications', 'email', 'sms']
  },
  {
    id: '13',
    question: 'Can I export my data?',
    answer: 'Yes, you can export your booking data, client information, and reports in various formats including CSV and PDF from the Reports section.',
    category: 'Data Management',
    tags: ['export', 'data', 'reports']
  },
  {
    id: '14',
    question: 'How do I set different pricing for services?',
    answer: 'You can set individual pricing for each service in the Services section. Different pricing tiers and packages are also supported.',
    category: 'Pricing',
    tags: ['pricing', 'services', 'packages']
  },
  {
    id: '15',
    question: 'What happens if I exceed my plan limits?',
    answer: 'If you exceed your plan limits, you\'ll receive notifications and the option to upgrade. Your service won\'t be interrupted, but additional usage may be billed.',
    category: 'Account & Billing',
    tags: ['limits', 'billing', 'upgrade']
  }
];

const FAQ = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const categories = ['All', ...new Set(faqData.map(faq => faq.category))];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/help')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Help
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h1>
            <p className="text-muted-foreground mt-1">
              Find answers to common questions about Jusbook
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredFAQs.length} FAQ{filteredFAQs.length !== 1 ? 's' : ''} found
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFAQs.map((faq) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle 
                      className="text-lg cursor-pointer hover:text-primary transition-colors"
                      onClick={() => toggleFAQ(faq.id)}
                    >
                      {faq.question}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {faq.category}
                      </Badge>
                      {faq.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <AnimatePresence>
                {expandedFAQ === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredFAQs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">No FAQs found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or category filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FAQ;
