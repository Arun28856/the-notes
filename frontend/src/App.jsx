import {Route, Routes} from 'react-router';
import { HomePage } from './pages/HomePage';
import { CreatePage } from './pages/CreatePage';
import { NotesPage } from './pages/NotesPage';
import { AuthForm } from './components/AuthForm';
import toast from 'react-hot-toast';

const App = () => {
  return (
  <div className='relative h-full w-full'>
  <div className="absolute inset-0 -z-10 h-full w-full bg-black" />
  <Routes>

    <Route path = '/' element = {<HomePage />} />
    <Route path = '/create' element = {<CreatePage />} />
    <Route path = '/note/:id' element = {<NotesPage />} />
    <Route path = '/auth' element = {<AuthForm />} />

  </Routes>
  </div>);
}

export default App