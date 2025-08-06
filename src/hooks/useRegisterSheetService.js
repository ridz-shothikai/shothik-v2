"use client";

import { useState, useEffect, useCallback } from "react";

const useSheetAIToken = (userEmail) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sheetAIToken, setSheetAIToken] = useState(null);

  const refreshSheetAIToken = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("No access token found");
        return null;
      }

      if (!userEmail) {
        setError("Email is required");
        return null;
      }

      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URI}/sheet/register-sheet-service`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            email: userEmail,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("sheetai-token", data.token);
        setSheetAIToken(data.token);
        return data.token;
      } else {
        throw new Error("No sheetai-token received from API");
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    const existingToken = localStorage.getItem("sheetai-token");

    if (existingToken) {
      setSheetAIToken(existingToken);
    } else {
      refreshSheetAIToken();
    }
  }, [refreshSheetAIToken]);

  return {
    sheetAIToken,
    isLoading,
    error,
    refreshSheetAIToken,
  };
};

export default useSheetAIToken;
