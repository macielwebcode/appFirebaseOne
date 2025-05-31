import { dbfirestore, auth } from './firebaseConnection';
import { useState, useEffect } from 'react';
import { 
  doc, 
  setDoc, 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

import{
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

import './app.css'

function App() {

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [post, setPost] = useState([]);
  const [idPost, setId] = useState([]);
  const [email, setEmail] = useState([]);
  const [pass, setPass] = useState([]);

  const [user, setUser] = useState(false)
  const [userDetail, setUserDetail] = useState({})


  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(dbfirestore, "posts"), (snapshot) => {
        let listaPostLoad = []

          snapshot.forEach((doc) => {
            listaPostLoad.push({
              id: doc.id,
              title: doc.data().title,
              author: doc.data().author
            })
          })

          setPost(listaPostLoad)
      })
    }

    loadPosts()
  }, [])

  useEffect(() => {
    async function checkLogin(){
      onAuthStateChanged(auth, (user) => {
        if(user){
          console.log('oq recebe no user', user)
          setUser(true)
          setUserDetail({
            uid: user.uid,
            email: user.email
          })
        }else{
          setUser(false)
          setUserDetail({})
        }
      })
    }
    checkLogin()
  }, [])
  
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

  async function deletePost(id){
   const  docRef = doc(dbfirestore, "posts", id)
    await deleteDoc(docRef)
      .then(() =>{
        console.log("deletado com sucesso")
      })
      .catch((error) =>{
        console.log("deu ruim", error)
      })
  }

  async function hanldeInsertUser(){
    await createUserWithEmailAndPassword(auth, email, pass)
      .then((value) => {
        console.log("sucesso new user")
        console.log(value)
        setEmail('')
        setPass('')
      })
      .catch((error) => {
        if(error.code === 'auth/weak-password'){
          alert('senha fraca')
        }else if(error.code === 'auth/email-already-in-use'){
          alert("email já existe")
        }
      })
  }

  async function hanldeLoginUser(){
    await signInWithEmailAndPassword(auth, email, pass)
      .then((value) => {
        console.log('user logado com success')
        console.log('details user logado', value.user)

        setUserDetail({
          uid: value.user.uid,
          email: value.user.email
        })
        setUser(true)



        setEmail('')
        setPass('')
      })
      .catch((error) => { 
        console.log('nao sucesso', error)
      })
  }


  async function handleLogout(){
    await signOut(auth)
    setUser(false)
    setUserDetail({})
  }

  return (
    <div className="App">

      { user && (
        <div className='container'>
          <div className='formItem'>
            <h1>Você está logaod(a)</h1>
          </div>
          <div className='formItem'>
            <span>Id: {userDetail.uid}</span>
            <span>Email: {userDetail.email}</span>
          </div>
          <div className='formItem'>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}

      <div className='container'>
        <div className='formItem'>
          <label>E-mail</label>
          <input 
            type="text"
            placeholder='digitar email'
            value={email}
            onChange={ (e) => setEmail(e.target.value) }
          />
        </div>

        <div className='formItem'>
          <label>Senha</label>
          <input 
            type="text"
            placeholder='digitar senha'
            value={pass}
            onChange={ (e) => setPass(e.target.value) }
          />
        </div>

        <div className='formItem'>
          <button onClick={hanldeInsertUser}>Inserir User</button>
        </div>

        <div className='formItem'>
          <button onClick={hanldeLoginUser}>Login User</button>
        </div>

      </div>

      <hr />

      <div className='container'>
        <h2>Posts Manager</h2>
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
                <button onClick={() => deletePost(post.id) }>Excluir</button>
              </li>
            )
          })}
        </ul>
      </div>

    </div>

  )
}

export default App;
