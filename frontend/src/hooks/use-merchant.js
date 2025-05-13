import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAuthStore } from "@/store/auth";
import axiosInstance from "@/lib/axios";

/**
 * Custom hook to manage merchant data
 * @param {Object} options - Hook options
 * @param {string} options.merchantId - Optional merchant ID to override URL param
 * @param {boolean} options.skipStatusCheck - Skip automatic setup status check
 * @returns {Object} Merchant data and utility functions
 */
export function useMerchant({
  merchantId: propMerchantId,
  skipStatusCheck = false,
} = {}) {
  const { id: urlMerchantId } = useParams();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [merchant, setMerchant] = useState(null);
  const [userMerchants, setUserMerchants] = useState([]);
  const [setupStatus, setSetupStatus] = useState(null);
  const [error, setError] = useState(null);

  const merchantId = propMerchantId || urlMerchantId;

  const checkUserMerchants = useCallback(async () => {
    if (!user) return null;

    try {
      setLoading(true);
      const response = await axiosInstance.get("/user/merchant");

      if (response.data.hasMerchant) {
        setUserMerchants([{ id: response.data.merchantId }]);
        return response.data.merchantId;
      } else {
        setUserMerchants([]);
        return null;
      }
    } catch (error) {
      console.error("Error checking user merchants:", error);
      setError("Failed to fetch user merchants");
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchMerchant = useCallback(async (id) => {
    if (!id) return null;

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/merchant/${id}/settings`);
      setMerchant(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching merchant:", error);
      if (error.response?.status === 404) {
        setMerchant(null);
      } else {
        setError("Failed to fetch merchant data");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkSetupStatus = useCallback(async (id) => {
    if (!id) return null;

    try {
      const response = await axiosInstance.get(`/merchant/${id}/status`);
      setSetupStatus(response.data);
      return response.data;
    } catch (error) {
      console.error("Error checking merchant setup status:", error);
      return null;
    }
  }, []);

  const createMerchant = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/merchant/create");

      if (response.data.success) {
        const newMerchantId = response.data.merchantId;
        setUserMerchants([{ id: newMerchantId }]);
        return newMerchantId;
      }
      return null;
    } catch (error) {
      console.error("Error creating merchant:", error);
      setError("Failed to create merchant");
      if (error.response?.data?.merchantId) {
        return error.response.data.merchantId;
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);

      try {
        if (merchantId) {
          await fetchMerchant(merchantId);

          if (!skipStatusCheck) {
            await checkSetupStatus(merchantId);
          }
        } else {
          const userMerchantId = await checkUserMerchants();
          if (userMerchantId) {
            await fetchMerchant(userMerchantId);

            if (!skipStatusCheck) {
              await checkSetupStatus(userMerchantId);
            }
          }
        }
      } catch (err) {
        console.error("Error initializing merchant hook:", err);
        setError("Failed to initialize merchant data");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [
    merchantId,
    checkUserMerchants,
    fetchMerchant,
    checkSetupStatus,
    skipStatusCheck,
  ]);

  const isOwner = merchant && user && merchant.ownerId === user.id;

  const isSetupComplete = setupStatus?.isComplete || false;

  const currentMerchantId =
    merchant?.id || userMerchants[0]?.id || merchantId || null;

  return {
    loading,
    error,
    merchant,
    merchantId: currentMerchantId,
    setupStatus,
    userMerchants,
    hasCompletedSetup: isSetupComplete,
    isOwner,

    checkUserMerchants,
    fetchMerchant,
    checkSetupStatus,
    createMerchant,

    getSetupUrl: (id) => `/merchant/${id || currentMerchantId}/setup`,
    getDashboardUrl: (id) => `/merchant/${id || currentMerchantId}/dashboard`,
    getReservationsUrl: (id) =>
      `/merchant/${id || currentMerchantId}/reservations`,
    getSettingsUrl: (id, section = "overview") =>
      `/merchant/${id || currentMerchantId}/settings${section ? `/${section}` : ""}`,
    getPublicUrl: (id) => `/merchant/${id || currentMerchantId}`,

    hasMerchant: userMerchants.length > 0 || !!merchant,
  };
}
