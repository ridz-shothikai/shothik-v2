"use client";

const DotIndicator = ({ text, dots = 5 }) => {
  return (
    <div className="inline-flex items-center gap-2 px-1 py-2">
      <div className="flex gap-1">
        {Array.from({ length: dots }).map((_, i) => (
          <div
            key={i}
            className="bg-primary size-[1em] rounded-full"
            style={{
              animation: "typing 1s infinite",
              animationDelay: `${i * 0.2}s`,
              transformOrigin: "center",
              display: "inline-block",
            }}
          />
        ))}
      </div>
      {text && (
        <span className="text-muted-foreground text-sm italic">{text}</span>
      )}

      <style jsx>{`
        @keyframes typing {
          0%,
          60%,
          100% {
            transform: scale(0.8);
            opacity: 0.3;
          }
          45% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default DotIndicator;
