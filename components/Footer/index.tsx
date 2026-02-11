import Logo from "../Header/Logo";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-blue-200 border-t-[6px] border-black">
      
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand Block */}
          <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] p-6">
            <Logo size="md" />
            <p className="mt-4 text-black text-sm">
              Building bold digital experiences with raw energy.
            </p>
          </div>

          {/* Links 1 */}
          <div className="bg-pink-100 border-[4px] border-black shadow-[8px_8px_0px_#000] p-6">
            <h3 className="text-black text-lg font-bold mb-4">
              Product
            </h3>
            <ul className="space-y-2 text-black">
              <li><Link href="#">Features</Link></li>
              <li><Link href="#">Pricing</Link></li>
              <li><Link href="#">Updates</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="bg-blue-200 border-[4px] border-black shadow-[8px_8px_0px_#000] p-6">
            <h3 className="text-black text-lg font-bold mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-black">
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Contact</Link></li>
            </ul>
          </div>

          {/* CTA Block */}
          <div className="bg-green-300 border-[4px] border-black shadow-[8px_8px_0px_#000] p-6 flex flex-col justify-between">
            <h3 className="text-black text-lg font-bold">
              Ready to start?
            </h3>
            <button className="mt-4 bg-black text-white border-[4px] border-black shadow-[4px_4px_0px_#000] px-4 py-2 hover:translate-x-1 hover:translate-y-1 transition">
              Get Started
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t-[4px] border-black pt-6 flex flex-col md:flex-row justify-between items-center text-black font-bold">
          <p>© 2026 YourBrand. No fluff. Just impact.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
