import { useState } from "react";
import ItemForm from "../../Components/ItemForm/ItemForm";
import ItemList from "../../Components/ItemList/ItemList";
import "./ManageItems.css";

const ManageItems = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  return (
    <div className="items-container text-light">
      <div className="left-column">
        <ItemForm
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      </div>
      <div className="right-column">
        <ItemList setSelectedItem={setSelectedItem} />
      </div>
    </div>
  );
};

export default ManageItems;
