import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSelector } from "react-redux";
import navConfig from "../../config/config/navConfig";
import NavSectionMini from "./components/NavSectionMini";
import NavToggleButton from "./components/toggleButton";

export default function NavMini() {
  const { user } = useSelector((state) => state.auth);

  return (
    <nav
      className={cn(
        "fixed top-0 bottom-0 left-0 z-50 flex-shrink-0",
        "bg-background border-border relative border-r border-dashed",
        "w-24",
      )}
    >
      <NavToggleButton className="absolute top-12 -right-4" />

      <div
        className={cn(
          "h-full w-full pb-2",
          "flex flex-col items-center",
          "overflow-x-hidden overflow-y-auto",
        )}
      >
        <div className="mx-auto my-2 w-full">
          <Image
            src="/moscot.png"
            priority
            alt="shothik_logo"
            width={100}
            height={40}
            className="mx-auto h-auto w-1/2 object-contain"
          />
        </div>

        <NavSectionMini data={navConfig} user={user} />
      </div>
    </nav>
  );
}
