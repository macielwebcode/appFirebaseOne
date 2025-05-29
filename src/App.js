import { dbfirestore } from './firebaseConnection';
import { useState } from 'react';
import { doc, setDoc, collection, addDoc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import './app.css'

function App() {

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [post, setPost] = useState([]);
  const [idPost, setId] = useState([]);

  
  async function hanldeInsert(){

    await addDoc(collection(dbfirestore, "posts"), {
      title: title,
      author: author
    })
    .then(() =>{
      console.log("insert com suscesso")
      setAuthor('')
      setTitle('')
    })
    .catch((error) =>{
      console.log("deu erro", error)
    })


    //forma de cadastrar com id fixo
    // await setDoc(doc(dbfirestore, "posts", "004"), {
    //   title: title,
    //   author: author
    // })
    // .then(() =>{
    //   console.log("insert com suscesso")
    // })
    // .catch((error) =>{
    //   console.log("deu erro", error)
    // })
  }

  async function hanldeSearch(){

    //buscando vários posts
    const postRef = collection(dbfirestore, "posts")
    await getDocs(postRef)
          .then((snapshot) => {
              let lista = []

              snapshot.forEach((doc) => {
                lista.push({
                  id: doc.id,
                  title: doc.data().title,
                  author: doc.data().author
                })
              })

              setPost(lista)
          })
          .catch((error) => {
            console.log("error", error)
          })

    // const postRef = doc(dbfirestore, "posts", "003")

    // await getDoc(postRef)
    //   .then((snapshot) => {
    //     setAuthor(snapshot.data().author)
    //     setTitle(snapshot.data().title)
    //   })
    //   .catch(() => {
    //     console.log("error")
    //   })
  }

  async function hanldeUpdate() {
    const docRef = doc(dbfirestore, "posts", idPost)
    await updateDoc(docRef, {
      title: title,
      author: author
    })
    .then(() =>{
      console.log("update com sucesso")
      setId('')
      setTitle('')
      setAuthor('')
    })
    .catch((error) => {
      console.log("deu ruim", error)
    })
  }

  return (
    <div className="App">
      <div className='container'>
        <div className='formItem'>
          <label>ID do Post</label>
          <input 
            type="text"
            placeholder='digitar id'
            value={idPost}
            onChange={ (e) => setId(e.target.value) }
          />
        </div>

        <div className='formItem'>
          <label>Title</label>
          <textarea 
            type="text"
            placeholder='digitar title'
            value={title}
            onChange={ (e) => setTitle(e.target.value) }
          />
        </div>

        <div className='formItem'>
          <label>Author</label>
          <input 
            type="text"
            placeholder='digitar autor do post'
            value={author}
            onChange={ (e) => setAuthor(e.target.value) }
          />
        </div>

        <div className='formItem'>
          <button onClick={hanldeInsert}>Inserir</button>
        </div>

        <div className='formItem'>
          <button onClick={hanldeUpdate}>Atualizar</button>
        </div>

        <div className='formItem'>
          <button onClick={hanldeSearch}>Pesquisar</button>
        </div>



      </div>

      <div className='containerUl'>
        <ul>
          {post.map((item) => {
            return(
              <li key={item.id} className='itemPost'>
                <span>Id: {item.id}</span> || 
                <span>Title: {item.title}</span> || 
                <span>Author: {item.author}</span>
              </li>
            )
          })}
        </ul>
      </div>

    </div>

  )
}

export default App;
