import { Metadata } from "next";
import HomeContent from "./components/home/home-content";

export const metadata: Metadata = {
  title: "RentX",
  description: "Rent anything",
};

export default function Home() {
  return (
    <div>
     <HomeContent/>
    </div>
  );
}

