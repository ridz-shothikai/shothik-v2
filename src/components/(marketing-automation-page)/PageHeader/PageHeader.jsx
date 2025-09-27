import { Button } from "@mui/material";
import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";

const PageHeader = () => {
  return (
    <div className="flex h-16 w-full items-center justify-between gap-4">
      <Link href="/projects" className="flex items-center">
        <ChevronLeft className="mr-2 h-5 w-5" />
        <span>Ads Hub</span>
      </Link>
      <Link href="/marketing-automation">
        <Button variant="contained" className="ml-auto gap-2">
          <Plus /> <span>New Project</span>{" "}
        </Button>
      </Link>
    </div>
  );
};

export default PageHeader;
