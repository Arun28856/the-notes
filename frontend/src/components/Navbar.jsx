import { Link, useNavigate } from "react-router";
import { PlusIcon, LogOut } from "lucide-react";

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = 'http://localhost:8080';
  };

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-[#00FF9D]/20">
        <div className="mx-auto max-w-6xl px-4 py-4 md:px-8 md:py-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl md:text-2xl font-bold text-[#00FF9D] font-mono tracking-tight">The Notes</h1>
                <div className="flex items-center gap-4">
                   <Link to={"/create"} className="bg-[#00FF9D]/10 hover:bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/30 hover:border-[#00FF9D]/50 transition-all duration-200 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                    <PlusIcon className="size-4 md:size-5"/>
                    <span className="hidden sm:inline">New Note</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 hover:border-red-500/50 transition-all duration-200 px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <LogOut className="size-4 md:size-5"/>
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>

        </div>
    </header>
  )
}

export default Navbar;