'use client';
import React from 'react';
import { Button } from 'primereact/button';
import { twMerge } from 'tailwind-merge';

function PrimaryButton({
  onClick,
  label,
  className,
}: {
  onClick: () => void;
  label: string;
  className: string;
}) {
  return (
    <Button
      onClick={onClick}
      className={`${twMerge(
        'border-[1px] border-black px-3 py-1 rounded-lg font-bold bg-black',
        `${className}`
      )}`}
      label={label}
    />
  );
}

export default PrimaryButton;
