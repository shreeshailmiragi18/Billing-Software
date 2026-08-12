import { useEffect, useState } from "react";
import UsersForm from "../../Components/UsersForm/UsersForm";
import UsersList from "../../Components/UsersList/UsersList";
import { fetchUsers } from "../../Service/UserService";
import { toast } from "react-hot-toast";
import "./ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const response = await fetchUsers();
        setUsers(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Unable to fetch users");
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  return (
    <div className="users-container text-light">
      <div className="left-column">
        <UsersForm
          setUsers={setUsers}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>
      <div className="right-column">
        <UsersList
          users={users}
          setUsers={setUsers}
          setSelectedUser={setSelectedUser}
        />
      </div>
    </div>
  );
};

export default ManageUsers;
