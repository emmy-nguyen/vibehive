import * as Toast from "@radix-ui/react-toast";
import { IoInformationCircle } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";

interface ToastProps {
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ToastMessage: React.FC<ToastProps> = ({
  title,
  isOpen,
  onOpenChange,
}) => {
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        open={isOpen}
        onOpenChange={onOpenChange}
        className="relative flex gap-4 items-cente rrtl:space-x-reverse w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
      >
        <div className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5">
          <IoInformationCircle />
        </div>
        <Toast.Title className="text-sm text-white">{title}</Toast.Title>
        <Toast.Action asChild altText="Close">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-2 right-2 hover:text-white text-md w-6"
          >
            <IoCloseOutline />
          </button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-8 right-8 flex flex-col space-y-2 z-50 w-full max-w-xs pointer-events-none" />
    </Toast.Provider>
  );
};

export default ToastMessage;
