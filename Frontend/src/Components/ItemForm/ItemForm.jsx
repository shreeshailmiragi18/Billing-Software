import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";
import { addItem, updateItem } from "../../Service/ItemService";

const ItemForm = ({ selectedItem, setSelectedItem }) => {
  const { categories, setItemsData, itemsData, setCategories } =
    useContext(AppContext);
  const [image, setImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    categoryId: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    if (selectedItem) {
      setData({
        name: selectedItem.name || "",
        categoryId: selectedItem.categoryId || "",
        price: selectedItem.price || "",
        description: selectedItem.description || "",
      });
      // try common image keys
      const img =
        selectedItem.image ||
        selectedItem.imageUrl ||
        selectedItem.photoUrl ||
        null;
      setPreviewUrl(img);
      setImage(false);
    } else {
      setData({ name: "", categoryId: "", price: "", description: "" });
      setPreviewUrl(null);
      setImage(false);
    }
  }, [selectedItem]);

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
      if (selectedItem && selectedItem.itemId) {
        // For updates, always send FormData with 'item' part so backend receives same shape as add
        payload = new FormData();
        payload.append("item", JSON.stringify(data));
        if (image) payload.append("file", image);
        const response = await updateItem(selectedItem.itemId, payload);
        setItemsData((prev) =>
          prev.map((it) =>
            it.itemId === selectedItem.itemId ? response.data : it
          )
        );
        // adjust category counts if changed
        if (selectedItem.categoryId !== data.categoryId) {
          setCategories((prevCategories) =>
            prevCategories.map((category) => {
              if (category.categoryId === selectedItem.categoryId)
                return { ...category, items: Math.max(0, category.items - 1) };
              if (category.categoryId === data.categoryId)
                return { ...category, items: category.items + 1 };
              return category;
            })
          );
        }
        toast.success("Item updated");
        setSelectedItem && setSelectedItem(null);
      } else {
        if (!image) {
          toast.error("select image");
          setLoading(false);
          return;
        }
        payload = new FormData();
        payload.append("item", JSON.stringify(data));
        payload.append("file", image);
        const response = await addItem(payload);
        if (response.status === 201) {
          setItemsData([...itemsData, response.data]);
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.categoryId === data.categoryId
                ? { ...category, items: category.items + 1 }
                : category
            )
          );
          toast.success("Item added");
          setData({ name: "", description: "", price: "", categoryId: "" });
          setImage(false);
        } else {
          toast.error("Unable to add item");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to save item");
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e) => {
    const f = e.target.files[0];
    setImage(f || false);
    if (f) setPreviewUrl(URL.createObjectURL(f));
    else setPreviewUrl(null);
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div className="mx-2 mt-2" style={{ height: "100%" }}>
        <div className="row" style={{ height: "100%" }}>
          <div
            className="card col-md-8 form-container"
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
                      src={previewUrl ? previewUrl : assets.uploadImage}
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
                    onChange={onFileChange}
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
                    placeholder="Item Name"
                    className="form-control"
                    style={{ borderRadius: "7px" }}
                    onChange={onChangeHandler}
                    value={data.name}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="category">
                    Category
                  </label>
                  <select
                    name="categoryId"
                    id="category "
                    className="form-control"
                    style={{ borderRadius: "7px" }}
                    onChange={onChangeHandler}
                    value={data.categoryId}
                    required
                  >
                    <option value="">--SELECT CATEGORY--</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category.categoryId}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    placeholder="&#8377;200.00"
                    className="form-control"
                    style={{ borderRadius: "7px" }}
                    onChange={onChangeHandler}
                    value={data.price}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    rows="7"
                    name="description"
                    id="description"
                    placeholder="Write content here.."
                    className="form-control"
                    style={{ borderRadius: "7px" }}
                    onChange={onChangeHandler}
                    value={data.description}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-warning w-100"
                  disabled={loading}
                >
                  {loading ? "Loading.." : selectedItem ? "Update" : "Save"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ItemForm;
