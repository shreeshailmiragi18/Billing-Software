import { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";
import { addCategory, updateCategory } from "../../Service/CategoryService";

const CategoryForm = ({ selectedCategory, setSelectedCategory }) => {
  const { setCategories, categories } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    bgColor: "#2c2c2c",
  });

  useEffect(() => {
    if (selectedCategory) {
      setData({
        name: selectedCategory.name || "",
        description: selectedCategory.description || "",
        bgColor: selectedCategory.bgColor || "#2c2c2c",
      });

      setImage(false);
    } else {
      setData({ name: "", description: "", bgColor: "#2c2c2c" });
      setImage(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const onChangeHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let payload;

      if (selectedCategory && selectedCategory.categoryId) {
        payload = new FormData();
        payload.append("category", JSON.stringify(data));
        if (image) payload.append("file", image);
        const response = await updateCategory(
          selectedCategory.categoryId,
          payload
        );

        setCategories((prev) =>
          prev.map((c) =>
            c.categoryId === selectedCategory.categoryId ? response.data : c
          )
        );
        toast.success("Category updated");
        setSelectedCategory && setSelectedCategory(null);
      } else {

        if (!image) {
          toast.error("Select image");
          setLoading(false);
          return;
        }
        payload = new FormData();
        payload.append("category", JSON.stringify(data));
        payload.append("file", image);
        const response = await addCategory(payload);
        if (response.status === 201 || response.status === 200) {
          setCategories([...categories, response.data]);
          toast.success("Category added");
        }
      }

      setData({ name: "", description: "", bgColor: "#2c2c2c" });
      setImage(false);
    } catch (err) {
      console.error(err);
      toast.error("Error saving category");
    } finally {
      setLoading(false);
    }
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
                <label htmlFor="image" className="form-label">
                  <img
                    src={
                      image ? URL.createObjectURL(image) : assets.uploadImage
                    }
                    alt=""
                    width={48}
                  />
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  className="form-control"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Category Name"
                  className="form-control"
                  style={{ borderRadius: "7px" }}
                  onChange={onChangeHandler}
                  value={data.name}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  rows="5"
                  name="description"
                  id="description"
                  placeholder="Write content here.."
                  className="form-control"
                  style={{ borderRadius: "7px" }}
                  onChange={onChangeHandler}
                  value={data.description}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="bgcolor" className="form-label">
                  Background Color
                </label>
                <br />
                <input
                  type="color"
                  name="bgColor"
                  id="bgcolor"
                  placeholder="#ffffff"
                  style={{ width: 64 }}
                  onChange={onChangeHandler}
                  value={data.bgColor}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-warning w-100"
              >
                {loading
                  ? "Loading..."
                  : selectedCategory
                  ? "Update"
                  : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
