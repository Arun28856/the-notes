import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  }


  return (
  <div className='min-h-screen bg-base-200'>
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
        <Link to="/" className="flex items-center gap-2 mb-6 text-[#00FF9D]">
        <ArrowLeft className="size-4"/>
        </Link>

      </div>
    </div>

  </div>);
}

export default CreatePage;
