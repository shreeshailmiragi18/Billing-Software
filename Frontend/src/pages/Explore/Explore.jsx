import { AppContext } from '../../context/AppContext';
import { useContext, useState } from 'react'; 
import DisplayCategory from "../../Components/DisplayCategory/DisplayCategory";
import DisplayItems from "../../Components/DisplayItems/DisplayItems";
import CartItems from "../../Components/CartItems/CartItems";
import CartSummary from "../../Components/CartSummary/CartSummary";
import CustomerForm from "../../Components/CustomerForm/CustomerForm";
import './Explore.css'; 

const Explore = () => {
    const[selectedCategory,setSelectedCategory]=useState("");
    const[mobileNumber,setMobileNumber]= useState("");
    const[customerName,setCustomerName]=useState("");
    const {categories} = useContext (AppContext);
    console.log(categories);
    return(
        <div className="explore-container text-light">
            <div className="left-column">
                <div className="first-row" style={{overflowY:'auto'}}>
                   <DisplayCategory
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory} 
                    categories={categories}/>

                </div>
                <hr  className="horizontal-line"/>
                <div className="second-row" style={{overflowY:'auto'}}>
                    <DisplayItems selectedCategory={selectedCategory}/>

                </div>
            </div>
            <div className="right-column d-flex flex-column">
                <div className="customer-form-container" style={{height:'15%'}}>
                    <CustomerForm
                     customerName={customerName}
                     mobileNumber={mobileNumber}
                     setMobileNumber={setMobileNumber}
                     setCustomerName={setCustomerName}
                    />
                </div>

        
            <hr className="my-3 text-light"/>
            <div className="cart-items-container" style={{height: '55%',overflowY:'auto'}}>
               <CartItems />

            </div>
            <div className="cart-summary-container" style={{height:'30%'}}>
                <CartSummary 
                     customerName={customerName}
                     mobileNumber={mobileNumber}
                     setMobileNumber={setMobileNumber}
                     setCustomerName={setCustomerName}
                />

            </div>
            </div>
        </div>
    );
}

export default Explore;