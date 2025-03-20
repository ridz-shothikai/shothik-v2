import GoogleAnalytics from './googleAnalytics';

function UseGoogleAnalytics() {
  return (
    <div>
      {/* Use the GoogleAnalytics component here */}
      <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
    </div>
  );
}

export default UseGoogleAnalytics;
