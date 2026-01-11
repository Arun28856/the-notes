import { Link } from "react-router";
import { ShieldCheck } from "lucide-react";

export const Navbar = () => {
  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-[#00FF9D]/20">
        <div className="mx-auto max-w-6xl px-4 py-4 md:px-8 md:py-6">
            <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <h1 className="text-xl md:text-2xl font-bold text-[#00FF9D] font-mono tracking-tight">The Notes</h1>
                </Link>
            </div>
        </div>
    </header>
  )
}

export default Navbar;
