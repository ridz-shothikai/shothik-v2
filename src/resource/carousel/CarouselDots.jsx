import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------

export default function CarouselDots(props) {
  const rounded = props?.rounded || false;
  const className = props?.className;

  return {
    appendDots: (dots) => (
      <ul
        className={cn(
          "text-primary z-10 flex items-center justify-center p-0",
          "[&_li]:flex [&_li]:h-[18px] [&_li]:w-[18px] [&_li]:cursor-pointer [&_li]:items-center [&_li]:justify-center [&_li]:opacity-30",
          rounded
            ? "[&_li.slick-active_span]:w-4 [&_li.slick-active_span]:rounded-md"
            : "",
          "[&_li.slick-active]:opacity-100",
          className,
        )}
        {...props}
      >
        {dots}
      </ul>
    ),
    customPaging: () => (
      <div className="flex h-full w-full items-center justify-center">
        <span className="ease-sharp h-2 w-2 rounded-full bg-current transition-all duration-200" />
      </div>
    ),
  };
}
