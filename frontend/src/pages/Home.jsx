import CustomerFavorites from "../components/CustomerFavorites";
import EditorsChoice from "../components/EditorsChoice";
import Hero from "../components/Hero";
import ShopByMood from "../components/ShopByMood";
import Trending from "../components/Trending";

const Home = () => {
  return (
    <>
      <Hero />
      <EditorsChoice />
      <Trending />
      <ShopByMood />
      <CustomerFavorites />
    </>
  );
};

export default Home;