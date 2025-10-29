"use client";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useState } from "react";
import useResponsive from "../../hooks/useResponsive";
import { useCategoryQuery } from "../../redux/api/blog/blogApiSlice";
import CategoryBtn from "./CategoryBtn";
import SideCard from "./SideCard";
import SideMenu from "./SideMenu";

const SideBar = ({ onCategoryClick, selectedCategory }) => {
  const [open, setOpen] = useState(false);
  const isMobile = useResponsive("down", "sm");
  const { data: categories, isLoading } = useCategoryQuery();

  const handleCategoryClick = (category) => {
    onCategoryClick(category._id);
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="w-full md:w-[250px]">
      <div className="w-[250px]">
        {isMobile ? (
          <>
            <Button variant="default" size="lg" onClick={handleOpen} className="w-full">
              Popular Topics
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent 
                showCloseButton={false}
                className="fixed bottom-0 left-0 right-0 top-auto max-w-full h-[80vh] rounded-t-2xl p-0 translate-x-0 translate-y-0 data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom border-t"
              >
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Header with close button */}
                  <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
                    <h6 className="text-lg font-semibold">All topics</h6>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClose}
                      className="transition-transform hover:scale-110"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Scrollable content */}
                  <div className="flex-1 overflow-y-auto overscroll-contain p-4">
                    <div className="space-y-1">
                      {categories?.data?.length ? (
                        categories.data.map((category) => (
                          <Button
                            key={category._id}
                            variant="ghost"
                            className="w-full justify-start text-left p-3 hover:bg-accent rounded-lg"
                            onClick={() => handleCategoryClick(category)}
                          >
                            {category.title}
                          </Button>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No Category found</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <SideMenu />
                    </div>

                    <div className="mt-6 mb-4 p-4 bg-muted rounded-lg">
                      <SideCard />
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <div className="flex flex-col gap-4 max-w-[500px]">
            <div className="bg-card rounded flex flex-col overflow-y-auto scrollbar-hide">
              <CategoryBtn
                selectedCategory={selectedCategory}
                category={{ title: "All topics", _id: "" }}
                handleCategoryClick={handleCategoryClick}
              />
              <div>
                {isLoading ? (
                  <>
                    <Skeleton className="w-full h-5 mb-2" />
                    <Skeleton className="w-full h-5 mb-2" />
                    <Skeleton className="w-full h-5 mb-2" />
                    <Skeleton className="w-full h-5 mb-2" />
                    <Skeleton className="w-full h-5 mb-2" />
                    <Skeleton className="w-full h-5 mb-2" />
                    <Skeleton className="w-full h-5 mb-2" />
                    <Skeleton className="w-full h-5 mb-2" />
                  </>
                ) : !categories?.data?.length ? (
                  <div>
                    <p className="text-muted-foreground">No Category found</p>
                  </div>
                ) : (
                  categories?.data?.map((category) => (
                    <CategoryBtn
                      selectedCategory={selectedCategory}
                      key={category._id}
                      category={category}
                      handleCategoryClick={handleCategoryClick}
                    />
                  ))
                )}
              </div>
              <SideMenu />
            </div>
            <Card className="p-2 rounded">
              <SideCard />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
