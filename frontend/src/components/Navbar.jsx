import { Link } from "react-router";
import { PlusIcon } from "lucide-react";

export const Navbar = () => {
  return (
    <header className="bg-base-300 border-b border-base-conent/10">
        <div className="mx-auto max-w-6xl px-4 py-4 md:px-8 md:py-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl md:text-2xl font-bold text-primary font-mono tracking-tight">The Notes</h1>
                <div className="flex items-center gap-4">
                   <Link to={"/create"} className="btn btn-secondary btn-sm md:btn-md">
                    <PlusIcon className="size-4 md:size-5"/>
                    <span className="hidden sm:inline">Create Note</span>
                    </Link>

                </div>
            </div>

        </div>
    </header>
  )
}

export default Navbar;