import Image from "next/image";
import HomeComponent from "./components/home";
import DenseAppBar from "./components/navbar";
import SideBarList from "./components/sidebarList";

const Home = () => {
  return (
    <>
      <DenseAppBar />
      <HomeComponent />;
    </>
  );
};

export default Home;
