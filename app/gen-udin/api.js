import Cookies from "react-cookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = Cookies.load("apiToken");

export async function uploadSendOtp(aadhaar) {
  try {
    const udin_token = Cookies.load("udin_token");
    const response = await fetch(`${API_BASE_URL}uploadSendOtp`, {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        udin_token: udin_token,
        aadhaar_number: aadhaar,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

export async function uploadVerifyOtp(otp, transactionId) {
  try {
    const udin_token = Cookies.load("udin_token");
    const response = await fetch(`${API_BASE_URL}uploadVerifyOtp`, {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp: otp,
        transaction_id: transactionId, // Transaction ID from send OTP response
        udin_token: udin_token,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

export async function generateCertificateByApplicationID() {
  try {
    const udin_token = Cookies.load("udin_token");
    const uid = Cookies.load("uid");
    const aid = Cookies.load("aid");

    const response = await fetch(
      `${API_BASE_URL}generateCertificateByApplicationID`,
      {
        method: "POST",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: uid,
          application_id: aid,
          udin_token: udin_token,
        }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

export async function downloadUdinCerificate(udinNo) {
  try {
    const response = await fetch(`${API_BASE_URL}downloadUdinCertificate`, {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ udin: udinNo }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
