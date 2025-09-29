import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {assets} from "../../assets/assets";
import { addItem } from "../../Service/ItemService";





const ItemForm = () => {
   const {categories,setItemsData,itemsData,setCategories} = useContext(AppContext);
   const[image,setImage]=useState(false);
   const[loading,setLoading]=useState(false);
    const[data,setData] = useState({
        name : "",
        categoryId: "",
        price: "",
        description: "", 
    });

    const onChangeHandler = (e) =>{
        const value = e.target.value;
        const name = e.target.name;
        setData((data) => ({...data,[name]: value}));

    }

    const onSubmitHandler = async (e) =>{
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("item",JSON.stringify(data));
        formData.append("file",image);
        try{
            if(!image){
                toast.error("select image");
                    return;
            }
            const response =await addItem(formData);
            if(response.status === 201){
                setItemsData([...itemsData, response.data]);
                  setCategories((prevCategories) => 
    prevCategories.map((category) => category.categoryId === data.categoryId ? {...category,items: category.items+1}:category));
                toast.success("Item added");
                setData({
                    name: "",
                    description: "",
                    price: "",
                    categoryId:"",
                })
                setImage(false);

            }else{
                toast.error("Unable to add item");

            } 
        }catch(error){
            console.error(error);
            toast.error("Unable to add item");

        }finally{
            setLoading(false); 
        }
    }

    

    return(
        <div className="item-form-container" style={{height: '100vh', overflowY: 'auto',overflowX: 'hidden'}}>

            <div className="mx-2 mt-2">
         <div className="row">
            <div className="card col-md-8 form-container">
                <div className="card-body">
                    <form onSubmit={onSubmitHandler}>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">
                                <img src={image ? URL.createObjectURL(image) : assets.uploadImage} alt="" width={48}/>
                            </label>
                            <input type="file" name="image" id="image" className="form-control" hidden onChange={(e) => setImage(e.target.files[0])}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>  
                                    <input type="text" name="name" id="name" placeholder="Item Name" className="form-control" style={{ borderRadius: '7px' }} onChange={onChangeHandler} value={data.name} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="category">Category</label>
                            <select name="categoryId" id="category " className="form-control" style={{borderRadius: '7px' }} onChange={onChangeHandler} value={data.categoryId} required >
                                <option value="">--SELECT CATEGORY--</option>
                                {categories.map((category,index) => (
                                    <option key={index} value={category.categoryId}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Price</label>
                            <input type="number"  name="price" id="price" placeholder="&#8377;200.00" className="form-control" style={{borderRadius: '7px'}} onChange={onChangeHandler} value={data.price} required />
                        </div>
                         <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label> 
                           <textarea rows="7"  name="description" id="description" placeholder="Write content here.." className="form-control" style={{borderRadius: '7px'}} onChange={onChangeHandler} value={data.description} />
                        </div>
                        <button type="submit" className="btn btn-warning w-100" disabled={loading}>{loading ? "Loading.." : "Save"}</button>
                    </form>
                </div>
            </div>
         </div>
       </div>
        </div>
    );
}
export default ItemForm;