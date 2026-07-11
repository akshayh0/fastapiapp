import { useEffect, useState } from "react";
import { getPendingUsers, approveUser } from "../Services/AuthService";

export default function ApproveUsers() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchPendingUsers() {
    setLoading(true);
    try {
      const data = await getPendingUsers();
      setPendingUsers(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching pending users:", err);
      setError(err.response?.data?.detail || "Failed to fetch pending users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId: number, email: string) => {
    try {
      await approveUser(userId);
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
      alert(`User ${email} has been approved successfully!`);
    } catch (err: any) {
      console.error("Error approving user:", err);
      alert(err.response?.data?.detail || "Failed to approve user.");
    }
  };

  return (
    <div className="antigravity-card p-8 flex flex-col gap-6 text-left relative max-w-3xl mx-auto">
      {/* Manila Folder Tab */}
      <div className="folder-tab">SUPER ADMIN: PENDING APPROVALS</div>

      <div className="space-y-1">
        <h2 className="text-[32px] text-[#14171A] font-bold m-0 leading-tight" style={{ fontFamily: "'Space Mono', monospace" }}>
          Registration Requests
        </h2>
        <p className="text-[#767B82] text-xs font-mono uppercase">
          [ Review and approve access to Career.AI ]
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <span className="material-symbols-outlined animate-spin text-[32px] text-[#3F5B44]">sync</span>
        </div>
      ) : error ? (
        <div className="text-red-700 font-mono text-xs p-4 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      ) : pendingUsers.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-[#DDE0DA] rounded-xl">
          <span className="material-symbols-outlined text-[48px] text-[#767B82]/40 mb-2">check_circle</span>
          <p className="text-[#767B82] text-xs font-mono uppercase m-0">No pending registration requests</p>
        </div>
      ) : (
        <div className="border border-[#DDE0DA] rounded-xl overflow-hidden bg-white">
          <table className="w-full border-collapse text-left text-xs font-mono">
            <thead>
              <tr className="bg-[#E4E6E1] text-[#767B82] border-b border-[#DDE0DA]">
                <th className="p-4 uppercase font-bold">Name</th>
                <th className="p-4 uppercase font-bold">Email</th>
                <th className="p-4 uppercase font-bold">Requested Role</th>
                <th className="p-4 text-right uppercase font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user.id} className="border-b border-[#DDE0DA] hover:bg-[#F4F5F2]/50 transition-colors">
                  <td className="p-4 text-[#14171A] font-semibold font-body-md">{user.name}</td>
                  <td className="p-4 text-[#767B82]">{user.email}</td>
                  <td className="p-4 text-[#767B82] font-semibold uppercase">{user.role}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleApprove(user.id, user.email)}
                      className="px-3 py-1.5 bg-[#3F5B44] text-white hover:bg-[#324936] rounded font-mono font-bold text-[10px] tracking-wider uppercase border-none cursor-pointer active:scale-95 transition-all shadow-xs"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
