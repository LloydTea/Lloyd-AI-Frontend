import React from 'react';
import axios,{ AxiosResponse } from "axios";
import { useState, useEffect, useRef } from 'react'
import { Container, Button, Row, Col} from "react-bootstrap";
interface messageText {
    message: string;
}
interface MyResponseHeaders {
    data: {
        message: string;
    }
 }
const apiUrl = 'https://ai.lloydtea.pro:5450';


function Chatbot (){

  const [sendersMessage, setSendersMessage] = React.useState<messageText>({ message: ''});
  const [childElements, setChildElements] = useState<JSX.Element[]>([]);
  const [textareaHeight, setTextareaHeight] = useState('40px'); 
  const parentRef = useRef<HTMLDivElement>(null);

  function handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setSendersMessage({ message: event.target.value });
    const textarea = event.target;
    textarea.style.height = '40px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }


  function handleKeyPress(event:  React.KeyboardEvent<HTMLTextAreaElement>){
    if (event.key === 'Enter') {
      event.preventDefault(); 
        if (sendersMessage.message !== "") {
          setSendersMessage({ message: event.currentTarget.value });
          displayMesssage(sendersMessage.message, false);
          sendToAI(sendersMessage.message)
        }

        setSendersMessage({ message: "" });
        setTextareaHeight('40px'); 
    }
  }
  useEffect(() => {
    // Scroll to bottom after adding a new child element
    if (parentRef.current) {
      const parentElement = parentRef.current;
      parentElement.scrollTop = parentElement.scrollHeight;
    }
  }, [childElements]);

  function buttonClicked(){
    if(sendersMessage.message !== ""){
        sendToAI(sendersMessage.message)
        console.log(sendersMessage)
        displayMesssage(sendersMessage.message, false);
        setSendersMessage({ message: "" });
        setTextareaHeight('40px'); 
    }
  }
  
  function sendToAI(message: string){
    const messageText: messageText = {
        message: message,
      };
      axios.post(`${apiUrl}/send`, messageText, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response: AxiosResponse<messageText, MyResponseHeaders>) => {
    // Check if the response contains data and message
    if (response.data && response.data.message) {
      const messageFromAi:string = response.data.message;
      displayMesssage(messageFromAi, true);
    } else {
      console.error('Invalid response format:', response.data);
    }
  })
  .catch((error : messageText) => {
    console.error('Error sending POST request:', error.message);
  });
  }

  function displayMesssage(message: string, sender: boolean){
    const newDiv = <Row key={childElements.length} className={ sender ? 'justify-content-start': 'justify-content-end'}>
    <Col md="9" className="position-relative">
        <i className={sender ? 'bi bi-caret-left-fill text-primary AI_chatLeftIndication_Icon' : 'bi bi-caret-right-fill text-primary AI_chatRightIndication_Icon'}></i>
        <p className={sender ? "m-2 rounded border border-primary p-3 bg-secondary text-light m-font float-start" : "m-2 rounded border border-primary p-3 bg-secondary text-light m-font float-end"}>{message}</p>
    </Col>
</Row>;

    // Update the state to include the new child element
    setChildElements(prevChildElements => [...prevChildElements, newDiv]);

  }
    return(
        <>
            <Container>
                <Row className="justify-content-center">
                    <Col lg="8" className="bg-secondary p-0 vh-100 position-relative overflow-hidden">
                        <div id="chatmessages" className="h-100 p-2 border border-light  border-opacity-50 rounded-bottom-0 m-3 rounded  overflow-scroll overflow-x-hidden"  ref={parentRef}>
                            <Row className="justify-content-start">
                                <Col md="9" className="position-relative">
                                    <i className="bi bi-caret-left-fill text-primary AI_chatLeftIndication_Icon"></i>
                                    <p className="m-2 rounded border border-primary p-3 bg-secondary text-light m-font">Hello There, Welcome to LloydAi. I am here to help with what ever you would like to know about Lloyds professional career...</p>
                                </Col>
                            </Row>
                            {childElements.map((childElement) => childElement)}
                        </div>
                        <div className="position-absolute bottom-0 w-100 bg-secondary bg-opacity-75">
                            <div className="p-3 border-top border-light border-opacity-50">
                              <div className='d-flex p-2 bg-white rounded'>
                                <textarea  className='text_input flex-fill border-0' placeholder='Type your message here...' rows={1} name="message" value={sendersMessage.message} style={{ height: textareaHeight }} onChange={handleInputChange} onKeyDown={handleKeyPress}></textarea>
                                <div className='d-flex align-items-end'>
                                  <Button variant="primary" onClick={buttonClicked}><i className="bi bi-send"></i></Button>
                                </div>
                              </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Chatbot