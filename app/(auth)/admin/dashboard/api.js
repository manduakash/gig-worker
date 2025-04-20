import { callApi } from "@/app/commonApi.js";
import Cookies from "react-cookies";
const TOKEN = Cookies.load("apiToken");

if (!TOKEN) {
  console.warn("Warning: API token not found in cookies");
}
export async function AdminDashboardCount(
  AuthorityUserId,
  BoundaryLevelID,
  BoundaryID
) {
  try {
    const response = await callApi("getAuthorityDashboard", {
      AuthorityUserId,
      BoundaryLevelID,
      BoundaryID,
    });
    return response;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
