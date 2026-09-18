import { Outlet } from 'react-router-dom';
import Navbar from '../components/client/Navbar';
import Footer from '../components/client/Footer';
import '../client.css';

const ClientLayout = () => {
  return (
    <div className="client-layout client-page bg-[#fff8f7] min-h-screen">
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ClientLayout;
