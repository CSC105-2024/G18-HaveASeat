import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import { Link, useNavigate } from "react-router";
import axiosInstance from "@/lib/axios.js";
import { Button, buttonVariants } from "@/components/ui/button.jsx";
import { IconArrowRight } from "@tabler/icons-react";
import { useMerchantContext } from "@/providers/merchant.jsx";

function SetupProgress({ trigger }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [merchantId, setMerchantId] = useState(null);
  const [setupStatus, setSetupStatus] = useState(null);
  const { refreshSetupStatus } = useMerchantContext();

  useEffect(() => {
    checkMerchantStatus();
    refreshSetupStatus();
    // eslint-disable-next-line
  }, [trigger]);

  const checkMerchantStatus = async () => {
    try {
      setChecking(true);

      const response = await axiosInstance.get("/user/merchant");

      if (response.data.merchantId) {
        setMerchantId(response.data.merchantId);

        const statusResponse = await axiosInstance.get(
          `/merchant/${response.data.merchantId}/status`,
        );
        setSetupStatus(statusResponse.data);
      }
    } catch (error) {
      console.error("Error checking merchant status:", error);
    } finally {
      setChecking(false);
    }
  };

  const continueSetup = () => {
    if (setupStatus?.nextStep) {
      navigate(`/merchant/${merchantId}/settings/${setupStatus.nextStep}`);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (merchantId && setupStatus && !setupStatus.isComplete) {
    return (
      <div>
        <Card className="mb-6 gap-4">
          <CardHeader>
            <CardTitle>Complete Your Merchant Setup</CardTitle>
            <CardDescription>
              Your merchant account needs to be fully set up before it can go
              public
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Setup Progress</span>
                <span>{setupStatus.completionPercentage}%</span>
              </div>
              <Progress value={setupStatus.completionPercentage} />
              <div className="flex flex-col gap-4 md:flex-row">
                <Link
                  to="/merchant/setup"
                  className={buttonVariants({
                    variant: "secondary",
                    size: "sm",
                  })}
                >
                  More Information
                </Link>
                <Button size="sm" onClick={continueSetup} className="">
                  Continue Setup
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return null;
}

export default SetupProgress;
