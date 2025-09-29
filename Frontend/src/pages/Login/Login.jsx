import './Login.css';
import {  useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../Service/AuthService';
import { toast } from 'react-hot-toast';
import { AppContext } from '../../context/AppContext';


const Login = () => {
    const {setAuthData} = useContext(AppContext);
    const navigate = useNavigate(); 
      const [loading,setLoading] = useState(false);
      const[data,setData] = useState({
        email:'',
        password:''
      });

      const onChangeHandler=(e)=>{ 
        const name= e.target.name;
        const value = e.target.value;
        setData((data)=>({...data,[name]:value}))
      }

        const onSubmitHandler= async (e)=>{
            e.preventDefault();
            setLoading(true);
            try{
                const response = await login(data);
                if(response.status === 200){
                    toast.success("Login Successful");
                    localStorage.setItem("token",response.data.token);
                    localStorage.setItem("role",response.data.role);
                    setAuthData(response.data.token,response.data.role);
                    navigate("/dashboard");
                }

            }catch(error){
                console.log(error);
                toast.error("Invalid Email or Password");
            }finally{
                setLoading(false);
            }
           
        }
    return(
       <div className="bg-light d-flex align-items-center justify-content-center vh-100 login-background" >
          <div className="card shadow-lg w-100" style={{maxWidth:'480px'}}>
            <div className="card-body">
                <div className="text-center">
                    <h1 className="card-title">Sign in</h1>
                    <p className="card-text text-muted">
                        Sign in below to access your account
                    </p>
                </div>
            <div className="mt-4">
                <form onSubmit={onSubmitHandler}>
                    <div className="mb-4">
                        <label htmlFor='email' className='form-label text-muted'>
                            Email address
                        </label>
                        <input type="text"  name="email" className='form-control' placeholder='yourname@example.com' id='email' style={{borderRadius:'3px'}} onChange={onChangeHandler} value={data.email} />
                    </div>
                    <div className="mb-4">
                   
                        <label htmlFor='password' className='form-label text-muted'>
                            Password
                        </label>
                        <input type="password"  name="password" className='form-control' placeholder='********' id='password' style={{borderRadius:'3px'}} onChange={onChangeHandler} value={data.password} />
                        
                    </div>
                    <div className="d-grid">
                        <button type="submit" className='btn btn-dark btn-lg' disabled={loading}>
                           {loading? "signing in...":"Sign in"}
                        </button>
                    </div>
                </form>
            </div>
            </div>
          </div>
        </div>
    )
}

export default Login;