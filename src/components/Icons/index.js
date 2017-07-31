import React from 'react'

export const ArrowDown = ({ size, fill, style, ...props }) =>
  <svg
    {...props}
    fill={fill}
    {...style}
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>

export const ArrowUp = ({ size, fill, style, ...props }) =>
  <svg
    {...props}
    fill={fill}
    {...style}
    width={size}
    height={size}
    viewBox="0 0 24 24"
  >
    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
