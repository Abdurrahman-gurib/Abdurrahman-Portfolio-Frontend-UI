import { Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/SiteLayout';
import { BackofficeShell } from './components/BackofficeShell';
import { RequireAuth } from './components/RequireAuth';
import { ChatWidget } from './components/ChatWidget';

import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Pricing from './pages/Pricing';
import Work from './pages/Work';
import CaseStudy from './pages/CaseStudy';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import Login from './pages/backoffice/Login';
import Dashboard from './pages/backoffice/Dashboard';
import Enquiries from './pages/backoffice/Enquiries';
import EnquiryDetail from './pages/backoffice/EnquiryDetail';
import Settings from './pages/backoffice/Settings';
import Conversations from './pages/backoffice/Conversations';
import ConversationDetail from './pages/backoffice/ConversationDetail';

export default function App() {
  return (
    <Routes>
      {/* Public site: the live chat launcher sits beside the layout so it appears on every public page and never in the back office */}
      <Route
        element={
          <>
            <SiteLayout />
            <ChatWidget />
          </>
        }
      >
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="work" element={<Work />} />
        <Route path="work/:slug" element={<CaseStudy />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Back office */}
      <Route path="backoffice/login" element={<Login />} />
      <Route path="backoffice" element={<RequireAuth />}>
        <Route element={<BackofficeShell />}>
          <Route index element={<Dashboard />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="enquiries/:id" element={<EnquiryDetail />} />
          <Route path="conversations" element={<Conversations />} />
          <Route path="conversations/:id" element={<ConversationDetail />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}
