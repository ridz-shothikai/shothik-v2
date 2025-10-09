"use client";

import { Delete, ExpandLess, ExpandMore, Refresh } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { historyGroupsByPeriod } from "../../../utils/historyGroupsByPeriod";
import { truncateText } from "../paraphrase/actions/HistoryTab";

export default function GPTHistoryTab({
  setHumanizeInput,
  onClose,
  allHumanizeHistory,
  refetchHistory,
}) {
  const [expandedEntries, setExpandedEntries] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const { accessToken } = useSelector((state) => state.auth);

  // const { data, refetch } = useGetAllHistoryQuery();
  // console.log(data, "data");
  const groupedData = historyGroupsByPeriod(allHumanizeHistory);
  console.log(groupedData, "grouped data");

  const toggleEntryExpansion = (period, index) => {
    setExpandedEntries((prev) => ({
      ...prev,
      [`${period}-${index}`]: !prev?.[`${period}-${index}`],
    }));
  };

  const toggleGroup = (period) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [period]: !prev?.[period],
    }));
  };

  // INFO: This effect is responsible for auto opening|expanding the curent month toggle to see the history data
  useEffect(() => {
    if (groupedData && groupedData.length > 0) {
      const thisMonthGroup = groupedData.find(
        (group) => group.period === "This Month",
      );
      if (thisMonthGroup) {
        setExpandedGroups((prev) => ({
          ...prev,
          "This Month": true,
        }));
      }
    }
  }, []); // no need for dependencies

  return (
    <div id="history_tab" className="px-2 py-1">
      {/* header */}
      <div className="mb-2 flex items-center justify-between px-2">
        <h6 className="text-lg font-bold">History</h6>
        {accessToken && (
          <div className="flex gap-1">
            <IconButton
              size="small"
              onClick={refetchHistory}
              className="min-w-0 p-1"
            >
              <Refresh className="text-sm" />
            </IconButton>
            <IconButton
              size="small"
              // onClick={handleDeleteAll} TODO: implement
              className="min-w-0 p-1"
            >
              <Delete className="text-sm" />
            </IconButton>
          </div>
        )}
      </div>

      {/* Period groups */}
      {groupedData?.length === 0 ? (
        <p className="text-muted-foreground px-2 text-sm">
          No history entries.
        </p>
      ) : (
        groupedData?.map(({ period, history }) => (
          <div key={period} className="mb-2">
            <div
              onClick={() => toggleGroup(period)}
              className="mb-1 flex cursor-pointer items-center justify-between px-2"
            >
              <span className="text-muted-foreground text-sm">{period}</span>
              {expandedGroups?.[period] ? (
                <IconButton size="small" className="min-w-0 p-1">
                  <ExpandLess className="text-sm" />
                </IconButton>
              ) : (
                <IconButton size="small" className="min-w-0 p-1">
                  <ExpandMore className="text-sm" />
                </IconButton>
              )}
            </div>
            <div className="border-border border-b" />
            {expandedGroups?.[period] &&
              history?.map((entry, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setHumanizeInput(entry.text);
                    onClose(); // close the settings drawer
                  }}
                  // className={`cursor-pointer px-2 pt-1 pb-1 transition-colors ${i < history?.length - 1 ? "border-border border-b" : ""} ${entry?._id === activeHistory?._id ? "bg-primary/10" : "bg-transparent"} `}
                  className={`border-border cursor-pointer border-b px-2 pt-1 pb-1 transition-colors`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                      {new Date(entry.time).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        // handleDeleteEntry(entry._id);
                      }}
                      className="text-error min-w-0 p-1"
                    >
                      <Delete className="text-sm" />
                    </IconButton>
                  </div>
                  <p className="text-sm">
                    {expandedEntries?.[`${period}-${i}`]
                      ? entry?.text
                      : truncateText(entry?.text, 20)}
                    {entry?.text?.split(" ")?.length > 20 && (
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleEntryExpansion(period, i);
                        }}
                        className="ml-1 normal-case"
                      >
                        {expandedEntries?.[`${period}-${i}`]
                          ? "Read Less"
                          : "Read More"}
                      </Button>
                    )}
                  </p>
                </div>
              ))}
          </div>
        ))
      )}
    </div>
  );
}
