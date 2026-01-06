import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Landing() {
    const navigate = useNavigate();
    const [showSignup, setShowSignup] = useState(false);
    const [showSignin, setShowSignin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/userSignUp', {
                email,
                password
            });

            const data = res.data;
            setResponse(data);

            setEmail('');
            setPassword('');
            navigate('/home');
        }
        catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setResponse(err.response.data.message);
               
            }

        }
    }
    async function handleSignin(e) {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/userSignIn', {
                email,
                password
            });
            const token = res.data.token;
            localStorage.setItem('token', token);
            setEmail('');
            setPassword('');
            navigate('/home')
        }
        catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setResponse(err.response.data.message);
                


            }
        }
    }

    return (
        <div >
            <div className='flex flex-col items-center justify-center my-10'>
                <h1 className='font-extrabold text-6xl mb-5 text-shadow-lg text-yellow-500'>EffectiveBuild</h1>
                <h2 className='font-bold text-xl bg-amber-100 p-5'>A great construction budget and timing app which makes site building easy and effective!</h2>
            </div>
            <section className='flex flex-wrap items-center justify-center'>
                <h3 className='shadow-xl mx-10 p-10 font-bold text-yellow-500 text-2xl'>Fast tracking of projects</h3>
                <h3 className='shadow-xl mx-10 p-10 font-bold text-yellow-500 text-2xl'>Preventing budget imbalance</h3>
                <h3 className='shadow-xl mx-10 p-10 font-bold text-yellow-500 text-2xl'>Scalable time allocation for projects</h3>
            </section>
            <section className='flex flex-wrap items-center justify-center my-10'>
                <button className='mx-5 ring-2 p-3 rounded-full bg-amber-200 font-bold hover:bg-yellow-300 hover:cursor-pointer'
                    onClick={(e) => {
                        setShowSignup(true)
                        setShowSignin(false)

                    }}>SignUp</button>
                <button className='mx-10 ring-2 p-3 rounded-full bg-amber-200 font-bold hover:bg-yellow-300 hover:cursor-pointer'
                    onClick={(e) => {
                        setShowSignin(true)
                        setShowSignup(false)
                    }
                    }>Login</button>

            </section>

            <section className='flex flex-col items-center shadow-xl'>
                {showSignup && <form className='flex flex-col items-center justify-center shadow-xl p-10' onSubmit={handleSignup}>
                    <input type="email"
                        className='border-2 border-amber-500 rounded-md w-xs p-2 focus:shadow-xl text-amber-500'
                        placeholder='Enter Your email'
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                    <br />
                    <input type="password"
                        className='border-2 border-amber-500 rounded-md w-xs p-2'
                        placeholder='Enter Your password'
                        name='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />

                    <button type='submit' className='ring-2 bg-amber-200 rounded-md mt-10 p-2 font-bold text-amber-500 bg-gray-700 hover:cursor-pointer active:translate-1'>Signup</button>

                </form>}
                {showSignin &&
                    <form onSubmit={handleSignin} className='flex flex-col items-center justify-center shadow-xl p-10'>
                        <input type="email"
                            className='border-2 border-amber-500 rounded-md w-xs p-2 focus:shadow-xl text-amber-500'
                            placeholder='Enter Your email'
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required />
                        <br />
                        <input type="password"
                            className='border-2 border-amber-500 rounded-md w-xs p-2'
                            placeholder='Enter Your password'
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required />

                        <button type='submit' className='ring-2 bg-amber-200 rounded-md mt-10 p-2 font-bold text-amber-500 bg-gray-700 hover:cursor-pointer active:translate-1'>Login</button>

                    </form>}
                {response && <p className='font-bold text-2xl my-5 text-yellow-500'>{response}</p>}
            </section>
        </div>
    )
}

export default Landing
