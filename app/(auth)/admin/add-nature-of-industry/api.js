import { callApi } from "@/app/commonApi.js";

export async function saveGigWorkerNatureIndustry(
  nature_industry_individual_id,
  nature_industry_id,
  nature_industry_name
) {
  try {
    const response = await callApi("saveGigWorkerNatureIndustry", {
      nature_industry_individual_id,
      nature_industry_id,
      nature_industry_name
    });
    return response;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
