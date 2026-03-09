// Analytics tracking utilities
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  try {
    if (window.gtag) {
      window.gtag('event', eventName, parameters);
    }
    
    console.log('Analytics event tracked:', eventName, parameters);
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Conversion tracking functions
export const trackSignup = (method: string = 'email') => {
  trackEvent('signup', {
    method,
    category: 'engagement',
    label: 'user_registration'
  });
};

export const trackUpgrade = (plan: string, value: number) => {
  trackEvent('upgrade', {
    plan_type: plan,
    value,
    currency: 'USD',
    category: 'conversion',
    label: 'pro_subscription'
  });
};

export const trackFeatureUsage = (feature: string, count: number = 1) => {
  trackEvent('feature_usage', {
    feature_name: feature,
    usage_count: count,
    category: 'engagement',
    label: 'tool_interaction'
  });
};

export const trackPageView = (pageName: string) => {
  trackEvent('page_view', {
    page_name: pageName,
    category: 'navigation'
  });
};

export const trackButtonClick = (buttonName: string, location: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    location,
    category: 'interaction'
  });
};