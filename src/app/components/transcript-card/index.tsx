import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  CircularProgress,
  Typography,
  AccordionActions,
  Button,
  List,
  ListItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const TransciptCard = ({ title, transcriptText, summaryLoading }: any) => {
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
  return (
    <Accordion defaultExpanded>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel3-content"
        id="panel3-header"
      >
        {title}
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "30px" }}>
        <Box
          sx={{
            border: "1px solid black",
            borderRadius: "5px",
            minHeight: "30px",
            padding: "20px",
          }}
        >
          <Box className="flex justify-center">
            {summaryLoading && <CircularProgress />}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {!transcriptText &&
              !summaryLoading &&
              "No Data sync please process Data"}
            {Array.isArray(transcriptText) &&
              typeof transcriptText[0] === "string" && (
                <List className="text-black text-[16px]">
                  {transcriptText.map((item: any, index: any) => (
                    <ListItem
                      key={index}
                      className="-mt-2"
                      sx={{
                        padding: "8px 0px",
                      }}
                    >
                      {item}
                    </ListItem>
                  ))}
                </List>
              )}
            {transcriptText?.hasOwnProperty("intro") && (
              <Typography variant="body2" color="black">
                <Typography
                  variant="subtitle1"
                  sx={{
                    marginBottom: "20px",
                  }}
                >
                  {transcriptText.title}
                </Typography>
                <Typography variant="subtitle1">
                  {transcriptText.intro}
                </Typography>
                <List className="text-[16px]">
                  {transcriptText.points.map((point: any, index: any) => (
                    <ListItem key={index} className="-mt-2">
                      {"- " + point}
                    </ListItem>
                  ))}
                </List>
                <Typography
                  variant="subtitle1"
                  sx={{
                    marginBottom: "20px",
                  }}
                >
                  {transcriptText.outro}
                </Typography>
                <Typography variant="subtitle1">Sincerely,</Typography>
                <Typography variant="subtitle1">
                  {transcriptText.regards}
                </Typography>
              </Typography>
            )}
            {typeof transcriptText === "string" && transcriptText}
            {transcriptText?.hasOwnProperty("vitalSigns") && (
              <Typography variant="body2" color="black">
                <Typography variant="subtitle1">
                  vitalSigns:{transcriptText.vitalSigns}
                </Typography>
                <Typography variant="subtitle1">
                  physicalExamination:{transcriptText.physicalExamination}
                </Typography>
                <Typography variant="subtitle1">
                  diagnosticTestResults:{transcriptText.diagnosticTestResults}
                </Typography>
              </Typography>
            )}
            {Array.isArray(transcriptText) &&
              typeof transcriptText[0] === "object" &&
              transcriptText.map((item: any, index: any) => (
                <Typography variant="body2" color="black">
                  <Typography
                    variant="subtitle1"
                    sx={{
                      marginBottom: "7px",
                    }}
                  >
                    {`${index + 1}. ${item.title}`}
                  </Typography>
                  <List className="text-[16px]">
                    {item.data.map((point: any, index: any) => (
                      <ListItem key={index} className="-mt-2">
                        {"- " + point}
                      </ListItem>
                    ))}
                  </List>
                </Typography>
              ))}
          </Typography>
        </Box>
      </AccordionDetails>
      <AccordionActions>
        <Button onClick={() => handleCopy(transcriptText)}>Copy</Button>
      </AccordionActions>
    </Accordion>
  );
};

export default TransciptCard;
