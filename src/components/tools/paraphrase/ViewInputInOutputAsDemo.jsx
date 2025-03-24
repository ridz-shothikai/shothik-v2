"use client";
import CheckmarkLoader from "../../../resource/CheckmarkLoader";

const ViewInputInOutAsDemo = ({ input, wordLimit }) => {
  const plainText = input.replace(/<[^>]+>/g, "");
  const textAsWordsArray = plainText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  
  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      backgroundColor: "rgba(255, 255, 255, 0.9)"
    }}>
      <CheckmarkLoader size={60} />
      
      <div style={{
        opacity: 0.7,
        width: "100%",
        marginTop: "32px",
        textAlign: "center",
        color: "#333"
      }}>
        <p>Processing your text...</p>
      </div>
    </div>
  );
};

export default ViewInputInOutAsDemo;