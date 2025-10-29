import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { _socials } from "../_mock/socials";
import VideoImage from "../components/home/components/VideoImage";

export default function ComingSoon() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-100px)] flex-col items-center justify-center px-4">
      <div>
        <h2 className="from-primary to-primary/70 bg-gradient-to-br bg-clip-text text-4xl font-bold text-transparent">
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

      <div className="flex flex-row items-center justify-center gap-1">
        {_socials.map((social) => (
          <Button key={social.value} variant="ghost" size="icon" asChild>
            <NextLink href={social.path} className="hover:opacity-80">
              <social.icon className="text-current" />
            </NextLink>
          </Button>
        ))}
      </div>
    </div>
  );
}
