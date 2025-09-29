import { useState,useContext } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { deleteItem } from "../../Service/ItemService";
import './ItemList.css';




const ItemList = () => {
    const {itemsData,setItemsData} = useContext(AppContext);
    const [searchItem,setSearchItem] = useState("");
    const filteredItems = itemsData.filter((item)=> {
        return item.name.toLowerCase().includes(searchItem.toLowerCase());
    })

    const removeItem = async(itemId) => {
        try{
            const response = await deleteItem(itemId);
            if(response.status === 204){
                const updatedItems = itemsData.filter(item => item.itemId !== itemId);
                setItemsData(updatedItems);
                toast.success("Item deleted");
            }else{
                toast.error("unable to delete item");
            }
        }catch(err){
            console.error(err);
            toast.error("unable to delete item");
        }

    }
   return (
    <div className="category-list-container" style={{ height: "100vh", overflowY: "auto", overflowX: "hidden" }}>
      <div className="row pe-2">
              <div className="input-group mb-3">
                    <input type="text" name="keyword"  id="keyword" className="form-control" placeholder="Search keyword"   onChange={(e)=>setSearchItem(e.target.value)} value={searchItem} style={{borderTopLeftRadius:'7px', borderBottomLeftRadius:'7px'}}/>
                    <span className="input-group-text bg-warning">
                           <i className="bi bi-search"></i>
                    </span>
              </div> 
      </div>
      <div className="row g-3 pe2">
              {filteredItems.map((item,index) => (
                    <div className="col-12" key={index}>
                        <div className="card p-3 bg-dark">
                            <div className="d-flex align-items-center">
                                <div style={{marginRight: '15px'}}>
                                    <img src={item.imgUrl} alt={item.name} width={48} className="item-image" />
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="mb-1 text-white">{item.name}</h6>
                                    <p className="mb-0 text-white">
                                        Category : {item.categoryName}
                                    </p>
                                    <span className="mb-0 text-block badge rounded-pill text-bg-warning">
                                        &#8377;{item.price}
                                    </span>
                                </div>
                                <div>
                                <burron className="btn btn-danger btn-sm" onClick={() => removeItem(item.itemId)}>
                                    <i className="bi bi-trash"></i>
                                </burron>
                                </div>
                            </div>
                        </div>
                    </div>

                ))}
      </div>
    </div>
  );
}

export default ItemList;