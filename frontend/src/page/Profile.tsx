import Dropzone from "@/components/ImageDropzone";
import Bounded from "./landing/Bounded";
import StarGrid from "./landing/StarGrid";
import { useState } from "react";
import Button from "@/components/shared/Button";
import LocationPicker from "@/components/LocationPicker";
import InputField from "@/components/shared/InputField";
import { MapPin } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/apiDetails";

function Profile() {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const [frontCitizenship, setFrontCitizenship] = useState<File | null>(null);
  const [backCitizenship, setBackCitizenship] = useState<File | null>(null);
  const [latitude, setLatitude] = useState<number>(user.latitude || 0);
  const [longitude, setLongitude] = useState<number>(user.longitude || 0);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSubmitForUsers = async () => {
    setIsSaving(true);
    try {
      updateUser({
        latitude,
        longitude,
      });
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitForFarmers = async () => {
    if (!frontCitizenship || !backCitizenship) {
      console.error("Both citizenship documents are required");
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("citizenship-front", frontCitizenship);
      formData.append("citizenship-back", backCitizenship);
      formData.append("farmerId", user.id);

      const response = await axios.post(
        `${API_BASE_URL}/users/verify`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await updateUser({
        verified: response.data.data.verified,
        citizenShip_back: response.data.data.citizenShip_back,
        citizenShip_front: response.data.data.citizenShip_front,
      });

      toast.success("Citizenship documents submitted successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || !user.username) {
    navigate("/login");
    return null;
  }

  return (
    <Bounded className="mb-16">
      <StarGrid />
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center justify-start gap-8 px-4">
        <div className="relative w-full flex flex-col items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Profile
          </h1>
        </div>

        {user.identity === "farmer" ? (
          <section className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-foreground">
                Citizenship Documents
              </h2>
              <p className="text-sm text-muted-foreground">
                Upload front and back images of your citizenship
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-foreground">
                  Front Side
                </label>
                <Dropzone
                  onChange={(file) => setFrontCitizenship(file)}
                  prompt="Upload Front Citizenship"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-foreground">
                  Back Side
                </label>
                <Dropzone
                  onChange={(file) => setBackCitizenship(file)}
                  prompt="Upload Back Citizenship"
                />
              </div>
            </div>
          </section>
        ) : (
          <section className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-foreground">
                Location
              </h2>
              <p className="text-sm text-muted-foreground">
                Update your current location information
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-foreground">
                  Coordinates (Lat, Lng)
                </label>

                <InputField
                  name="coordinates"
                  icon={<MapPin className="w-4 h-4" />}
                  type="text"
                  placeholder="27.62958, 83.47240"
                  value={`${latitude ? latitude : 27.62958}, ${
                    longitude ? longitude : 83.4724
                  }`}
                  onChange={(value) => {
                    if (value.trim() === "") {
                      setLatitude(27.62958);
                      setLongitude(83.4724);
                      return;
                    }

                    const parts = value.split(",");
                    if (parts.length === 2) {
                      const lat = parseFloat(parts[0].trim());
                      const lng = parseFloat(parts[1].trim());

                      if (
                        !isNaN(lat) &&
                        !isNaN(lng) &&
                        lat >= -90 &&
                        lat <= 90 &&
                        lng >= -180 &&
                        lng <= 180
                      ) {
                        setLatitude(lat);
                        setLongitude(lng);
                      }
                    }
                  }}
                  disabled={isSaving}
                  className={isSaving ? "opacity-50 cursor-not-allowed" : ""}
                />

                <LocationPicker
                  location={{ latitude, longitude }}
                  onChange={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                  }}
                  className={isSaving ? "opacity-50 pointer-events-none" : ""}
                />
              </div>
            </div>
          </section>
        )}

        <section className="w-full flex flex-row items-center justify-end gap-4">
          <Button
            title="Save Documents"
            onClick={
              user.identity === "farmer"
                ? handleSubmitForFarmers
                : handleSubmitForUsers
            }
            isLoading={isSaving}
            containerClass="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
          ></Button>
        </section>
      </main>
    </Bounded>
  );
}

export default Profile;
