import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

function trackProject() {
    const [currentProject, setCurrentProject] = useState([]);
    const [response, setResponse] = useState('');
    const [showProgress, setShowProgress] = useState(false);
    const [info, setInfo] = useState({ tasks: [], expenses: [] });

    const fetchProject = async () => {
        try {
            const res = await axios.get('http://localhost:8080/getProject');

            const data = res.data.currentProject;
            setCurrentProject(data.rows);
        }
        catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setResponse(err.response.data.message);

            }

        }

    }

    const handleCompleted = async (name) => {
        try {
            const res = await axios.put(`http://localhost:8080/toggleCompleted/${name}`
            );
            setCurrentProject(prev => prev.map(project => project.projecttitle == name ? { ...project, status: 'completed' } : project));
            await fetchProject();
        }
        catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setResponse(err.response.data.message);
            }
        }
    }

    const handleDelete = async (name) => {
        try {
            const res = await axios.delete(`http://localhost:8080/deleteProject/${name}`);
            const data = res.data;

            setCurrentProject(prev => prev.filter(project => project.projecttitle != name));
            await fetchProject();
        }
        catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setResponse(err.response.data.message);
            }
        }
    }

    const handleViewInfo = async (name) => {
        try {
            const res = await axios.get(`http://localhost:8080/viewInfo/${name}`);
            const data = res.data;
            setInfo(data);
        }
        catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setResponse(err.response.data.message);
            }
        }

    }


const handleSetProgress = (title)=>{
    const res = axios.post(`http://localhost:8080/handleSetProgress/${title}`,);
}


    useEffect(() => {
        fetchProject();
    }, []);
    return (
        <div>
            <div className='flex flex-col items-center justify-center my-10 shadow-lg'>
                <h1 className='font-extrabold text-3xl mb-5 text-shadow-lg text-yellow-500'>EffectiveBuild</h1>
            </div>
            <div className='flex flex-col items-center my-10'>
                <h2 className='font-bold text-4xl text-gray-500'> Your projects</h2>
            </div>
            <section className='flex flex-wrap items-center justify-center'>
                {currentProject.map((project, index) => (
                    <ul key={index} className='shadow-lg w-fit p-10 bg-gray-100 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 mx-5 my-5 rounded-xl'>

                        <li className='font-bold text-3xl text-amber-500 my-5 text-center'>Title: {project.projecttitle}</li>
                        <li className='font-bold text-3xl  text-gray-700 mb-2'>Start Date : {project.startdate}</li>
                        <li className='font-bold text-3xl text-gray-700 mb-2'>End Date : {project.enddate}</li>
                        <li className='font-bold text-3xl text-gray-700 mb-2'>Total Budget : ${project.totalbudget}</li>
                        <li className='font-bold text-3xl text-gray-700 mb-5'>Status : {project.status}</li>
                        <div className='flex flex-col justify-center'>
                            <button className='ring-2 text-yellow-500 rounded-sm font-semibold text-xl p-2 cursor-pointer mt-5 active:translate-1 mx-10' onClick={() => handleViewInfo(project.projecttitle)}>Set Progress</button>
                            <button className='ring-2 text-gray-400 rounded-sm font-semibold text-xl p-2 cursor-pointer my-5 active:translate-1 mx-10' onClick={() => handleViewInfo(project.projecttitle)}>View Info</button>
                            {project.status == 'pending' ? <button className='ring-2 ring-indigo-400 rounded-sm font-semibold text-xl p-2 text-indigo-500 cursor-pointer mb-5 active:translate-1 mx-10' onClick={() => handleCompleted(project.projecttitle)}> Completed</button> : ''}
                            <button className='ring-2 ring-red-500 text-red-400 rounded-sm font-semibold text-xl p-2 cursor-pointer active:translate-1 mx-10' onClick={() => handleDelete(project.projecttitle)}>Delete</button>
                        </div>

                    </ul>
                ))}
                <div className='flex flex-col items-center'>
                    {response && <p className='font-bold text-xl my-5 text-yellow-500'>{response.message}</p>}
                </div>
            </section>
            <hr className=' border-2 text-gray-300 shadow-xl' />


               <section className='flex flex-col items-center justify-center my-10'>

    {info && info.tasks.length > 0 ? (
        info.tasks.map((value, index) => (
            <ul className='shadow-xl shadow-amber-500 p-10 bg-yellow-100 flex flex-col items-center mb-10 transition delay-150 duration-300 ease-in-out hover:scale-105' key={index}>
                <h2 className='text-amber-500 text-4xl font-bold mb-10 shadow-xl p-10'>Information about current project tasks</h2>
                <li className='font-bold text-3xl my-2'>📍Task Name : {value.taskname}</li>
                <li className='font-bold text-3xl my-2'>📍Task Start Date : {value.taskstartdate}</li>
                <li className='font-bold text-3xl my-2'>📍Task End Date : {value.taskenddate}</li>
                <li className='font-bold text-3xl my-2'>📍Task Assigned To : {value.taskassignedto}</li>
                <li className='font-bold text-3xl my-2'>📍Task Budget : ${value.taskbudget}</li>
                <li className='font-bold text-3xl my-2'>📍Task Status : {value.status}</li>
                <div className='flex flex-row justify-center'>
                    <button className='ring-2 p-5 mx-5 my-5 font-bold text-xl rounded-sm text-amber-500 bg-gray-500 cursor-pointer mb-5 active:translate-1 ' onClick={
                        setShowProgress(true)
                    }>Set Progress</button>
                    <button className='ring-2 p-5 mx-5 my-5 font-bold text-xl rounded-sm text-amber-500 bg-gray-500 cursor-pointer mb-5 active:translate-1 '>Completed</button>
                </div>
            </ul>
        ))
    ) : (
        <p className="text-gray-500 text-xl font-bold">{response}</p>
    )}

    {info && info.expenses.length > 0 ? (
        info.expenses.map((value, index) => (
            <ul className='shadow-xl shadow-amber-500 p-10 bg-yellow-100 flex flex-col items-center transition delay-150 duration-300 ease-in-out hover:scale-105 ' key={index}>
                <h2 className='text-amber-500 text-4xl font-bold mb-10 shadow-xl p-10'>Information about current project expenses</h2>
                <li className='font-bold text-3xl my-2'>💸Expense Name : {value.expensename}</li>
                <li className='font-bold text-3xl my-2'>💸Expense Category : {value.category}</li>
                <li className='font-bold text-3xl my-2'>💸Expense Date: {value.expensedate}</li>
                <li className='font-bold text-3xl my-2'>💸Expense Amount : ${value.expenseamount}</li>
            </ul>
        ))
    ) : (
        <p className="text-gray-500 text-xl font-bold">{response}</p>
    )}

            </section>
        </div>

    )
}

export default trackProject
