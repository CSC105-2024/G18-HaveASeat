import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import AdministratorLayout from "@/components/layout/administrator.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { ReportDataTable } from "@/components/datatable/administrator/reports/table.jsx";
import axiosInstance from "@/lib/axios.js";

function Page() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/reports");

      const reportsData = response.data?.data || response.data;
      setReports(reportsData);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <AdministratorLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      </AdministratorLayout>
    );
  }

  return (
    <AdministratorLayout>
      <div className="flex flex-col gap-8 px-4">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Reports Management</h2>
          <Separator />
        </div>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
          <div className="flex flex-col gap-4">
            <ReportDataTable data={reports} onRefresh={fetchReports} />
          </div>
        </div>
      </div>
    </AdministratorLayout>
  );
}

export default Page;
