import { createContext,useState, useContext } from "react";
import type {ReactNode} from "react";

interface User {
    username: string, 
    email: string,
    id: string
}
interface AuthContextValue {
    user : User | null;
    login : (token : string) => void;
    logout : () => void;
}
const AuthContext = createContext<AuthContextValue | null> (null);
function decodeToken(token : string) : User | null {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload))
    } catch {
        return null
    }
}
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const token = localStorage.getItem("token");
        return token ? decodeToken(token) : null;
    });

    function login(token: string) {
        localStorage.setItem("token", token);
        setUser(decodeToken(token));
    }

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext)!;
}
