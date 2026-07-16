import {useEffect} from 'react'

export default function useKeyPress(targetCode, onPress) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.code === targetCode) onPress(event)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onPress, targetCode])
}
