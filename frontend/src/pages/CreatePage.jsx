import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';

export const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/notes", {
        title,
        content
      });
      console.log("Note created:", res.data);
      toast.success("Note created successfully");
      setTitle("");
      setContent("");
      setTimeout(() => navigate('/'), 100);
    } catch (error) {
      toast.error("Failed to create note");
    } finally {
      setLoading(false);
    }
  }


  return (
  <div className='min-h-screen bg-base-200'>
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
        
        <div className='card-bg base-100'>
          <div className='card-body'>
            <div className='flex items-center justify-between mb-6'>
              <Link to="/" className="flex items-center gap-2 text-[#00FF9D]">
                <ArrowLeft className="size-6"/>
              </Link>
              <button className='btn btn-ghost' disabled={loading} onClick={handleSubmit}>
                {loading ? 'Saving...' : 'Save'}
                </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className='form-control mb-4'>
                <input 
                  type="text" 
                  placeholder='Untitled' 
                  className='w-full text-5xl font-bold bg-transparent border-none outline-none focus:outline-none placeholder-base-content/30 p-0' 
                  style={{ caretColor: '#FFFFFF' }}
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
                <textarea
                 placeholder='Start writing here...'
                 className='w-full text-base bg-transparent border-none outline-none focus:outline-none placeholder-base-content/30 p-0 mt-4 resize-none'
                 style={{ minHeight: '300px' }}
                 value={content}
                 onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>

  </div>);
}

export default CreatePage;
