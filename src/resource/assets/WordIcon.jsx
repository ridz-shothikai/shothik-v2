import Image from "next/image";

function WordIcon({ width = 20, height = 18 }) {
  return (
    <Image
      width={width}
      height={height}
      src="/tools/word.png"
      alt="word icon"
    />
  );
}

export default WordIcon;
