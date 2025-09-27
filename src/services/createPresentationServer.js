export async function createPresentationServer({ message, file_urls, token }) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URI}/presentation/init`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, file_urls }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      console.log(data.message || "Failed to create presentation");
    }

    return {
      success: true,
      presentationId: data?.presentationId || data?.presentation_id,
    };
  } catch (err) {
    console.error("Server action failed:", err);
    return { success: false, error: err.message || "Something went wrong" };
  }
}
