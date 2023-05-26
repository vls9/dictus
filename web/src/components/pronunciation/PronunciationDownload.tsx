import { Button } from "@chakra-ui/react";
import { useState } from "react";

interface PronunciationDownloadProps {}

export const PronunciationDownload: React.FC<
  PronunciationDownloadProps
> = ({}) => {
  const [alertMessage, setAlertMessage] = useState("");
  const handleDownload = async () => {
    // Get CSV file from the back end
    try {
      const response = await fetch("http://localhost:4000/download-pronunciations", {
        method: "GET",
        headers: {
          Accept: "text/csv",
        },
        credentials: "include", // Send cookie
      });
      if (response.status !== 200) {
        setAlertMessage("Failed to download pronunciations");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const formattedTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
      a.download = `pronunciations_${formattedTimestamp}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error(error);
      setAlertMessage("Failed to download pronunciations");
    }
  };

  return (
    <>
      <Button
        mb={4}
        colorScheme="green"
        variant="outline"
        onClick={handleDownload}
      >
        Download all
      </Button>
    </>
  );
};
