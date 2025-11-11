import React from "react";
import { useSelector } from "react-redux";
import Login from "../views/pages/login";
import Navbar from "../Components/Navbar";
import Banner from "../Components/Banner";
import Fruits from "../Components/Fruits";
import Beauty from "../Components/Beauty";
import MensCollection from "../Components/MensCollection";
import TechProducts from "../Components/TechProducts";
import HeroCards from "../Components/HeroCards";

function AppLayout() {
  return (
    <>
      <Navbar />
      <Banner />
      <Fruits />
      <Beauty />
      <MensCollection />
      <TechProducts />
      <HeroCards />
    </>
  );
}

function Router() {
  const user = useSelector((state) => state.auth.user);

  // 👇 This decides what to show based on Redux
  return user ? <AppLayout /> : <Login />;
}

export default Router;
