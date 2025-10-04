import { Button } from "@mui/material";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Earth,
  Heart,
  MessageCircle,
  Music,
  RefreshCcw,
  Send,
  Share,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const AdPreviewSection = ({ project, selectedPlatform, onPlatformChange }) => {
  const platforms = ["facebook", "instagram", "tiktok"];
  const [openMediaModal, setOpenMediaModal] = useState(false);

  const post = {
    add: "1",
    name: "Classic Chronograph Wristwatch",
    url: "www.example.com/product/123",
    type: "image",
    image: "/images/marketing-automation/demo-product.png",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente eaque unde atque incidunt quod nesciunt dignissimos excepturi dolor deserunt! Exercitationem possimus, ipsam ut provident recusandae inventore fuga corporis consequatur mollitia!",
  };

  const handlePrevious = () => {
    const currentIndex = platforms.indexOf(selectedPlatform);
    const prevIndex = (currentIndex - 1 + platforms.length) % platforms.length;
    onPlatformChange(platforms[prevIndex]);
  };

  const handleNext = () => {
    const currentIndex = platforms.indexOf(selectedPlatform);
    const nextIndex = (currentIndex + 1) % platforms.length;
    onPlatformChange(platforms[nextIndex]);
  };

  return (
    <div className="bg-muted space-y-4 self-stretch rounded-xl p-4">
      <div className="relative">
        {/* Arrow Navigation */}
        <button
          onClick={handlePrevious}
          className="bg-card/80 hover:bg-card absolute top-1/2 left-2 z-10 -translate-y-1/2 cursor-pointer rounded-full p-2 shadow-md transition-all"
        >
          <ChevronLeft className="size-5" />
        </button>

        <button
          onClick={handleNext}
          className="bg-card/80 hover:bg-card absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer rounded-full p-2 shadow-md transition-all"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Platform Preview */}
        <div className="flex justify-center">
          {selectedPlatform === "facebook" && (
            <AdFaceBookPreview
              post={post}
              openMediaModal={openMediaModal}
              setOpenMediaModal={setOpenMediaModal}
            />
          )}
          {selectedPlatform === "instagram" && (
            <AdInstagramPreview
              post={post}
              openMediaModal={openMediaModal}
              setOpenMediaModal={setOpenMediaModal}
            />
          )}
          {selectedPlatform === "tiktok" && (
            <AdTikTokPreview
              post={post}
              openMediaModal={openMediaModal}
              setOpenMediaModal={setOpenMediaModal}
            />
          )}
        </div>
      </div>

      <PlatformSelector
        platforms={platforms}
        selectedPlatform={selectedPlatform}
        onPlatformChange={onPlatformChange}
      />
    </div>
  );
};

export default AdPreviewSection;

const AdFaceBookPreview = ({ post, openMediaModal, setOpenMediaModal }) => (
  <div className="bg-card text-card-foreground mx-auto flex aspect-[9/16] w-80 flex-col space-y-2 rounded-xl">
    <div className="p-4">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-full border">
          <Image
            src={"/images/marketing-automation/user.png"}
            alt="User avatar"
            width={20}
            height={20}
          />
        </div>
        <div className="flex flex-col space-y-1 leading-none">
          <strong className="block text-sm">John Doe</strong>
          <div className="-mt-1 flex items-center gap-2 text-xs">
            <small>Sponsored</small> <Earth className="inline-block size-2" />
          </div>
        </div>
      </div>
      <p className="mt-4 line-clamp-2 text-sm">{post?.text}</p>
    </div>
    <div className="group relative flex-1 overflow-hidden">
      {post?.type === "image" && post?.image && (
        <Image
          className="size-full object-cover"
          src={post?.image}
          alt="Product preview"
          width={400}
          height={400}
        />
      )}
      <div
        onClick={() => setOpenMediaModal(true)}
        className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/25 text-white opacity-0 transition-all duration-300 group-hover:opacity-100"
      >
        <RefreshCcw strokeWidth={1.5} className="size-16" />
      </div>
    </div>
    <div className="text flex justify-between p-4">
      <div className="max-w-1/2">
        <div className="line-clamp-1 text-xs">{post?.url}</div>
        <div className="line-clamp-1 text-sm font-bold">{post?.name}</div>
      </div>
      <a
        href={post?.url}
        className="bg-muted flex cursor-pointer items-center rounded-md border px-2"
      >
        <span className="text-xs">Shop Now</span>
      </a>
    </div>
    {/* Facebook Reactions and Comments */}
    <div className="space-y-2 px-4 py-2">
      {/* Reaction Summary */}
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="flex size-4 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
              👍
            </div>
            <div className="flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              ❤️
            </div>
            <div className="flex size-4 items-center justify-center rounded-full bg-yellow-400 text-xs text-white">
              😊
            </div>
          </div>
          <span>1.2K</span>
        </div>
        <div className="flex gap-3">
          <span>45 comments</span>
          <span>23 shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-b py-1">
        <div className="flex items-center justify-around">
          <button className="text-muted-foreground flex items-center gap-1 rounded px-3 py-2">
            <Heart className="size-4" />
            <span className="text-sm font-medium">Like</span>
          </button>
          <button className="text-muted-foreground flex items-center gap-1 rounded px-3 py-2">
            <MessageCircle className="size-4" />
            <span className="text-sm font-medium">Comment</span>
          </button>
          <button className="text-muted-foreground flex items-center gap-1 rounded px-3 py-2">
            <Share className="size-4" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const AdInstagramPreview = ({ post, openMediaModal, setOpenMediaModal }) => (
  <div className="bg-card text-card-foreground mx-auto flex aspect-[9/16] w-80 flex-col">
    {/* Instagram Header */}
    <div className="from-card/50 flex items-center justify-between bg-gradient-to-b to-transparent p-3">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
          <div className="flex size-full items-center justify-center rounded-full bg-black">
            <Image
              src={"/images/marketing-automation/user.png"}
              alt="User avatar"
              width={20}
              height={20}
              className="rounded-full"
            />
          </div>
        </div>
        <div className="flex flex-col space-y-1 leading-none">
          <strong className="block text-sm">John Doe</strong>
          <div className="-mt-1 flex items-center gap-2 text-xs">
            <small>Sponsored</small> <Earth className="inline-block size-2" />
          </div>
        </div>
      </div>
      <div>⋯</div>
    </div>

    {/* Instagram Content */}
    <div className="group relative flex-1 overflow-hidden">
      {post?.type === "image" && post?.image && (
        <Image
          className="size-full object-cover"
          src={post?.image}
          alt="Product preview"
          width={400}
          height={600}
        />
      )}
      <div
        onClick={() => setOpenMediaModal(true)}
        className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/25 text-white opacity-0 transition-all duration-300 group-hover:opacity-100"
      >
        <RefreshCcw strokeWidth={1.5} className="size-16" />
      </div>
    </div>

    {/* Instagram Actions */}
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Heart className="size-6" />
          <MessageCircle className="size-6" />
          <Send className="size-6" />
        </div>
        <Bookmark className="size-6" />
      </div>

      <div>
        <div className="mb-1 text-sm font-semibold">1,234 likes</div>
        <div className="text-sm">
          <span className="font-semibold">john_doe</span>{" "}
          {post?.text?.slice(0, 100)}...
        </div>
        <div className="text-muted-foreground/80 mt-1 text-xs">
          View all comments
        </div>
      </div>

      {/* Instagram CTA */}
      <div className="border-muted-foreground rounded-lg border p-3">
        <div className="text-muted-foreground/80 text-xs">{post?.url}</div>
        <div className="mb-1 text-sm font-bold">{post?.name}</div>
        <a
          href={post?.url}
          className="mt-2 rounded bg-blue-500 px-4 py-1 text-sm font-semibold text-white"
        >
          Shop Now
        </a>
      </div>
    </div>
  </div>
);

const AdTikTokPreview = ({ post, openMediaModal, setOpenMediaModal }) => (
  <div className="relative mx-auto flex aspect-[9/16] w-80 flex-col overflow-hidden bg-black text-white">
    {/* TikTok Content */}
    <div className="group relative flex-1">
      {post?.type === "image" && post?.image && (
        <Image
          className="size-full object-cover"
          src={post?.image}
          alt="Product preview"
          width={400}
          height={700}
        />
      )}
      <div
        onClick={() => setOpenMediaModal(true)}
        className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/25 text-white opacity-0 transition-all duration-300 group-hover:opacity-100"
      >
        <RefreshCcw strokeWidth={1.5} className="size-16" />
      </div>
    </div>

    {/* TikTok Right Sidebar */}
    <div className="absolute right-3 bottom-20 flex flex-col items-center space-y-6">
      <div className="flex flex-col items-center">
        <div className="size-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
          <div className="flex size-full items-center justify-center rounded-full bg-black">
            <Image
              src={"/images/marketing-automation/user.png"}
              alt="User avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
        </div>
        <div className="-mt-3 flex size-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          +
        </div>
      </div>

      <div className="flex flex-col items-center space-y-1">
        <Heart className="size-8" />
        <span className="text-xs">12.3K</span>
      </div>

      <div className="flex flex-col items-center space-y-1">
        <MessageCircle className="size-8" />
        <span className="text-xs">2,847</span>
      </div>

      <div className="flex flex-col items-center space-y-1">
        <Share className="size-8" />
        <span className="text-xs">Share</span>
      </div>

      <div className="flex size-8 items-center justify-center rounded-lg bg-gray-700">
        <Music className="size-5" />
      </div>
    </div>

    {/* TikTok Bottom Info */}
    <div className="absolute right-16 bottom-4 left-3 space-y-2">
      <div>
        <div className="text-sm font-semibold">@john_doe</div>
        <div className="text-sm">{post?.text?.slice(0, 80)}...</div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <Music className="size-3" />
        <span>Original sound - john_doe</span>
      </div>

      {/* TikTok CTA */}
      <div className="mt-2 rounded-lg bg-white/20 p-2 backdrop-blur">
        <div className="text-xs opacity-80">{post?.url}</div>
        <div className="mb-1 text-sm font-bold">{post?.name}</div>
        <a
          href={post?.url}
          className="mt-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-black"
        >
          Shop Now
        </a>
      </div>
    </div>
  </div>
);

const PlatformSelector = ({
  platforms,
  selectedPlatform,
  onPlatformChange,
}) => (
  <div className="space-y-2">
    <strong className="block text-center">Switch Platform</strong>
    <div className="flex gap-2 space-y-2">
      {platforms.map((platform) => (
        <Button
          onClick={() => onPlatformChange(platform)}
          variant={selectedPlatform === platform ? "contained" : "text"}
          key={platform}
          className="flex-1 gap-2 capitalize"
        >
          {platform}
        </Button>
      ))}
    </div>
  </div>
);
