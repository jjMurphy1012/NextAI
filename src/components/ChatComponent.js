import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button } from "antd";
import { AudioOutlined } from "@ant-design/icons";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Speech from "speak-tts";
import { use } from "react";
import { splitSentences } from "speak-tts/lib/utils";
const { Search } = Input;

const DOMAIN = process.env.REACT_APP_DOMAIN;

const searchContainer = {
  display: "flex",
  justifyContent: "center",
};

const ChatComponent = (props) => {
  const { handleResp, isLoading, setIsLoading } = props;
  // Define a state variable to keep track of the search value
  const [searchValue, setSearchValue] = useState("");
  const [isChatModeOn, setIsChatModeOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speech, setSpeech] = useState(null);

  //speech recognition
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    listening,
  } = useSpeechRecognition();

  useEffect(() => {
    const speech = new Speech();
    if (speech.hasBrowserSupport()) {
      setSpeech(speech);
      speech
        .init({
          volume: 1,
          lang: "en-GB",
          rate: 1,
          pitch: 1,
          voice: "Google US English",
          splitSentences: false,
        })
        .then((data) => {
          setSpeech(speech);
        })
        .catch((e) => {
          console.error("An error occurred while initializing : ", e);
        });
    }
  }, []);
  //语音输入，没有声音自动停止。输入完了才进行搜索
  useEffect(() => {
    if (!listening && !!transcript) {
      (async () => await onSearch(transcript))();
      setIsRecording(false);
    }
  }, [listening, transcript]); //

  const talk = (what2say) => {
    speech
      .speak({
        text: what2say,
        queue: false, // current speech will be interrupted,
        listeners: {
          onstart: () => {
            console.log("Start utterance");
          },
          onend: () => {
            console.log("End utterance");
          },
          onresume: () => {
            console.log("Resume utterance");
          },
          onboundary: (event) => {
            console.log(
              event.name +
                " boundary reached after " +
                event.elapsedTime +
                " milliseconds."
            );
          },
        },
      })

      .then(() => {
        // if everyting went well, start listening again
        console.log("Success !");
        userStartConvo();
      })
      .catch((e) => {
        console.error("An error occurred :", e);
      });
  };
  const userStartConvo = () => {
    SpeechRecognition.startListening();
    setIsRecording(true);
    resetTranscript();
  };
  const chatModeClickHandler = () => {
    setIsChatModeOn(!isChatModeOn);
    //点击chatMode的时候停止语音输入
    setIsRecording(false);
    SpeechRecognition.stopListening();
  };
  const recordingClickHandler = () => {
    if (isRecording) {
      //如果正在录音，点击就停止录音
      setIsRecording(false);
      SpeechRecognition.stopListening();
    } else {
      //如果没有在录音，点击就开始录音
      setIsRecording(true);
      SpeechRecognition.startListening();
    }
  };
  const onSearch = async (question) => {
    // Clear the search input
    setSearchValue("");
    setIsLoading(true);

    try {
      const response = await axios.get(`${DOMAIN}/chat`, {
        params: {
          question,
        },
      });
      handleResp(question, response.data);
      // if chat mode is on, speak the response
      if (isChatModeOn) {
        talk(response.data);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
      handleResp(question, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    // Update searchValue state when the user types in the input box
    setSearchValue(e.target.value);
  };

  return (
    <div style={searchContainer}>
      {!isChatModeOn && (
        <Search
          placeholder="input search text"
          enterButton="Ask"
          size="large"
          onSearch={onSearch}
          loading={isLoading}
          value={searchValue} // Control the value
          onChange={handleChange} // Update the value when changed
        />
      )}
      <Button
        type="primary"
        size="large"
        danger={isChatModeOn}
        onClick={chatModeClickHandler}
        style={{ marginLeft: "5px" }}
      >
        Chat Mode: {isChatModeOn ? "On" : "Off"}
      </Button>
      {isChatModeOn && (
        <Button
          type="primary"
          icon={<AudioOutlined />}
          size="large"
          danger={isRecording}
          onClick={recordingClickHandler}
          style={{ marginLeft: "5px" }}
        >
          {isRecording ? "Recording..." : "Click to record"}
        </Button>
      )}
    </div>
  );
};

export default ChatComponent;
