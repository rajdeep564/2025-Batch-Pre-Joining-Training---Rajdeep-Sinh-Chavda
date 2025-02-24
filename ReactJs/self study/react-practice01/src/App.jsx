import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Button from './components/Button/Button.jsx';
import ShoppingList from './components/ShoppingList/ShoppingList.jsx';
import { useState } from 'react';


function MyButton() {

  const [count,setCount] = useState(0);

  function handleClick(){

    setCount(count + 1);

   
  }

  return (
    <button onClick={handleClick} style={{color:"red"}}>
clicked {count} times
    
    </button>
    
  )}

export default function App() {
return (
  <>
  <MyButton/>
  </>
)
}
