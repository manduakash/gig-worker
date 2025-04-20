import { callApi } from "@/app/commonApi.js";

export async function saveGigWorkerOccupationType(
  occupation_type_name
) {
  try {
    const response = await callApi("saveGigWorkerOccupationType", {
      "occupation_id": 0,
      "occupationtype_id": 0,
      "occupation_type_name": occupation_type_name
    });
    return response;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
