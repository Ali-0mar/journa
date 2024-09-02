'use client'
import { updateEntry, deleteEntry } from '@/util/api'
import { useState } from 'react'
//@ts-ignore
import { useAutosave } from 'react-autosave'
import Spinner from './Spinner'
import { useRouter } from 'next/navigation'

const Editor = ({ entry }: any) => {
  const [text, setText] = useState(entry.content)
  const [currentEntry, setEntry] = useState(entry)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  console.log(entry)

  const handleDelete = async () => {
    await deleteEntry(entry.id)
    router.push('/journal')
  }
  useAutosave({
    data: text,
    onSave: async (_text: string) => {
      if (_text === entry.content) return
      setIsSaving(true)

      const { data } = await updateEntry(entry.id, { content: _text })

      setEntry(data)
      setIsSaving(false)
    },
  })
  console.log(currentEntry)
  return (
    <div className="w-full h-full grid grid-cols-3 gap-0 relative">
      <div className="absolute left-0 top-0 p-2">
        {isSaving ? (
          <Spinner />
        ) : (
          <div className="w-[16px] h-[16px] rounded-full bg-green-500"></div>
        )}
      </div>
      <div className="col-span-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-60 text-xl p-8"
        />
        <li className="py-4 px-4">
          <span className="text-xl font-semibold">Summary:</span>
          <p className="text-xl whitespace-pre-line">
            {currentEntry.analysis.summary}
          </p>
        </li>
        <li className="py-4 px-4">
          <span className="text-xl font-semibold">Incorrect Informations:</span>
          {currentEntry.analysis.incorrect_information
            .split(',')
            .map((info: string, index: number) => (
              <p
                key={`${info}-${index}`}
                className="text-xl whitespace-pre-line"
              >
                - {info}
              </p>
            ))}
        </li>
        <li className="py-4 px-4">
          <span className="text-xl font-semibold">Resources:</span>
          {currentEntry.analysis.resources
            .split(',')
            .map((res: string, index: number) => (
              <p
                key={`${res}-${index}`}
                className="text-xl whitespace-pre-line"
              >
                - {res}
              </p>
            ))}
        </li>
        <li className="py-4 px-4">
          <span className="text-xl font-semibold">Kewords:</span>
          {currentEntry.analysis.keywords
            .split(',')
            .map((keyword: string, index: number) => (
              <>
                <span className="text-xl mx-2" key={`${keyword}-${index}`}>
                  {keyword}
                </span>
                {index === currentEntry.analysis.keywords.split(',').length - 1 ? (
                  <span>.</span>
                ) : (
                  <span>|</span>
                )}
              </>
            ))}
        </li>
        <li className="py-4 px-4">
          <span className="text-xl font-semibold">Concepts:</span>
          {currentEntry.analysis.concepts
            .split(',')
            .map((concept: string, index: number) => (
              <>
                <span className="text-xl mx-2" key={`${concept}-${index}`}>
                  {concept}
                </span>
                {index === currentEntry.analysis.concepts.split(',').length - 1 ? (
                  <span>.</span>
                ) : (
                  <span>|</span>
                )}
              </>
            ))}
        </li>
      </div>
      <div className="border-l border-black/5">
        <div
          style={{ background: currentEntry.analysis.color }}
          className="h-[100px] bg-blue-600 text-white p-8"
        >
          <h2 className="text-2xl bg-white/25 text-black">Analysis</h2>
        </div>
        <div>
          <ul role="list" className="divide-y divide-gray-200">
            <li className="py-4 px-8 flex items-center justify-between">
              <div className="text-xl font-semibold w-1/3">Subject</div>
              <div className="text-xl">{currentEntry.analysis.subject}</div>
            </li>

            <li className="py-4 px-8 flex items-center justify-between">
              <div className="text-xl font-semibold">Understandement level</div>
              <div className="text-xl">{currentEntry.analysis.mood}</div>
            </li>

            <li className="py-4 px-8 flex items-center justify-between">
              <div className="text-xl font-semibold">Negative</div>
              <div className="text-xl">
                {currentEntry.analysis.negative ? 'True' : 'False'}
              </div>
            </li>
            <li className="py-4 px-8 flex items-center justify-between">
              <button
                onClick={handleDelete}
                type="button"
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Editor
