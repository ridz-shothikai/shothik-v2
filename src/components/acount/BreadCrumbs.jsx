import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Breadcrumb({ links, heading, activeLast }) {
  return (
    <div className="flex items-center">
      <div className="flex-grow">
        <h1 className="mb-2 text-2xl font-semibold">{heading}</h1>

        {/* BREADCRUMBS */}
        <nav className="flex items-center space-x-2 text-sm">
          {links.map((link, idx) => (
            <div key={idx} className="flex items-center">
              <span
                className={cn(
                  "text-foreground capitalize",
                  activeLast === link.name &&
                    "text-muted-foreground pointer-events-none",
                )}
              >
                {link.name}
              </span>
              {idx < links.length - 1 && (
                <ChevronRight className="text-muted-foreground mx-2 h-4 w-4" />
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
