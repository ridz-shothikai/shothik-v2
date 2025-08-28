export const createSheetSimulationChatId = async (inputValue, router, sId) => {
    try {
      const response = await fetch(
        // "http://163.172.172.38:3005/api/chat/create_chat",
        `${process.env.NEXT_PUBLIC_API_URI_WITHOUT_PREFIX}/sheet/chat/create_chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("sheetai-token")}`,
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            name: `${inputValue} - ${new Date().toLocaleString()}`,
          }),
        }
      );
      if (!response.ok) {
        console.log("Failed to create sheet");
        return;
      }

      // We can do some operation here

      const result = await response.json();
      const chatId = result.chat_id || result.id || result._id;

      // Save active chat ID for connection polling
      sessionStorage.setItem("activeChatId", chatId);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push(`/agents/sheets/?id=${chatId}&s_id=${sId}`);
    } catch (error) {
        console.log("Failed to create chat");
    }
}