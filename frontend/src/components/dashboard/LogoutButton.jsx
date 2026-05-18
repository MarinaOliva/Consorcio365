import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
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
      <span className="ml-2 text-sm">↪</span>
    </Button>
  );
}

export default LogoutButton;