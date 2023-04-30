import NoteContext from "./NoteContext";
import { useState } from "react";
const NoteState = (props) => {
  // const s1={
  //     "name":"Ishaan",
  //     "class": "5b"
  // }
  // const [state,setState]=useState(s1);
  // const update=()=>{
  //     setTimeout(()=>{
  //         setState({
  //             "name":"Larry",
  //             "class":"10b"
  //         })
  //     },1000)
  // }
  // return(
  //     <NoteContext.Provider value={{state,update}}>
  //         {props.children}
  //     </NoteContext.Provider>
  // )
  const host = "http://localhost:5000"
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial)
  const getNote = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
    });
    const json=await response.json();
    console.log(json);
    setNotes(json);
  }
  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag }) // body data type must match "Content-Type" header
    });
    const note =await response.json();
    setNotes(notes.concat(note))
  }
  const deleteNote =async (id) => {
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      }
    });
    const json =await response.json();
    console.log(json);
    console.log("Deleting the note with id " + id)
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes)
  }
  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag }) // body data type must match "Content-Type" header
    });
    const json =await response.json(); // parses JSON response into native JavaScript objects
    console.log(json);
    let newNotes=JSON.parse(JSON.stringify(notes))
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  }
  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote ,getNote}}>
      {props.children}
    </NoteContext.Provider>
  )
}
export default NoteState;