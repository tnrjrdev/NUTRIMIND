import { useNavigate } from "react-router-dom";
import type { MenuShortcut } from "../types/home.types";

type ShortcutItemProps = {
  item: MenuShortcut;
};

function getIcon(icon: string) {
  switch (icon) {
    case "book":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
          <path d="M6 5h12v14H6z" stroke="#3b4a76" strokeWidth="1.6" />
          <path d="M6 5h12v14" stroke="#3b4a76" strokeWidth="1.6" />
          <path d="M9 8h6" stroke="#3b4a76" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "basket":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
          <path d="M6 8h12l-1.5 10h-9L6 8z" stroke="#3b4a76" strokeWidth="1.6" />
          <path d="M9 8V5a3 3 0 016 0v3" stroke="#3b4a76" strokeWidth="1.6" />
        </svg>
      );
    case "cart":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
          <path d="M5 6h2l2 10h8l2-6H8" stroke="#3b4a76" strokeWidth="1.6" />
          <circle cx="9" cy="20" r="1.5" fill="#3b4a76" />
          <circle cx="17" cy="20" r="1.5" fill="#3b4a76" />
        </svg>
      );
    case "bike":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
          <circle cx="7" cy="17" r="3" stroke="#3b4a76" strokeWidth="1.6" />
          <circle cx="17" cy="17" r="3" stroke="#3b4a76" strokeWidth="1.6" />
          <path d="M7 17h4l3-7h2" stroke="#3b4a76" strokeWidth="1.6" />
        </svg>
      );
    case "cup":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
          <path d="M7 6h10v7a5 5 0 01-10 0V6z" stroke="#3b4a76" strokeWidth="1.6" />
          <path d="M17 8h2a2 2 0 010 4h-2" stroke="#3b4a76" strokeWidth="1.6" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
          <path d="M6 12l4 4 8-8" stroke="#3b4a76" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
          <path d="M12 21s-6-4.35-9-7.5C1.5 10.35 3.5 6 7.5 6c2 0 3.5 1.5 4.5 3.5C12.5 7.5 14 6 16 6 20 6 22.5 10.35 21 13.5 18 16.65 12 21 12 21z" stroke="#3b4a76" strokeWidth="1.6" fill="none" />
        </svg>
      );
    case "lamp":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
          <path d="M12 3a5 5 0 00-5 5c0 2.5 1.5 4 3 5v1h4v-1c1.5-1 3-2.5 3-5a5 5 0 00-5-5z" stroke="#3b4a76" strokeWidth="1.6" />
          <path d="M10 17h4" stroke="#3b4a76" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <span className="text-2xl" aria-hidden="true">★</span>
      );
  }
}

export function ShortcutItem({ item }: ShortcutItemProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      aria-label={item.label}
      onClick={() => item.path && navigate(item.path)}
      className="group flex flex-col items-center gap-2 text-center transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b59619]/70"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white border border-[#eaebed] shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition duration-200 group-hover:bg-[#fbf7ee]">
        {getIcon(item.icon)}
      </span>
      <span className="max-w-[100px] text-sm font-semibold leading-[1.25] text-[#313131]">
        {item.label}
      </span>
    </button>
  );
}