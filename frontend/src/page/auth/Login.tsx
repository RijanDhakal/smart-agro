import InputField from "@/components/shared/InputField";
import Bounded from "../landing/Bounded";
import { FaPhone } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import StarGrid from "../landing/StarGrid";
import Button from "@/components/shared/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: GeolocationPositionError | null;
  loading: boolean;
}

export interface Credentials {
  username: string;
  contact: string;
  gmail: string;
  identity: string;
}

const identities = [
  { value: "user", label: "User" },
  { value: "farmer", label: "Farmer" },
];

function Login() {
  const navigate = useNavigate();
  const { user, logUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [currentLocation, setCurrentLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    contact: "",
    gmail: "",
    identity: "user",
  });

  const [open, setOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setCurrentLocation((prev) => ({
        ...prev,
        error: {
          message: "Geolocation is not supported by your browser.",
        } as GeolocationPositionError,
        loading: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({
          latitude,
          longitude,
          error: null,
          loading: false,
        });
        console.log("User location:", { latitude, longitude });
      },
      (error) => {
        setCurrentLocation((prev) => ({ ...prev, error, loading: false }));
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  const handleInputChange = (
    value: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const loginData = {
      id: "",
      username: formData.get("username") as string,
      gmail: formData.get("gmail") as string,
      contact: formData.get("contact") as string,
      identity: credentials.identity as "user" | "farmer",
      latitude: currentLocation.latitude ? currentLocation.latitude : null,
      longitude: currentLocation.longitude ? currentLocation.longitude : null,
    };

    console.log("Login data:", loginData);
    try {
      console.log("Submitting login with:", loginData);
      await logUser(loginData);

      if (loginData.username && loginData.contact) {
        console.log("Login successful! Redirecting to home page...");
        navigate("/home");
      } else {
        console.error("Login failed: Missing required fields");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user && user.username) {
    navigate("/home");
    return null;
  }

  return (
    <Bounded>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl flex flex-col items-center justify-center gap-8"
      >
        <section className="w-full h-1/6 flex flex-col items-center justify-center">
          <StarGrid></StarGrid>
          <h1 className="text-balance text-3xl font-medium md:text-5xl lg:text-7xl text-foreground">
            Login
          </h1>
        </section>
        <section className="w-full h-auto flex flex-col items-center justify-start gap-3">
          <InputField
            type="text"
            name="username"
            placeholder="Username"
            required
            icon={<FaUser />}
            value={credentials.username}
            onChange={handleInputChange}
          />
          <InputField
            type="tel"
            name="contact"
            placeholder="Contact Number"
            required
            icon={<FaPhone />}
            value={credentials.contact}
            onChange={handleInputChange}
          />
          <InputField
            type="gmail"
            name="gmail"
            placeholder="Gmail (Optional)"
            icon={<IoMdMail />}
            value={credentials.gmail}
            onChange={handleInputChange}
          />

          <div className="w-full max-w-xl">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  role="combobox"
                  aria-expanded={open}
                  className="border-input data-placeholder:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] h-9 cursor-pointer"
                >
                  {credentials.identity
                    ? identities.find(
                        (identity) => identity.value === credentials.identity
                      )?.label
                    : "Select identity..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="center" side="top">
                <Command>
                  <CommandInput placeholder="Search identity..." />
                  <CommandList>
                    <CommandEmpty>No identity found.</CommandEmpty>
                    <CommandGroup>
                      {identities.map((identity) => (
                        <CommandItem
                          className="cursor-pointer"
                          key={identity.value}
                          value={identity.value}
                          onSelect={(currentValue) => {
                            setCredentials((prev) => ({
                              ...prev,
                              identity:
                                currentValue === credentials.identity
                                  ? "user"
                                  : currentValue,
                            }));
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              credentials.identity === identity.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {identity.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div
            className="w-full flex items-start gap-2 mt-2 cursor-pointer"
            onClick={() => setTermsAccepted(!termsAccepted)}
          >
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer pointer-events-none"
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-600 cursor-pointer"
            >
              I agree to the{" "}
              <span className="text-primary">Terms and Conditions</span>
            </label>
          </div>
        </section>
        <section className="w-full flex flex-row items-center justify-center">
          <Button
            isLoading={isSubmitting}
            type="submit"
            title={"Login"}
            disabled={!termsAccepted}
          ></Button>
        </section>
      </form>
    </Bounded>
  );
}

export default Login;
