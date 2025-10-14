import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_GEOLOCATION_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Geolocation API key is not configured" },
      { status: 500 }
    );
  }

  try {
    // Get coordinates from request body (sent from client)
    const body = await request.json();
    const { latitude, longitude } = body;

    // If no coordinates provided, return error
    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    // Use Google Geocoding API to get detailed address
    const geocodingResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );

    if (!geocodingResponse.ok) {
      throw new Error("Invalid response from geocoding API");
    }

    const geocodingData = await geocodingResponse.json();

    if (!geocodingData.results || geocodingData.results.length === 0) {
      throw new Error("No results found for the given coordinates");
    }

    // Get the most detailed address (first result)
    const detailedAddress = geocodingData.results[0];

    // Extract specific components
    const addressComponents = detailedAddress.address_components;

    const locationData = {
      formattedAddress: detailedAddress.formatted_address,
      latitude,
      longitude,
      // Extract specific address parts
      street:
        addressComponents.find((c) => c.types.includes("route"))?.long_name ||
        null,
      city:
        addressComponents.find((c) => c.types.includes("locality"))
          ?.long_name ||
        addressComponents.find((c) =>
          c.types.includes("administrative_area_level_2")
        )?.long_name ||
        null,
      state:
        addressComponents.find((c) =>
          c.types.includes("administrative_area_level_1")
        )?.long_name || null,
      country:
        addressComponents.find((c) => c.types.includes("country"))?.long_name ||
        null,
      countryCode:
        addressComponents.find((c) => c.types.includes("country"))
          ?.short_name || null,
      postalCode:
        addressComponents.find((c) => c.types.includes("postal_code"))
          ?.long_name || null,
    };

    return NextResponse.json({ location: locationData.country });
  } catch (error) {
    console.error("Geolocation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
