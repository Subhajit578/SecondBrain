import {useNavigate} from "react-router-dom"
import {useAuth} from "../hooks/useAuth"
import { Button } from "./Button"
import { UserIcon } from "../icons/UserIcon"

export function UserModal() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
   
    if (user) {
        return (
            <Button
                text={user.username}
                startIcon={<UserIcon />}
                onClick={logout}
                variant="secondary"
                fullWidth={false}
                loading={false}
            />
        );
    }

    return (
        <Button
            text="Login / Signup"
            startIcon={<UserIcon />}
            onClick={() => navigate("/signin")}
            variant="primary"
            fullWidth={false}
            loading={false}
        />
    );
}