import React, { useState,useEffect } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { BsFillSendFill } from 'react-icons/bs';
import { SlCalender } from "react-icons/sl";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import WhatsaapNumber from '../../container/whatsaapNumber/WhatsaapNumber';
import MessageInput from '../../container/MessageInput/MessageInput';
import FileAttachment from '../../container/FileAttachment/FileAttachment';
import ReceivedMessages from '../../container/ReceivedMessages/ReceivedMessages';
import SendNowModal from "../../components/Modal/SendNowModal";
import Header from "../../components/layout/Header";
import { useSelector ,useDispatch} from 'react-redux';
import { storeMessage } from '../../redux/MessageSlice';
import { storeFiles } from '../../redux/FileAttachSlice';
import { storeWhatsappNumber } from '../../redux/whatsappSlice';
import MyLoader from '../Loding/MyLoader';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Dashboard = () => {
const dispatch=useDispatch()
  const navigate = useNavigate();
   const attachfiles = useSelector(state => state.fileAttach.FileAttach);
   console.log(attachfiles)
      const messages = useSelector(state => state.message.Message);
            const numbers = useSelector(state => state.whatsapp.whatsappNumber);
            console.log("numbers",numbers)
   const token = useSelector(state => state.auth.token);
   console.log("token",token)
  const [showCalendar, setShowCalendar] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(new Date());
  console.log("scheduledDate",scheduledDate)
  const [showSendModal, setShowSendModal] = useState(false);
  const [sentMessages, setSentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); 
  }, []);
const preparePayload = () => {

  const to = numbers.map(n => {
  let num = n.number.toString().replace(/\D/g, ''); // remove non-digit characters

  // Remove leading '91' if already present, or '0' if it's a local number
  if (num.startsWith('91') && num.length === 12) {
    num = num.slice(2);
  } else if (num.startsWith('0') && num.length === 11) {
    num = num.slice(1);
  }

  return `91${num}`;
});

console.log(to);

  const message = messages.map(m => m.text);

const photo = attachfiles
  .filter(f => f.type === "Photos")
  .map(f => f.url.split('/').pop());  // sirf filename nikalta hai

console.log(photo); 

  const videoFile = attachfiles.find(f => f.type === "Videos");
  const pdfFile = attachfiles.find(f => f.type === "Pdf");
  const docxFile = attachfiles.find(f => f.type === "Docx");

  // ✅ Input validation
  if (to.length === 0 && message.length === 0 ) {
    toast.error('Please add at least one number, message, or file before sending.');
    return null;
  }

  return {
    to,
    message,
    photo,
   video : videoFile ? videoFile.url.split('/').pop() : "",
    sendVideoAsSticker: true,
    pdf: pdfFile ? pdfFile.url.split('/').pop() : "",
    docx: docxFile ? docxFile.url.split('/').pop() : ""
  };
};


const handleSendNow = async () => {
  const payload = preparePayload();
  if (!payload) return; // ❗️ Exit early if payload is invalid

  setLoading(true);

  try {
    const res = await axios.post("http://51.20.128.98/whatsapp/send", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response:", res.data);

    const formattedMessages = numbers.map((n, idx) => ({
      id: n.number,
      type: "Contact",
      date: new Date().toISOString(),
      status: "Sent",
      message: messages[idx] ? messages[idx].text : ''
    }));

    setSentMessages(formattedMessages);
    dispatch(storeMessage([]));
    dispatch(storeFiles([]));
    dispatch(storeWhatsappNumber([]));
    setShowSendModal(true);

  } catch (error) {
    console.error("Error sending messages:", error);
    toast.error(error?.response?.data?.message || 'Failed to send messages.');
  } finally {
    setLoading(false);
  }
};
const sentmessge=()=>{
  navigate('/sent')
}
const handleScheduleSend = async () => {
  const payload = preparePayload();
  if (!payload) return;

  payload.scheduledTime = new Date(scheduledDate).toISOString();

  setLoading(true);

  try {
    const res = await axios.post("http://51.20.128.98/whatsapp/sendsc", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Scheduled Response:", res.data);

    dispatch(storeMessage([]));
    dispatch(storeFiles([]));
    dispatch(storeWhatsappNumber([]));
    setShowCalendar(false);

  } catch (error) {
    console.error("Error scheduling message:", error);
    toast.error(error?.response?.data?.message || 'Failed to schedule message.');
  } finally {
    setLoading(false);
  }
};


  return (
    <>
    {loading ? <MyLoader/>: <>
  <Header />
      <Container fluid className="bg-light" style={{ height: '92vh' }}>
        <Row className="h-100">
          <Col md={4} className="text-white p-3 bg-white">
            <ReceivedMessages />
          </Col>

          <Col md={4} className="text-white p-3 bg-white">
            <WhatsaapNumber />
          </Col>

          <Col md={4} className="bg-white d-flex flex-column">
            <div className="p-3">
              <MessageInput />
              <FileAttachment />
            </div>

            <div
              className="d-flex justify-content-between align-items-center px-4 py-2 text-white bg-success"
              style={{
                position: 'fixed',
                bottom: 0,
                width: '30vw',
                fontWeight: '500',
                boxShadow: '0 -2px 6px rgba(0, 0, 0, 0.15)',
              }}
            >
              <button
                onClick={() => setShowCalendar(true)}
                className="btn border-0 d-flex align-items-center gap-2 px-2 py-1 rounded-pill"
                style={{
                  backgroundColor: '#25D366',
                  color: 'white',
                  fontWeight: '600',
                    fontSize:"12px",
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                <SlCalender size={20} />
                Schedule Send
              </button>

                 <button
                onClick={() => sentmessge()}
                className="btn border-0 d-flex align-items-center gap-2 px-2 py-1 rounded-pill"
                style={{
                  backgroundColor: '#25D366',
                  color: 'white',
                  fontWeight: '600',
                    fontSize:"12px",
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
              
                Sent Messages
              </button>

              <button
                onClick={handleSendNow}
                className="btn border-0 d-flex align-items-center gap-2 px-2 py-1 rounded-pill"
                style={{
                  backgroundColor: '#128C7E',
                  color: 'white',
                  fontWeight: '600',
                  fontSize:"12px",
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
               
              >
                <BsFillSendFill size={18} />
                Send Now
              </button>
            </div>
          </Col>
        </Row>

        {/* Send Now Modal */}
        {showSendModal && (
          <SendNowModal
            show={showSendModal}
            handleClose={() => setShowSendModal(false)}
            sentMessages={sentMessages}
          />
        )}
          <ToastContainer />

        {/* Schedule Modal */}
        <Modal show={showCalendar} onHide={() => setShowCalendar(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Select Schedule Date & Time</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DatePicker
              selected={scheduledDate}
              onChange={(date) => setScheduledDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="form-control"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCalendar(false)}>
              Cancel
            </Button>
          <Button
  variant="primary"
  onClick={handleScheduleSend} // 🔁 Call API here
>
  Confirm Schedule
</Button>

          </Modal.Footer>
        </Modal>
          
      </Container>
    </>}
    
    </>
  );
};

export default Dashboard;
