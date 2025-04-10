import Image from 'next/image';
import Link from 'next/link';
export default function VerificationSent() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent lg:flex-row">
      {/* Left side - Verification Sent */}
      <div className="relative w-full bg-transparent lg:w-1/2">
        {/* Fixed header with logo */}
        <div className="fixed top-0 right-0 left-0 z-20 flex h-24 items-center bg-transparent md:h-32 lg:absolute lg:right-auto lg:left-auto">
          <div className="ml-6 sm:ml-8 md:ml-16 lg:ml-[160px] xl:ml-[180px]">
            <Link href="/auth/signin">
              <h1 className="font-modak text-3xl text-[#e36b37] md:text-4xl">
                Reeka
              </h1>
            </Link>
          </div>
        </div>

        {/* Content with scrollable container and top padding for logo */}
        <div className="min-h-screen w-full overflow-y-auto bg-transparent px-6 pt-24 pb-12 sm:px-8 md:px-16 md:pt-32 lg:px-0">
          <div className="mx-auto w-full max-w-[360px] bg-transparent pt-6 lg:mx-0 lg:ml-[160px] lg:pt-12 xl:ml-[180px]">
            {/* Email icon */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                  fill="#219653"
                />
              </svg>
            </div>

            <h2 className="mb-2 text-[28px] font-semibold lg:text-[32px]">
              Check Your Email
            </h2>
            <p className="mb-6 text-sm text-[#808080]">
              We've sent a verification link to your email address. Please check
              your inbox and follow the instructions to verify your account.
            </p>

            <div className="space-y-5">
              <Link href="/auth/signin">
                <button className="hover:bg-opacity-90 w-full cursor-pointer rounded-md bg-[#e36b37] py-3 text-white transition-all">
                  Back to Sign In
                </button>
              </Link>

              <p className="pt-2 text-center text-sm text-[#475467]">
                Didn't receive the email?{' '}
                <Link href="/auth/signin" className="text-[#e36b37]">
                  Resend Verification
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Dashboard image */}
      <div className="relative hidden h-full min-h-screen overflow-hidden bg-transparent lg:block lg:w-1/2">
        <Image
          src="/dashboard-bg.png"
          alt="Reeka Dashboard Preview"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
