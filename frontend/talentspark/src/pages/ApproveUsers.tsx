import { useEffect, useState } from "react";
import { getPendingUsers, approveUser, getAllUsers, deleteUser } from "../Services/AuthService";

interface Props {
  currentUser?: any;
}

export default function ApproveUsers({ currentUser }: Props) {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<"pending" | "all">("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  
  // Custom Confirmation Modal & Toast States
  const [userToDelete, setUserToDelete] = useState<{ id: number; email: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load initial data on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [pendingData, allData] = await Promise.all([
          getPendingUsers(),
          getAllUsers()
        ]);
        setPendingUsers(pendingData);
        setAllUsers(allData);
        setError(null);
      } catch (err: any) {
        console.error("Error loading user administration data:", err);
        setError(err.response?.data?.detail || "Failed to load user records.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleApprove = async (userId: number, email: string) => {
    setActionLoading(userId);
    try {
      await approveUser(userId);
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
      setAllUsers((prev) => prev.map((u) => u.id === userId ? { ...u, is_approved: true } : u));
      showToast(`Approved ${email} successfully!`, "success");
    } catch (err: any) {
      console.error("Error approving user:", err);
      showToast(err.response?.data?.detail || "Failed to approve user.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: number, email: string) => {
    if (currentUser && currentUser.id === userId) {
      showToast("You cannot delete your own account.", "error");
      return;
    }

    setActionLoading(userId);
    try {
      await deleteUser(userId);
      setAllUsers((prev) => prev.filter((u) => u.id !== userId));
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast(`User ${email} deleted successfully.`, "success");
    } catch (err: any) {
      console.error("Error deleting user:", err);
      showToast(err.response?.data?.detail || "Failed to delete user.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [pendingData, allData] = await Promise.all([
        getPendingUsers(),
        getAllUsers()
      ]);
      setPendingUsers(pendingData);
      setAllUsers(allData);
      setError(null);
      showToast("Data refreshed.", "success");
    } catch (err: any) {
      console.error("Error refreshing data:", err);
      setError("Failed to refresh records.");
      showToast("Failed to refresh records.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="antigravity-card p-8 flex flex-col gap-6 text-left relative max-w-4xl mx-auto">
      {/* Manila Folder Tab */}
      <div className="folder-tab">SUPER ADMIN: {activeSubTab === "pending" ? "PENDING APPROVALS" : "REGISTERED USERS"}</div>

      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-[32px] text-[#14171A] font-bold m-0 leading-tight" style={{ fontFamily: "'Space Mono', monospace" }}>
            User Administration
          </h2>
          <p className="text-[#767B82] text-xs font-mono uppercase">
            [ Manage access permissions and system accounts ]
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 border border-[#DDE0DA] rounded hover:bg-[#F4F5F2]/50 active:scale-95 transition-all cursor-pointer bg-white"
          title="Refresh User Records"
        >
          <span className="material-symbols-outlined text-[18px] text-[#767B82]">refresh</span>
        </button>
      </div>

      {/* Sub tabs */}
      <div className="flex gap-2 border-b border-[#DDE0DA]">
        <button
          onClick={() => setActiveSubTab("pending")}
          className={`px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer border-b-2 bg-transparent ${
            activeSubTab === "pending"
              ? "border-[#3F5B44] text-[#3F5B44]"
              : "border-transparent text-[#767B82] hover:text-[#14171A]"
          }`}
        >
          Pending Approvals ({pendingUsers.length})
        </button>
        <button
          onClick={() => setActiveSubTab("all")}
          className={`px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer border-b-2 bg-transparent ${
            activeSubTab === "all"
              ? "border-[#3F5B44] text-[#3F5B44]"
              : "border-transparent text-[#767B82] hover:text-[#14171A]"
          }`}
        >
          Registered Users ({allUsers.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <span className="material-symbols-outlined animate-spin text-[32px] text-[#3F5B44]">sync</span>
        </div>
      ) : error ? (
        <div className="text-red-700 font-mono text-xs p-4 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      ) : activeSubTab === "pending" ? (
        pendingUsers.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-[#DDE0DA] rounded-xl">
            <span className="material-symbols-outlined text-[48px] text-[#767B82]/40 mb-2">check_circle</span>
            <p className="text-[#767B82] text-xs font-mono uppercase m-0">No pending registration requests</p>
          </div>
        ) : (
          <div className="border border-[#DDE0DA] rounded-xl overflow-x-auto bg-white">
            <table className="w-full border-collapse text-left text-xs font-mono table-fixed">
              <thead>
                <tr className="bg-[#E4E6E1] text-[#767B82] border-b border-[#DDE0DA]">
                  <th className="p-4 uppercase font-bold w-[25%]">Name</th>
                  <th className="p-4 uppercase font-bold w-[45%]">Email</th>
                  <th className="p-4 uppercase font-bold w-[15%]">Requested Role</th>
                  <th className="p-4 text-right uppercase font-bold w-[15%]">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[#DDE0DA] hover:bg-[#F4F5F2]/50 transition-colors">
                    <td className="p-4 text-[#14171A] font-semibold font-body-md truncate" title={user.name}>{user.name}</td>
                    <td className="p-4 text-[#767B82] truncate" title={user.email}>{user.email}</td>
                    <td className="p-4 text-[#767B82] font-semibold uppercase truncate">{user.role}</td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleApprove(user.id, user.email)}
                        disabled={actionLoading === user.id}
                        className="px-3 py-1.5 bg-[#3F5B44] text-white hover:bg-[#324936] rounded font-mono font-bold text-[10px] tracking-wider uppercase border-none cursor-pointer active:scale-95 transition-all shadow-xs disabled:opacity-50"
                      >
                        {actionLoading === user.id ? "Approve..." : "Approve"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        allUsers.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-[#DDE0DA] rounded-xl">
            <span className="material-symbols-outlined text-[48px] text-[#767B82]/40 mb-2">group</span>
            <p className="text-[#767B82] text-xs font-mono uppercase m-0">No registered users found</p>
          </div>
        ) : (
          <div className="border border-[#DDE0DA] rounded-xl overflow-x-auto bg-white">
            <table className="w-full border-collapse text-left text-xs font-mono table-fixed">
              <thead>
                <tr className="bg-[#E4E6E1] text-[#767B82] border-b border-[#DDE0DA]">
                  <th className="p-4 uppercase font-bold w-[20%]">Name</th>
                  <th className="p-4 uppercase font-bold w-[35%]">Email</th>
                  <th className="p-4 uppercase font-bold w-[15%]">Role</th>
                  <th className="p-4 uppercase font-bold w-[15%]">Status</th>
                  <th className="p-4 text-right uppercase font-bold w-[15%]">Action</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => {
                  const isSelf = currentUser && currentUser.id === user.id;
                  return (
                    <tr key={user.id} className="border-b border-[#DDE0DA] hover:bg-[#F4F5F2]/50 transition-colors">
                      <td className="p-4 text-[#14171A] font-semibold font-body-md truncate" title={user.name}>
                        {user.name} {isSelf && <span className="text-[10px] text-[#3F5B44] bg-[#3F5B44]/10 px-1.5 py-0.5 rounded font-mono font-bold uppercase ml-1">(You)</span>}
                      </td>
                      <td className="p-4 text-[#767B82] truncate" title={user.email}>{user.email}</td>
                      <td className="p-4 text-[#767B82] font-semibold uppercase truncate">{user.role}</td>
                      <td className="p-4 truncate">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          user.is_approved 
                            ? "bg-green-100 text-green-800" 
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {user.is_approved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        {isSelf ? (
                          <button
                            disabled
                            className="px-3 py-1.5 bg-[#E4E6E1] text-[#767B82] rounded font-mono font-bold text-[10px] tracking-wider uppercase border-none cursor-not-allowed"
                          >
                            Delete
                          </button>
                        ) : (
                          <button
                            onClick={() => setUserToDelete({ id: user.id, email: user.email })}
                            disabled={actionLoading === user.id}
                            className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-mono font-bold text-[10px] tracking-wider uppercase border-none cursor-pointer active:scale-95 transition-all shadow-xs disabled:opacity-50"
                          >
                            {actionLoading === user.id ? "Delete..." : "Delete"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Premium Custom Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-[#14171A]/40 backdrop-blur-xs flex items-center justify-center z-[1000] p-4 animate-fade-in">
          <div className="bg-[#F4F5F2] border border-[#DDE0DA] rounded-xl shadow-2xl w-full max-w-md overflow-hidden text-left relative" style={{ boxSizing: "border-box" }}>
            {/* Header tab styling */}
            <div className="px-6 pt-6 pb-4 border-b border-[#DDE0DA]">
              <div 
                className="text-[9px] font-mono font-bold uppercase tracking-widest text-red-700 bg-red-500/10 px-2 py-0.5 rounded w-fit mb-2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Security Action Required
              </div>
              <h3 
                className="m-0 text-lg font-bold text-[#14171A] tracking-tight uppercase"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Confirm Account Deletion
              </h3>
            </div>

            {/* Content Body */}
            <div className="p-6 flex flex-col gap-3">
              <p className="text-xs text-[#767B82] leading-relaxed font-mono m-0">
                Are you sure you want to permanently delete user <span className="font-bold text-[#14171A] break-all">{userToDelete.email}</span>?
              </p>
              <p className="text-xs text-red-700/80 leading-relaxed font-mono m-0 bg-red-50 p-3 rounded border border-red-200/50">
                Warning: This operation is final. This will delete their profile and all associated case records, files, or applications.
              </p>
            </div>

            {/* Action buttons footer */}
            <div className="px-6 py-4 border-t border-[#DDE0DA] bg-[#EBECE8] flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 bg-transparent text-[#767B82] hover:text-[#14171A] border border-[#DDE0DA] rounded text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const { id, email } = userToDelete;
                  setUserToDelete(null);
                  handleDeleteUser(id, email);
                }}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white border-none rounded text-xs font-bold uppercase tracking-wider cursor-pointer active:scale-95 transition-all shadow-sm"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Custom Toast Message */}
      {toast && (
        <div className="fixed top-20 right-6 z-[10000] animate-fade-in-up">
          <div className={`antigravity-card p-4 rounded-lg flex items-center gap-3 border shadow-lg max-w-sm ${
            toast.type === "success" 
              ? "bg-[#F4F5F2] border-[#3F5B44]/30 text-[#3F5B44]" 
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            <span className="material-symbols-outlined text-[20px]">
              {toast.type === "success" ? "check_circle" : "error"}
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              {toast.message}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
