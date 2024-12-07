import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setform] = useState({ site: '', username: '', password: '' });
    const [passwordArray, setpasswordArray] = useState([]);

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/");
        let passwords = await req.json();
        console.log(passwords)
        setpasswordArray(passwords)
    }


    useEffect(() => {
        getPasswords();
        // let passwords = localStorage.getItem('passwords');
        // if (passwords) {
        //     setpasswordArray(JSON.parse(passwords));
        // }
    }, []);

    const copyText = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Text copied to clipboard!', {
            position: 'top-right',
            autoClose: 2000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'dark',
        });
    };

    const showPassword = () => {
        passwordRef.current.type = 'text';
        if (ref.current.src.includes('icons/eyecross.png')) {
            ref.current.src = 'icons/eye.png';
            passwordRef.current.type = 'password';
        } else {
            ref.current.src = 'icons/eyecross.png';
            passwordRef.current.type = 'text';
        }
    };

    // const savePassword = async () => {
    //     if (form.site.length > 3 && form.username.length > 3 && form.site.length > 3) {
    //         const updatedPasswords = [...passwordArray, { ...form, id: uuidv4() }];
    //         setpasswordArray(updatedPasswords);

    //         // if any kind of entry exist with that id it need to deleted (in delete function)
    //         await fetch("http://localhost:3000/",{method:"DELETE",headers:{"content-type":"application/json"},body:JSON.stringify({id:form.id})})

    //         await fetch("http://localhost:3000/",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({...form,id:uuidv4()})})
    //         // localStorage.setItem("passwords", JSON.stringify([...passwordArray, {...form, id: uuidv4()}]))
    //         setform({ site: '', username: '', password: '' });
    //         toast.success('Password saved successfully!', {
    //             position: 'top-right',
    //             autoClose: 2000,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             theme: 'dark',
    //         });
    //     }
    //     else {
    //         toast.error('Min length shold be greater than 3', {
    //             tposition: 'top-right',
    //             autoClose: 2000,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             theme: 'dark',
    //         })
    //     }
    // };


    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            const id = form.id || uuidv4(); // Use existing id if editing or generate a new one
            const updatedEntry = { ...form, id };

            // Update passwordArray
            setpasswordArray((prev) => [...prev.filter(item => item.id !== form.id), updatedEntry]);

            // Save to backend
            await fetch("http://localhost:3000/", {
                method: "DELETE",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ id: form.id }),
            });

            await fetch("http://localhost:3000/", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(updatedEntry),
            });

            // Reset form
            setform({ site: '', username: '', password: '' });
            toast.success('Password saved successfully!', { position: 'top-right', autoClose: 2000 });
        } else {
            toast.error('Min length should be greater than 3', { position: 'top-right', autoClose: 2000 });
        }
    };




    const deletePassword = async (id) => {
        const confirmDelete = confirm('Do you really want to delete this password?');
        if (confirmDelete) {
            const updatedPasswords = passwordArray.filter((item) => item.id !== id);
            setpasswordArray(updatedPasswords);
            // localStorage.setItem('password', JSON.stringify(updatedPasswords));
            let res = await fetch("http://localhost:3000/", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) })
            toast.error('Password deleted successfully!', {
                position: 'top-right',
                autoClose: 2000,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'dark',
            });
        }
    };

    const editPassword = (id) => {
        console.log("Editing password with id ", id);

        // Set the form to the selected password details
        setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
        setpasswordArray(passwordArray.filter(item => item.id !== id))
    };


    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <>
            <ToastContainer />

            <div>
                <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
                </div>
            </div>

            <div className="md:mycontainer ">
                <h1 className="text-4xl text font-bold text-center">
                    <span className="text-green-700">&lt;</span>
                    PassOP
                    <span className="text-green-700">&gt;</span>
                </h1>
                <p className="text-green-900 text-center">Ur Own Password Manager</p>
                <div className="flex flex-col p-4 text-black gap-4 items-center">
                    <input
                        value={form.site}
                        onChange={handleChange}
                        placeholder="Enter Website Url"
                        className="rounded-full border border-green-600 w-full p-4 py-2"
                        type="text"
                        name="site"
                        id="site"
                    />
                    <div className="flex flex-col md:flex-row w-full justify-between gap-8">
                        <input
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter User Name"
                            className="rounded-full border border-green-600 w-full p-4 py-1"
                            type="text"
                            name="username"
                            id="username"
                        />

                        <div className="relative">
                            <input
                                ref={passwordRef}
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter Password"
                                className="rounded-full border border-green-600 w-full p-4 py-1"
                                type="password"
                                name="password"
                                id="password"
                            />
                            <span className="absolute right-[1px] top-[1px] cursor-pointer" onClick={showPassword}>
                                <img ref={ref} className="p-1" width={30} src="/icons/eye.png" alt="eye" />
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={savePassword}
                        className="flex justify-center items-center gap-4 bg-green-600 hover:bg-green-400 rounded-full px-4 py-2 w-fit border-2 border-green-950 "
                    >
                        <lord-icon src="https://cdn.lordicon.com/jgnvfzqg.json" trigger="hover"></lord-icon>
                        Add Password
                    </button>
                </div>

                <div className="passwords">
                    <h2 className="font-bold text-2xl py-4">Ur passwords</h2>
                    {passwordArray.length === 0 && <div>No passwords to show</div>}
                    {passwordArray.length !== 0 && (
                        <table className="table-auto w-full rounded-md overflow-hidden">
                            <thead className="bg-green-800 text-white">
                                <tr>
                                    <th className="py-2">Site</th>
                                    <th className="py-2">UserName</th>
                                    <th className="py-2">Password</th>
                                    <th className="py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-green-100">
                                {passwordArray.map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-2 border border-white text-center">
                                            <div className="flex items-center justify-center">
                                                <a href={item.site} target="_blank" rel="noopener noreferrer">
                                                    {item.site}
                                                </a>
                                                <div
                                                    className="lordiconcopy size-7 cursor-pointer"
                                                    onClick={() => {
                                                        copyText(item.site);
                                                    }}
                                                >
                                                    <lord-icon
                                                        style={{
                                                            width: '25px',
                                                            height: '25px',
                                                            paddingTop: '3px',
                                                            paddingLeft: '3px',
                                                        }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover"
                                                    ></lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2 border border-white text-center">
                                            <div className="flex items-center justify-center">
                                                <span>{item.username}</span>
                                                <div
                                                    className="lordiconcopy size-7 cursor-pointer"
                                                    onClick={() => {
                                                        copyText(item.username);
                                                    }}
                                                >
                                                    <lord-icon
                                                        style={{
                                                            width: '25px',
                                                            height: '25px',
                                                            paddingTop: '3px',
                                                            paddingLeft: '3px',
                                                        }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover"
                                                    ></lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2 border border-white text-center">
                                            <div className="flex items-center justify-center">
                                                <span>{"*".repeat(item.password.length)}</span>
                                                <div
                                                    className="lordiconcopy size-7 cursor-pointer"
                                                    onClick={() => {
                                                        copyText(item.password);
                                                    }}
                                                >
                                                    <lord-icon
                                                        style={{
                                                            width: '25px',
                                                            height: '25px',
                                                            paddingTop: '3px',
                                                            paddingLeft: '3px',
                                                        }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover"
                                                    ></lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="justify-center py-2 border border-white text-center">
                                            <span
                                                className="cursor-pointer mx-1"
                                                onClick={() => {
                                                    editPassword(item.id);
                                                }}
                                            >
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/gwlusjdu.json"
                                                    trigger="hover"
                                                ></lord-icon>
                                            </span>
                                            <span
                                                className="cursor-pointer mx-1"
                                                onClick={() => {
                                                    deletePassword(item.id);
                                                }}
                                            >
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/kfzfxczd.json"
                                                    trigger="hover"
                                                ></lord-icon>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default Manager;
