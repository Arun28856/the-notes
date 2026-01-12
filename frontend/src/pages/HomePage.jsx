import Navbar  from '../components/Navbar.jsx';
import { useEffect, useState } from 'react';
import Ratelimited from '../components/RateLimitedUI.jsx';
import NoteCard from '../components/NoteCard.jsx';

import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useSearchParams, useNavigate } from 'react-router';

export const HomePage = () => {
  const [isRatelimited, setIsRatelimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  console.log('HomePage component loaded');
  console.log('Current URL search params:', window.location.search);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for token in URL (from OAuth redirect)
      const tokenFromUrl = searchParams.get('token');
      const nameFromUrl = searchParams.get('name');
      
      console.log('Token from URL:', tokenFromUrl);
      console.log('Name from URL:', nameFromUrl);
      
      if (tokenFromUrl) {
        console.log('Setting token in localStorage:', tokenFromUrl);
        localStorage.setItem('authToken', tokenFromUrl);
        if (nameFromUrl) {
          toast.success(`Welcome, ${decodeURIComponent(nameFromUrl)}!`);
        }
        // Clean up URL
        window.history.replaceState({}, document.title, '/');
      }

      // Check if user is logged in
      const token = localStorage.getItem('authToken');
      console.log('Token from localStorage:', token);
      
      if (!token) {
        console.log('No token found, redirecting to auth app');
        window.location.href = 'http://localhost:3003';
        return;
      }

      const fetchNotes = async () => {
        try {
          console.log('Fetching notes with token:', token);
          const res = await axios.get("https://the-notes-production.up.railway.app/api/notes", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Notes fetched successfully:', res.data);
          setNotes(res.data);
          setIsRatelimited(false);
        } catch (error) {
          console.log("Error fetching notes:", error);
          if(error.response?.status === 429){
            setIsRatelimited(true);
          } else if (error.response?.status === 401) {
            console.log('Authentication failed - 401 error');
            toast.error('Session expired. Please login again.');
            localStorage.removeItem('authToken');
            window.location.href = 'http://localhost:3003';
          } else {
            toast.error("Failed to load notes");
          }
        } finally {
          setLoading(false);
        }
      }
      
      await fetchNotes();
    };
    
    initializeAuth();
  }, [searchParams]);

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`https://the-notes-production.up.railway.app/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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