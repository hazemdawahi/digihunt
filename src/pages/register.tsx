import Head from 'next/head'
import Layout from '../layout/layout'
import Link from 'next/link'
import styles from '../styles/Form.module.css';
import Image from 'next/image'
import { HiAtSymbol, HiFingerPrint, HiOutlineUser } from "react-icons/hi";
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import router from 'next/router';

export default function Register() {
  const [location, setLocation] = useState(null);
  const [show, setShow] = useState({ password: false, cpassword: false });
  const [selectedOption, setSelectedOption] = useState("employee");

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

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      companyname: '',
      industry: ''
    },
    onSubmit: (values) => {
      console.log(selectedOption);
      const options = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, role: selectedOption, location: location?.country })
      };

      const url = selectedOption === 'company' ? '/api/auth/register_company' : '/api/auth/register';

      fetch(url, options)
        .then(res => res.json())
        .then((data) => {
          console.log(data);
          if (data) router.push('http://localhost:3000');
        });
    }
  });

  return (
    <Layout children={undefined}>
      <section className='w-3/4 mx-auto flex flex-col gap'>
        {/* form */}
        <form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
          <div className="flex">
            <div
              className={`w-1/2 py-2 text-center cursor-pointer ${
                selectedOption === 'employee' ? 'text-blue-500 font-bold border-b-2 border-blue-500' : 'text-gray-500'
              }`}
              onClick={() => handleOptionChange('employee')}
            >
              Employee
            </div>
            <div
              className={`w-1/2 py-2 text-center cursor-pointer ${
                selectedOption === 'company' ? 'text-blue-500 font-bold border-b-2 border-blue-500' : 'text-gray-500'
              }`}
              onClick={() => handleOptionChange('company')}
            >
              Company
            </div>
          </div>

          {selectedOption === 'employee' && (
            <>
              <div className={styles.input_group}>
                <input
                  type="text"
                  name='firstname'
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
                  name='lastname'
                  placeholder='Lastname'
                  className={styles.input_text}
                  {...formik.getFieldProps('lastname')}
                />
                <span className='icon flex items-center px-4'>
                  <HiOutlineUser size={25} />
                </span>
              </div>
            </>
          )}

          {selectedOption === 'company' && (
            <>
              <div className={styles.input_group}>
                <input
                  type="text"
                  name='companyname'
                  placeholder='Company Name'
                  className={styles.input_text}
                  {...formik.getFieldProps('companyname')}
                />
                <span className='icon flex items-center px-4'>
                  <HiOutlineUser size={25} />
                </span>
              </div>
              <div className={styles.input_group}>
                <input
                  type="text"
                  name='industry'
                  placeholder='Industry'
                  className={styles.input_text}
                  {...formik.getFieldProps('industry')}
                />
                <span className='icon flex items-center px-4'>
                  <HiOutlineUser size={25} />
                </span>
              </div>
            </>
          )}

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
            <span className='icon flex items-center px-4' onClick={() => setShow({ ...show, password: !show.password })}>
              <HiFingerPrint size={25} />
            </span>
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
