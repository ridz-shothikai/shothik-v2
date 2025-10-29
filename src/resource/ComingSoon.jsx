import { Button } from "@/components/ui/button";
import Link from "next/link";
import { _socials } from "../_mock/socials";
import VideoImage from "../components/home/components/VideoImage";

export default function ComingSoon() {
  return (
    <div className="container flex h-[calc(100vh-100px)] flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="from-primary to-primary/60 bg-gradient-to-br bg-clip-text text-4xl font-bold text-transparent">
          Coming Soon
        </h1>

        <p className="text-muted-foreground mt-2">
          We are currently working hard on this page!
        </p>
      </div>

      <VideoImage
        lightImage="/home/hero/hero-light.webp"
        darkImage="/home/hero/hero-dark.webp"
        height={400}
        width={400}
      />

      <div className="flex items-center justify-center gap-2">
        {_socials.map((social) => (
          <Button
            key={social.value}
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-primary/10"
            style={{ color: social.color }}
          >
            <Link href={social.path}>
              <social.icon />
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
