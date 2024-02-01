'use client' 
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="bg-gray-100 px-2 text-center">
     <div className="h-screen flex flex-col justify-center items-center">
        <h1 className="text-8xl font-extrabold text-red-500">Ooops!!</h1>
        <p className="text-4xl font-medium text-gray-800">An unknown error occured</p>
        <p className="text-xl text-gray-800 mt-4">We apologize for the inconvenience. Please try again.</p>

        <div className="mt-5">
      <button className="bg-yellow-300 py-3 w-[200] p-3 font-bold"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button></div>
    </div>
   
      
    </div>
  )
}