import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, IconButton, List, Stack } from "@mui/material";
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
    <Stack alignItems="center">
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
          <List
            key={groupIndex}
            disablePadding
            sx={{
              px: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {itemsToRender.map((list) => (
              <NavList key={list.title + list.path} data={list} layout="mini" />
            ))}

            {/* Show "More" button after the last visible item */}
            {shouldShowMoreHere && (
              <IconButton onClick={handleToggleShowAll} sx={{ my: 1 }}>
                <MoreHorizIcon />
              </IconButton>
            )}

            {/* Show "Less" button when showing all and this is the last group */}
            {showAll && shouldShowMoreButton && isLastGroup && (
              <IconButton onClick={handleToggleShowAll} sx={{ my: 1 }}>
                <ExpandLessIcon />
              </IconButton>
            )}

            {/* Show divider between groups (but not after the last group) */}
            {!isLastGroup && (
              <Stack alignItems="center">
                <Box
                  sx={{
                    width: 24,
                    height: "1px",
                    bgcolor: "divider",
                    my: "8px !important",
                  }}
                />
              </Stack>
            )}
          </List>
        );
      })}
    </Stack>
  );
}

export default NavSectionMini;
