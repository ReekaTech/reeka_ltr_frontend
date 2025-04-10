import Link from 'next/link';

export default function Success() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-transparent px-4">
      <div className="max-w-md text-center">
        {/* Lightning icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M13 10V3L4 14H11V21L20 10H13Z" fill="#219653" />
          </svg>
        </div>

        {/* Congratulations text */}
        <h1 className="font-nunito mb-4 text-4xl font-bold text-[#219653]">
          Congratulations
        </h1>

        {/* Description */}
        <p className="mb-8 text-[#808080]">
          Your account has been created successfully, you are ready to start
          managing your properties
        </p>

        {/* Get Started button */}
        <Link href="/auth/signin">
          <button className="hover:bg-opacity-90 w-full cursor-pointer rounded-md bg-[#e36b37] py-3 text-white transition-all">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
