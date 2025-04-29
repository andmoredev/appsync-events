import { useEffect, useState, useRef } from 'react'
import './App.css'

import { Amplify } from 'aws-amplify'
import { events } from 'aws-amplify/data'
import config from './amplify_outputs.json'

Amplify.configure(config)

export default function App() {
  const [messages, setMessages] = useState([])
  const [room, setRoom] = useState('')
  const [message, setMessage] = useState('')

  const counterRef = useRef(null)

  useEffect(() => {
    if (!room || !room.length) {
      return
    }
    let timeoutID
    const pr = events.connect(`/EventApiChannelNamespace/${room}`)
    pr.then((channel) => {
      channel.subscribe({
        next: (data) => {
          setMessages((messages) => [...messages, data.event.message])
          if (timeoutID) {
            clearTimeout(timeoutID);
          }
          counterRef.current?.classList.add('animate-bounce')
          timeoutID = setTimeout(() => {
            counterRef.current?.classList.remove('animate-bounce')
          }, 3000);
        },
        error: (value) => console.error(value),
      })
    })

    return () => {
      pr?.then((channel) => channel?.close())
    }
  }, [room])

  return (
    <div className='max-w-screen-md mx-auto'>
      <h2 className='my-4 p-4 font-semibold text-xl'>AppSync Events - Messages</h2>
      <button
        type="button"
        className='border rounded-md px-4 py-2 items-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-sky-200  shadow hover:bg-sky-200/90'
        onClick={() => {
          const room = prompt('Room:')
          if (room && room.length) {
            setMessages([])
            setRoom(room.trim().replace(/\W+/g, '-'))
          }
        }}
      >
        set room
      </button>
      <div className='my-4 border-b-2  border-sky-500 py-1 flex justify-between'>
        <div>
          {room ? (
            <span>
              Currently in room: <b>{room}</b>
            </span>
          ) : (
            <span>Pick a room to get started</span>
          )}
        </div>
        <div className='flex items-center uppercase text-xs tracking-wider font-semibold'>
          <div className='mr-2'>Messages count:</div>
          <span ref={counterRef} className='transition-all inline-flex items-center rounded-md bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-900'>{messages.length}</span></div>
      </div>
      <section id="messages" className='space-y-2'>
        {messages.map((message, index) => (
          <div
            key={index}
            className='border-b py-1 flex justify-between px-2'
          ><div>
              {message}
            </div>
            <div> </div>
          </div>
        ))}
      </section>

      <section>
        <form
          disabled={!room}
          className='w-full flex justify-between mt-8'
          onSubmit={async (e) => {
            e.preventDefault()
            const event = { message }
            setMessage('')
            await events.post(`/EventApiChannelNamespace/${room}`, event)
          }}
        >
          <input
            type="text"
            name="message"
            placeholder="Message:"
            className='flex flex-1 rounded-md border border-input px-3 py-1 h-9 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-transparent'
            value={message}
            disabled={!room}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className='ml-4 border rounded-md px-4 flex items-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-sky-200  shadow hover:bg-sky-200/90'
            disabled={!room || !message || !message.length}>
            <svg xmlns="http://www.w3.org/2000/svg" className='size-4' width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></svg>
          </button>
        </form>
      </section>

    </div>
  )
}