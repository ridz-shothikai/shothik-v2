import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import CommentSection from "./CommentSection";
import { LikeDislike } from "./LikeDislike";
import ShareIcons from "./ShareIcons";

export default function MainLayout({ blog }) {
  const shareUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL ?? "https://shothik.ai"}/blogs/${blog?.slag}`;
  const title = blog?.title || "Check out this blog!";
  const hashtags = ["ShothikAI", "AIContent", "Tech"];

  return (
    <div className="container mx-auto px-4 mb-6">
      <div className="mb-4">
        <p className="text-base font-bold uppercase tracking-wide leading-6 text-primary my-5">
          {`// ${blog?.category?.title} //`}
        </p>
        <h1 className="text-foreground text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-10 break-words m-0 p-0">
          {blog?.title}
        </h1>

        <p className="text-muted-foreground text-base leading-6 my-2">
          Updated on{" "}
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          }).format(new Date(blog?.updatedAt))}
        </p>
        <ul className="flex items-center flex-wrap m-0 p-0 py-2.5 w-full"></ul>
        <div className="flex items-center gap-2.5 mt-4">
          <Avatar>
            <AvatarImage src="/static/images/avatar/1.jpg" alt={blog?.author?.name} />
            <AvatarFallback>{blog?.author?.name?.[0] || "A"}</AvatarFallback>
          </Avatar>
          <p className="text-muted-foreground text-base tracking-normal leading-6 font-medium">
            {blog?.author?.name
              ? blog?.author?.name
              : blog?.editorContent?.name}
          </p>
        </div>
      </div>
      <img
        src={blog?.banner}
        alt={blog?.title}
        className="w-full h-[450px] object-cover mb-4 rounded-lg border border-border"
      />

      <div
        className="tracking-wide text-lg font-normal [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_code]:block [&_code]:text-base"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <div className="my-10 flex flex-col items-center">
        <div className="border border-border rounded-3xl p-3 w-full md:w-[70%]">
          <p className="text-base">
            Thank you for being a valued member of the Shothik AI Community!
            Explore our cutting-edge AI solutions for paraphrasing, generating
            human-like content, refining grammar, and summarizing information
            with precision and clarity.
          </p>
          <div className="text-primary mt-1 flex flex-row gap-1 items-center">
            <Link href="/pricing" className="hover:underline">Learn more about our products</Link>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
        <Card className="mt-5 p-4 w-full md:w-[70%]">
          <div className="flex flex-row gap-3 border-b border-border pb-2 flex-wrap">
            <h6 className="text-lg font-semibold">Still looking for an answer?</h6>
            <Link href="/blogs">
              <Button variant="outline">Search for more help</Button>
            </Link>
          </div>
          <div className="mt-4 flex flex-row gap-1 items-center justify-between flex-wrap gap-y-2">
            <div className="flex flex-row gap-1 items-center">
              <h6 className="mr-2 text-lg font-semibold">
                Was this helpful?
              </h6>
              <LikeDislike
                id={blog?._id}
                api="/blog"
                like={blog?.likes}
                dislike={blog?.dislikes}
                data={blog}
              />
            </div>

            <Separator
              orientation="vertical"
              className="hidden sm:block h-6"
            />

            <ShareIcons
              shareUrl={shareUrl}
              title={title}
              hashtags={hashtags}
              content={blog.content}
            />
          </div>
        </Card>
      </div>

      <CommentSection data={blog} comments={blog?.comments} />
    </div>
  );
}
