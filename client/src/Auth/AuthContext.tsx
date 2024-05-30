// // AuthContext.tsx
// import React, { createContext, useState, useEffect, ReactNode } from 'react';

// interface AuthContextProps {
//   isAuthenticated: boolean;
//   login: (accessToken: string, refreshToken: string) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextProps | null>(null);

// const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

//   useEffect(() => {
//     const accessToken = localStorage.getItem('accessToken');
//     console.log(accessToken)
//       if (accessToken) {
//         setIsAuthenticated(true);
//       }
//   }, []);

//   const login = (accessToken: string, refreshToken: string) => {
//     setIsAuthenticated(true);
//     localStorage.setItem('accessToken', accessToken);
//     localStorage.setItem('refreshToken', refreshToken);
//   };

//   const logout = () => {
//     setIsAuthenticated(false);
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//   };

//   return (
//     <AuthContext.Provider value={{isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthProvider, AuthContext };
