/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
import Head from 'next/head'
import Layout from '../layout/layout'
import Link from 'next/link'
import styles from '../styles/Form.module.css';
import Image from 'next/image'
import { HiAtSymbol, HiFingerPrint,HiUsers } from "react-icons/hi";
import { useState } from 'react';
import { useFormik } from 'formik'; // import useFormik hook
import router, { useRouter } from 'next/router';

export default function Verfication(){
    const { email } = router.query; // extract email from query parameter

  const formik = useFormik({
    initialValues: {
      verification_code: '',
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...values,  email})
    });
  
      const data = await response.json();
      if(data) router.push('http://localhost:3000')
      // handle the response data here
    },
  });

  return (
    <Layout>
      <Head>
        <title>Verfication_code</title>
      </Head>
        
      <section className='w-3/4 mx-auto flex flex-col gap-2'>
        <div className="title">
          <h1 className='text-gray-800 text-4xl font-bold py-4'>Verification code </h1>
        </div>

        {/* form */}
        <form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
          <div className={styles.input_group}>
            <input 
              type="string"
              name='verification_code'
              placeholder='verification_code'
              className={styles.input_text}
              {...formik.getFieldProps('verification_code')}
            />
            <span className='icon flex items-center px-4'>
              <HiUsers size={25} />
            </span>
          </div>
           
          {/* login buttons */}
          <div className="input-button">
            <button type='submit' className={styles.button}>
              Verify
            </button>
          </div>
        </form>
      </section>
    </Layout>
  )
}
