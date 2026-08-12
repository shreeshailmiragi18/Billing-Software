import { useState } from "react";
import CategoryForm from "../../Components/CategoryForm/CategoryForm";
import CategoryList from "../../Components/CategoryList/CategoryList";
import "./ManageCategory.css";

const ManageCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  return (
    <div className="category-container text-light">
      <div className="left-column">
        <CategoryForm
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>
      <div className="right-column">
        <CategoryList setSelectedCategory={setSelectedCategory} />
      </div>
    </div>
  );
};

export default ManageCategory;
