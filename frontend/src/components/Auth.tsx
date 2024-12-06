import { SignupInput } from "@sahilkhude/medium-common";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config";
import axios from "axios"

export const Auth = ({type} : {type: 'signup' | 'signin'}) => {
    const navigate = useNavigate();
    const [postInputs,setPostInputs] = useState<SignupInput>({
        email:"",
        name:"",
        password:""
    })

    async function sendRequest() {
        try {
            const responce = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, {
                postInputs
            });
            const jwt = responce.data;
            localStorage.setItem("token", "Bearer " + jwt);
            navigate("/blogs")
        } catch(e){
            alert("Wrong creds");
        }
    }

    return <div className="w-full px-20">
        <div className="flex flex-col items-center justify-center px-10 py-8 mx-auto md:h-screen lg:py-0">
            <div className="px-10 w-full">
                <div className="text-3xl font-extrabold text-left">
                    {type === "signup" ? "Create an account" : "Welcome back"}
                </div>
                <div className="text-slate-400">
                    {type ==="signin" ? "Dont have an account?" : "Already have an account?"} 
                    <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                        {type === "signin" ? "Sign Up" : "Sign In" }
                    </Link>
                </div>
                <div className="pt-10">
                    {type === "signup" ? <LabelInput label="name" type="text" placeholder="Natasha Ramanof" onChange={(e) => {
                        setPostInputs(c => ({
                            ...c,
                            name : e.target.value
                        }))
                    }}
                    /> : null}
                    <LabelInput label="email" type="text" placeholder="nats@gmail.com" onChange={(e) => {
                        setPostInputs(c => ({
                            ...c,
                            email : e.target.value
                        }))
                    }}
                    />
                    <LabelInput label="password" type="password" placeholder="random password" onChange={(e) => {
                        setPostInputs(c => ({
                            ...c,
                            password : e.target.value
                        }))
                    }}
                    />
                    <button onClick={sendRequest} type="button" className="w-full mt-10 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">{type === "signup" ?  "Sign Up" : "Sign In"}</button>
                </div>
            </div>
        </div>
    </div>
}

interface LabelInputType {
    label: string,
    placeholder: string,
    onChange: (e:ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}
function LabelInput({label, placeholder, onChange ,type}: LabelInputType){
    return <div>
        <label className="block mb-2 text-sm text-black font-semibold pt-2">{label}</label>
        <input type={type} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
        focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        placeholder={placeholder} onChange={onChange} required/>
    </div>
}