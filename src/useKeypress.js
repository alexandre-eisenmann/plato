import { useEffect, useState } from 'react';

const useKeypress = targetKey => {
    const [keyPressed, setKeyPressed] = useState({});
  
    const downHandler = ({ shiftKey, code }) => {
        setKeyPressed({shiftKey, code});
     };
   
     const upHandler = ({ code }) => {
       
       setKeyPressed({});
     };
   
   
    useEffect(() => {
      window.addEventListener('keydown', downHandler);
      window.addEventListener('keyup', upHandler);
  
      return () => {
        window.removeEventListener('keydown', downHandler);
        window.removeEventListener('keyup', upHandler);
      };
    }, []);
  
    return keyPressed;
  };

export default useKeypress



// export default function useKeypress(key, action) {
//   useEffect(() => {
//     function onKeyup(e) {
//       console.log("!!!!", e.code)
//       if (e.code === key) action()
//     }
//     window.addEventListener('keyup', onKeyup);
//     return () => window.removeEventListener('keyup', onKeyup);
//   }, []);
// }
