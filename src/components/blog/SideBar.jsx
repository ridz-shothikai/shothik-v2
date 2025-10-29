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
              <DialogContent className="fixed bottom-0 left-0 right-0 max-w-full h-[80vh] rounded-t-2xl p-0">
                <div className="flex flex-col justify-between items-start h-full p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="self-end transition-transform hover:scale-110"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <div className="w-full">
                    <h6 className="text-lg font-semibold mb-4">All topics</h6>
                    <div>
                      {categories?.data?.length ? (
                        categories.data.map((category) => (
                          <Button
                            key={category._id}
                            variant="ghost"
                            className="w-full justify-start text-left p-2 hover:bg-accent"
                            onClick={() => handleCategoryClick(category)}
                          >
                            {category.title}
                          </Button>
                        ))
                      ) : (
                        <div>
                          <p className="text-muted-foreground">No Category found</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <SideMenu />

                  <div className="mt-4 p-2 bg-muted rounded w-full">
                    <SideCard />
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
