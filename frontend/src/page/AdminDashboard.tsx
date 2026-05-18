import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Bounded from "./landing/Bounded";
import StarGrid from "./landing/StarGrid";
import { useUser } from "@/context/UserContext";
import { Users, CheckCircle2, XCircle, Eye, ShoppingBag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loader from "@/components/shared/Loader";
import axios from "axios";
import { API_BASE_URL } from "@/config/apiDetails";

interface UserVerification {
  farmerID: string;
  username: string;
  contact: string;
  identity: "user" | "farmer";
  verified: boolean;
  citizenshipFront?: string;
  citizenshipBack?: string;
  registeredDate: string;
}

interface AdminStats {
  totalUsers: number;
  verifiedUsers: number;
  pendingVerification: number;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [users, setUsers] = useState<UserVerification[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    verifiedUsers: 0,
    pendingVerification: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("verification");

  // if (!user || !user.username) {
  //   navigate("/login");
  //   toast.error("Please log in to access dashboard.");
  //   return;
  // }



  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/getFarmers`);
        const users = response.data.data;
        console.log("Fetched farmers:", users);

        const sortedUsers = users.sort((a: UserVerification, b: UserVerification) => {
          if (a.verified === b.verified) return 0;
          return a.verified ? 1 : -1;
        });

        setUsers(sortedUsers);

        const totalUsers = users.length;
        const verifiedUsers = users.filter((u: UserVerification) => u.verified).length;
        const pendingVerification = users.filter((u: UserVerification) => !u.verified).length;

        setStats({
          totalUsers,
          verifiedUsers,
          pendingVerification,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const handleVerificationChange = async (
    farmerID: string,
    newStatus: string
  ) => {
    try {
      // TODO: Backend Code
      const isVerified = newStatus === "verified";

      setUsers((prevUsers) =>
        prevUsers
          .map((u) =>
            u.farmerID === farmerID ? { ...u, verified: isVerified } : u
          )
          .sort((a, b) => {
            if (a.verified === b.verified) return 0;
            return a.verified ? 1 : -1;
          })
      );

      toast.success(
        `User ${isVerified ? "verified" : "unverified"} successfully`
      );
    } catch (error) {
      console.error("Error updating verification:", error);
      toast.error("Failed to update verification");
    }
  };

  if (isLoading) {
    return (
      <Bounded className="pt-0!">
        <StarGrid />
        <Loader />
      </Bounded>
    );
  }

    if (user.username !== "admin") {
    navigate("/home");
    toast.error("Access denied. Admins only.");
    return;
  }

  return (
    <Bounded className="min-h-screen pb-20">
      <StarGrid />
      <div className="w-full max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Verified</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.verifiedUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <XCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.pendingVerification}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="verification">User Verification</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="verification">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  User Verification Management
                </h2>
              </div>

              <div className="lg:hidden divide-y divide-gray-200">
                {users.map((userItem) => (
                  <div key={userItem.farmerID} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">
                        {userItem.username}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          userItem.verified
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {userItem.verified ? "Verified" : "Pending"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        {userItem.contact}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">farmer</p>
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={userItem.verified ? "verified" : "unverified"}
                        onValueChange={(value) =>
                          handleVerificationChange(userItem.farmerID, value)
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="unverified">Unverified</SelectItem>
                        </SelectContent>
                      </Select>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Eye className="w-5 h-5 text-gray-600" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[90vw] max-w-3xl p-4"
                          align="start"
                        >
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-gray-900">
                              Citizenship Documents
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs font-medium text-gray-600 mb-2">
                                  Front Side
                                </p>
                                <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
                                  <img
                                    src={userItem.citizenshipFront}
                                    alt="Citizenship Front"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-600 mb-2">
                                  Back Side
                                </p>
                                <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
                                  <img
                                    src={userItem.citizenshipBack}
                                    alt="Citizenship Back"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        User ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Identity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Verification Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((userItem) => (
                      <tr key={userItem.farmerID} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {userItem.farmerID}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {userItem.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {userItem.contact}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          farmer
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Select
                            value={
                              userItem.verified ? "verified" : "unverified"
                            }
                            onValueChange={(value) =>
                              handleVerificationChange(userItem.farmerID, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="verified">Verified</SelectItem>
                              <SelectItem value="unverified">
                                Unverified
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium cursor-pointer">
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-[90vw] max-w-3xl p-4"
                              align="start"
                            >
                              <div className="space-y-3">
                                <h4 className="font-semibold text-sm text-gray-900">
                                  Citizenship Documents
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-xs font-medium text-gray-600 mb-2">
                                      Front Side
                                    </p>
                                    <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
                                      <img
                                        src={userItem.citizenshipFront}
                                        alt="Citizenship Front"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-600 mb-2">
                                      Back Side
                                    </p>
                                    <div className="aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
                                      <img
                                        src={userItem.citizenshipBack}
                                        alt="Citizenship Back"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Orders Management
              </h3>
              <p className="text-gray-600">
                Order management features coming soon...
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Bounded>
  );
}

export default AdminDashboard;
