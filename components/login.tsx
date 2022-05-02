import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { useAuthState, useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';

export default function MyModal() {
    const [email, setEmail] = useState('');
    const [errorForm, setError] = useState({ 'email': null, 'password': null });
    const [password, setPassword] = useState('');
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };
    // let [user, loading, error] = useAuthState(getAuth());
    let [createUserWithEmailAndPassword,
        user,
        loading,
        error,] = useCreateUserWithEmailAndPassword(getAuth());

    let [isOpen, setIsOpen] = useState(true)

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    return (
        <>
            <div className=" flex items-center justify-center ">
                <button
                    type="button"
                    onClick={openModal}
                    className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                    Open dialog
                </button>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeModal}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>


                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <Dialog.Title
                                    as="h3"
                                    className=" leading-6 text-gray-900 text-2xl font-bold"
                                >
                                    Login to your account                                </Dialog.Title>
                                <div>

                                    <div className="my-3">
                                        <label className="block text-md mb-2" htmlFor="email">Email</label>
                                        <span className='text-red-500'>{errorForm.email}</span>
                                        <input className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none" type="email" name="password" placeholder="email" value={email} pattern=".+@beststartupever\.com"
                                            onChange={(e) => setEmail(e.target.value)} />
                                    </div><div className="mt-5">
                                        <label className="block text-md mb-2" htmlFor="password">Password</label>
                                        <input className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none" type="password" name="password" placeholder="password" value={password}
                                            onChange={(e) => setPassword(e.target.value)} />
                                    </div>

                                    <div className="flex justify-end">

                                        <span className="text-sm text-blue-700 hover:underline cursor-pointer">Forgot password?</span>
                                    </div>
                                    <div>
                                        <button className="mt-4 mb-3 w-full bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition duration-100" onClick={() => {
                                            // validateEmail(email) ? createUserWithEmailAndPassword(email, password) : alert('Please enter a valid email address')
                                           
                                                createUserWithEmailAndPassword(email, password).then((e) => {
                                                    console.log(e)
                                                }).catch(error => {
                                                    console.log(error)
                                                }).then(() => {
                                                    console.log(error)
                                                    if (error.code === 'auth/invalid-email') {
                                                        setError({ ...errorForm, email: 'Please enter a valid email address' })
                                                    } else if (error.code === 'auth/email-already-in-use') {
                                                        setError({
                                                            ...errorForm, email: 'E-Mail has already been used for another user.'
                                                        })
                                                    }


                                                    setTimeout(() => {
                                                        setError({ ...errorForm, email: null })
                                                    }, 5000);
                                                });
                                            

                                        }}>Login now</button>
                                        <div className="flex  space-x-2 justify-center items-end bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md transition duration-100" >
                                            <img className=" h-5 cursor-pointer" src="https://i.imgur.com/arC60SB.png" alt="" />
                                            <button>Or sign-in with google</button>
                                        </div> <p className="mt-8"> Dont have an account? <span className="cursor-pointer text-sm text-blue-600"> Join free today</span></p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        onClick={closeModal}
                                    >
                                        Got it, thanks!
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition >
        </>
    )
}
