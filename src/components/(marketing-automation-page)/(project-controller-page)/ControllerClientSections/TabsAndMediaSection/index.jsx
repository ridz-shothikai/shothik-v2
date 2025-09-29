import { cn } from "@/lib/utils";
import { Box, Button, Dialog, DialogContent, Tab, Tabs } from "@mui/material";
import {
  AlignVerticalDistributeCenter,
  ChartNoAxesCombined,
  Sparkles,
  Upload,
  UserCheck,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

const TabsAndMediaSection = ({ tab, onTabChange, adSetCount, mediasCount }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState(0);
  const [mediaItems, setMediaItems] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files) return;

    const newMediaItems = [];

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("image/") ? "image" : "video";

      newMediaItems.push({
        id: Math.random().toString(36).substr(2, 9),
        type,
        source: "uploaded",
        url,
        name: file.name,
      });
    });

    setMediaItems((prev) => [...prev, ...newMediaItems]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGenerateImages = async () => {
    // Mock API call for image generation
    try {
      // Replace with your actual API call
      const generatedImages = await generateImagesAPI();

      const newGeneratedItems = generatedImages.map((img, index) => ({
        id: `generated-${Date.now()}-${index}`,
        type: "image",
        source: "generated",
        url: img.url,
        name: `Generated Image ${index + 1}`,
      }));

      setMediaItems((prev) => [...prev, ...newGeneratedItems]);
    } catch (error) {
      console.error("Error generating images:", error);
    }
  };

  const handleRemoveMedia = (id) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredMediaItems = (section) => {
    switch (section) {
      case "all":
        return mediaItems.filter((item) => item.type === "image");
      case "uploaded-images":
        return mediaItems.filter(
          (item) => item.type === "image" && item.source === "uploaded",
        );
      case "generated-images":
        return mediaItems.filter(
          (item) => item.type === "image" && item.source === "generated",
        );
      case "videos":
        return mediaItems.filter((item) => item.type === "video");
      default:
        return mediaItems;
    }
  };

  // Mock API function - replace with your actual implementation
  const generateImagesAPI = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return mock generated images
    return [
      {
        url: "/images/marketing-automation/demo-product.png",
      },
      {
        url: "/images/marketing-automation/demo-product.png",
      },
      {
        url: "/images/marketing-automation/demo-product.png",
      },
    ];
  };

  return (
    <>
      <div className="flex flex-col items-center justify-between gap-2 lg:flex-row">
        <div className="flex h-12 w-full items-center justify-between gap-4 rounded-full border p-1 lg:w-auto">
          <div
            className={cn(
              "flex h-full cursor-pointer items-center gap-2 rounded-full px-2",
              {
                "bg-muted-foreground/15": tab === "performance-forecast",
              },
            )}
            onClick={() => onTabChange("performance-forecast")}
          >
            <ChartNoAxesCombined />
            <span>Performance Forecast</span>
          </div>
          <div
            className={cn(
              "flex h-full cursor-pointer items-center gap-2 rounded-full px-2",
              {
                "bg-muted-foreground/15": tab === "ad-sets",
              },
            )}
            onClick={() => onTabChange("ad-sets")}
          >
            <UserCheck />
            <span>Ad sets</span>
            <span className="flex size-6 items-center justify-center rounded-full bg-green-950 text-white">
              {adSetCount}
            </span>
          </div>
        </div>
        <Button
          size="large"
          className="w-full gap-2 !rounded-full lg:w-auto"
          variant="contained"
          onClick={() => setModalOpen(true)}
        >
          <AlignVerticalDistributeCenter />
          <span>images/videos</span>
          <span className="flex size-6 items-center justify-center rounded-full bg-white font-light text-black">
            {mediasCount}
          </span>
        </Button>
      </div>

      {/* Media Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            minHeight: "80vh",
          },
        }}
      >
        <DialogContent className="flex flex-col p-0">
          <div className="mt-4 mb-4 text-end">
            <button
              className="top-4 right-4 cursor-pointer"
              onClick={() => setModalOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          {/* Upload Section */}
          <div className="space-y-4 border-b">
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,video/*"
                multiple
                max={20}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-foreground hover:bg-primary/10 hover:border-primary w-full cursor-pointer justify-start space-y-2 rounded-xl border border-dashed p-6"
              >
                <h4 className="flex items-center justify-center gap-2 font-bold">
                  <Upload strokeWidth={3} className="size-6" /> Upload
                  Images/Videos
                </h4>
                <div className="text-center">
                  <strong className="text-muted-foreground block text-sm font-semibold">
                    Maximum 20 files per upload
                  </strong>
                  <p className="text-muted-foreground text-xs font-light">
                    Images (PNG, JPG, JPEG) 20 MB max. Videos (MP4, MOV) 200 MB
                    max
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Button
                variant="contained"
                onClick={handleGenerateImages}
                className="w-full justify-start gap-2"
              >
                <Sparkles strokeWidth={3} className="size-4" />
                Generate Images
              </Button>
            </div>
          </div>

          {/* Media Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeMediaTab}
              onChange={(_, newValue) => setActiveMediaTab(newValue)}
              variant="fullWidth"
            >
              <Tab label="All Images" />
              <Tab label="Imported Images" />
              <Tab label="Generated Images" />
              <Tab label="Videos" />
            </Tabs>
          </Box>

          {/* Media Grid */}
          <div className="flex-1 overflow-auto p-4">
            {filteredMediaItems().length === 0 ? (
              <div className="flex h-32 items-center justify-center text-gray-500">
                No media files found
              </div>
            ) : (
              <div className="flex overflow-x-auto">
                {filteredMediaItems().map((item) => (
                  <div
                    className="group aspect-square shrink-0 basis-1/2 overflow-hidden rounded-lg p-2 sm:basis-1/4 md:basis-1/6"
                    key={item.id}
                  >
                    <div className="relative size-full border">
                      {item.type === "video" ? (
                        <video
                          src={item.url}
                          className="h-full w-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      )}

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveMedia(item.id)}
                        className="absolute top-1 right-1 flex size-4 cursor-pointer items-center justify-center rounded-full bg-black/25 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="size-3" />
                      </button>

                      {/* Badge for generated images */}
                      {item.source === "generated" && (
                        <div className="bg-primary absolute top-1 left-1 flex size-4 items-center justify-center rounded-full text-xs text-white">
                          <Sparkles className="size-3" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="space-y-2 py-2">
              <p>All Images</p>
              <div></div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-end gap-4 border-t p-4">
            <Button
              variant="contained"
              onClick={() => {
                // Handle save logic here
                console.log("Save clicked");
                setModalOpen(false);
              }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#10b981",
                "&:hover": { backgroundColor: "#059669" },
              }}
              onClick={() => {
                // Handle save and assign logic here
                console.log("Save & Assign clicked");
                setModalOpen(false);
              }}
            >
              Save & Assign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TabsAndMediaSection;
