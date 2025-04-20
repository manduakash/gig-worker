import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cookies from "react-cookies";
import { AlertCircle, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getGigWorkerVehicleInfoAPI } from "./api";

export default function UploadDocuments({ formData, setFormData }) {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);

  const [panCardPreview, setPanCardPreview] = useState(null);
  const [drivingLicensePreview, setDrivingLicensePreview] = useState(null);
  const [bankPassbookPreview, setBankPassbookPreview] = useState(null);
  const [aadhaarPreview, setAadhaarPreview] = useState(null);
  const [isBankDetailsVisible, setIsBankDetailsVisible] = useState(null);
  const [isAutomobile, setIsAutomobile] = useState(null);
  const udinNo = Cookies.load("uno");
  const readOnly = Boolean(udinNo);
  const { toast } = useToast();

  useEffect(() => {
    const applicationId = Cookies.load("aid");
    const userID = Cookies.load("uid");
    const abortController = new AbortController();
    const bank_details_visibility = Cookies.load("bank_details_visibility");
    setIsBankDetailsVisible(bank_details_visibility)

    const fetchVehicleDetails = async () => {
      try {
        const { signal } = abortController;
        const result = await getGigWorkerVehicleInfoAPI(
          Number(applicationId) || 0,
          Number(userID) || 0,
          { signal }
        );
        const isVehicleAutomobile = result?.data?.arr_vehicle_details.find((item) => item.vehicle_category_id == 10);
        setIsAutomobile(isVehicleAutomobile || null);
      } catch (error) {
        if (error.name === "AbortError") {
        } else {
          console.error(
            "Error fetching vehicle details from API:",
            error
          );
        }
      }
    };

    fetchVehicleDetails();

    return () => abortController.abort();
  }, []);

  useEffect(() => {
    let previewUrl = null;
    const sigFile = formData?.signature_file;
    const editSigFile = formData?.edit_signature_file;

    if (sigFile) {
      if (typeof sigFile === "object" && sigFile instanceof File) {
        previewUrl = URL.createObjectURL(sigFile);
      } else if (typeof sigFile === "string") {
        previewUrl = sigFile;
      }
    } else if (editSigFile && typeof editSigFile === "string") {
      previewUrl = editSigFile;
    }

    setSignaturePreview(previewUrl);

    return () => {
      // Only revoke if it was an object URL created from sigFile
      if (
        previewUrl &&
        typeof sigFile === "object" &&
        sigFile instanceof File
      ) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [formData?.signature_file, formData?.edit_signature_file]); // Correct dependencies

  // --- Photo Effect (FIXED for initial edit load) ---
  useEffect(() => {
    let previewUrl = null;
    const photoFile = formData?.photo_file; // The potentially new File or existing string
    const editPhotoFile = formData?.edit_photo_file; // The initial edit URL string

    if (photoFile) {
      // Prioritize photo_file (could be new File or potentially string if handled differently elsewhere)
      if (typeof photoFile === "object" && photoFile instanceof File) {
        previewUrl = URL.createObjectURL(photoFile);
      } else if (typeof photoFile === "string") {
        previewUrl = photoFile; // Assume it's a valid URL if it's a string
      }
    } else if (editPhotoFile && typeof editPhotoFile === "string") {
      // Fallback to editPhotoFile if photoFile is absent
      previewUrl = editPhotoFile;
    }

    setPhotoPreview(previewUrl);

    // Cleanup function for Object URL
    return () => {
      // Only revoke if it was an object URL created from photoFile
      if (
        previewUrl &&
        typeof photoFile === "object" &&
        photoFile instanceof File
      ) {
        URL.revokeObjectURL(previewUrl);
      }
    };
    // dependencies to include edit_photo_file
  }, [formData?.photo_file, formData?.edit_photo_file]);

  useEffect(() => {
    let previewUrl = null;
    const panFile = formData?.pan_card_file;
    const editPanFile = formData?.edit_pan_card_file;

    if (panFile) {
      if (typeof panFile === "object" && panFile instanceof File) {
        previewUrl = URL.createObjectURL(panFile);
      } else if (typeof panFile === "string") {
        previewUrl = panFile;
      }
    } else if (editPanFile && typeof editPanFile === "string") {
      previewUrl = editPanFile;
    }

    setPanCardPreview(previewUrl);

    return () => {
      if (previewUrl && typeof panFile === "object" && panFile instanceof File) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [formData?.pan_card_file, formData?.edit_pan_card_file]);

  useEffect(() => {
    let previewUrl = null;
    const dlFile = formData?.driving_license_file;
    const editDlFile = formData?.edit_driving_license_file;

    if (dlFile) {
      if (typeof dlFile === "object" && dlFile instanceof File) {
        previewUrl = URL.createObjectURL(dlFile);
      } else if (typeof dlFile === "string") {
        previewUrl = dlFile;
      }
    } else if (editDlFile && typeof editDlFile === "string") {
      previewUrl = editDlFile;
    }

    setDrivingLicensePreview(previewUrl);

    return () => {
      if (previewUrl && typeof dlFile === "object" && dlFile instanceof File) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [formData?.driving_license_file, formData?.edit_driving_license_file]);

  useEffect(() => {
    let previewUrl = null;
    const bankFile = formData?.bank_passbook_file;
    const editBankFile = formData?.edit_bank_passbook_file;

    if (bankFile) {
      if (typeof bankFile === "object" && bankFile instanceof File) {
        previewUrl = URL.createObjectURL(bankFile);
      } else if (typeof bankFile === "string") {
        previewUrl = bankFile;
      }
    } else if (editBankFile && typeof editBankFile === "string") {
      previewUrl = editBankFile;
    }

    setBankPassbookPreview(previewUrl);

    return () => {
      if (previewUrl && typeof bankFile === "object" && bankFile instanceof File) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [formData?.bank_passbook_file, formData?.edit_bank_passbook_file]);

  useEffect(() => {
    let previewUrl = null;
    const aadhaarFile = formData?.aadhaar_file;
    const editAadhaarFile = formData?.edit_aadhaar_file;

    if (aadhaarFile) {
      if (typeof aadhaarFile === "object" && aadhaarFile instanceof File) {
        previewUrl = URL.createObjectURL(aadhaarFile);
      } else if (typeof aadhaarFile === "string") {
        previewUrl = aadhaarFile;
      }
    } else if (editAadhaarFile && typeof editAadhaarFile === "string") {
      previewUrl = editAadhaarFile;
    }

    setAadhaarPreview(previewUrl);

    return () => {
      if (previewUrl && typeof aadhaarFile === "object" && aadhaarFile instanceof File) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [formData?.aadhaar_file, formData?.edit_aadhaar_file]);


  const validateFile = (file) => {
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const MAX_FILE_SIZE = 200 * 1024; // 200KB
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Invalid file type. Only PNG, JPG & JPEG are allowed.');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>Failed to Save!</span>
          </div>
        ),
        description: "File size exceeds 200KB limit.",
      });
      return false;
    }
    return true;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setPhotoPreview(null);
      setFormData((prev) => ({ ...prev, photo_file: null }));
      return;
    }

    if (!validateFile(file)) {
      e.target.value = null; // Clear file input
      return;
    }

    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    const preview = URL.createObjectURL(file);
    setPhotoPreview(preview);
    setFormData((prev) => ({
      ...prev,
      photo_file: file,
    }));
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setSignaturePreview(null);
      setFormData((prev) => ({ ...prev, signature_file: null }));
      return;
    }

    if (!validateFile(file)) {
      e.target.value = null;
      return;
    }

    if (signaturePreview && signaturePreview.startsWith("blob:")) {
      URL.revokeObjectURL(signaturePreview);
    }

    const preview = URL.createObjectURL(file);
    setSignaturePreview(preview);
    setFormData((prev) => ({
      ...prev,
      signature_file: file,
    }));
  };

  const handlePanCardChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setPanCardPreview(null);
      setFormData((prev) => ({ ...prev, pan_card_file: null }));
      return;
    }

    if (!validateFile(file)) {
      e.target.value = null; // Clear file input
      return;
    }

    if (panCardPreview && panCardPreview.startsWith("blob:")) {
      URL.revokeObjectURL(panCardPreview);
    }

    const preview = URL.createObjectURL(file);
    setPanCardPreview(preview);
    setFormData((prev) => ({
      ...prev,
      pan_card_file: file,
    }));
  };

  const handleDrivingLicenseChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setDrivingLicensePreview(null);
      setFormData((prev) => ({ ...prev, driving_license_file: null }));
      return;
    }

    if (!validateFile(file)) {
      e.target.value = null; // Clear file input
      return;
    }

    if (drivingLicensePreview && drivingLicensePreview.startsWith("blob:")) {
      URL.revokeObjectURL(drivingLicensePreview);
    }

    const preview = URL.createObjectURL(file);
    setDrivingLicensePreview(preview);
    setFormData((prev) => ({
      ...prev,
      driving_license_file: file,
    }));
  };

  const handleBankPassbookChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setBankPassbookPreview(null);
      setFormData((prev) => ({ ...prev, bank_passbook_file: null }));
      return;
    }

    if (!validateFile(file)) {
      e.target.value = null; // Clear file input
      return;
    }

    if (bankPassbookPreview && bankPassbookPreview.startsWith("blob:")) {
      URL.revokeObjectURL(bankPassbookPreview);
    }

    const preview = URL.createObjectURL(file);
    setBankPassbookPreview(preview);
    setFormData((prev) => ({
      ...prev,
      bank_passbook_file: file,
    }));
  };

  const handleAadhaarChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setAadhaarPreview(null);
      setFormData((prev) => ({ ...prev, aadhaar_file: null }));
      return;
    }

    if (!validateFile(file)) {
      e.target.value = null; // Clear file input
      return;
    }

    if (aadhaarPreview && aadhaarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(aadhaarPreview);
    }

    const preview = URL.createObjectURL(file);
    setAadhaarPreview(preview);
    setFormData((prev) => ({
      ...prev,
      aadhaar_file: file,
    }));
  };

  const handleRemovePhoto = () => {
    // Clean up object URL if current preview is one
    if (photoPreview && photoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    // Update formData: nullify both file and potentially the edit file marker
    setFormData((prev) => ({
      ...prev,
      photo_file: null,
      edit_photo_file: null,
    })); // Also clear edit_photo_file
    const fileInput = document.getElementById("upload-photo");
    if (fileInput) fileInput.value = "";
  };

  const handleRemoveSignature = () => {
    // setSignatureFile(null); // Consider removing
    // Clean up object URL if current preview is one
    if (signaturePreview && signaturePreview.startsWith("blob:")) {
      URL.revokeObjectURL(signaturePreview);
    }
    setSignaturePreview("");
    // Update formData: nullify both file and potentially the edit file marker
    setFormData((prev) => ({
      ...prev,
      signature_file: "",
      edit_signature_file: "",
    })); // Also clear edit_signature_file
    const fileInput = document.getElementById("upload-signature");
    if (fileInput) fileInput.value = "";
  };

  const handleRemovePanCard = () => {
    // Clean up object URL if current preview is one
    if (panCardPreview && panCardPreview.startsWith("blob:")) {
      URL.revokeObjectURL(panCardPreview);
    }
    setPanCardPreview(null);
    // Update formData: nullify both file and potentially the edit file marker
    setFormData((prev) => ({
      ...prev,
      pan_card_file: null,
      edit_pan_card_file: null,
    })); // Also clear edit_photo_file
    const fileInput = document.getElementById("upload-pan-card");
    if (fileInput) fileInput.value = "";
  };

  const handleRemoveDrivingLicense = () => {
    // Clean up object URL if current preview is one
    if (drivingLicensePreview && drivingLicensePreview.startsWith("blob:")) {
      URL.revokeObjectURL(drivingLicensePreview);
    }
    setDrivingLicensePreview(null);
    // Update formData: nullify both file and potentially the edit file marker
    setFormData((prev) => ({
      ...prev,
      driving_license_file: null,
      edit_driving_license_file: null,
    })); // Also clear edit_photo_file
    const fileInput = document.getElementById("upload-driving-license");
    if (fileInput) fileInput.value = "";
  };

  const handleRemoveBankPassbook = () => {
    // Clean up object URL if current preview is one
    if (bankPassbookPreview && bankPassbookPreview.startsWith("blob:")) {
      URL.revokeObjectURL(bankPassbookPreview);
    }
    setBankPassbookPreview(null);
    // Update formData: nullify both file and potentially the edit file marker
    setFormData((prev) => ({
      ...prev,
      bank_passbook_file: null,
      edit_bank_passbook_file: null,
    })); // Also clear edit_photo_file
    const fileInput = document.getElementById("upload-bank-passbook");
    if (fileInput) fileInput.value = "";
  };

  const handleRemoveAadhaar = () => {
    // Clean up object URL if current preview is one
    if (aadhaarPreview && aadhaarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(aadhaarPreview);
    }
    setAadhaarPreview(null);
    // Update formData: nullify both file and potentially the edit file marker
    setFormData((prev) => ({
      ...prev,
      aadhaar_file: null,
      edit_aadhaar_file: null,
    })); // Also clear edit_photo_file
    const fileInput = document.getElementById("upload-aadhaar");
    if (fileInput) fileInput.value = "";
  };

  // ... rest of the return statement (JSX) remains the same ...
  return (
    <div className="p-4 border rounded mt-8">
      <h3 className="text-xl font-semibold mb-4">Upload Documents</h3>
      <div className="grid grid-cols-2 gap-6">
        {/* Upload Photo */}
        <div className="mb-4">
          <Label htmlFor="upload-photo" className="block text-gray-700 mb-1">
            Upload Applicant Photo
          </Label>
          <div className="flex items-center gap-2 border-[1.5px] border-indigo-300 border-dashed rounded-md ps-3 cursor-pointer">
            <FileImage className="w-8 h-8 text-gray-400" />
            <Input
              id="upload-photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              disabled={readOnly}
              className="flex-1 rounded-none border-none cursor-pointer bg-indigo-50"
            />
          </div>
          <span className="flex text-sm text-gray-600 my-2 items-center gap-1"><AlertCircle className="h-4 w-4 font-bold text-indigo-600" /> File Format: JPG/JPEG/PNG | Max File Size: 200 Kb</span>
          {photoPreview && (
            <div className="mt-4 relative">
              <div className="relative inline-block">
                <img
                  src={photoPreview}
                  alt="Photo Preview"
                  className="w-32 h-32 object-cover border rounded"
                />
                {!readOnly && ( // Conditionally render the button
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-2 -right-2 bg-black/30 backdrop-blur-sm text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/50 focus:outline-none transition-colors"
                  // disabled={readOnly} // Disabled prop is redundant if button isn't rendered
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Upload Signature */}
        <div className="mb-4">
          <Label
            htmlFor="upload-signature"
            className="block text-gray-700 mb-1"
          >
            Upload Applicant Signature
          </Label>
          <div className="flex items-center gap-2 border-[1.5px] border-indigo-300 border-dashed rounded-md ps-3 cursor-pointer">
            <FileImage className="w-8 h-8 text-gray-400" />
            <Input
              id="upload-signature"
              type="file"
              accept="image/*"
              onChange={handleSignatureChange}
              className="flex-1 rounded-none border-none cursor-pointer bg-indigo-50"
              disabled={readOnly}
            />
          </div>
          <span className="flex text-sm text-gray-600 my-2 items-center gap-1"><AlertCircle className="h-4 w-4 font-bold text-indigo-600" /> File Format: JPG/JPEG/PNG | Max File Size: 200 Kb</span>
          {signaturePreview && (
            <div className="mt-4 relative">
              <div className="relative inline-block">
                <img
                  src={signaturePreview}
                  alt="Signature Preview"
                  className="w-64 h-32 object-cover border rounded" // Adjusted dimensions for signature clarity
                />
                {!readOnly && ( // Conditionally render the button
                  <button
                    type="button"
                    onClick={handleRemoveSignature}
                    className="absolute -top-2 -right-2 bg-black/30 backdrop-blur-sm text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/50 focus:outline-none transition-colors"
                  // disabled={readOnly} // Disabled prop is redundant if button isn't rendered
                  >
                    ×
                  </button>
                )}
              </div>

            </div>

          )}
        </div>

        {/* Upload Pan Card */}
        <div className="mb-4">
          <Label
            htmlFor="upload-pan-card"
            className="block text-gray-700 mb-1"
          >
            Upload Pan Card
          </Label>
          <div className="flex items-center gap-2 border-[1.5px] border-indigo-300 border-dashed rounded-md ps-3 cursor-pointer">
            <FileImage className="w-8 h-8 text-gray-400" />
            <Input
              id="upload-pan-card"
              type="file"
              accept="image/*"
              onChange={handlePanCardChange}
              className="flex-1 rounded-none border-none cursor-pointer bg-indigo-50"
              disabled={readOnly}
            />
          </div>
          <span className="flex text-sm text-gray-600 my-2 items-center gap-1"><AlertCircle className="h-4 w-4 font-bold text-indigo-600" /> File Format: JPG/JPEG/PNG | Max File Size: 200 Kb</span>
          {panCardPreview && (
            <div className="mt-4 relative">
              <div className="relative inline-block">
                <img
                  src={panCardPreview}
                  alt="Pan Card Preview"
                  className="w-64 h-32 object-cover border rounded" // Adjusted dimensions for signature clarity
                />
                {!readOnly && ( // Conditionally render the button
                  <button
                    type="button"
                    onClick={handleRemovePanCard}
                    className="absolute -top-2 -right-2 bg-black/30 backdrop-blur-sm text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/50 focus:outline-none transition-colors"
                  // disabled={readOnly} // Disabled prop is redundant if button isn't rendered
                  >
                    ×
                  </button>
                )}
              </div>

            </div>

          )}
        </div>

        {/* Upload Driving License */}
        {isAutomobile &&
          <div className="mb-4">
            <Label
              htmlFor="upload-driving-license"
              className="block text-gray-700 mb-1"
            >
              Upload Driving License
            </Label>
            <div className="flex items-center gap-2 border-[1.5px] border-indigo-300 border-dashed rounded-md ps-3 cursor-pointer">
              <FileImage className="w-8 h-8 text-gray-400" />
              <Input
                id="upload-driving-license"
                type="file"
                accept="image/*"
                onChange={handleDrivingLicenseChange}
                className="flex-1 rounded-none border-none cursor-pointer bg-indigo-50"
                disabled={readOnly}
              />
            </div>
            <span className="flex text-sm text-gray-600 my-2 items-center gap-1"><AlertCircle className="h-4 w-4 font-bold text-indigo-600" /> File Format: JPG/JPEG/PNG | Max File Size: 200 Kb</span>
            {drivingLicensePreview && (
              <div className="mt-4 relative">
                <div className="relative inline-block">
                  <img
                    src={drivingLicensePreview}
                    alt="Signature Preview"
                    className="w-64 h-32 object-cover border rounded" // Adjusted dimensions for signature clarity
                  />
                  {!readOnly && ( // Conditionally render the button
                    <button
                      type="button"
                      onClick={handleRemoveDrivingLicense}
                      className="absolute -top-2 -right-2 bg-black/30 backdrop-blur-sm text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/50 focus:outline-none transition-colors"
                    // disabled={readOnly} // Disabled prop is redundant if button isn't rendered
                    >
                      ×
                    </button>
                  )}
                </div>

              </div>

            )}
          </div>
        }

        {/* Bank Passbook */}
        {isBankDetailsVisible == 1 ?
          <div className="mb-4">
            <Label
              htmlFor="upload-bank-passbook"
              className="block text-gray-700 mb-1"
            >
              Upload Bank Passbook
            </Label>
            <div className="flex items-center gap-2 border-[1.5px] border-indigo-300 border-dashed rounded-md ps-3 cursor-pointer">
              <FileImage className="w-8 h-8 text-gray-400" />
              <Input
                id="upload-bank-passbook"
                type="file"
                accept="image/*"
                onChange={handleBankPassbookChange}
                className="flex-1 rounded-none border-none cursor-pointer bg-indigo-50"
                disabled={readOnly}
              />
            </div>
            <span className="flex text-sm text-gray-600 my-2 items-center gap-1"><AlertCircle className="h-4 w-4 font-bold text-indigo-600" /> File Format: JPG/JPEG/PNG | Max File Size: 200 Kb</span>
            {bankPassbookPreview && (
              <div className="mt-4 relative">
                <div className="relative inline-block">
                  <img
                    src={bankPassbookPreview}
                    alt="Signature Preview"
                    className="w-64 h-32 object-cover border rounded" // Adjusted dimensions for signature clarity
                  />
                  {!readOnly && ( // Conditionally render the button
                    <button
                      type="button"
                      onClick={handleRemoveBankPassbook}
                      className="absolute -top-2 -right-2 bg-black/30 backdrop-blur-sm text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/50 focus:outline-none transition-colors"
                    // disabled={readOnly} // Disabled prop is redundant if button isn't rendered
                    >
                      ×
                    </button>
                  )}
                </div>

              </div>

            )}
          </div> : null}

        {/* Aadhaar Card */}
        <div className="mb-4">
          <Label
            htmlFor="upload-aadhaar"
            className="block text-gray-700 mb-1"
          >
            Upload Aadhaar Card
          </Label>
          <div className="flex items-center gap-2 border-[1.5px] border-indigo-300 border-dashed rounded-md ps-3 cursor-pointer">
            <FileImage className="w-8 h-8 text-gray-400" />
            <Input
              id="upload-aadhaar"
              type="file"
              accept="image/*"
              onChange={handleAadhaarChange}
              className="flex-1 rounded-none border-none cursor-pointer bg-indigo-50"
              disabled={readOnly}
            />
          </div>
          <span className="flex text-sm text-gray-600 my-2 items-center gap-1"><AlertCircle className="h-4 w-4 font-bold text-indigo-600" /> File Format: JPG/JPEG/PNG | Max File Size: 200 Kb</span>
          {aadhaarPreview && (
            <div className="mt-4 relative">
              <div className="relative inline-block">
                <img
                  src={aadhaarPreview}
                  alt="Aadhaar Preview"
                  className="w-64 h-32 object-cover border rounded" // Adjusted dimensions for signature clarity
                />
                {!readOnly && ( // Conditionally render the button
                  <button
                    type="button"
                    onClick={handleRemoveAadhaar}
                    className="absolute -top-2 -right-2 bg-black/30 backdrop-blur-sm text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/50 focus:outline-none transition-colors"
                  // disabled={readOnly} // Disabled prop is redundant if button isn't rendered
                  >
                    ×
                  </button>
                )}
              </div>

            </div>

          )}
        </div>

      </div>
    </div>
  );
}
