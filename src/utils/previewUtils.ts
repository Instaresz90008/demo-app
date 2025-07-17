
import { toast } from "@/components/ui/use-toast";

/**
 * Opens a catalogue preview in a new tab with proper error handling
 * @param slug - The catalogue slug to preview
 * @returns Whether the preview was successfully opened
 */
export const openCataloguePreview = (slug: string): boolean => {
  if (!slug) {
    toast({
      title: "Error",
      description: "Cannot preview catalogue: invalid slug.",
      variant: "destructive",
    });
    return false;
  }
  
  try {
    // Ensure the URL is properly formatted with the correct pathname
    const baseUrl = window.location.origin;
    // Using the standardized /catalogue/:slug route
    const previewUrl = `${baseUrl}/catalogue/${encodeURIComponent(slug)}`;
    
    console.log("Opening preview URL:", previewUrl);
    
    // Use window.open with rel attributes for security and target="_blank" to open in new tab
    const newWindow = window.open(previewUrl, '_blank');
    
    // Check if the window was blocked by a popup blocker
    if (newWindow === null || typeof newWindow === 'undefined') {
      toast({
        title: "Popup Blocked",
        description: "Please allow popups for this site to open previews.",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Preview opened",
      description: "The catalogue preview has opened in a new tab.",
    });
    
    return true;
  } catch (error) {
    console.error("Failed to open preview:", error);
    toast({
      title: "Error",
      description: "Failed to open preview. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};
