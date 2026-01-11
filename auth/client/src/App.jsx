import { Route, Routes } from 'react-router';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { VerifyOTPPage } from './pages/VerifyOTPPage';
import { SuccessPage } from './pages/SuccessPage';

const App = () => {
  return (
    <div className='relative h-full w-full'>
      <div className="absolute inset-0 -z-10 h-full w-full bg-black" />
      <Routes>
        <Route path='/' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/verify' element={<VerifyOTPPage />} />
        <Route path='/success' element={<SuccessPage />} />
      </Routes>
    </div>
  );
}

export default App
