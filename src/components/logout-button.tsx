import { signOut } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LogoutButtonProps {
  children?: React.ReactNode;
  className?: string;
}

const LogoutButton = ({ children, className }: LogoutButtonProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <button onClick={handleSignOut} className={`cursor-pointer ${className}`}>
      {children}
    </button>
  );
};

export default LogoutButton;

