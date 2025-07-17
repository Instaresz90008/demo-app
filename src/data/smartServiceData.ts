
import { BookingType, PricingModel } from '@/types/smartService';

export const BOOKING_TYPES: BookingType[] = [
  {
    id: '1',
    key: '1-one',
    name: '1-One',
    description: 'Private 1-on-1 session',
    icon: '👤',
    supportedPricingModels: ['fixed', 'time-based', 'subscription', 'tiered', 'pay-what-you-want'],
    availabilityType: 'slot-selection'
  },
  {
    id: '2',
    key: '1-many',
    name: '1–Many (Broadcast)',
    description: 'One host, multiple passive participants',
    icon: '🎤',
    supportedPricingModels: ['free-rsvp', 'per-participant', 'tiered-access', 'group-fixed'],
    availabilityType: 'slot-selection'
  },
  {
    id: '3',
    key: 'group-interactive',
    name: 'Group (Interactive)',
    description: 'Multiple participants engage actively',
    icon: '👥',
    supportedPricingModels: ['per-participant', 'hybrid', 'group-fixed', 'minimum-payout'],
    availabilityType: 'slot-selection'
  },
  {
    id: '4',
    key: 'round-robin',
    name: 'Round Robin',
    description: 'Distribute bookings among team members',
    icon: '🔄',
    supportedPricingModels: ['fixed', 'time-based'],
    availabilityType: 'collective-sync'
  },
  {
    id: '5',
    key: 'collective-availability',
    name: 'Collective Availability',
    description: 'Team members share availability',
    icon: '🤝',
    supportedPricingModels: ['fixed', 'group-fixed'],
    availabilityType: 'collective-sync'
  },
  {
    id: '6',
    key: 'multi-service-bundle',
    name: 'Multi-Service / Bundle',
    description: 'Package multiple services together',
    icon: '📦',
    supportedPricingModels: ['bundled-price', 'tiered-package'],
    availabilityType: 'custom-mapping'
  },
  {
    id: '7',
    key: 'program-series',
    name: 'Program / Series',
    description: 'Sequential sessions or courses',
    icon: '📚',
    supportedPricingModels: ['full-program-fee', 'tiered-access'],
    availabilityType: 'recurring-calendar'
  },
  {
    id: '8',
    key: 'drop-in-queue',
    name: 'Drop-in / Queue Mode',
    description: 'First-come, first-served availability',
    icon: '⏰',
    supportedPricingModels: ['entry-fee', 'free'],
    availabilityType: 'auto-scheduling'
  },
  {
    id: '9',
    key: 'on-demand-expert',
    name: 'On-Demand Expert Match',
    description: 'AI-powered expert matching',
    icon: '🎯',
    supportedPricingModels: ['fixed'],
    availabilityType: 'auto-scheduling'
  }
];

export const PRICING_MODELS: Record<string, PricingModel> = {
  'fixed': {
    id: 'fixed',
    name: 'Fixed Price',
    description: 'One-time flat fee',
    icon: '💰',
    configFields: ['price']
  },
  'time-based': {
    id: 'time-based',
    name: 'Time-Based',
    description: 'Price per hour/minute',
    icon: '⏱️',
    configFields: ['hourlyRate', 'minimumDuration']
  },
  'subscription': {
    id: 'subscription',
    name: 'Subscription',
    description: 'Recurring payment',
    icon: '🔄',
    configFields: ['monthlyPrice', 'sessionsPerMonth']
  },
  'tiered': {
    id: 'tiered',
    name: 'Tiered Pricing',
    description: 'Multiple price options',
    icon: '📊',
    configFields: ['tiers']
  },
  'pay-what-you-want': {
    id: 'pay-what-you-want',
    name: 'Pay What You Want',
    description: 'Client sets the price',
    icon: '🎯',
    configFields: ['minimumPrice', 'suggestedPrice']
  },
  'free-rsvp': {
    id: 'free-rsvp',
    name: 'Free RSVP',
    description: 'No charge, just reservation',
    icon: '🆓',
    configFields: []
  },
  'per-participant': {
    id: 'per-participant',
    name: 'Per Participant',
    description: 'Price multiplied by attendees',
    icon: '👥',
    configFields: ['pricePerPerson', 'maxParticipants']
  },
  'tiered-access': {
    id: 'tiered-access',
    name: 'Tiered Access',
    description: 'Different access levels',
    icon: '🎫',
    configFields: ['accessTiers']
  },
  'group-fixed': {
    id: 'group-fixed',
    name: 'Group Fixed',
    description: 'Fixed price regardless of size',
    icon: '👨‍👩‍👧‍👦',
    configFields: ['groupPrice', 'maxGroupSize']
  },
  'hybrid': {
    id: 'hybrid',
    name: 'Hybrid (Base + Per Head)',
    description: 'Base fee plus per person',
    icon: '🧮',
    configFields: ['basePrice', 'pricePerPerson']
  },
  'minimum-payout': {
    id: 'minimum-payout',
    name: 'Minimum Payout',
    description: 'Guaranteed minimum earnings',
    icon: '🎯',
    configFields: ['minimumPayout', 'pricePerPerson']
  },
  'bundled-price': {
    id: 'bundled-price',
    name: 'Bundled Price',
    description: 'Package deal pricing',
    icon: '📦',
    configFields: ['bundlePrice', 'individualServices']
  },
  'tiered-package': {
    id: 'tiered-package',
    name: 'Tiered Package',
    description: 'Multiple package options',
    icon: '📋',
    configFields: ['packages']
  },
  'full-program-fee': {
    id: 'full-program-fee',
    name: 'Full Program Fee',
    description: 'One payment for entire program',
    icon: '🎓',
    configFields: ['programPrice', 'sessionCount']
  },
  'entry-fee': {
    id: 'entry-fee',
    name: 'Entry Fee',
    description: 'Fee to join queue',
    icon: '🎟️',
    configFields: ['entryPrice']
  },
  'free': {
    id: 'free',
    name: 'Free',
    description: 'No charge',
    icon: '🆓',
    configFields: []
  }
};
