import { NextResponse } from "next/server";

<<<<<<< HEAD
export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_GEOLOCATION_KEY;
=======
export async function POST() {
  const apiKey = process.env.GOOGLE_GEOLOCATION_KEY; // Server-side env var
>>>>>>> dedb2bb747d65f0308eeb19397b266c82841989c

  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Geolocation API key is not configured" },
<<<<<<< HEAD
      { status: 500 }
=======
      { status: 500 },
>>>>>>> dedb2bb747d65f0308eeb19397b266c82841989c
    );
  }

  try {
<<<<<<< HEAD
    // Get the client's IP address from request headers
    const forwarded = request.headers.get("x-forwarded-for");
    const clientIp = forwarded
      ? forwarded.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "unknown";

    console.log("Client IP:", clientIp);

    // Call Google Geolocation API with client IP consideration
=======
>>>>>>> dedb2bb747d65f0308eeb19397b266c82841989c
    const geolocationResponse = await fetch(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
<<<<<<< HEAD
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
=======
        },
      },
    );

    if (!geolocationResponse.ok) {
      throw new Error("Invalid response from geolocation API");
>>>>>>> dedb2bb747d65f0308eeb19397b266c82841989c
    }

    const geolocationData = await geolocationResponse.json();

    if (!geolocationData.location) {
<<<<<<< HEAD
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
=======
      throw new Error("Invalid response from geolocation API");
    }

    const { lat, lng } = geolocationData.location;

    const geocodingResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
    );

    if (!geocodingResponse.ok) {
      throw new Error("Invalid response from geocoding API");
>>>>>>> dedb2bb747d65f0308eeb19397b266c82841989c
    }

    const geocodingData = await geocodingResponse.json();

<<<<<<< HEAD
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
=======
    if (!geocodingData.results) {
      throw new Error("Invalid response from geocoding API");
    }

    const countryResult = geocodingData.results.find((result) =>
      result.types.includes("country"),
    );

    if (!countryResult?.formatted_address) {
      throw new Error("Country not found in geocoding response");
    }

    const country = countryResult.formatted_address.toLowerCase();

    return NextResponse.json({ location: country });
  } catch (error) {
    console.error("Geolocation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
>>>>>>> dedb2bb747d65f0308eeb19397b266c82841989c
  }
}
