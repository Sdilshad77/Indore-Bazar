import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BadgeCheck, Search, UserX } from "lucide-react";
import { adminGetUsers, adminUpdateUser } from "../../store/slices/adminSlice.js";
import AdminNav from "../../components/admin/AdminNav.jsx";
import Spinner from "../../components/Spinner.jsx";
import { toastError, toastSuccess } from "../../utils/toast.js";

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.admin);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    dispatch(adminGetUsers());
  }, [dispatch]);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(q.toLowerCase()) ||
      u.email?.toLowerCase().includes(q.toLowerCase()) ||
      u.phone?.includes(q)
  );

  const toggle = async (u) => {
    setBusy(u._id);
    const res = await dispatch(adminUpdateUser({ uid: u._id, isActive: !u.isActive }));
    setBusy(null);
    if (res.meta.requestStatus === "fulfilled") {
      toastSuccess(u.isActive ? "User deactivated" : "User activated");
    } else {
      toastError(res.payload || "Failed to update user");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8">
      <AdminNav />
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Users</h1>
          <p className="text-sm text-muted mt-1">{users.length} registered users</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search users..."
            className="bg-white border border-line rounded-2xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-line overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="bg-surface text-left text-xs uppercase text-muted">
                  <th className="px-5 py-3.5 font-bold">User</th>
                  <th className="px-5 py-3.5 font-bold">Contact</th>
                  <th className="px-5 py-3.5 font-bold">Role</th>
                  <th className="px-5 py-3.5 font-bold">Joined</th>
                  <th className="px-5 py-3.5 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-surface/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="h-9 w-9 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold truncate">{u.name}</p>
                          <p className="text-xs text-muted truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted">{u.phone}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        {u.isAdmin && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Admin</span>
                        )}
                        {u.isShopOwner && (
                          <span className="text-[10px] font-bold bg-primary-light text-primary px-2 py-1 rounded-full flex items-center gap-0.5">
                            <BadgeCheck size={10} /> Seller
                          </span>
                        )}
                        {!u.isAdmin && !u.isShopOwner && (
                          <span className="text-[10px] font-bold bg-surface text-muted px-2 py-1 rounded-full">Customer</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => toggle(u)}
                        disabled={busy === u._id}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition disabled:opacity-50 ${
                          u.isActive
                            ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                            : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                        }`}
                      >
                        {busy === u._id ? (
                          <Spinner size="sm" />
                        ) : u.isActive ? (
                          <><BadgeCheck size={13} /> Active</>
                        ) : (
                          <><UserX size={13} /> Inactive</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-muted">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}