import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/context/UserContext";

function ProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster richColors position="top-right" />
      <UserProvider>{children}</UserProvider>
    </>
  );
}

export default ProviderWrapper;
