import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";

const Footer = () => {
  return (
    <div className="bg-[#0f1117] text-white">
      {/* CTA */}
      <div className="bg-[#1a1a2e] px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <h2 className="text-xl font-medium leading-snug md:w-2/5">
          <span className="text-teal-400">Subscribe</span> for news, events and offers
        </h2>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email..."
            className="h-[38px] px-4 rounded-lg bg-white/10 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-teal-500 w-[220px]"
          />
          <button className="h-[38px] px-5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg">
            Subscribe
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-8 py-12">
        <div>
          <img src="https://shopo.quomodothemes.website/assets/images/logo.svg" alt="" style={{ filter: "brightness(0) invert(1)" }} className="h-7" />
          <p className="mt-4 text-sm text-white/45 leading-relaxed">The home and elements needed to create beautiful products.</p>
          <div className="flex gap-2 mt-4">
            {[AiFillFacebook, AiOutlineTwitter, AiFillInstagram, AiFillYoutube].map((Icon, i) => (
              <div key={i} className="w-8 h-8 rounded-lg border border-white/15 flex items-center justify-center text-white/50 cursor-pointer hover:text-teal-400 hover:border-teal-400/40">
                <Icon size={15} />
              </div>
            ))}
          </div>
        </div>

        {[
          { title: "Company", links: footerProductLinks },
          { title: "Shop", links: footercompanyLinks },
          { title: "Support", links: footerSupportLinks },
        ].map(({ title, links }, i) => (
          <div key={i}>
            <h4 className="text-xs font-medium text-white/60 uppercase tracking-widest mb-4">{title}</h4>
            {links.map((link, j) => (
              <Link key={j} to={link.link} className="block text-sm text-white/40 hover:text-teal-400 py-1 transition">
                {link.name}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-white/35">© 2026 shopo. All rights reserved.</span>
        <span className="text-xs text-white/35">Terms · Privacy Policy</span>
        <img src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75" alt="" className="h-6 opacity-40" />
      </div>
    </div>
  );
};

export default Footer;