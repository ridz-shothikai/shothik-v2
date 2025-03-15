const ViewInputInOutAsDemo = ({ input, wordLimit }) => {
  const plainText = input.replace(/<[^>]+>/g, "");
  const textAsWordsArray = plainText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const validWords = textAsWordsArray.slice(0, wordLimit).join(" ");

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 15,
        opacity: 0.2,
        overflow: "hidden",
        height: "90%",
      }}
    >
      <p> {validWords}</p>
    </div>
  );
};

export default ViewInputInOutAsDemo;
