import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "sonner";
import { IconUserPlus } from "@tabler/icons-react";
import { useUserAddOverlay } from "@/overlay/user/add.jsx";
import AdministratorLayout from "@/components/layout/administrator.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { UserDataTable } from "@/components/datatable/administrator/users/table.jsx";
import axiosInstance from "@/lib/axios.js";

function Page() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { open: openUserAddOverlay } = useUserAddOverlay();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/users");
      const usersData = response.data?.data || response.data;
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    openUserAddOverlay({
      addMode: true,
      onSuccess: () => {
        fetchUsers();
      },
    });
  };

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
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Users Management</h2>
            <Button onClick={handleAddUser}>
              <IconUserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
          <Separator />
        </div>
        <div className="flex flex-col gap-12">
          <div className="space-y-4">
            <UserDataTable data={users} onRefresh={fetchUsers} />
          </div>
        </div>
      </div>
    </AdministratorLayout>
  );
}

export default Page;
