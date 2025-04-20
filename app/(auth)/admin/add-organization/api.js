import { callApi } from "@/app/commonApi";

export async function saveGigWorkerOrganization(
  user_id,
  nature_of_industry_id,
  organization_name
) {
  try {
    const response = await callApi("saveGigWorkerOrganization", {
        "organization_individual_id": user_id,
        "organization_nature__industryid": nature_of_industry_id,
        "organization_id": 0,
        "organization_name": organization_name
    });
    return response;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
