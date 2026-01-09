import Header from "../components/Header";
import Hero from "../components/Hero";
import HeadphoneScroll from "../components/HeadphoneScroll";
import Features from "../components/Features";
import Footer from "../components/Footer";

export default function Page() {
  return (
    <main className="bg-[#050505]">
      <Header />
      <div id="hero">
        <Hero />
      </div>
      <div id="experience">
        <HeadphoneScroll />
      </div>
      <div id="specs">
        <Features />
      </div>
      <div id="design">
        {/* Design section placeholder - can add content here */}
      </div>
      <div id="contact">
        <Footer />
      </div>
    </main>
  );
}
