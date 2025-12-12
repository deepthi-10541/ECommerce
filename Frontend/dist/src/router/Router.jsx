import React from "react";
import { useSelector } from "react-redux";
import Login from "../views/pages/login";
import Navbar from "../Components/Navbar";
import Banner from "../Components/Banner";

import HomePage from '../Components/HomePage';
import HeroCards from "../Components/HeroCards";

// ✅ Import Sidebar
import ProfileSidebar from "../views/pages/ProfileSidebar";

function AppLayout() {
  return (
    <>
      <Navbar />

      {/* 👇 Profile Sidebar should load globally for logged-in users */}
      <ProfileSidebar />

      <Banner />
          <HomePage />
      <HeroCards />
    </>
  );
}

function Router() {
  const user = useSelector((state) => state.auth.user);

  // 👇 Routing based on login
  return user ? <AppLayout /> : <Login />;
}

export default Router;
