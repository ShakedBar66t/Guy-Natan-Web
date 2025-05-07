// Function to track custom events
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
) => {
  // Make sure gtag is available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
};

// Example usage:
// For tracking page views explicitly
export const trackPageView = (url: string) => {
  trackEvent('page_view', {
    page_path: url,
  });
};

// For tracking button clicks
export const trackButtonClick = (buttonName: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
  });
};

// For tracking form submissions
export const trackFormSubmission = (formName: string) => {
  trackEvent('form_submit', {
    form_name: formName,
  });
}; 