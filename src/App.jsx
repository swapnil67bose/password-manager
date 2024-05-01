import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Manager from './components/Manager'


function App() {
  

  return (
    <>
      <Navbar />
      <div className='min-h-[80vh]'>
      <Manager/>
      </div>
      
    </>
  )
}

export default App
