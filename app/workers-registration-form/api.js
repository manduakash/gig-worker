import Cookies from "react-cookies";
import { callApi, callApiWithoutToken, postFileRequest } from "../commonApi";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const TOKEN = Cookies.load("apiToken");
const userID = Cookies.load("uid");

export const fetchBoundaryDetailsAPI = async (
  boundary_level_id,
  boundary_id,
  is_urban,
  login_user_id
) => {
  try {
    return await callApi("getBoundaryDetailsByBoundaryID", {
      boundary_level_id,
      boundary_id,
      is_urban,
      login_user_id,
    });
  } catch (error) {
    console.error("Error fetching boundary details:", error);
    throw error;
  }
};

export const saveGigWorkerBasicInfoAPI = async (requestBody) => {
  try {
    return await callApi("saveGigWorkerBasicDetails", requestBody);
  } catch (error) {
    console.error("Error submitting Basic Info:", error);
    throw error;
  }
};

export const saveGigWorkerVehicleInfoAPI = async (requestBody) => {
  try {
    return await callApi("saveGigWorkerVehicleInfo", requestBody);
  } catch (error) {
    console.error("Error submitting Vehicle Info:", error);
    throw error;
  }
};

export const saveGigWorkerOtherInfoAPI = async (requestBody) => {
  try {
    return await callApi("saveGigWorkerOtherInfo", requestBody);
  } catch (error) {
    console.error("Error submitting Other Info:", error);
    throw error;
  }
};

export const saveGigWorkRelatedInfoAPI = async (requestBody) => {
  try {
    return await callApi("saveGigWorkRelatedInfo", requestBody);
  } catch (error) {
    console.error("Error submitting Work Related Info:", error);
    throw error;
  }
};

export const saveGigBankDetailsAPI = async (requestBody) => {
  try {
    return await callApi("saveGigWorkerBankInfo", requestBody);
  } catch (error) {
    console.error("Error submitting Bank Details:", error);
    throw error;
  }
};

export const getAllLanguagesAPI = async (user_id = 0, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}getAllLanguage`, {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id }),
      signal: options?.signal,
    });

    if (options?.signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    if (response.status === 401) {
      window.location.href = "/session-expired";
    }
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }
    console.error("Error fetching languages:", error);
    throw error;
  }
};

export const getAllVehicleMasterDataAPI = async (user_id = 0) => {
  try {
    return await callApi("getAllVehicleMasterData", { user_id });
  } catch (error) {
    console.error("Error fetching vehicle master data:", error);
    throw error;
  }
};

export const getLandingPageDetailsAPI = async () => {
  try {
    return await callApiWithoutToken("getLandingPageDetails");
  } catch (error) {
    console.error("Error fetching:", error);
    throw error;
  }
};
export const getGigWorkerVehicleInfoAPI = async (
  application_id = 0,
  user_id = 0
) => {
  try {
    return await callApi("getGigWorkerVehicleInfo", {
      application_id,
      user_id,
    });
  } catch (error) {
    console.error("Error fetching Gig Worker Bank Info:", error);
    throw error;
  }
};

export const getAllOccupationAPI = async (user_id = 0) => {
  try {
    return await callApi("getAllOccupationType", { user_id });
  } catch (error) {
    console.error("Error fetching occupation data:", error);
    throw error;
  }
};

export const getAllAgeGroupDetailsAPI = async () => {
  try {
    return await callApi("getAllAgeGroupDetails", { });
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getAllNatureIndustryAPI = async (user_id = 0) => {
  try {
    return await callApi("getAllNatureIndustry", { user_id });
  } catch (error) {
    console.error("Error fetching nature industry data:", error);
    throw error;
  }
};

export const getAllOrganizationAPI = async (
  user_id = 0,
  nature_industry_id = 0
) => {
  try {
    return await callApi("getAllOrganization", { user_id, nature_industry_id });
  } catch (error) {
    console.error("Error fetching organization data:", error);
    throw error;
  }
};

export const getAllBankAPI = async (userID) => {
  try {
    return await callApi("getAllBank", { user_id: userID });
  } catch (error) {
    console.error("Error fetching bank data:", error);
    throw error;
  }
};

export const getIFSCCodeByBankIDAPI = async (bankId) => {
  try {
    return await callApi("getIFSCCodeByBankID", { bank_id: bankId });
  } catch (error) {
    console.error("Error fetching ifsc data:", error);
    throw error;
  }
};

export const getBankBranchNameByIFSCCodeAPI = async (code) => {
  try {

    return await callApi("getBankBranchNameByIFSCCode", { ifsc_code: code });
  } catch (error) {
    console.error("Error fetching ifsc data:", error);
    throw error;
  }
};

export const uploadGigWorkerFiles = async ({
application_id,
form_step,
entry_user_id,
disclaimer_approval_status,
photo,
signature,
pan_card_img,
driving_license_img,
bank_passbook_img,
aadhar_image
}) => {
  try {
    const formData = {
      application_id: application_id,
      form_step: form_step,
      entry_user_id: entry_user_id,
      disclaimer_approval_status: disclaimer_approval_status,
      photo: photo,
      signature: signature,
      pan_card_img: pan_card_img,
      driving_license_img: driving_license_img,
      bank_passbook_img: bank_passbook_img,
      aadhar_image: aadhar_image
    };

    return await postFileRequest("uploadGigWorkerFiles", formData);
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
};

export const getGigWorkerBasicInfoAPI = async (
  application_id = 0,
  user_id = 0
) => {
  try {
    return await callApi("getGigWorkerBasicDetails", {
      application_id,
      user_id,
    });
  } catch (error) {
    console.error("Error fetching Gig Worker Basic Info:", error);
    throw error;
  }
};

// IMPLEMENTATION: getGigWorkerOtherInfoAPI is now added
export const getGigWorkerOtherInfoAPI = async (
  application_id = 0,
  user_id = 0,
  options = {}
) => {
  try {
    return await callApi("getGigWorkerOtherDetails", {
      application_id,
      user_id,
    });
  } catch (error) {
    console.error("Error fetching Gig Worker Other Info:", error);
    throw error;
  }
};

export const getGigWorkerWorkRelatedInfoAPI = async (
  application_id = 0,
  user_id = 0
) => {
  try {
    return await callApi("getGigWorkerWorkRelatedInfo", {
      application_id,
      user_id,
    });
  } catch (error) {
    console.error("Error fetching Gig Worker Work Related Info:", error);
    throw error;
  }
};

export const getGigWorkerBankInfoAPI = async (
  application_id = 0,
  user_id = 0
) => {
  try {
    return await callApi("getGigWorkerBankInfo", { application_id, user_id });
  } catch (error) {
    console.error("Error fetching Gig Worker Bank Info:", error);
    throw error;
  }
};

export const getAllRelationTypeAPI = async (user_id = 0) => {
  try {
    return await callApi("getAllRelationType", { user_id });
  } catch (error) {
    console.error("Error fetching relation types:", error);
    throw error;
  }
};

export const getGigWorkerDocumentsAPI = async (
  application_id = 0,
  user_id = 0
) => {
  try {
    return await callApi("getGigWorkerDocInfo", { application_id, user_id });
  } catch (error) {
    console.error("Error fetching Gig Worker Documents:", error);
    throw error;
  }
};

export const getBloodGroupDetailsApi = async () => {
  try {
    return await callApi("getBloodGroupDetails", { blood_group_id: 0 });
  } catch (error) {
    console.error("Error fetching Documents:", error);
    throw error;
  }
};
