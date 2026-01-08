import { Link } from "react-router"
import { Trash2Icon } from "lucide-react";
import { formatDate } from "../../lib/Utils.js";

const NoteCard = ({note}) => {
  return (
    <Link to={`/note/${note._id}`}
    className="card bg-base-100 hover:shadow-lg transition-all duration-200 
      border-t-4 border-solid border-[#00FF9D]">

        <div className="card-body p-4">
            <h3 className="card-title text-base-content text-lg">{note.title}</h3>
            <p className="text-base-content/70 line-clamp-2 text-sm">{note.content}</p>

            <div className="card-actions justify-between items-center mt-3">
                <span className="text-sm text-base-content/70">
                    {formatDate(new Date(note.createdAt))}
                </span>

                <div className="flex items-center gap-2">
                    <button className="btn btn-ghost btn-xs text-error">
                        <Trash2Icon className="size-4" />
                    </button>
                </div>

            </div>

        </div>


      </Link>
  )
}

export default NoteCard