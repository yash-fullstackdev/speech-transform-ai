"use client";

import { useState } from "react";
import Dropzone from "react-dropzone";
import { useReactMediaRecorder } from "react-media-recorder";
import AudioPlayer from "react-h5-audio-player";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { dataUrlToFile } from "@/app/utils";
import axios from "axios";
import MicIcon from "@mui/icons-material/Mic";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import "./index.css";

const HomeComponent = () => {
  const [playAudio, setPlayAudio] = useState<boolean>(false);
  // const [formData, setFormData] = useState<any>();
  const [audiotext, setaudioText] = useState<any>();
  const [isLoading, setIsloading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [convertedText, setCovertedText] = useState();

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      stopStreamsOnStop: true,
      onStop(blobUrl) {
        createAudioFile(blobUrl);
      },
    });

  const handleuploadAudio = async (e: any, isDropped = false) => {
    let file;
    if (!isDropped && e?.target?.files && e.target.files[0]) {
      file = e.target.files[0];
    } else {
      file = e[0];
    }
    const data = new FormData();
    data.append("file", file);
    data.append("model", "whisper-1");
    data.append("language", "en");

    console.log("data", data);
    // setFormData(data);

    if (file.size > 25 * 1024 * 1024) {
      alert("Please upload an audio file less than 25MB");
      return;
    }

    try {
      setIsloading(true);
      setSummaryLoading(true);
      console.log("formData", data);
      const res = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        data,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
        }
      );

      const tdata = res.data;
      setCovertedText(tdata.text);
      setIsloading(false);

      // API call For summary data
      const summaryResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content: `Summarize the following text. Provide a short summary of the meeting and a bulleted list of the main meeting highlights : ${tdata.text}`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer  ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      setaudioText(summaryResponse?.data.choices[0].message.content);
      setSummaryLoading(false);
    } catch {
      console.log("error");
    } finally {
      setIsloading(false);
      setSummaryLoading(false);
    }
  };

  const createAudioFile = async (blobURL: any) => {
    try {
      const reader = new FileReader();
      const getURL = await fetch(blobURL ?? "");
      const convertToBlob = await getURL.blob();
      if (convertToBlob) {
        reader.readAsDataURL(convertToBlob);
        reader.onloadend = async () => {
          const fileName = "test-audio";
          const url = reader.result?.toString() ?? "";
          const file: any = dataUrlToFile(url, fileName);
          console.log("testFile", file);
          const modalData = new FormData();
          modalData.append("file", file);
          modalData.append("model", "whisper-1");
          modalData.append("language", "en");
          console.log("modalData", modalData);
          // setFormData(modalData);

          try {
            setIsloading(true);
            setSummaryLoading(true);
            const reader: any = new FileReader();
            reader.readAsDataURL(convertToBlob);
            reader.onloadend = async function () {
              const response = await axios.post(
                "https://api.openai.com/v1/audio/transcriptions",
                modalData,
                {
                  headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                  },
                }
              );
              const { text } = response.data;
              setCovertedText(text);
              setIsloading(false);

              const summaryResponse = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                  model: "gpt-3.5-turbo",
                  messages: [
                    {
                      role: "user",
                      content: `Summarize the following text. Provide a short summary of the meeting and a bulleted list of the main meeting highlights : ${text}`,
                    },
                  ],
                },
                {
                  headers: {
                    Authorization: `Bearer  ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              setaudioText(summaryResponse.data.choices[0].message.content);
              setSummaryLoading(false);

              if (response.status !== 200) {
                throw (
                  response.data.error ||
                  new Error(`Request failed with status ${response.status}`)
                );
              }
            };
          } catch (error: any) {
            console.error(error);
            alert(error.message);
          } finally {
            setIsloading(false);
            setSummaryLoading(false);
          }
        };
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleDrop = (acceptedFiles: any) => {
    handleuploadAudio(acceptedFiles, true);
  };

  const handleDragEnter = () => {
    console.log("Drag enter");
  };

  const handleDragLeave = () => {
    console.log("Drag leave");
  };

  return (
    <>
      <Dropzone
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        noClick={true}
        accept={{ "audio/*": [] }}
        maxFiles={1}
      >
        {({ getRootProps, getInputProps, open, acceptedFiles }) => (
          <div style={{ padding: "10px 40px 0px 40px" }}>
            <div
              {...getRootProps({ className: "dropzone" })}
              className="w-full bg-gray-200 h-[355px] border-1 bg-white flex items-center justify-center flex-col "
            >
              <input {...getInputProps()} />

              <div className="flex py-3">
                <div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {status == "idle" && (
                      <Button
                        variant="contained"
                        onClick={startRecording}
                        startIcon={<MicIcon />}
                      >
                        Start recording
                      </Button>
                    )}
                    {status == "stopped" && (
                      <Button
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => {
                          setPlayAudio(true);
                        }}
                      >
                        play recording
                      </Button>
                    )}
                    {status == "recording" && (
                      <Button
                        onClick={stopRecording}
                        startIcon={<StopIcon />}
                        variant="contained"
                      >
                        stop recording
                      </Button>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "10px 0",
                    }}
                  >
                    ---- OR ----
                  </div>

                  {acceptedFiles && acceptedFiles.length > 0 && (
                    <Typography>File Name: {acceptedFiles[0].name}</Typography>
                  )}

                  <Typography>
                    Drag in or<Button onClick={open}>upload</Button>a
                    pre-recorded audio.
                  </Typography>
                </div>
              </div>

              {playAudio && (
                <div className="w-full h-[355px] md:rounded-20 border-0 md:border-1 md:border-grey-200 bg-white md:bg-[#F9F9F9] flex items-center justify-center flex-col">
                  <AudioPlayer
                    autoPlay={true}
                    src={mediaBlobUrl ?? ""}
                    onEnded={() => setPlayAudio(false)}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Dropzone>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          padding: "40px",
          justifyContent: "center",
        }}
      >
        <div>
          {/* {convertedText && ( */}
          <Card className="m-3" sx={{ width: 600, minHeight: 300 }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Converted Text
              </Typography>
              {isLoading && <CircularProgress />}
              <Typography variant="body2" color="text.secondary">
                {!convertedText &&
                  !isLoading &&
                  "No Data sync please process Data"}
                {convertedText}
              </Typography>
            </CardContent>
          </Card>
          {/* )} */}
        </div>
        <div>
          {/* {audiotext && ( */}
          <>
            <Card className="m-3" sx={{ width: 600, minHeight: 300 }}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Summary Text
                </Typography>
                {summaryLoading && <CircularProgress />}
                <Typography variant="body2" color="text.secondary">
                  {!audiotext &&
                    !summaryLoading &&
                    "No Data sync please process Data"}
                  {audiotext}
                </Typography>
              </CardContent>
            </Card>
          </>
          {/* )} */}
        </div>
      </div>
    </>
  );
};
export default HomeComponent;
