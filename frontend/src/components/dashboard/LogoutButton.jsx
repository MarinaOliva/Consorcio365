import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import {LogOut} from "lucide-react"

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Button
      variant="secondary"
      onClick={handleLogout}
      className="
        w-full rounded-full border border-emerald-300
        bg-transparent px-4 py-2 text-xs
        shadow-[0_0_10px_rgba(110,231,183,0.4)]
        hover:bg-secondarySoft
      "
    >
      SALIR
      <LogOut size={18} className="ml-2 text-sm" />
    </Button>
  );
}

export default LogoutButton;