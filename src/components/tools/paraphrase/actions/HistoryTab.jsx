// HistoryTab.jsx
import { Delete, ExpandLess, ExpandMore, Refresh } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveHistory,
  setHistories,
  setHistoryGroups,
} from "../../../../redux/slice/paraphraseHistorySlice";

const HistoryTab = ({ onClose }) => {
  const dispatch = useDispatch();

  const [expandedEntries, setExpandedEntries] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const { accessToken } = useSelector((state) => state.auth);

  const { activeHistory, histories, historyGroups } = useSelector(
    (state) => state.paraphraseHistory,
  );

  const API_BASE = process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX + "/p-v2/api";

  // const API_BASE = "http://localhost:3050/api";

  const historyGroupsByPeriod = (histories) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const groups = histories.reduce((acc, entry) => {
      const d = new Date(entry.timestamp);
      const m = d.getMonth();
      const y = d.getFullYear();
      const monthName = d.toLocaleString("default", { month: "long" });
      const key =
        m === currentMonth && y === currentYear
          ? "This Month"
          : `${monthName} ${y}`;

      if (!acc[key]) acc[key] = [];
      acc[key].push({
        _id: entry._id,
        text: entry.text,
        time: entry.timestamp,
      });
      return acc;
    }, {});

    const result = [];

    if (groups["This Month"]) {
      result.push({ period: "This Month", history: groups["This Month"] });
      delete groups["This Month"];
    }
    Object.keys(groups)
      .sort((a, b) => {
        const [ma, ya] = a.split(" ");
        const [mb, yb] = b.split(" ");
        const da = new Date(`${ma} 1, ${ya}`);
        const db = new Date(`${mb} 1, ${yb}`);
        return db - da;
      })
      .forEach((key) => {
        result.push({ period: key, history: groups[key] });
      });

    return result;
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      dispatch(setHistories(data));
      const groups = historyGroupsByPeriod(data);
      dispatch(setHistoryGroups(groups));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to clear all history?")) return;
    try {
      const res = await fetch(`${API_BASE}/history`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
      if (!res.ok) throw new Error("Failed to delete history");
      dispatch(setHistories([]));
      dispatch(setHistoryGroups([]));
      dispatch(setActiveHistory(null));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      const res = await fetch(`${API_BASE}/history/${entryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
      if (!res.ok) throw new Error("Failed to delete history entry");

      const updatedHistories = histories.filter(
        (history) => history._id !== entryId,
      );
      dispatch(setHistories(updatedHistories));
      const groups = historyGroupsByPeriod(updatedHistories);
      dispatch(setHistoryGroups(groups));

      if (activeHistory && activeHistory._id === entryId) {
        dispatch(setActiveHistory(null));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetActiveHistory = (entry) => {
    dispatch(setActiveHistory(entry));
    onClose();
  };

  // useEffect(() => {
  //   if (!accessToken) return;
  //   fetchHistory();
  // }, [accessToken]);

  useEffect(() => {
    if (!(historyGroups?.length > 0)) return;
    const init = {};
    historyGroups?.forEach((group) => {
      init[group?.period] = true;
    });
    setExpandedGroups(init);
  }, [historyGroups]);

  const toggleGroup = (period) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [period]: !prev[period],
    }));
  };

  const toggleEntryExpansion = (period, index) => {
    setExpandedEntries((prev) => ({
      ...prev,
      [`${period}-${index}`]: !prev[`${period}-${index}`],
    }));
  };

  return (
    <div id="history_tab" className="px-2 py-1">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between px-2">
        <h6 className="text-lg font-bold">History</h6>
        {accessToken && (
          <div className="flex gap-1">
            <IconButton
              size="small"
              onClick={fetchHistory}
              className="min-w-0 p-1"
            >
              <Refresh className="text-sm" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleDeleteAll}
              className="min-w-0 p-1"
            >
              <Delete className="text-sm" />
            </IconButton>
          </div>
        )}
      </div>

      {/* Period groups */}
      {historyGroups?.length === 0 ? (
        <p className="text-muted-foreground px-2 text-sm">
          No history entries.
        </p>
      ) : (
        historyGroups?.map(({ period, history }) => (
          <div key={period} className="mb-2">
            <div
              onClick={() => toggleGroup(period)}
              className="mb-1 flex cursor-pointer items-center justify-between px-2"
            >
              <span className="text-muted-foreground text-sm">{period}</span>
              {expandedGroups[period] ? (
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
            {expandedGroups[period] &&
              history.map((entry, i) => (
                <div
                  key={i}
                  onClick={() => handleSetActiveHistory(entry)}
                  className={`cursor-pointer px-2 pt-1 pb-1 transition-colors ${i < history?.length - 1 ? "border-border border-b" : ""} ${entry?._id === activeHistory?._id ? "bg-primary/10" : "bg-transparent"} `}
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
                        handleDeleteEntry(entry._id);
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
};

// HELPER FUNCTION
function truncateText(text, limit) {
  const words = text?.split(" ");
  if (words?.length > limit) {
    return words?.slice(0, limit).join(" ") + "...";
  }
  return text;
}

export default HistoryTab;
