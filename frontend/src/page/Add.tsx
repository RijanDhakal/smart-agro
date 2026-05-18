import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Loader,
  LucideText,
  Mic,
  RotateCcw,
  Save,
  Shuffle,
} from "lucide-react";
import Bounded from "./landing/Bounded";
import StarGrid from "./landing/StarGrid";
import { FaCloudUploadAlt } from "react-icons/fa";
import InputField from "@/components/shared/InputField";
import { BarVisualizer } from "@/components/ui/bar-visualizer";
import { SiTicktick } from "react-icons/si";
import { FaIndianRupeeSign, FaX } from "react-icons/fa6";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import Button from "@/components/shared/Button";
import { GoNumber } from "react-icons/go";
import { MdTextFields } from "react-icons/md";
import { API_BASE_URL } from "@/config/apiDetails";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Add() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    expectedLifeSpan: "",
  });
  const [isCaptured, setIsCaptured] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [speechModuleState, setSpeechModuleState] = useState<
    "idle" | "listening" | "processing" | "completed" | "failed"
  >("idle");
  const { startRecording, stopRecording, isRecording } = useVoiceRecorder({
    onTranscriptionComplete: (result) => {
      console.log("Transcription Result:", result);
      setData((prev) => ({
        ...prev,
        name: result.data.name.english || prev.name,
        description: result.data.description || prev.description,
        price:
          result.data.price.value + " " + result.data.price.unit || prev.price,
        quantity:
          result.data.quantity.value + " " + result.data.quantity.unit ||
          prev.quantity,
        expectedLifeSpan: result.data.expectedLifeSpan || prev.expectedLifeSpan,
      }));
      setSpeechModuleState("completed");
    },
    onError: (error) => {
      console.error("Voice Recorder Error:", error);
      setSpeechModuleState("failed");
    },
    apiEndpoint: `${API_BASE_URL}/products/add-voice`,
  });

  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );

  async function startCamera() {
    try {
      if (video.current?.srcObject) {
        const stream = video.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      if (video.current) {
        video.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied or not available.");
      console.error(err);
    }
  }

  const handleCapture = () => {
    if (!canvas.current || !video.current) return;

    const context = canvas.current.getContext("2d");
    if (!context) return;

    canvas.current.width = video.current.videoWidth;
    canvas.current.height = video.current.videoHeight;
    context.drawImage(
      video.current,
      0,
      0,
      canvas.current.width,
      canvas.current.height
    );
    setIsCaptured(true);
  };

  const handleRetake = () => {
    setIsCaptured(false);
    startCamera();
  };

  const handleFlip = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setCapturedFile(file);
        setIsCaptured(true);

        if (canvas.current) {
          const img = new Image();
          img.onload = () => {
            if (canvas.current) {
              canvas.current.width = img.width;
              canvas.current.height = img.height;
              const context = canvas.current.getContext("2d");
              context?.drawImage(img, 0, 0);
            }
          };
          img.src = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!canvas.current) return;

    canvas.current.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });

          setCapturedFile(file);
          setIsSubmitted(true);
          console.log("Submitting file:", file);
        }
      },
      "image/jpeg",
      0.95
    );
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!capturedFile) {
      console.error("Product image is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("productName", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("quantity", data.quantity);
      formData.append("expectedLifeSpan", data.expectedLifeSpan);
      formData.append("sellerId", user.id);
      formData.append("picture", capturedFile);

      const response = await axios.post(
        `${API_BASE_URL}/products/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Product Data:", response.data);
      navigate("/home");
    } catch (error) {
      console.error("Error submitting product data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    startCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  useEffect(() => {
    const videoElement = video.current;

    return () => {
      if (videoElement?.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  if (isSubmitted && capturedFile) {
    return (
      <Bounded>
        <StarGrid />
        <main className="w-full max-w-4xl mx-auto flex flex-col items-center justify-start gap-8 px-4">
          <div className="relative w-full flex flex-col items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Products
            </h1>
          </div>

          <section className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-foreground">
                Product Image
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <div className="w-full aspect-video border-2 border-dashed flex flex-col items-center justify-center rounded-xl cursor-pointer">
                  <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                    <img
                      src={
                        capturedFile ? URL.createObjectURL(capturedFile) : ""
                      }
                      alt="Uploaded Product Image Preview"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-foreground">
                Product Details
              </h2>
            </div>

            <section className="flex flex-row items-center justify-center relative mb-4">
              {speechModuleState === "listening" ? (
                <>
                  <div className="w-full h-30 flex flex-col items-center justify-center bg-[#F4F4F5] relative rounded-xl gap-2">
                    <BarVisualizer
                      state={isRecording ? "speaking" : "listening"}
                      demo={true}
                      barCount={15}
                      minHeight={15}
                      maxHeight={90}
                      className="h-30 max-w-full"
                    />
                    <button
                      onClick={() => {
                        setSpeechModuleState("processing");
                        stopRecording();
                      }}
                      className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-20 bg-destructive/80 hover:bg-destructive/90 active:bg-destructive text-white rounded-full p-3 sm:p-4 transition-all duration-200 active:scale-95 touch-manipulation cursor-pointer"
                      aria-label={"Speak"}
                    >
                      <FaX className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                </>
              ) : speechModuleState === "processing" ? (
                <>
                  <div className="w-full h-30 flex flex-col items-center justify-center bg-[#F4F4F5] relative rounded-xl gap-2">
                    <div
                      onClick={() => setSpeechModuleState("completed")}
                      className="z-20 bg-primary/80 hover:bg-primary/90 active:bg-primary text-white rounded-full p-3 sm:p-4 transition-all duration-200 active:scale-95 touch-manipulation cursor-pointer"
                      aria-label={"processing"}
                    >
                      <Loader className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                    </div>
                    Processing
                  </div>
                </>
              ) : speechModuleState === "completed" ? (
                <div className="w-full h-30 flex flex-row items-center justify-center bg-[#F4F4F5] relative rounded-xl gap-2">
                  <div
                    className="z-20 bg-primary/80 hover:bg-primary/90 active:bg-primary text-white rounded-full p-3 sm:p-4 transition-all duration-200 active:scale-95 touch-manipulation cursor-pointer"
                    aria-label={"Speak"}
                  >
                    <SiTicktick className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  Completed
                </div>
              ) : speechModuleState === "failed" ? (
                <div className="w-full h-30 flex flex-col items-center justify-center bg-[#F4F4F5] relative rounded-xl gap-2">
                  <button
                    onClick={() => {
                      setSpeechModuleState("listening");
                      startRecording();
                    }}
                    className="z-20 bg-destructive/80 hover:bg-destructive/90 active:bg-destructive text-white rounded-full p-3 sm:p-4 transition-all duration-200 active:scale-95 touch-manipulation cursor-pointer"
                    aria-label={"Speak"}
                  >
                    <FaX className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  Failed to generate! Try again.
                </div>
              ) : (
                <div className="w-full h-30 flex flex-col items-center justify-center bg-[#F4F4F5] relative rounded-xl gap-2">
                  <button
                    onClick={() => {
                      setSpeechModuleState("listening");
                      startRecording();
                    }}
                    className="z-20 bg-primary/80 hover:bg-primary/90 active:bg-primary text-white rounded-full p-3 sm:p-4 transition-all duration-200 active:scale-95 touch-manipulation cursor-pointer"
                    aria-label={"Speak"}
                  >
                    <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  Generate Using Speech
                </div>
              )}
            </section>

            <form
              onSubmit={handleFormSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              <div className="flex flex-col col-span-2">
                <label className="text-sm font-medium text-foreground">
                  Name
                </label>
                <InputField
                  value={data.name}
                  onChange={(e) => setData((prev) => ({ ...prev, name: e }))}
                  icon={<MdTextFields />}
                  placeholder="Name of the product"
                  name="name"
                ></InputField>
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <InputField
                  value={data.description}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, description: e }))
                  }
                  icon={<LucideText />}
                  placeholder="Description of the product"
                  name="description"
                ></InputField>
              </div>
              <div className="flex flex-col col-span-2 md:col-span-1">
                <label className="text-sm font-medium text-foreground">
                  Price
                </label>
                <InputField
                  value={data.price}
                  onChange={(e) => setData((prev) => ({ ...prev, price: e }))}
                  icon={<FaIndianRupeeSign />}
                  placeholder="Price of the product"
                  name="price"
                ></InputField>
              </div>
              <div className="flex flex-col col-span-2 md:col-span-1">
                <label className="text-sm font-medium text-foreground">
                  Quantity
                </label>
                <InputField
                  value={data.quantity}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, quantity: e }))
                  }
                  icon={<GoNumber />}
                  placeholder="Quantity of the product"
                  name="quantity"
                ></InputField>
              </div>

              <section className="flex flex-row items-center justify-center col-span-2 mt-4">
                <Button
                  type="submit"
                  title="Create Product"
                  isLoading={isSubmitting}
                ></Button>
              </section>
            </form>
          </section>
        </main>
      </Bounded>
    );
  }

  return (
    <div className="relative w-[calc(100vw-1px)] h-[calc(100vh-1px)] overflow-hidden bg-white">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <video
        ref={video}
        autoPlay
        playsInline
        className={`w-full h-full object-cover ${
          isCaptured ? "hidden" : "block"
        }`}
      />
      <canvas
        ref={canvas}
        className={`w-full h-full object-cover ${
          isCaptured ? "block" : "hidden"
        }`}
      />

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-4">
          {!isCaptured ? (
            <>
              <button
                onClick={handleFlip}
                className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="Flip"
              >
                <Shuffle className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={handleCapture}
                className="bg-white rounded-full p-4 shadow-lg hover:bg-gray-100 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="Capture photo"
              >
                <Camera className="w-8 h-8 text-gray-800" />
              </button>
              <button
                onClick={handleUpload}
                className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="Upload"
              >
                <FaCloudUploadAlt className="w-6 h-6 text-gray-800" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRetake}
                className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="Retake photo"
              >
                <RotateCcw className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={handleSubmit}
                className="bg-primary/90 rounded-full p-4 shadow-lg hover:bg-primary active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="Submit"
              >
                <Save className="w-8 h-8 text-white" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Add;
