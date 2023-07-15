/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import Link from 'next/link'
import { useState } from 'react'
import { getSession, useSession ,signOut} from "next-auth/react"
import SideNavbar from '../../components/SideNavbar'
import SideNavbar_admin from '../../components/SideNavbar_admin'

export default function Home() {

  const { data: session } = useSession()

  return (
    <div className={styles.container}>
      <Head>
        <title>Home Page</title>
      </Head>

      { User({ session }) }
    </div>
  )
}



function User({ session }){

  return(
<div><SideNavbar_admin/>

    <main className="container mx-auto text-center py-20 ">

          <h3 className='text-4xl font-bold'>Authorize User Homepage</h3>

          <div className='details'>
            <h5>{session.user.firstname}</h5>
            <h5>{session.user.lastname}</h5>

            <h5>{session.user.email}</h5>
            <h5>role:{session.user.role}</h5>

          </div>

        

      </main>
      </div>
  )
}
export async function getServerSideProps({req}){
  const session = await getSession({req})
  if(!session){
    return {
      redirect :{
        destination:'/login',
        permanent:false
      }
    }
  }

  return{
    props:{
      session
    }
  }

}