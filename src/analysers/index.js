import { GA_TRACKING_ID } from './config';

// Initialize Google Analytics
export const initGA = () => {
  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID);
};

// Track page view
export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// Track event
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
