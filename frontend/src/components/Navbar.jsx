import { Link, useNavigate } from "react-router";
import { PlusIcon, LogOut, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export const Navbar = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const currentUser = auth?.currentUser ?? null;
  const logout = auth?.logout ?? (async () => {});

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };
import { PlusIcon, LogOut } from "lucide-react";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-[#00FF9D]/20">
        <div className="mx-auto max-w-6xl px-4 py-4 md:px-8 md:py-6">
            <div className="flex items-center justify-between">
                <Link to="/">
                  <h1 className="text-xl md:text-2xl font-bold text-[#00FF9D] font-mono tracking-tight cursor-pointer hover:text-[#00FF9D]/80 transition-colors">The Notes</h1>
                </Link>
                <div className="flex items-center gap-4">
                  {currentUser ? (
                    <>
                      <Link to={"/create"} className="bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30 hover:border-[#00FF9D]/50 transition-all duration-200 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                        <PlusIcon className="size-4 md:size-5"/>
                        <span className="hidden sm:inline">New Note</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30 hover:border-[#00FF9D]/50 transition-all duration-200 px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
                      >
                        <LogOut className="size-4 md:size-5"/>
                        <span className="hidden sm:inline">Logout</span>
                      </button>
                    </>
                  ) : (
                    <Link to={"/auth"} className="bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30 hover:border-[#00FF9D]/50 transition-all duration-200 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                      <LogIn className="size-4 md:size-5"/>
                      <span className="hidden sm:inline">Login</span>
                    </Link>
                  )}
                <h1 className="text-xl md:text-2xl font-bold text-[#00FF9D] font-mono tracking-tight">The Notes</h1>
                <div className="flex items-center gap-4">
                   <Link to={"/create"} className="bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30 hover:border-[#00FF9D]/50 transition-all duration-200 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                    <PlusIcon className="size-4 md:size-5"/>
                    <span className="hidden sm:inline">New Note</span>
                    </Link>
                </div>
            </div>

        </div>
    </header>
  )
}

export default Navbar;