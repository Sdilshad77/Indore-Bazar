import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { getMyShop } from "../../store/slices/shopSlice.js";
import { getProducts } from "../../store/slices/productSlice.js";
import ShopNav from "../../components/shop/ShopNav.jsx";
import Spinner from "../../components/Spinner.jsx";
import API from "../../api/axios.js";
import { toastError, toastSuccess } from "../../utils/toast.js";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  image: null,
  preview: "",
};

export default function ShopProducts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myShop } = useSelector((state) => state.shops);
  const { products } = useSelector((state) => state.products);

  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    dispatch(getMyShop()).finally(() => setLoading(false));
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!myShop) navigate("/seller/dashboard");
  }, [myShop, navigate]);

  const myProducts = useMemo(
    () => products.filter((p) => p.shop?._id === myShop?._id),
    [products, myShop]
  );

  const resetForm = () => {
    setForm(EMPTY);
    setEditing(null);
    setModal(false);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category: p.category,
      image: null,
      preview: "",
    });
    setModal(true);
  };

  const onImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, image: file, preview: URL.createObjectURL(file) });
  };

  const save = async (e) => {
    e.preventDefault();
    if (!myShop) return;
    setSaving(true);
    try {
      if (editing) {
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description);
        fd.append("price", form.price);
        fd.append("stock", form.stock);
        fd.append("category", form.category);
        if (form.image) fd.append("productImage", form.image);
        await API.put(`/api/shop-owner/product/${editing._id}`, fd);
        toastSuccess("Product updated!");
        resetForm();
      } else {
        if (!form.image) {
          toastError("Please upload a product image");
          setSaving(false);
          return;
        }
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description);
        fd.append("price", form.price);
        fd.append("stock", form.stock);
        fd.append("category", form.category);
        fd.append("shopId", myShop._id);
        fd.append("productImage", form.image);
        const { data } = await API.post("/api/shop-owner/add-product", fd);
        toastSuccess("Product added to your shop!");
        resetForm();
      }
      dispatch(getProducts());
    } catch (err) {
      toastError(err?.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    setDeleting(p._id);
    try {
      await API.delete(`/api/shop-owner/product/${p._id}`);
      toastSuccess("Product deleted");
      dispatch(getProducts());
    } catch (err) {
      toastError(err?.response?.data?.message || "Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
      <ShopNav shopName={myShop?.name} />

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">My products</h1>
          <p className="text-sm text-muted mt-1">{myProducts.length} product{myProducts.length === 1 ? "" : "s"} live</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-primary text-white font-bold px-5 py-3 rounded-2xl hover:bg-primary-dark transition shadow-lg shadow-primary/30"
        >
          <Plus size={18} /> Add product
        </button>
      </div>

      {myProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-line p-12 text-center">
          <p className="text-5xl">📦</p>
          <p className="font-extrabold mt-4 text-lg">No products yet</p>
          <p className="text-sm text-muted mt-1">Add your first product to start selling! 🚀</p>
          <button
            onClick={() => setModal(true)}
            className="mt-5 bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:bg-primary-dark transition"
          >
            + Add your first product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {myProducts.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl border border-line p-4 flex gap-4">
              <img src={p.productImage} alt={p.name} className="h-20 w-20 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{p.name}</p>
                <p className="text-xs text-muted truncate">{p.description}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-bold bg-surface px-2 py-0.5 rounded-full">{p.category}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="font-extrabold text-primary">₹{p.price}</p>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openEdit(p)}
                      className="h-10 w-10 rounded-lg bg-surface hover:bg-primary-light text-ink hover:text-primary flex items-center justify-center transition"
                      aria-label="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => remove(p)}
                      disabled={deleting === p._id}
                      className="h-10 w-10 rounded-lg bg-surface hover:bg-red-50 text-ink hover:text-red-500 flex items-center justify-center transition disabled:opacity-50"
                      aria-label="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={resetForm}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-pop"
          >
            <div className="flex items-center justify-between p-5 border-b border-line sticky top-0 bg-white rounded-t-3xl">
              <h2 className="font-extrabold text-lg">
                {editing ? "Edit product" : "Add new product"}
              </h2>
              <button onClick={resetForm} className="p-2 rounded-full hover:bg-surface">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={save} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-muted uppercase">Product image</label>
                <label className="mt-1.5 flex items-center justify-center gap-2 border-2 border-dashed border-line rounded-2xl p-4 cursor-pointer hover:border-primary transition">
                  {form.preview ? (
                    <img src={form.preview} alt="" className="h-24 w-24 rounded-xl object-cover" />
                  ) : editing ? (
                    <img src={editing.productImage} alt="" className="h-24 w-24 rounded-xl object-cover" />
                  ) : (
                    <span className="flex flex-col items-center text-muted py-3">
                      <ImagePlus size={26} className="text-primary" />
                      <span className="text-xs font-semibold mt-2">Upload image</span>
                    </span>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={onImage} />
                </label>
                {!editing && <p className="text-[10px] text-muted mt-1">Required — product won't show without an image</p>}
                {editing && <p className="text-[10px] text-muted mt-1">Pick a new image only if you want to replace the current one</p>}
              </div>

              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Product name (e.g. Amul Milk 500ml)"
                className="w-full bg-surface rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <textarea
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description"
                rows={2}
                className="w-full bg-surface rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  required
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Price ₹"
                  className="w-full bg-surface rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  required
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="Stock"
                  className="w-full bg-surface rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-surface rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Category</option>
                  {["Dairy", "Bakery", "Fruits", "Vegetables", "Snacks", "Beverages", "Personal Care", "Household", "Meat & Fish", "Baby Care"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-primary text-white font-extrabold py-3.5 rounded-2xl hover:bg-primary-dark transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? <Spinner size="sm" light /> : editing ? "Update product" : "Add product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}