import React, { createContext, useContext, useEffect, useState } from "react";
import { useMerchant } from "@/hooks/use-merchant";
import { useAuthStore } from "@/store/auth";
import axiosInstance from "@/lib/axios.js";

const MerchantContext = createContext(null);

export function MerchantProvider({ children }) {
  const { user, isAuthenticated } = useAuthStore();
  const [setupStatus, setSetupStatus] = useState(null);

  const merchantData = useMerchant({ skipStatusCheck: true });

  useEffect(() => {
    const checkStatus = async () => {
      if (merchantData.merchantId && !setupStatus) {
        try {
          const response = await axiosInstance.get(
            `/merchant/${merchantData.merchantId}/status`,
          );
          setSetupStatus(response.data);
        } catch (error) {
          console.error("Error checking merchant status:", error);
        }
      }
    };

    checkStatus();
  }, [merchantData.merchantId, setupStatus]);

  useEffect(() => {
    if (isAuthenticated && user) {
      merchantData.checkUserMerchants();
    }
  }, [isAuthenticated, user, merchantData.checkUserMerchants]);

  const contextValue = {
    ...merchantData,
    hasCompletedSetup: setupStatus?.isComplete || false,
    setupStatus: setupStatus || merchantData.setupStatus,

    refreshSetupStatus: async () => {
      if (merchantData.merchantId) {
        try {
          const response = await axiosInstance.get(
            `/merchant/${merchantData.merchantId}/status`,
          );
          setSetupStatus(response.data);
          return response.data;
        } catch (error) {
          console.error("Error refreshing merchant status:", error);
          return null;
        }
      }
      return null;
    },
  };

  return (
    <MerchantContext.Provider value={contextValue}>
      {children}
    </MerchantContext.Provider>
  );
}

export function useMerchantContext() {
  const context = useContext(MerchantContext);
  if (!context) {
    throw new Error(
      "useMerchantContext must be used within a MerchantProvider",
    );
  }
  return context;
}
