import { handleSpeech } from "@/lib/handleSpeech";
import { Home, ShoppingBag, Plus, User, Mic } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Orb } from "./ui/orb";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { useUser } from "@/context/UserContext";

function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  // TODO: Integrate Voice Navigation / Product Searching / Commands
  const { startRecording, stopRecording, isRecording } = useVoiceRecorder({
    apiEndpoint: "",
    onTranscriptionComplete: (transcript) => {
      console.log("Transcription complete:", transcript);
    },
    onError: (error) => {
      console.error("Recording error:", error);
    },
  });
  const [isSpeechActive, setIsSpeechActive] = useState(false);

  const handleSpeechToggle = () => {
    if (isSpeechActive) {
      setIsSpeechActive(false);
      handleSpeech(location.pathname);
      stopRecording();
    } else {
      setIsSpeechActive(true);
      startRecording();
    }
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: ShoppingBag, label: "Orders", path: "/orders" },
    ...(user.identity === "farmer"
      ? [
          {
            icon: Plus,
            label: "Add",
            path: "/add",
            isSpecial: true,
          },
        ]
      : []),
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Mic, label: "Speech", action: handleSpeechToggle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around px-1 sm:px-4 shadow-lg z-50 safe-area-inset-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.path && location.pathname === item.path;

        if (item.isSpecial) {
          return (
            <button
              key={item.label}
              onClick={() => item.path && navigate(item.path)}
              className="relative -top-6 bg-primary/80 hover:bg-primary/90 active:bg-primary text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-200 active:scale-95 touch-manipulation cursor-pointer"
              aria-label={item.label}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          );
        }

        if (item.label === "Speech") {
          return (
            <Popover
              key={item.label}
              open={isSpeechActive}
              onOpenChange={setIsSpeechActive}
            >
              <PopoverTrigger asChild>
                <button
                  onClick={handleSpeechToggle}
                  className={`flex flex-col items-center justify-center gap-0.5 sm:gap-1 py-2 px-1 sm:px-3 min-w-[60px] sm:min-w-[70px] transition-colors duration-200 touch-manipulation cursor-pointer ${
                    isSpeechActive
                      ? "text-primary"
                      : "text-gray-500 active:text-gray-700"
                  }`}
                  aria-label={item.label}
                >
                  <Icon
                    className="w-5 h-5"
                    strokeWidth={isSpeechActive ? 2.5 : 2}
                  />
                  <span className="text-[10px] sm:text-xs font-medium">
                    {item.label}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="center"
                className="w-64 h-64 mb-2 flex items-center justify-center bg-linear-to-br from-primary/50 to-purple-50 border-2 border-primary/20 rounded-2xl shadow-xl"
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="flex justify-center gap-8">
                    <div className={"relative block md:block"}>
                      <div className="bg-muted relative h-32 w-32 rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                        <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]">
                          <Orb
                            colors={["#CAFCDC", "#A0D1B9"]}
                            seed={1000}
                            agentState={isRecording ? "listening" : "thinking"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    Listening...
                  </p>
                  <p className="text-xs text-gray-500 text-center px-4">
                    Click the mic button again to stop
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          );
        }

        return (
          <button
            key={item.label}
            onClick={() => item.path && navigate(item.path)}
            className={`flex flex-col items-center justify-center gap-0.5 sm:gap-1 py-2 px-1 sm:px-3 min-w-[60px] sm:min-w-[70px] transition-colors duration-200 touch-manipulation cursor-pointer ${
              isActive ? "text-green-600" : "text-gray-500 active:text-gray-700"
            }`}
            aria-label={item.label}
          >
            <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] sm:text-xs font-medium">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNavbar;
