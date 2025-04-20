import Cookies from "react-cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Send OTP to Aadhaar number
 */

export const AadhaarSendOtp = async (AuthPersonAadhaarNo) => {
  const url = `${BASE_URL}registrationSendOtp`;

  try {
    const body = JSON.stringify({ aadhaar_number: AuthPersonAadhaarNo });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    const result = await response.json();

    return result;
  } catch (error) {
    // Log the error if any occurs
    console.error("Error while sending OTP:", error);
    return { success: false, error: "Network error, please try again." };
  }
};

/**
 * Verify OTP with additional details
 */
export const AadhaarVerifyOtp = async (transId, OTP) => {
  try {
    const requestBody = {
      transaction_id: transId,
      otp: OTP,
    };

    const response = await fetch(`${BASE_URL}registrationVerifyOtp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error while verifying OTP:", error);
    return { success: false, error: "Network error, please try again." };
  }
};

export const individualRegister = async (
  fullName,
  transId,
  authPersonMobile,
  altMobileNo,
  maskedAadhaar
) => {
  try {
    const response = await fetch(`${BASE_URL}createIndividualProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        transaction_id: transId,
        phone_number: authPersonMobile,
        alternate_phone_number: altMobileNo,
        aadhaar_last_4_digits: maskedAadhaar,
      }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error while verifying OTP:", error);
    return { success: false, error: "Network error, please try again." };
  }
};
