import Cookies from "react-cookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const callApi = async (url, request_body) => {
  const TOKEN = Cookies.load("apiToken");

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: "POST",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request_body),
  });

  if (response.status === 401) {
    Cookies.remove("aadhaar_no");
    Cookies.remove("access_token");
    Cookies.remove("address");
    Cookies.remove("aid");
    Cookies.remove("apiToken");
    Cookies.remove("application_no");
    Cookies.remove("authority_id");
    Cookies.remove("authority_user_desigantion");
    Cookies.remove("authority_user_id");
    Cookies.remove("authority_user_type_id");
    Cookies.remove("base64Credentials");
    Cookies.remove("boundary_id");
    Cookies.remove("boundary_level_id");
    Cookies.remove("boundary_name");
    Cookies.remove("dob");
    Cookies.remove("gender");
    Cookies.remove("name");
    Cookies.remove("otpToken");
    Cookies.remove("step");
    Cookies.remove("udin_token");
    Cookies.remove("uid");
    Cookies.remove("user_type");
    Cookies.remove("user_type_id");
    window.location.href = "/session-expired";
  } else {
    return await response.json();
  }
};

export const callApiWithoutToken = async (url, request_body={}) => {

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: "POST",
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request_body),
  });

    return await response.json();
  
};

// export const postFileRequest = async (url, request_body) => {
//   try {
//     const TOKEN = Cookies.load("apiToken");
//     const formData = new FormData();

//     // Append all key/value pairs to formData
//     Object.keys(request_body).forEach((key) => {
//       formData.append(key, request_body[key]);
//     });

//     const requestOptions = {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${TOKEN}`,
//       },
//       body: formData,
//     };

//     const response = await fetch(`${API_BASE_URL}${url}`, requestOptions);

//     if (response.status === 401) {
//       window.location.href = "/session-expired";
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error uploading files:", error);
//     throw error;
//   }
// };

export const postFileRequest = async (url, request_body) => {
  try {
    const TOKEN = Cookies.load("apiToken");
    const formData = new FormData(); // Create a FormData object

    Object.keys(request_body).forEach((key) => {
      const value = request_body[key];

      // Check specifically for the file keys ('photo', 'signature')
      if (
        key === "photo" || 
        key === "signature" || 
        key === "pan_card_img" || 
        key === "driving_license_img" || 
        key === "bank_passbook_img" || 
        key === "aadhar_image"
      ) {
        // Check if the value is a File object with actual content
        if (value instanceof File && value.size > 0) {
          // It's a real file, append it normally with its name
          formData.append(key, value, value.name);
        } else {
          formData.append(key, new Blob([""]), ""); // <<< Key Change Here
        }
      } else {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      }
    }); ///

    const requestOptions = {
      method: "POST",
      headers: {
        // Content-Type is automatically set by the browser when using FormData
        Authorization: `Bearer ${TOKEN}`,
      },
      body: formData, // Send the populated FormData object
    };

    const response = await fetch(`${API_BASE_URL}${url}`, requestOptions);

    if (response.status === 401) {
      // ... (handle session expiry as before) ...
      window.location.href = "/session-expired";
      // Return null or throw an error to prevent further processing
      return null;
    }

    // Check for non-successful HTTP status codes
    if (!response.ok) {
      let errorData = null;
      try {
        // Try to parse potential JSON error body
        errorData = await response.json();
      } catch (parseError) {
        // Ignore if body isn't JSON or empty
      }
      console.error(
        `API Error (${response.status}) for ${url}:`,
        errorData || response.statusText
      );
      // Throw an error that includes API message if available
      throw new Error(errorData?.message || `HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Log the detailed error and re-throw it
    console.error(`Error during postFileRequest for ${url}:`, error);
    throw error; // Ensure the calling function (handleSubmitStep6) catches this
  }
};
export const logout = async () => {
  try {
    const HEADERS = {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    };

    const requestOptions = {
      method: "POST",
      headers: new Headers(HEADERS),
      body: JSON.stringify({}), // Empty body for logout request
      redirect: "follow",
    };

    const response = await fetch(`${API_BASE_URL}LogoutUser`, requestOptions);
  } catch (error) {
  } finally {
    Cookies.remove("aadhaar_no");
    Cookies.remove("access_token");
    Cookies.remove("address");
    Cookies.remove("aid");
    Cookies.remove("apiToken");
    Cookies.remove("application_no");
    Cookies.remove("authority_id");
    Cookies.remove("authority_user_desigantion");
    Cookies.remove("authority_user_id");
    Cookies.remove("authority_user_type_id");
    Cookies.remove("base64Credentials");
    Cookies.remove("boundary_id");
    Cookies.remove("boundary_level_id");
    Cookies.remove("boundary_name");
    Cookies.remove("dob");
    Cookies.remove("gender");
    Cookies.remove("name");
    Cookies.remove("otpToken");
    Cookies.remove("step");
    Cookies.remove("udin_token");
    Cookies.remove("uid");
    Cookies.remove("user_type");
    Cookies.remove("user_type_id");
    window.location.href = "/";
  }
};
