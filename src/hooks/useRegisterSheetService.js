"use client";

import { useState, useEffect } from "react";

const useSheetAIToken = (userEmail) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sheetAIToken, setSheetAIToken] = useState(null);

  useEffect(() => {
    const checkAndFetchToken = async () => {
      try {
        // Check if sheetai-token exists in localStorage
        const existingSheetAIToken = localStorage.getItem("sheetai-token");
        const accessToken = localStorage.getItem("accessToken");

        if (existingSheetAIToken) {
          // Token already exists, set it to state
          setSheetAIToken(existingSheetAIToken);
          return;
        }

        if (!accessToken) {
          // No access token available, can't proceed
          setError("No access token found");
          return;
        }

        if (!userEmail) {
          // No email provided, can't make API call
          setError("Email is required");
          return;
        }

        // Need to fetch sheetai-token
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

        // console.log(data, "sheet register hook data");

        if (data.access_token) {
          // Store the new token in localStorage
          localStorage.setItem("sheetai-token", data.access_token);
          setSheetAIToken(data.access_token);
        } else {
          throw new Error("No sheetai-token received from API");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkAndFetchToken();
  }, [userEmail]);

  return {
    sheetAIToken,
    isLoading,
    error,
  };
};

export default useSheetAIToken;
