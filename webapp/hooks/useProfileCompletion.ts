import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { BASE_URL } from "../lib/api";

export interface MissingFields {
  photo: boolean;
  document: boolean;
}

export function useProfileCompletion() {
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [missingFields, setMissingFields] = useState<MissingFields>({ photo: false, document: false });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<"photo" | "document" | null>(null);
  const pathname = usePathname();

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("cc_token");
      if (!token) {
        setCompletionPercentage(0);
        setMissingFields({ photo: false, document: false });
        setLoading(false);
        return;
      }

      const res = await fetch(`${BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        const profile = data.profile;
        
        let percentage = 0;
        let mFields = { photo: true, document: true };

        // Base fields check (if profile exists, base is 70%)
        if (profile) {
          percentage += 70;
          
          if (profile.photoUrl) {
            percentage += 15;
            mFields.photo = false;
          }
          if (profile.documentUrl) {
            percentage += 15;
            mFields.document = false;
          }
        }

        setCompletionPercentage(percentage);
        setMissingFields(mFields);
      }
    } catch (err) {
      console.error("Failed to fetch profile for completion check:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, pathname]);

  const uploadFile = async (file: File, type: "photo" | "document") => {
    setUploading(type);
    try {
      const token = localStorage.getItem("cc_token");
      if (!token) throw new Error("Not authenticated");

      // 1. Get presigned URL
      const presignRes = await fetch(`${BASE_URL}/upload/presign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ filename: file.name, filetype: file.type }),
      });

      if (!presignRes.ok) throw new Error("Failed to get presigned URL");
      const { uploadUrl, fileKey } = await presignRes.json();

      // 2. Upload directly to S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Failed to upload file to S3");

      // 3. Update profile with file key
      const patchRes = await fetch(`${BASE_URL}/profile/file`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fileKey, type }),
      });

      if (!patchRes.ok) throw new Error("Failed to update profile with file");

      // 4. Refresh completion state
      await fetchProfile();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload file. Please ensure your AWS credentials are valid.");
    } finally {
      setUploading(null);
    }
  };

  return { completionPercentage, missingFields, loading, uploading, uploadFile };
}
