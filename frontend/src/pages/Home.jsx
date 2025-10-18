import React, { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import AuthPage from "../components/Authentication/Auth";
import { Heart, Search, Droplet, Users, Bell, Hospital } from "lucide-react";

const Home = () => {
    const [showAuth, setShowAuth] = useState(false);
    const user = useSelector((state) => state.auth.user);

    const handleProtectedClick = () => {
        console.log("user -> ", user);

        if (!user) setShowAuth(true);
        if (user) toast.success("You are already logged in!");
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-red-50 to-white text-gray-800">
            <section className="text-center py-20 px-6 md:px-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-red-600 mb-4">
                    RakhtDhara – Connecting Lives, One Drop at a Time ❤️
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Donate blood, save lives, and find donors near you. Join a community built on compassion and connection.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <button
                        onClick={handleProtectedClick}
                        className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition"
                    >
                        Find Donor
                    </button>
                    <button
                        onClick={handleProtectedClick}
                        className="bg-white border border-red-600 text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-red-50 transition"
                    >
                        Request Blood
                    </button>
                </div>
            </section>

            <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-12 py-16">
                <FeatureCard icon={<Droplet className="w-10 h-10 text-red-600" />} title="Quick Blood Requests" desc="Post urgent blood requests and get responses from nearby donors instantly." />
                <FeatureCard icon={<Search className="w-10 h-10 text-red-600" />} title="Find Compatible Donors" desc="Smart search by blood group, location, and availability to save precious time." />
                <FeatureCard icon={<Users className="w-10 h-10 text-red-600" />} title="Direct Donor Connections" desc="Contact donors directly via in-app chat or phone with mutual consent." />
                <FeatureCard icon={<Hospital className="w-10 h-10 text-red-600" />} title="Nearby Blood Banks" desc="Find hospitals or blood banks with verified information and available stock." />
                <FeatureCard icon={<Bell className="w-10 h-10 text-red-600" />} title="Alerts & Notifications" desc="Stay updated on urgent needs and donation drives happening near you." />
                <FeatureCard icon={<Heart className="w-10 h-10 text-red-600" />} title="Track & Inspire" desc="Keep track of your donations, earn badges, and inspire others to donate." />
            </section>

            <section className="bg-red-600 text-white text-center py-16 px-6">
                <h2 className="text-3xl font-bold mb-4">Be Someone’s Lifeline Today</h2>
                <p className="max-w-2xl mx-auto text-lg mb-8">
                    Every 2 seconds, someone needs blood. Your one donation can save up to three lives.
                </p>
                <button
                    onClick={handleProtectedClick}
                    className="bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
                >
                    Join a Donation Drive
                </button>
            </section>

            <footer className="text-center py-6 text-gray-600">
                © 2025 RakhtDhara | Made with ❤️ for a better world
            </footer>

            {showAuth && <AuthPage onClose={() => setShowAuth(false)} />}
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition text-center">
        <div className="flex justify-center mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-red-700">{title}</h3>
        <p className="text-gray-600 text-sm">{desc}</p>
    </div>
);

export default Home;
