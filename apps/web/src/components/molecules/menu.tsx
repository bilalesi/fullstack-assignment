"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
    { label: "Home", url: "/" },
    { label: "Report", url: "/report" },
    { label: "Purchase", url: "/purchase" }
]

export default function Menu() {
    const pathname = usePathname();
    return (
        <nav className="flex items-start gap-2">
            {menu.map(({ url, label }) => (
                <Link
                    key={url}
                    href={url}
                    className={`px-3 py-2 hover:bg-gray-100 ${pathname === url ? 'border-b-2 border-red-500 text-red-500': 'bg-white text-gray-900'}`}
                >
                    {label}
                </Link>
            ))}
        </nav>
    )
}