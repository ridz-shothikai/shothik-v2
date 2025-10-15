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
    // Get the client's IP address from request headers
    const forwarded = request.headers.get("x-forwarded-for");
    const clientIp = forwarded
      ? forwarded.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "unknown";

    console.log("Client IP:", clientIp);

    // Call Google Geolocation API with client IP consideration
    const geolocationResponse = await fetch(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Forward the client's IP so Google can use it
          "X-Forwarded-For": clientIp !== "unknown" ? clientIp : "",
        },
        body: JSON.stringify({
          considerIp: true,
        }),
      }
    );

    if (!geolocationResponse.ok) {
      const errorData = await geolocationResponse.json();
      console.error("Geolocation API error:", errorData);
      throw new Error(errorData.error?.message || "Failed to get geolocation");
    }

    const geolocationData = await geolocationResponse.json();

    if (!geolocationData.location) {
      throw new Error("No location data received from geolocation API");
    }

    const { lat, lng } = geolocationData.location;
    const accuracy = geolocationData.accuracy;

    console.log("Geolocation response:", { lat, lng, accuracy });

    // Use Geocoding API to get detailed address
    const geocodingResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );

    if (!geocodingResponse.ok) {
      throw new Error("Failed to fetch geocoding data");
    }

    const geocodingData = await geocodingResponse.json();

    if (
      geocodingData.status !== "OK" ||
      !geocodingData.results ||
      geocodingData.results.length === 0
    ) {
      console.error("Geocoding error:", geocodingData);
      throw new Error(`Geocoding failed: ${geocodingData.status}`);
    }

    // Extract detailed location information
    const detailedAddress = geocodingData.results[0];
    const addressComponents = detailedAddress.address_components;

    const locationData = {
      formattedAddress: detailedAddress.formatted_address,
      latitude: lat,
      longitude: lng,
      accuracy: accuracy, // In meters
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

    return NextResponse.json({ location: locationData.country.toLowerCase() });
  } catch (error) {
    console.error("Geolocation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
