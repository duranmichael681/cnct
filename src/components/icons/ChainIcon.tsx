import { type SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={37}
    height={37}
    viewBox="0 0 40 40"
    fill="none"
    {...props}
  >
    <path
      stroke="#b6862c"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3.5}
      d="M14.99 19.973a8.334 8.334 0 0 0 12.566.9l5-5A8.333 8.333 0 0 0 20.773 4.089l-2.867 2.85m3.75 9.7a8.332 8.332 0 0 0-12.567-.9l-5 5a8.333 8.333 0 0 0 11.784 11.784l2.85-2.85"
    />
  </svg>
)
export default SvgComponent
