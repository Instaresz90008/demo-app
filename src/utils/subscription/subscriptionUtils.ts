/**
 * Calculates the yearly price based on monthly price with a discount
 * @param monthlyPrice The monthly price
 * @param yearlyDiscountPercentage The percentage discount for yearly billing (default: 16%)
 */
export const calculateYearlyPrice = (
  monthlyPrice: number,
  yearlyDiscountPercentage: number = 16
): number => {
  const monthsInYear = 12;
  const discount = 1 - yearlyDiscountPercentage / 100;
  return Math.round(monthlyPrice * monthsInYear * discount);
};

/**
 * Formats a price for display
 * @param price The price to format
 * @param currency The currency symbol (default: $)
 */
export const formatPrice = (price: number | string, currency: string = "$"): string => {
  return `${currency}${price}`;
};

/**
 * Generates a shareable plan link
 * @param planId The plan ID to link to
 */
export const getPlanLink = (planId: string): string => {
  return `/upgrade?plan=${planId}`;
};

/**
 * Calculate savings when switching from monthly to yearly billing
 * @param monthlyPrice The monthly price
 * @param yearlyPrice The yearly price
 */
export const calculateYearlySavings = (monthlyPrice: number, yearlyPrice: number): number => {
  const yearlyTotalAtMonthlyRate = monthlyPrice * 12;
  return Math.round(yearlyTotalAtMonthlyRate - yearlyPrice);
};

/**
 * Format savings amount as a percentage
 * @param monthlyCost Total cost if billed monthly for a year
 * @param yearlyCost Total cost if billed yearly
 */
export const calculateSavingsPercentage = (monthlyCost: number, yearlyCost: number): number => {
  if (monthlyCost === 0) return 0;
  return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
};

/**
 * Get billing period display text
 * @param billingPeriod The billing period (monthly/yearly)
 */
export const getBillingPeriodDisplay = (billingPeriod: "monthly" | "yearly"): { short: string, full: string } => {
  return {
    short: billingPeriod === "monthly" ? "mo" : "yr",
    full: billingPeriod === "monthly" ? "month" : "year"
  };
};

/**
 * Generate a consistent and valid booking link with enhanced uniqueness
 * @param serviceName The name of the service
 * @returns A URL-safe booking link string with enhanced uniqueness
 */
export const generateBookingLink = (serviceName: string): string => {
  // Format the service name for URL safety (lowercase, hyphens for spaces)
  const formattedService = serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  // Add multiple layers of uniqueness
  const timestamp = new Date().getTime().toString(36);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const dateCode = new Date().toISOString().split('T')[0].replace(/-/g, '').substring(2);
  
  // Return the final booking link with enhanced uniqueness
  return `${formattedService}-${dateCode}-${timestamp}-${randomSuffix}`;
};

/**
 * Generate a consistent and valid booking link
 * @param serviceName The name of the service
 * @returns A URL-safe booking link string
 */
export const generateBookingLinkOld = (serviceName: string): string => {
  // Format the service name for URL safety (lowercase, hyphens for spaces)
  const formattedService = serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  // Add a timestamp for uniqueness
  const timestamp = new Date().getTime().toString(36).substring(4, 10);
  
  // Return the final booking link
  return `book-${formattedService}-${timestamp}`;
};

/**
 * Get full booking URL including domain
 * @param bookingLink The booking link identifier
 * @returns Complete booking URL
 */
export const getFullBookingUrl = (bookingLink: string): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/booking/${bookingLink}`;
};
