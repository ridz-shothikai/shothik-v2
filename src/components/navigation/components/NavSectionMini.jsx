import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronUp, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import NavList from "./NavList";

const MAX_VISIBLE_ITEMS = 6;

function NavSectionMini({ data, user }) {
  const [showAll, setShowAll] = useState(false);

  // Filter out groups based on user roles
  const filteredData = data.filter(
    (group) => !group.roles || group.roles.includes(user?.package),
  );

  // Get all eligible items
  const eligibleItems = filteredData.flatMap((group) => group.items);

  console.log(eligibleItems, "eligibleItems");

  const shouldShowMoreButton = eligibleItems.length > MAX_VISIBLE_ITEMS;

  console.log(shouldShowMoreButton, "should show more button");

  const handleToggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  // Calculate how many items to show from each group
  let itemsRenderedSoFar = 0;

  return (
    <div className="flex flex-col items-center">
      {filteredData.map((group, groupIndex) => {
        const itemsToRender = [];

        for (const item of group.items) {
          if (showAll) {
            itemsToRender.push(item);
          } else if (itemsRenderedSoFar < MAX_VISIBLE_ITEMS) {
            itemsToRender.push(item);
            itemsRenderedSoFar++;
          }
        }

        if (itemsToRender.length === 0) {
          return null;
        }

        const isLastGroup = groupIndex === filteredData.length - 1;
        const shouldShowMoreHere =
          !showAll &&
          shouldShowMoreButton &&
          itemsRenderedSoFar >= MAX_VISIBLE_ITEMS &&
          isLastGroup;

        return (
          <div key={groupIndex} className="flex flex-col items-center px-2">
            {itemsToRender.map((list) => (
              <NavList
                key={list.title + list.path}
                data={list}
                layout="compact"
              />
            ))}

            {/* Show "More" button after the last visible item */}
            {shouldShowMoreHere && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleShowAll}
                className="my-1"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            )}

            {/* Show "Less" button when showing all and this is the last group */}
            {showAll && shouldShowMoreButton && isLastGroup && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleShowAll}
                className="my-1"
              >
                <ChevronUp className="h-5 w-5" />
              </Button>
            )}

            {/* Show divider between groups (but not after the last group) */}
            {!isLastGroup && (
              <div className="flex items-center">
                <Separator className="my-2 w-6" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default NavSectionMini;
