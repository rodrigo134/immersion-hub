import Navbar from "../components/layout/NavBar";
import StudyAreas from "../components/layout/StudyAreas";

export default function Home() {
  return (
    <>
      <Navbar />
      <StudyAreas onSelectCategory={(id) => console.log("Selected category:", id)} />
    </>
  );
}
