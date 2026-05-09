import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Cta from '../components/Cta';
import Footer from '../components/Footer';
;

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-950 text-white">

            {/* Navbar */}
            <NavBar />

            {/* Hero */}
            <Hero />

            {/* Features */}
            <Features />

            {/* CTA */}
            <Cta />

            {/* Footer */}
            <Footer />

        </div>
    );
};

export default LandingPage;