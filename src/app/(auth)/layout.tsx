interface AuthLayoutProps {
  children: React.ReactNode;
}
const FloatingDots = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-blue-300">
      <div className="absolute left-1/2 top-0 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(black,transparent)]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8678f9] to-[#8678f9] opacity-40 [mask-image:radial-gradient(farthest-side_at_top,black,transparent)]">
          <svg
            aria-hidden="true"
            className="absolute inset-x-0 inset-y-[-50%] h-[200%] w-full skew-y-[-18deg] fill-black/40 stroke-black/50 mix-blend-overlay"
          >
            <defs>
              <pattern
                id="dots"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
                patternTransform="translate(0 0)"
              >
                <circle r="2" cx="16" cy="16" fill="currentColor" />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              strokeWidth="0"
              fill="url(#dots)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex h-full flex-col bg-cover bg-top">
      <FloatingDots />
      <div className="z-[4] flex h-full w-full flex-col items-center justify-center">
        <div className="h-full w-full md:h-auto">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
