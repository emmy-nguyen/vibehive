import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Button from "./Button";
import useAuthModal from "../hooks/useAuthModal";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const authModal = useAuthModal();
  const router = useRouter();
  const handleLogout = () => {
    // handle logout here
  };
  return (
    <div
      className={twMerge(
        `h-fit bg-gradient-to-b from-yellow-400 p-6`,
        className
      )}
    >
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <button
            onClick={() => router.back()}
            className="rounded-full bg-gray-700 flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretLeft size={35} className="text-white" />
          </button>
          <button
            onClick={() => router.forward()}
            className="rounded-full bg-gray-700 flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretRight size={35} className="text-white" />
          </button>
        </div>

        {/* navigation for mobile view */}
        <div className="flex md:hidden gap-x-2 items-center">
          <button className="rounded-full p-2 bg-gray-700 flex items-center justify-center hover:opacity-75 transition">
            <HiHome className="text-gray-200" size={20} />
          </button>
          <button className="rounded-full p-2 bg-gray-700 flex items-center justify-center hover:opacity-75 transition">
            <BiSearch className="text-gray-200" size={20} />
          </button>
        </div>

        {/* signin and logout section */}
        <div className="flex justify-between items-center gap-x-4">
          <>
            <div>
              <Button
                onClick={() => authModal.onOpen(false)}
                className="bg-transparent text-neutral-300 font-medium"
              >
                Sign up
              </Button>
            </div>
            <div>
              <Button
                onClick={() => authModal.onOpen(true)}
                className="bg-yellow-500 px-6 py-2 text-gray-800"
              >
                Log in
              </Button>
            </div>
          </>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
