import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();


    const [projectTitle, setProjectTitle] = useState('');
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [totalBudget, setTotalBudget] = useState('');
    const [taskName, setTaskName] = useState('');
    const [taskStartDate, setTaskStartDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [taskAssignedTo, setTaskAssignedTo] = useState('');
    const [taskEndDate, setTaskEndDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [taskBudget, setTaskBudget] = useState('');
    const [expenseName, setExpenseName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseProject, setExpenseProject] = useState('');
    const [expenseDate, SetExpenseDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [category, setCategory] = useState('');
    const [response, setResponse] = useState('');
    const [taskProjectFor, setTaskProjectFor] = useState('');



    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/projectInfo', {
                projectTitle,
                startDate,
                endDate,
                totalBudget

            });

            const data = res.data;
            setResponse(data);
            setProjectTitle('');
            setStartDate('');
            setEndDate('');
            setTotalBudget('');
        }
        catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setResponse(err.response.data.message);

            }

        }
    }

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/tasks', {
                taskName,
                taskAssignedTo,
                taskBudget,
                taskStartDate,
                taskEndDate,
                projectTitle : taskProjectFor
            });

            const data = res.data;
            setResponse(data);
            setTaskName('');
            setTaskAssignedTo('');
            setTaskBudget('');
            setTaskStartDate('');
            setTaskEndDate('');
            setTaskProjectFor('');

        }
        catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setResponse(err.response.data.message);

            }
        }
    }

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/expenses',
                {
                    expenseName,
                    expenseAmount,
                    expenseProject,
                    expenseDate,
                    category
                }

            );

            const data = res.data;
            setResponse(data);
            setExpenseName('');
            setExpenseAmount('');
            setExpenseProject('');
            SetExpenseDate('');
            setCategory('');


        }
        catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setResponse(err.response.data.message);

            }
        }

    }



    return (
        <div>
            <div className='flex flex-col items-center justify-center my-10'>
                <h1 className='font-extrabold text-5xl mb-5 text-shadow-lg text-yellow-500 '>EffectiveBuild</h1>
                <h3 className='mt-5 font-semibold text-2xl bg-linear-to-r from-gray-500 to-yellow-500 bg-clip-text text-transparent'>Welcome to your project budget and timing app!</h3>
            </div>
            <hr className='border-1 border-gray-200' />
            <section >

                <form onSubmit={handleProjectSubmit} className='shadow-xl p-10 flex flex-col items-center justify-center '>
                    <label htmlFor="projectTitle" className='font-bold my-3'>Project Title</label>
                    <input type="text"
                        className='border-2 border-amber-500 rounded-md w-xs p-2 focus:shadow-xl text-amber-500'
                        name='projectTitle'
                        id='projectTitle'
                        placeholder='Enter the title of the project...'
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        required />
                    <label htmlFor="startDate" className='font-bold my-3'>Start Date</label>
                    <input type="date"
                        className='border-2 border-amber-500 rounded-md w-xs p-2 focus:shadow-xl text-amber-500'
                        id='startDate'
                        name='startDate'
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required />
                    <label htmlFor="endDate" className='font-bold my-3'>End Date</label>
                    <input type="date"
                        className='border-2 border-amber-500 rounded-md w-xs p-2 focus:shadow-xl text-amber-500'
                        name='endDate'
                        id='endDate'
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required />

                    <label htmlFor="totalBudget" className='font-bold my-3'>Total Budget</label>
                    <input type="number"
                        className='border-2 border-amber-500 rounded-md w-xs p-2 focus:shadow-xl text-amber-500'
                        name='totalBudget'
                        id='totalBudget'
                        placeholder='$00000.00'
                        step="0.01"
                        min="0"
                        value={totalBudget}
                        onChange={(e) => setTotalBudget(e.target.value)}
                        required />

                    <button type='submit' className='ring-2 bg-amber-200 rounded-md  p-2 font-bold text-amber-500 bg-gray-700 my-5 hover:cursor-pointer active:translate-1'>Set</button>
                </form>
                <div className='flex flex-col items-center'>
                    {response && <p className='font-bold text-xl my-5 text-yellow-500'>{response.message}</p>}
                </div>

            </section>

            <br />

            <section className='bg-gray-100 flex flex-wrap items-center justify-center'>

                <form onSubmit={handleTaskSubmit} className='flex flex-col items-center justify-center mx-20 float-left shadow-lg p-10 bg-white'>
                    <div className='flex flex-col items-center justify-center'>
                        <h2 className='font-bold text-2xl my-10'>Set tasks for the project.</h2>
                    </div>
                    <label htmlFor="taskName" className='font-bold my-3'>Task Name</label>
                    <input type="text"
                        className='border-2 border-amber-500 rounded-md w-xs p-2 focus:shadow-xl text-amber-500'
                        name='taskName'
                        id='taskName'
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        required />

                    <label htmlFor="taskAssignedTo" className='font-bold my-3'>Task Assigned to</label>
                    <input type="text"
                        className='border-2 border-amber-500 rounded-md w-xs p-2 focus:shadow-xl text-amber-500'
                        name='taskAssignedTo'
                        id='taskAssignedTo'
                        value={taskAssignedTo}
                        onChange={(e) => setTaskAssignedTo(e.target.value)}
                        required />
                    <label htmlFor="taskProjectFor" className='font-bold my-3'>Task Project for</label>
                    <input type="text"
                        className='border-2 border-amber-500 rounded-md w-xs p-2 focus:shadow-xl text-amber-500'
                        name='taskProjectFor'
                        id='taskProjectFor'
                        value={taskProjectFor}
                        onChange={(e) => setTaskProjectFor(e.target.value)}
                        required />

                    <label htmlFor="taskStartDate" className='font-bold my-3'>Task Start Date</label>
                    <input type="date"
                        className='border-2 border-amber-500 rounded-md w-xs p-2 focus:shadow-xl text-amber-500'
                        name='taskStartDate'
                        id='taskStartDate'
                        value={taskStartDate}
                        onChange={(e) => setTaskStartDate(e.target.value)}
                        required />

                    <label htmlFor="taskEndDate" className='font-bold my-3'>Task End Date</label>
                    <input type="date"
                        className='border-2 border-amber-500 rounded-md w-xs p-2 focus:shadow-xl text-amber-500'
                        name='taskEndDate'
                        id='taskEndDate'
                        value={taskEndDate}
                        onChange={(e) => setTaskEndDate(e.target.value)}
                        required />

                    <label htmlFor="taskBudget" className='font-bold my-3'>Task Budget</label>
                    <input type="number"
                        className='border-2 border-amber-500 rounded-md w-xs p-2 focus:shadow-xl text-amber-500'
                        name='taskBudget'
                        id='taskBudget'
                        placeholder='$00000.00'
                        step="0.01"
                        min="0"
                        value={taskBudget}
                        onChange={(e) => setTaskBudget(e.target.value)}
                        required />
                    <button type='submit' className='ring-2 bg-amber-200 rounded-md  p-2 font-bold text-amber-500 bg-gray-700 my-5 hover:cursor-pointer active:translate-1'>Set</button>

                </form>



                <form onSubmit={handleExpenseSubmit} className='flex flex-col items-center justify-center float-left shadow-lg p-5'>

                    <div className='flex flex-col items-center justify-center'>
                        <h2 className='font-bold text-2xl my-10'>Set expenses of the project.</h2>
                    </div>
                    <label htmlFor="expenseName" className='font-bold my-3'>Expense Description</label>
                    <input type="text"
                        className='border-2 border-amber-500 rounded-md w-xs p-2 focus:shadow-xl text-amber-500'
                        name='expenseName'
                        id='expenseName'
                        value={expenseName}
                        onChange={(e) => setExpenseName(e.target.value)}
                        required />

                    <label htmlFor="expenseProject" className='font-bold my-3'>Project Expensed for</label>
                    <input type="text"
                        className='border-2 border-amber-500 rounded-md w-xs p-2 focus:shadow-xl text-amber-500'
                        name='expenseProject'
                        id='expenseProject'
                        value={expenseProject}
                        onChange={(e) => setExpenseProject(e.target.value)}
                        required />

                    <label htmlFor="category" className='font-bold my-3'>Expense Category</label>
                    <input type="text"
                        className='border-2 border-amber-500 rounded-md w-xs p-2 focus:shadow-xl text-amber-500'
                        name='category'
                        id='category'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required />
                    <label htmlFor="expenseDate" className='font-bold my-3'>Expense Date</label>
                    <input type="date"
                        className='border-2 border-amber-500 rounded-md w-xs p-2 focus:shadow-xl text-amber-500'
                        name='expenseDate'
                        id='expenseDate'
                        value={expenseDate}
                        onChange={(e) => SetExpenseDate(e.target.value)}
                        required />
                    <label htmlFor="expenseAmount" className='font-bold my-3'>Expense Amount</label>
                    <input type="number"
                        className='border-2 border-amber-500 rounded-md w-xs p-2 focus:shadow-xl text-amber-500'
                        name='expenseAmount'
                        step="0.01"
                        min="0"
                        placeholder='$00000.00'
                        id='expenseAmount'
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        required />


                    <button type='submit' className='ring-2 bg-amber-200 rounded-md  p-2 font-bold text-amber-500 bg-gray-700 my-5 hover:cursor-pointer active:translate-1'>Set</button>

                </form>

            </section>
            

            <section className='flex flex-col items-center my-10'>
                <button type='submit' className='ring-2 bg-amber-200 rounded-md  p-2 font-bold text-amber-500 bg-gray-700 my-5 hover:cursor-pointer active:translate-1' onClick={() => navigate('/track')}>Track Project</button>
            </section>

        </div>
    )
}

export default Home
