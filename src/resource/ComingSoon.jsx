import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { _socials } from "../_mock/socials";
import VideoImage from "../components/home/components/VideoImage";

export default function ComingSoon() {
  return (
    <div className="container mx-auto px-4 h-[calc(100vh-100px)] flex flex-col justify-center items-center">
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
          Coming Soon
        </h2>

        <p className="text-muted-foreground">
          We are currently working hard on this page!
        </p>
      </div>

      <VideoImage
        lightImage="/home/hero/hero-light.webp"
        darkImage="/home/hero/hero-dark.webp"
        height={400}
        width={400}
      />

      <div className="flex flex-row gap-1 items-center justify-center">
        {_socials.map((social) => (
          <Button
            key={social.value}
            variant="ghost"
            size="icon"
            asChild
          >
            <NextLink
              href={social.path}
              className="hover:opacity-80"
            >
              <social.icon className="text-current" />
            </NextLink>
          </Button>
        ))}
      </div>
    </div>
  );
}
