import Image from 'next/image';
import Link from 'next/link';

export default function VerifyEmail() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent lg:flex-row">
      {/* Left side - Verify Email */}
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
            {/* Success icon */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                  fill="#219653"
                />
              </svg>
            </div>

            <h2 className="mb-2 text-[28px] font-semibold lg:text-[32px]">
              Email Verified
            </h2>
            <p className="mb-6 text-sm text-[#808080]">
              Your email has been successfully verified. You can now access all
              features of your account.
            </p>

            <div className="space-y-5">
              <Link href="/auth/signin">
                <button className="hover:bg-opacity-90 w-full cursor-pointer rounded-md bg-[#e36b37] py-3 text-white transition-all">
                  Sign In
                </button>
              </Link>
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
