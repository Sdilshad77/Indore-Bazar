import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Check, MapPin, Phone, X } from "lucide-react";
import { adminGetShops, adminUpdateShop } from "../../store/slices/adminSlice.js";
import AdminNav from "../../components/admin/AdminNav.jsx";
import Spinner from "../../components/Spinner.jsx";
import { toastError, toastSuccess } from "../../utils/toast.js";

const STATUS_BADGES = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

export default function AdminShops() {
  const dispatch = useDispatch();
  const { shops, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(adminGetShops());
  }, [dispatch]);

  const review = async (sid, status) => {
    const res = await dispatch(adminUpdateShop({ sid, status }));
    if (res.meta.requestStatus === "fulfilled") {
      toastSuccess(`Shop ${status === "accepted" ? "approved 🎉" : "rejected"}`);
    } else {
      toastError(res.payload || "Failed to update shop");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8">
      <AdminNav />
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Shops</h1>
        <p className="text-sm text-muted mt-1">
          Approve or reject shop applications — approved shops go live instantly
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {shops.map((s) => (
            <div key={s._id} className="bg-white rounded-2xl border border-line p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="h-12 w-12 rounded-2xl bg-primary-light text-primary text-xl font-extrabold flex items-center justify-center shrink-0">
                    {s.name?.[0]?.toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="font-extrabold truncate">{s.name}</p>
                    <p className="text-xs text-muted truncate">
                      by {s.user?.name} · {s.user?.phone}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shrink-0 ${STATUS_BADGES[s.status]}`}>
                  {s.status}
                </span>
              </div>

              <p className="text-sm text-muted mt-3 line-clamp-2">{s.description}</p>

              <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted">
                <span className="flex items-center gap-1"><MapPin size={13} className="text-primary" /> {s.address}</span>
                <span className="flex items-center gap-1"><Phone size={13} className="text-primary" /> {s.shopPhone}</span>
              </div>

              {s.status === "pending" && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => review(s._id, "accepted")}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white font-bold text-sm py-2.5 rounded-xl hover:bg-primary-dark transition"
                  >
                    <Check size={15} /> Approve
                  </button>
                  <button
                    onClick={() => review(s._id, "rejected")}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 text-red-600 font-bold text-sm py-2.5 rounded-xl hover:bg-red-100 transition"
                  >
                    <X size={15} /> Reject
                  </button>
                </div>
              )}
              {s.status === "accepted" && (
                <p className="mt-4 text-[11px] font-bold text-green-600 bg-green-50 rounded-xl py-2.5 text-center">
                  ✓ Live on Indore Bazar — owner is selling!
                </p>
              )}
            </div>
          ))}
          {shops.length === 0 && (
            <div className="md:col-span-2 bg-white rounded-3xl border border-line p-12 text-center text-muted">
              No shops registered yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}