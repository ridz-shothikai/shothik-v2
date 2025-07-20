export async function authenticateToSheetService (email) {
    try {
        // First, try to register the user (this might fail if user exists, which is fine)
        try {
          await fetch(
            "https://sheetai.pixigenai.com/api/auth/register_user",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: email.split("@")[0], // Use email prefix as name
                email: email,
                password: "secure_password", // You might want to generate a random password
              }),
            }
          );
        } catch (registerError) {
          // Ignore registration errors - user might already exist
          console.log("Registration skipped (user might already exist)");
        }

        // Login to get the token
        const loginResponse = await fetch(
          "https://sheetai.pixigenai.com/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              password: "secure_password", // Same password as registration
            }),
          }
        );

        if (!loginResponse.ok) {
          throw new Error(`Login failed: ${loginResponse.status}`);
        }

        const loginData = await loginResponse.json();

        if (loginData.token || loginData.access_token) {
          const token = loginData.token || loginData.access_token;
          localStorage.setItem("sheetai-token", token);
          return token;
        } else {
          throw new Error("No token received from login response");
        }
      } catch (error) {
        console.error("Sheet AI authentication error:", error);
        throw new Error(`Authentication failed: ${error.message}`);
      };
}