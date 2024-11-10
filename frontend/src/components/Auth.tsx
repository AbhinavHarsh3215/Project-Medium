import { SignupInput } from "@abhinavharsh/medium-common";
import { Link, useNavigate } from "react-router-dom"
import {useState,ChangeEvent} from "react"
import axios from "axios";
import { BACKEND_URL } from "../congif"


export const Auth=({type}:{type:"signup" | "signin"})=>{
    const navigate=useNavigate();
    const [postInputs,setPostInputs]=useState<SignupInput>({
        email:"",
        password:"",
        name:" ",
    })

    async function sendRequest() {
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
                postInputs,
                { headers: { 'Content-Type': 'application/json' } }
            );
            const jwt = response.data.jwt;
            localStorage.setItem("token", jwt);
            navigate("/blogs");
        } catch (e) {
            console.error("Error during request:", e);
            if (e.response) {
                console.error("Backend Response:", e.response.data);
            }
            alert("Error while signing up/signing in");
        }
        
    }

    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="px-10 ">
                    <div className="text-3xl font-extrabold">
                    {type==="signin"?"Login to your account":"Create an account"}
                    </div>
                    <div className="text-slate-400">
                        {type==="signin"?"Don't have an account?":"Already have an account?"} <Link to={type==="signin"?"/signup":"/signin"} className="pl-2 underline text-slate-600">{type==="signin"?"Sign up":"Sign in"}</Link>
                    </div>
                </div>  
                <div className="pt-8">
                    {type==="signup"?<LabelledInput label="First Name" placeholder="John" onChange={(e)=>{setPostInputs(c=>({...c,name:e.target.value}))}}/>:null}
                    <LabelledInput label="email" placeholder="123@gmail.com" onChange={(e)=>{setPostInputs(c=>({...c,email:e.target.value}))}}/>
                    <LabelledInput label="password" placeholder="abcd1234" type={"password"} onChange={(e)=>{setPostInputs(c=>({...c,password:e.target.value}))}}/>
                    <button type="button" onClick={sendRequest} className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type==="signup"?"Sign up":"Sign in"}</button>   
                </div>
            </div> 
        </div>
    </div>
}

interface LabelledInputType{
    label:string;
    placeholder:string;
    onChange?:(e:ChangeEvent<HTMLInputElement>)=>void;
    type?:string;
}


function LabelledInput({label, placeholder,onChange,type}:LabelledInputType){
    return <div>
        <div>
            <label className="block mb-2 text-sm  text-black font-semibol pt-4">{label}</label>
            <input onChange={onChange || (() => {})} type={type||"text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
        </div>
    </div>
}