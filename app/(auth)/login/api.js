const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const HOST = process.env.NEXT_PUBLIC_API_HOST;
import Cookies from "react-cookies";
// Function to send OTP
export const IndividualLoginOTP = async (phoneNumber) => {
  try {
    const response = await fetch(`${BASE_URL}loginSendOtp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile_number: phoneNumber,
      }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    // console.error("Error while sending OTP:", error);
    return { success: false, error: "Network error, please try again." };
  }
};

export const IndividualVerifyOTP = async (phoneNumber, otp) => {
  try {

    const response = await fetch(`${BASE_URL}loginVerifyOtp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobile_number: phoneNumber, otp: otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "OTP verification failed");
    }

    Cookies.save("uid", data?.data?.user_id);
    Cookies.save("user_type_id", data?.data?.user_type_id);
    Cookies.save("name", btoa(data?.data?.udin_profile));
    Cookies.save("udin_token", data?.data?.udin_token);
    Cookies.save("pic", data?.data?.accounts[0]?.photo_base64);
    Cookies.save("user_type", data?.data?.accounts[0]?.account_type);
    Cookies.save("aadhaar_no", btoa(data?.data?.accounts[0]?.aadhaar_no));
    Cookies.save("address", btoa(data?.data?.accounts[0]?.address));
    Cookies.save("gender", btoa(data?.data?.accounts[0]?.gender));
    Cookies.save("dob", btoa(data?.data?.accounts[0]?.dob));
    localStorage.setItem("pic", data?.data?.accounts[0]?.photo_base64);

    return data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, error: error.message };
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

    return { success: true, data };
  } catch (error) {
    // console.error("❌ Error generating API token:", error);
    return { success: false, error: error.message };
  }
};
