import { type SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={27}
    height={30}
    viewBox="0 0 27 30"
    fill="none"
    {...props}
  >
    <path
      stroke="#F3F3F3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M18.833 1.5v5.333M8.167 1.5v5.333M1.5 12.167h24m-21.333-8h18.666A2.667 2.667 0 0 1 25.5 6.833V25.5a2.667 2.667 0 0 1-2.667 2.667H4.167A2.667 2.667 0 0 1 1.5 25.5V6.833a2.667 2.667 0 0 1 2.667-2.666Z"
    />
  </svg>
)
export default SvgComponent
