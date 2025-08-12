export const createSheetSimulationChatId = async (inputValue, router, sId) => {
    try {
      const response = await fetch(
        "https://sheetai.pixigenai.com/api/chat/create_chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("sheetai-token")}`,
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