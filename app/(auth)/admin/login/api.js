import Cookies from "react-cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const HOST = process.env.NEXT_PUBLIC_API_HOST;
export const AdminLogin = async (user_name, password) => {
  try {
    const response = await fetch(`${BASE_URL}loginAuthorityUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_name, password }),
    });

    const data = await response.json();
    const base64Credentials = btoa(`${user_name}:${password}`);
    Cookies.save("base64Credentials", base64Credentials);
    Cookies.save("authority_id", data?.data?.authority_user_type_id);
    Cookies.save("authority_user_id", data?.data?.authority_user_id);
    Cookies.save("authority_user_type_id", data?.data?.authority_user_type_id);
    Cookies.save(
      "authority_user_desigantion",
      data?.data?.authority_user_desigantion
    );
    Cookies.save("boundary_level_id", data?.data?.boundary_level_id);
    Cookies.save("boundary_id", data?.data?.boundary_id);
    Cookies.save("boundary_name", data?.data?.boundary_name);

    return data;
  } catch (error) {
    return null;
  }
};

export const GenerateApiToken = async (base64Credentials) => {
  try {
    const url = `${HOST}GIGWorkerRestAPI/api/auth/`;

    if (!base64Credentials) {
      throw new Error("No credentials found. Please verify OTP first.");
    }

    const response = await fetch(`${url}generateToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${base64Credentials}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Token generation failed");
    }

    // ✅ Fix: Correctly access the token inside "data"
    const accessToken = data?.data?.access_token;

    if (!accessToken) {
      throw new Error("API response does not contain an access_token.");
    }

    // ✅ Save the extracted token using Cookies.save()
    Cookies.save("apiToken", accessToken);

    // ✅ Verify if token is stored correctly
    const savedToken = Cookies.load("apiToken");

    if (!savedToken) {
      throw new Error("Failed to save API token in cookies.");
    }

    return data;
  } catch (error) {
    // console.error("❌ Error generating API token:", error);
    return { success: false, error: error.message };
  }
};
