import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export default function Breadcrumb({ links, heading, activeLast }) {
  return (
    <div className="flex flex-row items-center">
      <div className="flex-grow">
        <h5 className="text-xl font-semibold mb-2">
          {heading}
        </h5>

        {/* BREADCRUMBS */}
        <BreadcrumbRoot>
          <BreadcrumbList>
            {links.map((link, idx) => (
              <>
                <BreadcrumbItem
                  key={idx}
                  className={cn(
                    "text-sm inline-flex items-center capitalize",
                    activeLast === link.name && "cursor-default pointer-events-none text-muted-foreground"
                  )}
                >
                  {link.name}
                </BreadcrumbItem>
                {idx < links.length - 1 && (
                  <BreadcrumbSeparator key={`sep-${idx}`}>
                    <Separator />
                  </BreadcrumbSeparator>
                )}
              </>
            ))}
          </BreadcrumbList>
        </BreadcrumbRoot>
      </div>
    </div>
  );
}

export function Separator() {
  return (
    <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground" />
  );
}
