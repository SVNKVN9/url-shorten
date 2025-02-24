'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
    const [url, setUrl] = useState<string>("")
    const [error, setError] = useState<string>()
    const [shortURL, setShortURL] = useState<string>("")
    const [theme, setTheme] = useState<string>("light");
    const [isWaitCreateUrl, setIsWaitCreateUrl] = useState<boolean>(false)

    useEffect(() => {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        setTheme(prefersDark ? "dark" : "light");
    }, []);

    const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

    const isUrlValid = (userInput: string) => {
        const res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return res != null
    }

    const onSubmit = async () => {
        if (!url) return setError("Please enter the URL")

        if (!isUrlValid(url)) return setError("The URL format not correct")

        setError("")
        setIsWaitCreateUrl(true)

        const result = await fetch('/api/url', {
            method: "POST",
            body: JSON.stringify({ url })
        })

        const json = await result.json()

        setShortURL(json.url)
        setIsWaitCreateUrl(false)
    }

    return (
        <div className={theme}>
            <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
                <div className="flex flex-col items-center gap-2">
                    <button
                        className="absolute top-5 right-5 bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded-lg"
                        onClick={toggleTheme}
                    >
                        Toggle {theme === "light" ? "Dark" : "Light"} Mode
                    </button>
                    <h3 className="font-medium text-3xl">Paste the URL</h3>
                    <div className="flex my-3 space-x-3">
                        <input
                            type="text"
                            placeholder="Enter the link here"
                            className="border border-stone-400 dark:border-stone-600 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg w-96"
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-700 duration-300"
                            onClick={onSubmit}
                        >
                            {
                                isWaitCreateUrl
                                    ? <div className="w-4 h-4 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                    : <span>Shorten URL</span>
                            }
                        </button>
                    </div>
                    {
                        shortURL && <div className="flex rounded-2xl px-4 py-2 space-x-2 bg-blue-500">
                            <p className="text-white">Click Here:</p>
                            <Link
                                href={shortURL}
                                target="_blank"
                                className="text-white text-center hover:underline hover:scale-105 duration-200"
                            >
                                {shortURL}
                            </Link>
                        </div>
                    }
                    {
                        error && <p className="w-1/2 text-red-600 underline text-center">
                            {error}
                        </p>
                    }
                    <p>ShortURL is a free tool to shorten URLs and generate short links</p>
                    <p>URL shortener allows to create a shortened link making it easy to share</p>
                </div>
            </div>
        </div>
    );
}
