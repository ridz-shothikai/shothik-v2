import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function LeftIcon({ className }) {
  return <ChevronLeft className={cn("h-5 w-5", className)} />;
}

export function RightIcon({ className }) {
  return <ChevronRight className={cn("h-5 w-5", className)} />;
}
