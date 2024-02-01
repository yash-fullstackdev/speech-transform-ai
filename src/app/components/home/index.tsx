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
  const [formData, setFormData] = useState<any>();
  const [audiotext, setaudioText] = useState<any>();
  const [isLoading, setIsloading] = useState(false);
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
    console.log("e", e[0], isDropped);
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
    setFormData(data);

    if (file.size > 25 * 1024 * 1024) {
      alert("Please upload an audio file less than 25MB");
      return;
    }

    try {
      console.log("formData", data);
      //  const Tdata = new FormData();
      //  Tdata.append("model", "whisper-1");
      //  Tdata.append("language", "en");
      //  setIsloading(true);
      //  console.log("Tdata", Tdata);
      const res = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },

          method: "POST",
          body: data,
        }
      );

      const tdata = await res.json();
      setCovertedText(tdata.text);

      //API call For summry data

      const summaryResponse: any = await axios.post(
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
    } catch {
      console.log("error");
    } finally {
      setIsloading(false);
    }
  };

  // const sendAudio = async () => {
  //   try {
  //     console.log("formData", formData);
  //     const Tdata = new FormData();
  //     Tdata.append("model", "whisper-1");
  //     Tdata.append("language", "en");
  //     setIsloading(true);
  //     console.log("Tdata", Tdata);
  //     const res = await fetch(
  //       "https://api.openai.com/v1/audio/transcriptions",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
  //         },

  //         method: "POST",
  //         body: Tdata,
  //       }
  //     );

  //     const data = await res.json();
  //     setCovertedText(data.text);

  //     const summaryResponse: any = await axios.post(
  //       "https://api.openai.com/v1/chat/completions",
  //       {
  //         model: "gpt-4",
  //         messages: [
  //           {
  //             role: "user",
  //             content: `Summarize the following text. Provide a short summary of the meeting and a bulleted list of the main meeting highlights : ${data.text}`,
  //           },
  //         ],
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer  ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     setaudioText(summaryResponse?.data.choices[0].message.content);
  //   } catch {
  //     console.log("error");
  //   } finally {
  //     setIsloading(false);
  //   }
  // };

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
          setFormData(modalData);

          try {
            setIsloading(true);
            const reader: any = new FileReader();
            reader.readAsDataURL(convertToBlob);
            reader.onloadend = async function () {
              const response = await fetch(
                "https://api.openai.com/v1/audio/transcriptions",
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                  },
                  body: modalData,
                }
              ).then((res) => res.json());
              const { text } = response;
              setCovertedText(text);

              const summaryResponse: any = await axios.post(
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

              const data = await response.json();
              if (response.status !== 200) {
                throw (
                  data.error ||
                  new Error(`Request failed with status ${response.status}`)
                );
              }
            };
          } catch (error: any) {
            console.error(error);
            alert(error.message);
          } finally {
            setIsloading(false);
          }
        };
      }
    } catch (error) {
      // eslint-disable-next-line no-console
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
                {/* <Button onClick={sendAudio}>upload</Button> */}
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
              {/* <input type="file" onChange={handleuploadAudio}></input> */}
            </div>
          </div>
        )}
      </Dropzone>
      {isLoading && <CircularProgress />}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <div>
          {convertedText && (
            <Card className="m-3">
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Converted Text
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {convertedText}
                </Typography>
              </CardContent>
            </Card>
          )}
        </div>
        <div>
          {audiotext && (
            <>
              <Card className="m-3">
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Summary Text
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {audiotext}
                  </Typography>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default HomeComponent;
