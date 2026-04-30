import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  useEffect(() => {
    const fetchUser = async () => {
      if (userData) return; 
      try {
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        }
        console.log(err);
      }
    };

    fetchUser();
  }, [dispatch, navigate, userData]);

  return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#020617] via-[#0f172a] to-black">

  
    <NavBar />

  
    <main className="flex-1 pt-20 pb-24 px-4 md:px-6 lg:px-10 relative">

      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-[10%] w-[300px] h-[300px] bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-100px] right-[10%] w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto w-full">

        
        
            <Outlet />
         
      </div>
    </main>


    <Footer />
  </div>
);
};

export default Body;
