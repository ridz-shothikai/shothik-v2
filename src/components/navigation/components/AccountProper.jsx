"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PATH_ACCOUNT } from "@/config/config/route";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import useSnackbar from "@/hooks/useSnackbar";
import {
  logout,
  setShowLoginModal,
  setShowRegisterModal,
} from "@/redux/slices/auth";
import Discord from "@/resource/assets/Discord";
import { HelpCircle, LogIn, Mail, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// ----------------------------------------------------------------------

export default function AccountPopover({ accessToken, user }) {
  const [open, setOpen] = useState(false);
  const enqueueSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const { push } = useRouter();

  const handleLogout = async () => {
    try {
      dispatch(logout());
      localStorage.setItem("logout-event", Date.now().toString());
      setOpen(false);
      enqueueSnackbar("Logout successful!", { variant: "success" });
      push("/");
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Unable to logout!", { variant: "error" });
    }
  };

  const handleClickItem = (path) => {
    setOpen(false);
    push(path);
  };

  const popoverRef = useOutsideClick(() => setOpen(false));

  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === "logout-event") {
        dispatch(logout());
        push("/");
      }
    };

    window.addEventListener("storage", syncLogout);

    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, [dispatch, push]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button ref={popoverRef} className="flex cursor-pointer items-center">
          {user && user?.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              className="h-10 w-10 rounded-full"
              width={40}
              height={40}
            />
          ) : user && accessToken ? (
            <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
              {user?.name
                ? `${String(user?.name ?? "").split(" ")[0][0] || ""}${
                    user.name?.split(" ")[1]?.[0] || ""
                  }`
                : ""}
            </div>
          ) : (
            <User className="text-muted-foreground h-8 w-8" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {user?.email && (
          <DropdownMenuItem
            onClick={() => handleClickItem(PATH_ACCOUNT.settings.root)}
            className="cursor-pointer"
          >
            <User className="mr-2 h-5 w-5" />
            <div className="flex flex-col">
              <span className="font-medium">My Profile</span>
              <span className="text-muted-foreground truncate text-xs">
                {user?.email
                  ? user.email.length > 15
                    ? `${user.email.slice(0, 15)}...`
                    : user.email
                  : ""}
              </span>
            </div>
          </DropdownMenuItem>
        )}

        {!user?.email && (
          <DropdownMenuItem
            data-umami-event="Nav: Login / Sign up"
            onClick={() => {
              setOpen(false);
              dispatch(setShowRegisterModal(false));
              dispatch(setShowLoginModal(true));
            }}
          >
            <LogIn className="mr-2 h-5 w-5" />
            <span>Login / Sign up</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href="mailto:support@shothik.ai" className="no-underline">
            <HelpCircle className="mr-2 h-5 w-5" />
            <span>Help Center</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/contact-us" className="no-underline">
            <Mail className="mr-2 h-5 w-5" />
            <span>Contact us</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="https://discord.gg/pq2wTqXEpj" className="no-underline">
            <Discord className="mr-2 h-5 w-5" />
            <span>Join Us on Discord</span>
          </Link>
        </DropdownMenuItem>

        {user?.email && (
          <DropdownMenuItem onClick={handleLogout}>
            <LogIn className="mr-2 h-5 w-5" />
            <span>Log out</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
