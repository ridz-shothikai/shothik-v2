export const googlePageView = (url, GA_TRACKING_ID) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const googleEvent = (action, category, label, value) => {
  if (typeof window.gtag !== "undefined") {
    console.log("googleEvent", action, category, label, value);
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
