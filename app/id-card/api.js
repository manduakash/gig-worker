import Cookies from "react-cookies";
import { callApi } from "../commonApi";

export const getGigWorkerIDCardDetailsApi = async () => {
  try {
    const applicationID = Cookies.load("aid");
    return await callApi("getGigWorkerIDCardDetails", { application_id: applicationID});
  } catch (error) {
    console.error("Error submitting Work Related Info:", error);
    throw error;
  }
};