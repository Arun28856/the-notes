import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams, useNavigate } from 'react-router';

export const NotesPage = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNote = async (e) => {
      try {
        const res = await axios.get(`http://localhost:8080/api/notes/${id}`)
        setTitle(res.data.title)
        setContent(res.data.content)
      } catch (error) {
        toast.error('Failed to fetch note')
        navigate('/')
      } finally {
        setFetching(false)
      }
    }
    fetchNote()
  }, [id, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await axios.put(`http://localhost:8080/api/notes/${id}`, {
        title,
        content
      })
      toast.success('Note updated successfully')
      setTimeout(() => navigate('/'), 1000)
    } catch (error) {
      toast.error('Failed to update note')
    } finally {
      setLoading(false)
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
              <button className='btn btn-ghost' disabled={loading || fetching} onClick={handleSubmit}>
                {loading ? 'Saving...' : 'Save'}
                </button>
            </div>
            {fetching ? (
              <div className="flex justify-center items-center" style={{ minHeight: '300px' }}>
                <span className="loading loading-spinner loading-lg text-[#00FF9D]"></span>
              </div>
            ) : (
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
            )}
          </div>

        </div>

      </div>
    </div>

  </div>);
}

export default NotesPage;
