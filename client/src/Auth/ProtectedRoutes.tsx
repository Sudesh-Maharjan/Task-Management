// // ProtectedRoute.tsx
// import { useContext } from 'react';
// import { Navigate, Outlet,   useLocation} from 'react-router-dom';
// import { AuthContext } from './AuthContext';
// import Home from '@/pages/Home';


// const ProtectedRoute = () => {
//   const authContext = useContext(AuthContext);
//   const location = useLocation();
//   console.log(authContext?.isAuthenticated)
//   if (!authContext) {
//     throw new Error('AuthContext must be used within an AuthProvider');
//   }

//   return authContext.isAuthenticated ? (
//     <Home /> 
//   ) : (
//     <Navigate to="/" state={{ from: location }} />
//   );
// };

// export default ProtectedRoute;
