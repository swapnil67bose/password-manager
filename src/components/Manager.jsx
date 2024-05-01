import React, { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setForm] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setPasswordArray] = useState([]);
    const getPasswords = async () => {
        let req = await fetch("hhtp://localhost:3000/")
        let Passwords = await req.json()
        console.log(Passwords)
    
            setPasswordArray(Passwords)
        
    }

    useEffect(() => {
        getPasswords()
      
        
    }, []);

    const copyText = (text) => {
        toast('Copy to clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",

        });
        navigator.clipboard.whiteText(text)
    }

    const showPassword = () => {
        passwordRef.current.type = "text"
        console.log(ref.current.src)
        if (ref.current.src.includes("icons/cross.png")) {
            ref.current.src = "icons/eye.png";
            passwordRef.current.type = "password"
        } else {
            ref.current.src = "icons/cross.png";
            passwordRef.current.type = "text"
        }
    };
    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3){
            setPasswordArray([...passwordArray,{...form, id:uuidv4() }])
            await fetch("http://localhost:3000/", {method: "DELETE", header: {"Content_Type":"application/json"},body:JSON.stringify({id:form,id}) })
            await fetch("http://localhost:3000/", {method: "POST", header: {"Content_Type":"application/json"},body:JSON.stringify({...form,id: uuidv4()}) })
            const newPassword = { ...form, id: uuidv4() };
            const updatedPasswordArray = [...passwordArray, newPassword];
            setPasswordArray(updatedPasswordArray);
            localStorage.setItem("passwords", JSON.stringify(updatedPasswordArray));
            setForm({ site: "", username: "", password: "" });
            toast('Password saved!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        }else{
            toast('Error: password not saved.');
        }
    };
    

    
    const deletePassword = async (id) => {
        console.log("Deleting password with id" + id)
        let c = confirm("Do you really want to delete password?")
        if (c){
            setPasswordArray(passwordArray.filter(item=>item.id!==id))
            let res = await fetch("http://localhost:3000/", {method: "DELETE", header: {"Content_Type":"application/json"},body:JSON.stringify({...form,id}) })
        localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item=>item.id!==id)))
        toast('Password Deleted!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",

        });

        }
        
    };
    const editPassword = (id) => {
        toast('Password Edited!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",

        });
        console.log("Editing password with id" + id)
        setForm({...passwordArray.filter(i=>i.id == id)[0], id: id})
        setPasswordArray(passwordArray.filter(item=>item.id!==id))
 
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition="Bounce"
            />
            {/* Same as */}
            <ToastContainer />

            <div className="absolute inset-0 -z-10 h-full w-full bg-green-75 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px), linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
            </div>

            <div className="p-2 md:p-0 mycontainer flex-col justify-center items-center">
                <h1 className='text-4xl font-bold text-center'>
                    <span className='text-green-700'>&lt;</span>
                    <span>pass</span>
                    <span className='text-green-600'>store&gt;</span>
                </h1>
                <p className='text-green-700 text-lg text-center'>Your own Password Manager</p>

                <div className='justify-center flex flex-col p-4 text-black gap-8'>
                    <input
                        value={form.site}
                        onChange={handleChange}
                        placeholder='Enter website URL'
                        className='justify-center rounded-full border border-green-500 w-full p-4 py-2'
                        type="text"
                        name="site"
                        id="site"
                    />
                    <div className='flex flex-col md:flex-row w-full justify-between gap-8'>
                        <input
                            value={form.username}
                            onChange={handleChange}
                            placeholder='Enter Username'
                            className='rounded-full border border-green-500 w-full p-4 py-1'
                            type="text"
                            name="username"
                            id="username"
                        />
                        <div className="relative">
                            <input ref={passwordRef}
                                value={form.password}
                                onChange={handleChange}
                                placeholder='Enter Password'
                                className='rounded-full border border-green-500 w-full p-4 py-1'
                                type="password"
                                name="password"
                                id = "password"
                            />
                            <span className='absolute right-[2px] top-[1px] cursor-pointer' onClick={showPassword}>
                                <img ref={ref} className='p-1' width={26} src="icons/eye.png" alt="eye" />
                            </span>
                        </div>
                    </div>
                    <div className='w-full flex justify-center'>
                        <button onClick={savePassword} className='bg-green-400 rounded-full hover:bg-green-300 px-7 py-1 flex items-center border-2 border-green-900'>
                            Save Password
                        </button>
                    </div>
                    <div className='passwords'>
                        <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
                        {passwordArray.length === 0 && <div>No password to show</div>}
                        {passwordArray.length !== 0 &&
                            <table className="table-auto w-full rounded-md overflow-hidden" mb-10>
                                <thead className='bg-green-800 text-white'>
                                    <tr>
                                        <th className='py-2'>Site</th>
                                        <th className='py-2'>Username</th>
                                        <th className='py-2'>Password</th>
                                        <th className='py-2'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-green-100'>
                                    {passwordArray.map((item, index) => (
                                        <tr key={index}>
                                            <td className='justify-center py-2 border border-white text-center  py-2'>
                                                <div className='justify-center flex item-center'>
                                                    <a href={item.site} target='_blank' rel='noopener noreferrer'></a>
                                                    {item.site}
                                                    <div className='lordiconcopy size-7 cursor-pointer' onClick={() => copyText(item.site)}>
                                                        <lord-icon
                                                            style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                            src="https://cdn.lordicon.com/iykgtsbt.json"
                                                            trigger="hover" >
                                                        </lord-icon>
                                                    </div>
                                                </div>


                                            </td>
                                            <td className='py-2 border border-white text-center py-2'>
                                                <div className='flex item-center justify-center'>
                                                    <span>{item.username}</span>
                                                    <div className='lordiconcopy size-7 cursor-pointer' onClick={() => copyText(item.username)}>
                                                        <lord-icon
                                                            style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                            src="https://cdn.lordicon.com/iykgtsbt.json"
                                                            trigger="hover" >
                                                        </lord-icon>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='py-2 border border-white text-center py-2'>
                                                <div className='flex item-center justify-center'>
                                                    <span>{"*".repeat(item.password.length)}</span>
                                                    <div className='lordiocncopy size-7 cursor-pointer' onClick={() => {copyText(item.password)}}>
                                                        <lord-icon
                                                            style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                            src="https://cdn.lordicon.com/iykgtsbt.json"
                                                            trigger="hover" >
                                                        </lord-icon>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className=' justify-center py-2 border border-white text-center py-2'>
                                                <span className='cusror-pointer mx-1' onClick={()=>editPassword(item.id)}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/gwlusjdu.json"
                                                        trigger="hover"
                                                        style={{ "width": "25px", "height": "25px" }}>
                                                    </lord-icon>
                                                </span>
                                                <span className='cusror-pointer mx-1' onClick={()=>deletePassword(item.id)}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/skkahier.json"
                                                        trigger="hover"
                                                        style={{ "width": "25px", "height": "25px" }}>
                                                    </lord-icon>
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            </div >
        </>
    );
};

export default Manager;