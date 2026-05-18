import { useRef, useCallback } from "react";
import axios from "axios";
import type { VoiceApiResponse } from "@/config/apiDetails";

interface VoiceRecorderOptions {
  onTranscriptionComplete?: (obj: VoiceApiResponse) => void;
  onError?: (error: Error) => void;
  apiEndpoint?: string;
}

export const useVoiceRecorder = ({
  onTranscriptionComplete,
  onError,
  apiEndpoint = "",
}: VoiceRecorderOptions = {}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const uploadAudio = useCallback(
    async (blob: Blob): Promise<string | null> => {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");
      try {
        const response = await axios.post(apiEndpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const result = response.data;
        onTranscriptionComplete?.(result);
        return result;
      } catch (error) {
        console.error("Error uploading audio:", error);
        onError?.(error as Error);
        return null;
      }
    },
    [apiEndpoint, onTranscriptionComplete, onError]
  );

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        console.log("Audio Blob:", audioBlob);
        await uploadAudio(audioBlob);
        stopStream();
      };

      mediaRecorder.start();
    } catch (error) {
      onError?.(error as Error);
    }
  }, [uploadAudio, onError]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
  }, []);

  return {
    startRecording,
    stopRecording,
    isRecording: mediaRecorderRef.current?.state === "recording",
  };
};
