import { callApi } from "@/app/commonApi.js";

export async function saveApplicationSectionVisibility(
  user_id,
  bank_details_visibility,
  personal_vehicle_visibility
) {
  try {
    const response = await callApi("saveApplicationSectionVisibility", {
      user_id,
      bank_details_visibility,
      personal_vehicle_visibility
    });
    return response;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
