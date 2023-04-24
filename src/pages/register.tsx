/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
import Head from 'next/head'
import Layout from '../layout/layout'
import Link from 'next/link'
import styles from '../styles/Form.module.css';
import Image from 'next/image'
import { HiAtSymbol, HiFingerPrint, HiOutlineUser } from "react-icons/hi";
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import router from 'next/router';

export default function Register(){
    const [location, setLocation] = useState(null)

    useEffect(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            const apiKey = '20940c75c1244996a8da8ba43769222b'
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
    
            fetch(url)
              .then(response => response.json())
              .then(data => {
                const { city, country } = data.results[0].components
                setLocation({ city, country })
              })
              .catch(error => {
                console.error(error)
              })
          }, error => {
            console.error(error)
          })
        } else {
          console.error('Geolocation is not supported by this browser')
        }
      }, [])
    
      if (location) {
        console.log('City:', location.city)
        console.log('Country:', location.country)
      } else {
        console.log('Getting current location...')
      }
    const [show, setShow] = useState({ password: false, cpassword: false })
    const [selectedOption, setSelectedOption] = useState("");

    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
    };
    
    
    const formik = useFormik({
        initialValues: {
            firstname : '',
            lastname: '',
            email: '',
            password: '',
            role: ''
        },
        onSubmit
    })
    
    async function onSubmit(values){
        console.log(selectedOption)
        const options = {
            method: "POST",
            headers : { 'Content-Type': 'application/json'},
            body: JSON.stringify({...values, role: selectedOption,location:location.country})
        }
    
        await fetch('http://localhost:3000/api/auth/register', options)
            .then(res => res.json())
            .then((data) => {
                console.log(data)
                if(data) router.push('http://localhost:3000')
            })
    }
    

    return (
        <Layout>


        

        <section className='w-3/4 mx-auto flex flex-col gap'>
            <div className="title">
                <h3 className='text-gray-800 text-2xl font-bold py-bu'>Register</h3>
            </div>

            {/* form */}
            <form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
                <div className={styles.input_group}>
                    <input 
                    type="text"
                    name='Firstname'
                    placeholder='Firstname'
                    className={styles.input_text}
                    {...formik.getFieldProps('firstname')}
                    />
                    <span className='icon flex items-center px-4'>
                        <HiOutlineUser size={25} />
                    </span>
                </div>
                <div className={styles.input_group}>
                    <input 
                    type="text"
                    name='Lastname'
                    placeholder='Lastname'
                    className={styles.input_text}
                    {...formik.getFieldProps('lastname')}
                    />
                    <span className='icon flex items-center px-4'>
                        <HiOutlineUser size={25} />
                    </span>
                </div>
                <div className={styles.input_group}>
                    <input 
                    type="email"
                    name='email'
                    placeholder='Email'
                    className={styles.input_text}
                    {...formik.getFieldProps('email')}
                    />
                    <span className='icon flex items-center px-4'>
                        <HiAtSymbol size={25} />
                    </span>
                </div>
                <div className={styles.input_group}>
                    <input 
                    type={`${show.password ? "text" : "password"}`}
                    name='password'
                    placeholder='password'
                    className={styles.input_text}
                    {...formik.getFieldProps('password')}
                    />
                     <span className='icon flex items-center px-4' onClick={() => setShow({ ...show, password: !show.password})}>
                        <HiFingerPrint size={25} />
                    </span>
                </div>

               
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
    <label>
      <input type="radio" value="employee" checked={selectedOption === "employee"} onChange={handleOptionChange} />
      Employee
    </label>
    <label>
      <input type="radio" value="company" checked={selectedOption === "company"} onChange={handleOptionChange} />
      Company
    </label>
  </div>
                {/* login buttons */}
                <div className="input-button">
                    <button type='submit' className={styles.button}>
                        Sign Up
                    </button>
                </div>
            </form>

            {/* bottom */}
            <p className='text-center text-gray-400 '>
                Have an account? <Link className='text-blue-700' href={'/login'}>Sign In</Link>
            </p>
        </section>
        </Layout>
    )
}