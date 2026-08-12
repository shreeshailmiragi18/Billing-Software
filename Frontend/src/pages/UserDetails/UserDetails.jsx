import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserById, updateUser } from "../../Service/UserService";
import { toast } from "react-hot-toast";
import "./UserDetails.css";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    role: "ROLE_USER",
    password: "",
  });
  const [mobile, setMobile] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const res = await fetchUserById(id);
        setUser(res.data);
        setData({
          name: res.data.name || "",
          email: res.data.email || "",
          role: res.data.role || "ROLE_USER",
          password: "",
        });
        setMobile(res.data.mobile || "");
        setPreviewUrl(res.data.profilePhoto || res.data.imgUrl || null);
      } catch (err) {
        console.error(err);
        toast.error("Unable to fetch user details");
      } finally {
        setLoading(false);
      }
    }
    if (id) loadUser();
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value }));
  };

  const onFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f || null);
    if (f) setPreviewUrl(URL.createObjectURL(f));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let payload;
      if (file) {
        payload = new FormData();
        payload.append("name", data.name);
        payload.append("email", data.email);
        if (data.password) payload.append("password", data.password);
        payload.append("role", data.role);
        payload.append("mobile", mobile);
        payload.append("profilePhoto", file);
      } else {
        payload = { ...data, mobile };
        if (!payload.password) delete payload.password;
      }

      const res = await updateUser(id, payload);
      toast.success("User updated");
      // After update, go back to users list and reload to reflect changes
      navigate("/users");
      // reload to ensure list refresh (simple approach)
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Unable to update user");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) return <div className="p-4 text-light">Loading...</div>;
  if (!user) return <div className="p-4 text-light">No user found.</div>;

  return (
    <div className="user-details p-4 text-light">
      <div className="card p-3 bg-dark">
        <div className="d-flex gap-3 align-items-start">
          <div style={{ textAlign: "center", minWidth: 140 }}>
            <label htmlFor="profilePhoto" style={{ cursor: "pointer" }}>
              <img
                src={previewUrl || "/assets/default-user.png"}
                alt={data.name}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 12,
                  objectFit: "cover",
                }}
              />
            </label>
            <div className="mt-2 text-muted" style={{ fontSize: 12 }}>
              <div>User ID</div>
              <div style={{ color: "#fff", fontWeight: 600 }}>
                {user.userId}
              </div>
            </div>
            <input
              id="profilePhoto"
              type="file"
              accept="image/*"
              hidden
              onChange={onFileChange}
            />
          </div>
          <div style={{ flex: 1 }}>
            <form onSubmit={onSubmit}>
              <div className="mb-2">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={data.name}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  name="email"
                  value={data.email}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Mobile</label>
                <input
                  className="form-control"
                  name="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Password</label>
                <input
                  className="form-control"
                  name="password"
                  value={data.password}
                  onChange={onChange}
                  placeholder="Leave empty to keep existing"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Role</label>
                <select
                  name="role"
                  value={data.role}
                  onChange={onChange}
                  className="form-control"
                >
                  <option value="ROLE_USER">User</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button
                  type="submit"
                  className="btn btn-warning"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
