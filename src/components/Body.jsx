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

  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
      }
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(135deg, #ff6f91, #ff9671, #ffc75f, #f9f871)",
      }}
    >
      {/* Navbar */}
      <NavBar />

      {/* Scrollable Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingTop: "4.5rem",   // navbar height
          paddingBottom: "100px", // footer height + extra space
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Body;
