import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const PageNotFound = () => {
  const [counter, setCounter] = useState(4)
  const navigate = useNavigate()

  useEffect(() => {
    if (counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000)
    } else {
      navigate('/')
    }
  }, [counter])

  return (
    <div>
      <div
        className=' 
    flex
    items-center
    justify-center
    w-screen
    h-screen
    bg-gradient-to-r
    from-green-900
    to-green-500
  '
      >
        <div className='px-40 py-20 bg-white rounded-md shadow-xl'>
          <div className='flex flex-col items-center'>
            <h1 className='font-bold text-blue-600 text-9xl'>Juha Way</h1>
            <h1 className='font-bold text-blue-600 text-9xl'>404</h1>

            <h6 className='mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl'>
              <span className='text-red-500'>Oops!</span> Page not found
            </h6>

            <p className='mb-8 text-center text-gray-500 md:text-lg'>
              The page you’re looking for doesn’t exist.
            </p>

            <a
              href='#'
              className='px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100'
            >
              {' '}
              Going back to the Home is {counter} seconds...
            </a>
            <a
              href='#'
              className='px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100'
            >
              {' '}
             Juha W@y Terus Gemilang
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageNotFound
