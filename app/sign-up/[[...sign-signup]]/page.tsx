import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        redirectUrl="/new-user"
        afterSignUpUrl="/new-user"
      />
    </div>
  )
}
