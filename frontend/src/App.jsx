import "./App.css";
import axios from "axios";
import NavBar from "./components/NavBar";
import Note from "./components/Note";
import LoginPage from "./components/LoginPage";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MdOutlineAdd } from "react-icons/md";
import { AiFillCloseCircle } from "react-icons/ai";
// import Cookies from "js-cookie";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [head, setHead] = useState('');
  const [body, setBody] = useState('');
  // const [isLogged, setIsLogged] = useState(true);
  const isLogged = true;

  function getNotes(tags) {
    const url = `http://localhost:3001/api/v1/notes?${tags
      .map((n, index) => `tags[${index}]=${n}`)
      .join("&")}`;
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((response) => {
        if (response && response.data && response.data.results) {
          setNotes(response.data.results);
        }
      })
      .catch((err) => {
        alert(`Error fetching notes: `, err);
      });
  }

  useEffect(() => {
    getNotes([]);
  }, []);

  const showInputModal = () => {
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={
            isLogged ? 
            <div className="App">
              <button className="topbutton">
                <MdOutlineAdd fontSize="32px" onClick={showInputModal}/>
              </button>
              <NavBar filter={getNotes}></NavBar>

              {/* notes div */}
              <div className="wrapper">
                {notes.map((item) => {
                  return (
                    <Note
                      style={{ margin: 0 }}
                      head={item.head}
                      body={item.body}
                      tags={item.tags}
                    ></Note>
                  );
                })}
              </div>

              {showModal ?
                <div className="popup" show={showModal}>
                  <div className="popup-content">
                    <div className="row navstyle">
                      <h2 style={{color: "#031218", margin: "10px"}}>
                        Create a new note
                      </h2>
                      <AiFillCloseCircle style={{color: "#031218", margin: "10px"}} onClick={closeModal}/>
                    </div>   
                    <div className="row">
                      <h4 style={{color: "#031218", margin: "10px"}}>Title</h4>
                      <input className="string-input" style={{margin: "10px"}} placeholder="Note title here" type="text" onChange={(e) => {
                        setHead(e.target.value)}}/>
                    </div>
                    <div className="row">
                      <h4 style={{color: "#031218", margin: "10px"}}>Description</h4>
                      <textarea className="string-input" style={{margin: "10px"}} placeholder="Note description here" type="text" value={body} onChange={(e) => setBody(e.target.value)}/>
                    </div>
                    <div className="row" style={{justifyContent: "end"}}>
                    <button style={{padding: "5px 20px", margin: "0 5px", border: "none", borderRadius: "10px", color: "white", background: "#031218"}} onClick={closeModal}>Discard</button>
                    <button style={{padding: "5px 20px", margin: "0 5px", border: "none", borderRadius: "10px", color: "black", background: "#00f3ed"}} onClick={() => console.log({head   })}>Save</button>
                    </div>
                  </div>
                </div>
                : null
              }

            </div> :
            <div>
              <h2 style={{minHeight: "10px", width: "100%", backgroundColor: "#c9301b", display: "block", margin: "0", textAlign: "center"}}>
                Please login
              </h2>
              <div style={{textAlign: "center", margin: "auto", minHeight: "66vh", height: "100%", backgroundColor: 'red'}}>
                sdbf
              </div>
            </div>
          } />
          <Route path="login" element={<LoginPage/>} />
          {/* <Route path="signup" element={<SignupPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}