import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Progress } from "@/components/ui/progress.jsx";
import {
  IconArrowRight,
  IconBuildingStore,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { toDisplayName } from "@/lib/string.js";

function MerchantSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [merchantId, setMerchantId] = useState(null);
  const [setupStatus, setSetupStatus] = useState(null);

  useEffect(() => {
    checkMerchantStatus();
  }, []);

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

        if (statusResponse.data.isComplete) {
          navigate(`/merchant/${response.data.merchantId}/dashboard`);
        }
      }
    } catch (error) {
      console.error("Error checking merchant status:", error);
    } finally {
      setChecking(false);
    }
  };

  const createMerchant = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/merchant/create");

      if (response.data.success) {
        setMerchantId(response.data.merchantId);
        toast.success("Merchant created! Let's set it up.");

        window.location.href = `/merchant/${response.data.merchantId}/settings/overview`;
      }
    } catch (error) {
      console.error("Error creating merchant:", error);
      if (error.response?.data?.merchantId) {
        setMerchantId(error.response.data.merchantId);
        navigate(
          `/merchant/${error.response.data.merchantId}/settings/overview`,
        );
      } else {
        toast.error("Failed to create merchant");
      }
    } finally {
      setLoading(false);
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

  if (!merchantId) {
    return (
      <div className="flex min-h-[80svh] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <IconBuildingStore className="text-primary h-16 w-16" />
            </div>
            <CardTitle className="text-2xl">Become a Merchant</CardTitle>
            <CardDescription>
              Create your merchant account and start accepting reservations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              size="lg"
              onClick={createMerchant}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Merchant Account"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (merchantId && setupStatus && !setupStatus.isComplete) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-bold">
                Complete Your Merchant Setup
              </h1>
              <p className="text-gray-600">
                Your merchant account needs to be fully set up before it can go
                public
              </p>
            </div>

            <Card className="mb-6">
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Setup Progress</span>
                    <span>{setupStatus.completionPercentage}%</span>
                  </div>
                  <Progress value={setupStatus.completionPercentage} />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {/* Overview Status */}
              <Card>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {setupStatus.setupStatus.overview.isComplete ? (
                          <IconCheck className="h-5 w-5 text-green-500" />
                        ) : (
                          <IconX className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">Basic Information</h3>
                        {setupStatus.setupStatus.overview.isComplete ? (
                          <p className="text-sm text-gray-600">Completed</p>
                        ) : (
                          <div>
                            <p className="mb-2 text-sm text-gray-600">
                              Missing fields:
                            </p>
                            <ul className="text-sm text-red-600">
                              {setupStatus.setupStatus.overview.missingFields.map(
                                (field) => (
                                  <li key={field}>• {toDisplayName(field)}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    {!setupStatus.setupStatus.overview.isComplete && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/merchant/${merchantId}/settings/overview`)
                        }
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Display Status */}
              <Card>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {setupStatus.setupStatus.display.isComplete ? (
                          <IconCheck className="h-5 w-5 text-green-500" />
                        ) : (
                          <IconX className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">Display & Images</h3>
                        {setupStatus.setupStatus.display.isComplete ? (
                          <p className="text-sm text-gray-600">Completed</p>
                        ) : (
                          <div>
                            <p className="mb-2 text-sm text-gray-600">
                              Missing fields:
                            </p>
                            <ul className="text-sm text-red-600">
                              {setupStatus.setupStatus.display.missingFields.map(
                                (field) => (
                                  <li key={field}>• {toDisplayName(field)}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    {!setupStatus.setupStatus.display.isComplete &&
                      setupStatus.setupStatus.overview.isComplete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/merchant/${merchantId}/settings/display`)
                          }
                        >
                          Complete
                        </Button>
                      )}
                  </div>
                </CardContent>
              </Card>

              {/* Reservation Status */}
              <Card>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {setupStatus.setupStatus.reservation.isComplete ? (
                          <IconCheck className="h-5 w-5 text-green-500" />
                        ) : (
                          <IconX className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">Reservation & Zones</h3>
                        {setupStatus.setupStatus.reservation.isComplete ? (
                          <p className="text-sm text-gray-600">Completed</p>
                        ) : (
                          <div>
                            <p className="mb-2 text-sm text-gray-600">
                              Missing fields:
                            </p>
                            <ul className="text-sm text-red-600">
                              {setupStatus.setupStatus.reservation.missingFields.map(
                                (field) => (
                                  <li key={field}>• {toDisplayName(field)}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    {!setupStatus.setupStatus.reservation.isComplete &&
                      setupStatus.setupStatus.display.isComplete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/merchant/${merchantId}/settings/reservation`,
                            )
                          }
                        >
                          Complete
                        </Button>
                      )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <Button
                size="lg"
                onClick={continueSetup}
                className="min-w-[200px]"
              >
                Continue Setup
                <IconArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default MerchantSetup;
