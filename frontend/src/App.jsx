import {Route, Routes} from 'react-router';
import { HomePage } from './pages/HomePage';
import { CreatePage } from './pages/CreatePage';
import { NotesPage } from './pages/NotesPage';
import toast from 'react-hot-toast';

const App = () => {
  return <div>
    <button onClick={() => toast.success("Congrats, the button worked")}>Click Me</button>
  <Routes>

    <Route path = '/' element = {<HomePage />} />
    <Route path = '/create' element = {<CreatePage />} />
    <Route path = '/note/:id' element = {<NotesPage />} />

  </Routes>


  </div>;
}

export default App