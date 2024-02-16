"use client";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { Button, Typography } from "@mui/material";
import { dataUrlToFile } from "@/app/utils";
import axios from "axios";
import "./index.css";
import { VoiceVisualizer, useVoiceVisualizer } from "react-voice-visualizer";
import TransciptCard from "../transcript-card";
import { uuidv4 } from "@firebase/util";
import { Timestamp, addDoc, collection, updateDoc } from "firebase/firestore";
import db, { storage } from "@/app/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import NameModel from "./_components/NameModel";
import { checkValidJSon } from "@/app/utils/checkJson";

const HomeComponent = () => {
  if (typeof window !== "undefined") {
    const [audiotext, setaudioText] = useState<any>("");
    const [isLoading, setIsloading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [mainLoading, setMainLoading] = useState(true);
    const [currentDocId, setCurrentDocId] = useState("");
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [convertedText, setCovertedText] = useState("");
    const [open, setOpen] = useState(false);
    const recorderControls = useVoiceVisualizer();
    const [userData, setUserData] = useState({ name: "unknown", id: "" });
    const { audioRef, isAvailableRecordedAudio } = recorderControls;
    const [audioFile, setAudioFile] = useState(null as any);
    const handleuploadAudio = async (e: any, isDropped = false) => {
      let file;

      setaudioText(JSON.stringify(""));
      setCovertedText("");
      if (!isDropped && e?.target?.files && e.target.files[0]) {
        file = e.target.files[0];
        setAudioFile(file);
      } else {
        file = e[0];
        setAudioFile(file);
      }
      const data = new FormData();
      data.append("file", file);
      data.append("model", "whisper-1");
      data.append("language", "en");
      if (file.size > 30 * 1024 * 1024) {
        alert("Please upload an audio file less than 30MB");
        return;
      }

      try {
        setIsloading(true);
        setSummaryLoading(true);
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

        const summaryResponse = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4",
            messages: [
              {
                role: "user",
                content: `

Do not include any explanations, only provide a  RFC8259 compliant JSON response  following this format without deviation.give me each data full not cut and save like this ...
(the given exmple is just a exmple craete data from given text data at the end of the exmple)
(regards take from ${userData.name})
Exmple data needed in this format : {
  "subjective": [
    "The patient, Simran Parveen, a 29-year-old female, presents with a chief complaint of severe stomach ache since yesterday night. She reports taking an antacid last night, but the pain persisted. The patient also experienced bouts of vomiting last night and this morning.",
    "Simran has a history of a similar stomach ache approximately three months ago, which resolved after taking an antacid. She denies having a headache. The patient expresses significant discomfort and difficulty working due to the pain."
  ],
  "objective": {
    "vitalSigns": "Not mentioned",
    "physicalExamination": "Abdominal tenderness upon palpation",
    "diagnosticTestResults": "Positive for food poisoning"
  },
  "assessmentPlan": [
    {
      "title": "Acute abdominal pain",
      "data": [
        "History: Patient Simran Parveen, 29 years old, presented with severe stomach ache since yesterday night. The pain did not subside with antacid use. The patient had a similar episode three months ago, but the pain resolved with antacid at that time.",
        "Physical Examination: Abdominal tenderness on palpation.",
        "Plan: Administered an injection for temporary pain relief. Prescribed medication for today to be taken after dinner."
      ]
    },
    {
      "title": "Nausea and vomiting",
      "data": [
        "History: Patient reported bouts of vomiting last night and this morning.",
        "Plan: Monitor symptoms and assess response to prescribed medication."
      ]
    },
    {
      "title": "Food poisoning",
      "data": [
        "History: Patient reported a similar episode three months ago, which resolved with antacid use.",
        "Plan: Prescribed medication for one week after dinner. Advised to return to the clinic immediately if similar symptoms occur again."
      ]
    }
  ],
  "PatientInstructions": {
    "title": "Dear Simran Parveen",
    "intro": "Thank you for visiting us again and for your dedication to improving your health. We appreciate your openness in discussing the challenges you've been facing with your back pain and the impact on your daily life. Here is a summary of the key points and recommendations from our conversation:",
    "points": [
      "Take the prescribed medicine after your dinner tonight.",
      "Submit the fees at the cash counter.",
      "After receiving your test reports, bring them to the clinic as soon as possible for review.",
      "Based on your test reports, it has been determined that you experienced food poisoning. Please take the newly prescribed medications for one week after dinner.",
      "If you experience similar symptoms again, return to the clinic immediately."
    ],
    "outro": "We hope you find relief soon and look forward to assisting you in your recovery. If you have any questions or concerns, please do not hesitate to contact our office.",
    "regards": "Test User"
  },
  "summaryMeeting": [
    "May I come in, doctor?",
    "Yes, come in.",
    "What's your name?",
    "I'm Simran Parveen.",
    "And how old are you?",
    "I'm 29.",
    "Now tell me, what are the problems that you're facing?",
    "Since yesterday night, I've been having severe stomach aches. I took an antacid last night but the pain was still the same.",
    "Any other symptoms?",
    "Yeah, I also had bouts of vomiting last night and today morning as well.",
    "Do you have a headache?",
    "No.",
    "Did you have this kind of a stomach ache before?",
    "Yes doctor, I had it once before.",
    "How many days ago?",
    "Almost three months ago.",
    "But at that time the pain stopped after I took an antacid.",
    "Please lie on the bed.",
    "Does it hurt here?",
    "Yes, doctor. It hurts a lot.",
    "Is it something serious doctor?",
    "I can't say now. I'm writing down some tests. Try to do this by today.",
    "But what about now? I can't even work properly because of the pain.",
    "I understand. I'm giving you an injection for temporary relief.",
    "After receiving the test reports, bring them to me as soon as possible.",
    "Won't you give me any medicines, doctor?",
    "I'm prescribing this medicine. It's just for today. Take it after your dinner.",
    "Where shall I submit the fees?",
    "Please submit that in the cash counter.",
    "Here are the reports of the tests that you gave.",
    "It's not that serious. Nothing to worry about. It was just food poisoning. I'm writing down a medicines. Please take them for one week after dinner.",
    "And if you face this problem again come back immediately.",
    "Thank you."
  ]
}
  ${tdata.text}`,
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
         setSummaryLoading(false);
         setMainLoading(false);
        if (summaryResponse.data.choices[0].message.content) {
          setaudioText(
            JSON.parse(summaryResponse.data.choices[0].message.content)
          );
        } else {
          toast.error("Please Upload file or audio again")
          return
        }
        
      } catch (error: any) {
        toast.error("Please try again later")
        console.error(error);
      } finally {
        setIsloading(false);
        setSummaryLoading(false);
        setMainLoading(false);
      }
    };

    const createAudioFile = async (blobURL: any) => {
      try {
        setIsloading(true);
        setSummaryLoading(true);
        const reader = new FileReader();
        const getURL = await fetch(blobURL ?? "");
        const convertToBlob = await getURL.blob();
        if (convertToBlob) {
          reader.readAsDataURL(convertToBlob);
          reader.onloadend = async () => {
            const fileName = "test-audio";
            const url = reader.result?.toString() ?? "";
            const file: any = dataUrlToFile(url, fileName);
            const modalData = new FormData();
            modalData.append("file", file);
            modalData.append("model", "whisper-1");
            modalData.append("language", "en");
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
                setMainLoading(false);
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

    useEffect(() => {
      if (audioRef?.current?.currentSrc) {
        createAudioFile(audioRef?.current?.currentSrc);
      }
    }, [isAvailableRecordedAudio, audioRef]);
    useEffect(() => {
      const userDataString = localStorage.getItem("userData");
      if (userDataString !== null) {
        setUserData(JSON.parse(userDataString));
      }
    }, []);
    const handleDrop = (acceptedFiles: any) => {
      handleuploadAudio(acceptedFiles, true);
    };

    const handleDragEnter = () => {
      console.log("Drag enter");
    };

    const handleDragLeave = () => {
      console.log("Drag leave");
    };

    const handleCopy = (content: any) => {
      console.log("content", content);
      navigator.clipboard
        .writeText(content)
        .then(() => {
          console.log("Text copied to clipboard");
        })
        .catch((error) => {
          console.error("Error copying text to clipboard:", error);
        });
    };

   console.log("audiotext", JSON.stringify(audiotext));

    const saveToFirebase = async () => {
      try {
        setSaveLoading(true);
        setOpen(true)
        const doc = await addDoc(collection(db, "patient"), {
          id: uuidv4(),
          summary: audiotext,
          full_transcript: convertedText,
          audio: "",
          isDeleted: false,
          isPdeleted: false,
          isRead: false,
          createdBy: userData.id,
          createdAt: Timestamp.now(),
          name: "unknown",
        });
        setCurrentDocId(doc.id);
        const fileURLs = [];

        const uuid = uuidv4();
        const fileRef = ref(storage, `audio/${uuid}.mp3`);
        if (audioFile) {
          await uploadBytes(fileRef, audioFile, {
            customMetadata: {
              originalName: audioFile.name,
            },
          });

          const downloadURL = await getDownloadURL(fileRef);

          fileURLs.push({
            fileName: `${uuid}.mp3`,
            location: downloadURL,
            originalName: audioFile.name,
          });
          await updateDoc(doc, { audio: downloadURL });
        }
        setSaveLoading(false);
        setMainLoading(true);
        setCovertedText("");
        setaudioText("");
        toast.success("Your data and audio have been saved successfully!");
      } catch (error) {
        setSaveLoading(false);
        console.error("Error saving data to Firebase:", error);
        toast.error(
          "Oops! Something went wrong while saving your data. Please try again later."
        );
      }
    };

   

    return (
      <>
        <NameModel open={open} id={currentDocId} handleClose={() => {
          setOpen(false)
        }} />
        <Dropzone
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          noClick={true}
          accept={{ "audio/*": [] }}
          maxFiles={1}
        >
          {({ getRootProps, getInputProps, open, acceptedFiles }: any) => (
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />

              <div>
                <div className="w-full  md:rounded-20 border-0 md:border-1 md:border-grey-200 bg-white md:bg-[#F9F9F9] flex items-center justify-center flex-col">
                  <VoiceVisualizer ref={audioRef} controls={recorderControls} />
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
                  <Typography textAlign="center">
                    File Name: {acceptedFiles[0].name}
                  </Typography>
                )}

                <Typography textAlign="center">
                  Drag in or<Button onClick={open}>upload</Button>a pre-recorded
                  audio.
                </Typography>
              </div>
            </div>
          )}
        </Dropzone>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
          }}
        >
          <div>
            <TransciptCard
              title="Full Transcript"
              transcriptText={convertedText}
              summaryLoading={isLoading}
            />
            <TransciptCard
              title="Subjective"
              transcriptText={audiotext.subjective}
              summaryLoading={summaryLoading}
            />

            <TransciptCard
              title="objective"
              transcriptText={audiotext.objective}
              summaryLoading={summaryLoading}
            />
            <TransciptCard
              title="assessment & Plan"
              transcriptText={audiotext.assessmentPlan}
              summaryLoading={summaryLoading}
            />
            <TransciptCard
              title="Patient Instructions"
              transcriptText={audiotext.PatientInstructions}
              summaryLoading={summaryLoading}
            />
            <TransciptCard
              title="Summary"
              transcriptText={audiotext.summaryMeeting}
              summaryLoading={summaryLoading}
            />
          </div>
        </div>
        <div className="flex flex-row-reverse mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={saveToFirebase}
            disabled={mainLoading}
            className="bg-blue-600"
          >
            {saveLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </>
    );
  }
};
export default HomeComponent;
