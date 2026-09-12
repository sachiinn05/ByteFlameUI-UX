import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import PresenceListener from "./PresenceListener";
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
    <div className="page-shell flex flex-col">
      <NavBar />
      <PresenceListener />
      <main className="flex-1 pt-20 pb-10 px-4 md:px-6">
        <div className="page-wrap">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Body;
