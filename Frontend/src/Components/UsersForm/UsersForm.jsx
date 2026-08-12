import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { addUser, updateUser } from "../../Service/UserService";

const UsersForm = ({ setUsers, selectedUser, setSelectedUser }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ROLE_USER",
  });
  const [file, setFile] = useState(null);

  const onChangeHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setData((data) => ({ ...data, [name]: value }));
  };

  useEffect(() => {
    if (selectedUser) {
      setData({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        password: "",
        role: selectedUser.role || "ROLE_USER",
      });
      setFile(null);
    } else {
      // reset
      setData({ name: "", email: "", password: "", role: "ROLE_USER" });
      setFile(null);
    }
  }, [selectedUser]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Build payload with user fields (no mobile/profilePhoto)
      let payload = { ...data };
      if (!payload.password) delete payload.password;

      let response;
      if (selectedUser && selectedUser.userId) {
        // update
        response = await updateUser(selectedUser.userId, payload);
        // update local users list
        setUsers((prev) =>
          prev.map((u) =>
            u.userId === selectedUser.userId ? response.data : u
          )
        );
        toast.success("User updated");
        // clear selected user
        setSelectedUser && setSelectedUser(null);
      } else {
        response = await addUser(payload);
        setUsers((prevUsers) => [...prevUsers, response.data]);
        toast.success("User Added");
      }
      // reset form
      setData({ name: "", email: "", password: "", role: "ROLE_USER" });
      setFile(null);
    } catch (e) {
      console.error(e);
      toast.error("Error saving user");
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f || null);
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div className="row" style={{ height: "100%" }}>
        <div
          className="card col-md-12 form-container"
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            right: 8,
            bottom: 8,
            overflow: "hidden",
          }}
        >
          <div className="card-body" style={{ height: "100%" }}>
            <form onSubmit={onSubmitHandler}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Jhon Doe"
                  className="form-control"
                  style={{ borderRadius: "7px" }}
                  onChange={onChangeHandler}
                  value={data.name}
                  required
                />
              </div>
              {/* Mobile and Profile Photo fields removed as requested */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="yourname@example.com"
                  className="form-control"
                  style={{ borderRadius: "7px" }}
                  onChange={onChangeHandler}
                  value={data.email}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="********"
                  className="form-control"
                  style={{ borderRadius: "7px" }}
                  onChange={onChangeHandler}
                  value={data.password}
                />
                {selectedUser && (
                  <div className="form-text">
                    Leave password empty to keep existing password.
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-warning w-100"
                disabled={loading}
              >
                {loading ? "Loading..." : selectedUser ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UsersForm;
