import axios from "axios"
import { Appbar } from "../components/Appbar"
import { BACKEND_URL } from "../config"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const Publish = () => {
    const [title,setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    return <div>
    <Appbar/>
    <div className="w-full mb-4 mt-10 border border-gray-200 rounded-lg bg-gray-50 ">
        <div className="px-4 py-2 bg-white rounded-b-lg ">
            <label className="sr-only">Title</label>
            <textarea onChange={(e) => {
                setTitle(e.target.value);
            }} id="editor" rows={1} className="block w-full px-0 text-lg focus:outline-none font-bold text-gray-800 bg-white border-0 " placeholder="Title" required ></textarea>
        </div>
        <div className="px-4 py-2 bg-white rounded-b-lg ">
            <label className="sr-only">Publish post</label>
            <textarea onChange={(e) => {
                setContent(e.target.value);
            }} id="editor" rows={8} className="block w-full focus:outline-none px-0 text-sm text-gray-800 bg-white border-0 " placeholder="Write an article..." required ></textarea>
        </div>
            </div>
            <button onClick={async () => {
                const responce = await axios.post(`${BACKEND_URL}/api/v1/blog`,{
                    title,
                    content
                },{
                    headers : {
                        Authorization: localStorage.getItem("token")
                    }
                });
                navigate(`/blog/${responce.data.id}`)
            }} type="button" className="mr-4 ml-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium text-sm px-10 py-2.5 text-center me-2 mb-2 ">
                    Publish
            </button>
    </div>
}