"use client";

const BackgroundContainer = ({ children }) => {
  return (
    <div className="pt-6 pb-1 bg-muted">
      <div className="container mx-auto px-4">{children}</div>
    </div>
  );
};

export default BackgroundContainer;
