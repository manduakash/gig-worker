import { callApi } from "@/app/commonApi.js";
import Cookies from "react-cookies";

export async function getAuthorityMISReport(
  login_user_id,
  from_date,
  to_date,
  gender_id = 0,
  district_id = 0,
  subdivision_id = 0,
  block_id = 0,
  municipality_id = 0,
  pin_code = 0,
  grade_id = 0,
  occupation_type_id = 0,
  nature_of_industry_id = 0,
  organisation_id = "",
  age_group_id = 0,
  work_experience = 0
) {
  try {
    const response = await callApi("getAuthorityMISReport", {
      login_user_id,
      from_date,
      to_date,
      gender_id,
      district_id,
      subdivision_id,
      block_id,
      municipality_id,
      pin_code,
      grade_id,
      occupation_type_id,
      nature_of_industry_id,
      organisation_id,
      age_group_id,
      work_experience,
    });
    return response;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}
