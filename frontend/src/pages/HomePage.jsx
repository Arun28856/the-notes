import Navbar  from '../components/Navbar.jsx';
import { useEffect, useState } from 'react';
import Ratelimited from '../components/RateLimitedUI.jsx';
import NoteCard from '../components/NoteCard.jsx';

import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router';

export const HomePage = () => {
  const [isRatelimited, setIsRatelimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [searchParams] = useSearchParams();
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("/api/notes");
        setNotes(res.data);
        setIsRatelimited(false);
      } catch (error) {
        if(error.response?.status === 429){
          setIsRatelimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await axios.delete(`/api/notes/${id}`);
      toast.success('Note deleted successfully');
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  return <div className = "min-h-screen">
    <Navbar />
    {isRatelimited && <Ratelimited />}
    
    <div className='max-w-6xl mx-auto px-8 md:px-12 lg:px-16 py-4 mt-8'>
      {loading && <div className='text-center text-secondary py-5'>Loading notes...</div>}

      {notes.length > 0 && !isRatelimited && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {notes.map(note => (
            <NoteCard key={note._id} note={note} handleDelete={handleDelete} />
          ))}   
        </div>
      )}

      {notes.length === 0 && !loading && !isRatelimited && (
        <div className='flex flex-col items-center justify-center py-20'>
          <div className='text-6xl mb-4'>📝</div>
          <h2 className='text-2xl font-bold text-base-content mb-2'>No notes yet</h2>
          <p className='text-base-content/70 mb-6'>Start creating your first note!</p>
          <Link to="/create" className='btn btn-primary'>
            Create Note
          </Link>
        </div>
      )}
    </div>
  </div>;
}

export default HomePage;