import Cookies from "react-cookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const TOKEN = Cookies.load("apiToken");

export async function getApplicationInfoByStatusIDAuthority(
  status_id,
  from_date,
  to_date,
  authority_user_id,
  boundary_level_id,
  boundary_id
) {
  try {
    const aid = Cookies.load("aid"); // Application ID from cookies

    const response = await fetch(
      `${API_BASE_URL}getApplicationInfoByStatusIDAuthority`,
      {
        method: "POST",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status_id: status_id,
          application_id: 0,
          from_date: from_date,
          to_date: to_date,
          authority_user_id: authority_user_id,
          boundary_level_id: boundary_level_id,
          boundary_id: boundary_id,
        }),
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { status: 4, message: "Error fetching data" };
  }
}
