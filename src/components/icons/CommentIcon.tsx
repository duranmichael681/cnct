import { type SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <path
      fill="#FEF7FF"
      d="M5.833 17.5h17.5v-2.917h-17.5V17.5Zm0-4.375h17.5v-2.917h-17.5v2.917Zm0-4.375h17.5V5.833h-17.5V8.75Zm23.334 20.417-5.834-5.834H2.917a2.809 2.809 0 0 1-2.06-.856A2.809 2.809 0 0 1 0 20.417v-17.5c0-.802.286-1.489.857-2.06A2.809 2.809 0 0 1 2.917 0H26.25c.802 0 1.489.286 2.06.857s.857 1.258.857 2.06v26.25Zm-26.25-8.75h21.656l1.677 1.64V2.917H2.917v17.5Z"
    />
  </svg>
)
export default SvgComponent
