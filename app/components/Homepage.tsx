import Image from "next/image";
import Link from "next/link"; // Imported Link
import Navbar from "./Navbar";
import Footer from "./Footer";

const Homepage = () => {
  return (
    <div className="bg-white text-gray-900 flex flex-col items-center w-full h-auto">
      {/* Header */}
      <Navbar />

      {/* Main Section */}
      <section className="px-10 py-65 flex items-center justify-center gap-10 w-full h-auto max-w-[1500px]">
        <div>
          <h1 className="text-6xl font-bold mb-6">
            Connect, Trade, Succeed: Your <br></br>Campus Marketplace
          </h1>
          <p className="text-lg mb-6">
            UniMarket is the ultimate platform for CIT students to effortlessly
            buy, sell, rent, and borrow academic essentials and more. Build
            trust, save money, and simplify campus life.
          </p>
          <div className="flex space-x-4">
            {/* Login Button Link */}
            <Link href="/login">
              <button className="bg-red-800 text-white px-6 py-3 rounded-md hover:bg-red-900 transition-colors cursor-pointer">
                Login
              </button>
            </Link>

            {/* Register Button Link */}
            <Link href="/register">
              <button className="bg-transparent border-2 border-red-800 text-red-800 px-6 py-3 rounded-md hover:bg-red-50 transition-colors cursor-pointer">
                Register
              </button>
            </Link>
          </div>
        </div>
        <div className="w-7xl">
          <Image
            src="/images/image_landing.jpg"
            alt="Group of students"
            width={1000}
            height={0}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Why UniMarket Section */}
      <section className="px-20 py-30 bg-gray-100 w-full">
        <h2 className="text-4xl font-bold text-center mb-16">Why UniMarket?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-15">
          <div className="flex flex-col justify-center items-center p-20 bg-white text-center rounded-lg shadow-md gap-3">
            <Image
              className="text-red-800 mb-4 w-10 h-auto"
              src="/images/bulb.png"
              alt="Light Bulb"
              width={1000}
              height={64}
            />
            <h3 className="text-2xl font-semibold mb-2">Smart Exchange</h3>
            <p>
              Effortlessly buy, sell, or swap academic items with fellow
              students. Find what you need or declutter your space.
            </p>
          </div>
          <div className="flex flex-col justify-center items-center p-20 bg-white text-center rounded-lg shadow-md gap-3">
            <Image
              className="text-red-800 mb-4 w-10 h-auto"
              src="/images/money.png"
              alt="Money"
              width={1000}
              height={64}
            />
            <h3 className="text-2xl font-semibold mb-2">Easy Loans</h3>
            <p>
              Peer-to-peer borrowing and lending for textbooks, equipment, or
              small amounts, all within a trusted network.
            </p>
          </div>
          <div className="flex flex-col justify-center items-center p-20 bg-white text-center rounded-lg shadow-md gap-3">
            <Image
              className="text-red-800 mb-4 w-10 h-auto"
              src="/images/collab.png"
              alt="Collab"
              width={1000}
              height={64}
            />
            <h3 className="text-2xl font-semibold mb-2">Build Trust</h3>
            <p>
              Secure student verification and a trust score system ensure
              reliable and safe transactions for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Student Testimonial Section */}
      <section className="px-10 py-40 w-full">
        <h2 className="text-4xl font-bold text-center mb-8">
          What Students Say
        </h2>
        <div className="flex flex-col justify-center items-center text-center max-w-2xl mx-auto mb-8">
          <p className="text-lg italic mb-4">
            &quot;UniMarket made buying and selling textbooks so easy! I saved
            money and connected with other students on campus. It&apos;s a
            game-changer!&quot;
          </p>
          <Image
            className="text-red-800 my-10 w-20 h-auto"
            src="/images/woman.png"
            alt="Woman"
            width={1000}
            height={64}
          />
          <p className="font-semibold text-orange-800">
            Sarah J., Engineering Student
          </p>
          <p className="text-gray-600">CIT University</p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-[#FFF0F0FF] py-40 text-center w-full flex flex-col justify-center items-center gap-5">
        <h2 className="text-4xl font-bold mb-6">
          Ready to simplify your student life?
        </h2>
        <p className="text-lg mb-6 font-light">
          Join UniMarket today and discover a smarter way to manage your
          academic needs. <br></br>Connect with your peers, find great deals,
          and build a trusted campus community.
        </p>
        {/* Register Now Link */}
        <Link href="/register">
          <button className="text-white bg-red-800 px-8 py-3 rounded-2xl hover:bg-red-900 transition-colors cursor-pointer">
            Register Now
          </button>
        </Link>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Homepage;
