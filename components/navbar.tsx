import ThemeSwitch from "./ThemeSwitch";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import Link from "next/link";
// import { SiteDetails } from "../setup";

export default function Header() {
    let router = useRouter();
    return (
        <div className="dark:bg-gray-900 dark:border-gray-700 bg-white border-b-2 border-gray-200 w-full h-[4rem]">
            <div className="max-w-4xl mx-auto w-full p-3 flex justify-between">
                <Link href="/" locale={false}>
                    <a className="font-bold my-auto">
                        ReducedImage.
                        <span className="text-blue-600">com</span>
                    </a>
                </Link>

                {/* <a href="https://ko-fi.com/macedonga" className="ml-auto font-semibold rounded-lg dark:bg-gray-700 dark:text-white text-black bg-gray-300 py-2 px-4">
                    Dark
                </a> */}
                <div className="flex space-x-3">
                    <ThemeSwitch />

                </div>
            </div>{" "}
        </div>
    );
}
