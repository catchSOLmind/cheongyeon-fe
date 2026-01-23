import { RouterProvider } from 'react-router-dom';
import { appRouter } from '@/app/router/appRoutes';

export default function App() {
  return <RouterProvider router={appRouter} />;
}

