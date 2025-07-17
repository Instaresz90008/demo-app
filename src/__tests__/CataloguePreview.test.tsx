
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { openCataloguePreview } from '../utils/previewUtils';

// Mock the window.open function
const mockWindowOpen = vi.fn();
global.open = mockWindowOpen;

// Mock the toast function
vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn()
}));

describe('Catalogue Preview Functionality', () => {
  beforeEach(() => {
    // Clear mock history before each test
    mockWindowOpen.mockClear();
  });
  
  test('should open a preview with valid slug', () => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { origin: 'http://test.com' },
      writable: true
    });
    
    // Set mock to return a value for window.open
    mockWindowOpen.mockReturnValue({});
    
    const result = openCataloguePreview('test-slug');
    
    expect(result).toBe(true);
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'http://test.com/catalogue/test-slug', 
      '_blank'
    );
  });
  
  test('should return false for empty slug', () => {
    const result = openCataloguePreview('');
    
    expect(result).toBe(false);
    expect(mockWindowOpen).not.toHaveBeenCalled();
  });
  
  test('should handle popup blockers', () => {
    // Mock window.open returning null to simulate popup blocker
    mockWindowOpen.mockReturnValue(null);
    
    const result = openCataloguePreview('test-slug');
    
    expect(result).toBe(false);
  });
});
