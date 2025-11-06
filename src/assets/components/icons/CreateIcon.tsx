import { type SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M7.5 10H1.25a1.21 1.21 0 0 1-.89-.36A1.21 1.21 0 0 1 0 8.75c0-.354.12-.651.36-.89.239-.24.536-.36.89-.36H7.5V1.25c0-.354.12-.651.36-.89.239-.24.536-.36.89-.36s.651.12.89.36c.24.239.36.536.36.89V7.5h6.25c.354 0 .651.12.89.36.24.239.36.536.36.89s-.12.651-.36.89c-.239.24-.536.36-.89.36H10v6.25c0 .354-.12.651-.36.89-.239.24-.536.36-.89.36a1.21 1.21 0 0 1-.89-.36 1.21 1.21 0 0 1-.36-.89V10Z"
    />
  </svg>
)
export default SvgComponent
