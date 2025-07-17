
import { Service } from './types';

// Mock services for demo purposes
export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Initial Consultation',
    subtitle: 'Get started with our service',
    description: 'A 30-minute session to discuss your needs and goals. We\'ll understand your requirements and suggest the best way forward.',
    duration: 30,
    meetingType: 'Video Call',
    providerName: 'John Doe'
  },
  {
    id: '2',
    name: 'Strategy Session',
    subtitle: 'Develop your business strategy',
    description: 'A deep dive into your business strategy and planning. We\'ll analyze your current position and create a roadmap for success.',
    duration: 60,
    meetingType: 'In Person',
    providerName: 'Jane Smith'
  },
  {
    id: '3',
    name: 'Technical Support',
    subtitle: 'Get help with technical issues',
    description: 'Resolve technical problems with our expert support team. We\'ll troubleshoot issues and provide solutions to get you back on track.',
    duration: 45,
    meetingType: 'Phone Call',
    providerName: 'Alex Johnson'
  },
  {
    id: '4',
    name: 'Follow-up Meeting',
    subtitle: 'Check progress on your goals',
    description: 'Review progress and adjust strategies as needed. We\'ll assess what\'s working, what isn\'t, and make necessary adjustments.',
    duration: 30,
    meetingType: 'Video Call',
    providerName: 'Sarah Williams'
  },
  {
    id: '5',
    name: 'Full Review',
    subtitle: 'Comprehensive service review',
    description: 'A complete review of all aspects of our service with your account. We\'ll evaluate results, gather feedback, and plan next steps.',
    duration: 90,
    meetingType: 'In Person',
    providerName: 'Michael Brown'
  },
  {
    id: '6',
    name: 'Quick Check-in',
    subtitle: 'Brief status update',
    description: 'A short meeting to quickly align on progress and address any immediate concerns or questions.',
    duration: 15,
    meetingType: 'Phone Call',
    providerName: 'Emily Davis'
  },
  {
    id: '7',
    name: 'Implementation Workshop',
    subtitle: 'Hands-on guidance for setup',
    description: 'A practical session where we guide you through implementing our solutions step by step.',
    duration: 120,
    meetingType: 'Video Call',
    providerName: 'David Wilson'
  }
];
