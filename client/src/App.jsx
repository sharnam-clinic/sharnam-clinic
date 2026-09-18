import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';
import PublicLayout from './layouts/PublicLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import ClientLayout from './layouts/ClientLayout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';
import UserTypeList from './pages/UserTypeList';
import UserTypeForm from './pages/UserTypeForm';
import RolePermissionForm from './pages/RolePermissionForm';
import ClinicPhotoList from './pages/ClinicPhotoList';
import ClinicPhotoForm from './pages/ClinicPhotoForm';
import ServiceList from './pages/ServiceList';
import ServiceForm from './pages/ServiceForm';
import HealthConditionList from './pages/HealthConditionList';
import HealthConditionForm from './pages/HealthConditionForm';

// Client pages
import HomePage from './pages/client/HomePage';
import AboutPage from './pages/client/AboutPage';
import ServicesPage from './pages/client/ServicesPage';
import HealthInfoPage from './pages/client/HealthInfoPage';
import ContactPage from './pages/client/ContactPage';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          }
        }}
      />
      <Routes>
        {/* Client-facing public pages */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/health-info" element={<HealthInfoPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Login page */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
        
        {/* Admin panel */}
        <Route path="/admin" element={<ProtectedLayout />}>
          <Route index element={<AdminDashboard />} />
          
          {/* Dynamic Clinic Modules */}
          <Route path="clinic-photos" element={<ClinicPhotoList />} />
          <Route path="clinic-photos/new" element={<ClinicPhotoForm />} />
          <Route path="clinic-photos/edit/:id" element={<ClinicPhotoForm />} />

          <Route path="services" element={<ServiceList />} />
          <Route path="services/new" element={<ServiceForm />} />
          <Route path="services/edit/:id" element={<ServiceForm />} />

          <Route path="health-conditions" element={<HealthConditionList />} />
          <Route path="health-conditions/new" element={<HealthConditionForm />} />
          <Route path="health-conditions/edit/:id" element={<HealthConditionForm />} />

          {/* User & Access Management */}
          <Route path="users" element={<UserList />} />
          <Route path="users/new" element={<UserForm />} />
          <Route path="users/edit/:id" element={<UserForm />} />
          
          <Route path="user-types" element={<UserTypeList />} />
          <Route path="user-types/new" element={<UserTypeForm />} />
          <Route path="user-types/edit/:id" element={<UserTypeForm />} />

          <Route path="role-permission" element={<RolePermissionForm />} />
          <Route path="permissions" element={<RolePermissionForm />} />
          <Route path="permissions/:userTypeId" element={<RolePermissionForm />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
