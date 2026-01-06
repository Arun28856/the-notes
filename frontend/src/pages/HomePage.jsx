import Navbar  from '../components/navbar.jsx';
import { useEffect, useState } from 'react';
import Ratelimited from '../components/RatelimitedUI.jsx';
import NoteCard from '../components/NoteCard.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';

export const HomePage = () => {
  const [isRatelimited, setIsRatelimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {

      try {
        const res = await axios.get("http://localhost:8080/api/notes");
        console.log(res.data);
        setNotes(res.data);
        setIsRatelimited(false);

      }catch (error) {
        console.log("Error fetching notes:");
        if(error.response?.status === 429){
          setIsRatelimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, []);

  return <div className = "min-h-screen">
    <Navbar />
    {isRatelimited && <Ratelimited />}
    
    <div className='max-w-7xl mx-auto p-4 mt-8'>
      {loading && <div className='text-center text-secondary py-5'>Loading notes...</div>}

      {notes.length > 0 && !isRatelimited && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {notes.map(note => (
            <NoteCard key={note._id} note={note} />
          ))}   


        </div>
      )}

    </div>

  </div>;
}

export default HomePage;