import { auth } from '@clerk/nextjs'
import Link from 'next/link'

export default async function Home() {
  const { userId } = await auth()
  let href = userId ? '/journal' : '/new-user'

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center text-white">
      <div className="w-full max-w-[800px] mx-auto">
        <h1 className="text-6xl mb-4">The best Journal app.</h1>
        <p className="text-2xl text-white/60 mb-4">
          This is the best app for tracking your progress through out your college days. All
          you have to do is write the information you memorized from the lectures and we will tell the right and wrong and where you can read more about each topic.
          Just don&apos;t cheat!!!
        </p>
        <div>
          <Link href={href}>
            <button className="bg-blue-600 px-4 py-2 rounded-lg text-xl">
              get started
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
