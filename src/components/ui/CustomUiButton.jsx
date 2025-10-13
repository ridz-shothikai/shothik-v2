import { cn } from "@/lib/utils";
import Image from "next/image";

export default function CustomUiButton({
  startIconSrc,
  className,
  iconClassName,
  textLable,
  variant = "primary",
  ...props
}) {
  const baseStyles =
    "flex items-center gap-1 md:gap-1.5 lg:gap-2 rounded-lg px-3 py-2.5 font-semibold hover:opacity-80 transition-opacity text-sm transition duration-300 ease-in-out cursor-pointer";

  const variantStyles = {
    primary:
      "border-primary text-primary border-2 bg-transparent hover:bg-[#00A76F29]",
    secondary: "bg-blue-500 text-white", // Example secondary style
    // Add more variants as needed
  };
  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {startIconSrc && (
        <Image
          src={startIconSrc}
          alt=""
          width={24}
          height={24}
          className={cn("h-5 w-5 lg:h-6 lg:w-6", iconClassName)}
        />
      )}

      {textLable}
    </button>
  );
}
