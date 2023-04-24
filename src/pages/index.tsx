/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useState } from 'react'
import { getSession, useSession ,signOut} from "next-auth/react"
import SideNavbar from './SideNavbar'
import { Container, Card, Row, Text, Avatar, Grid, Input, Button, Spacer, Badge } from "@nextui-org/react";
import { FaEdit } from 'react-icons/fa'
import { BiPen } from 'react-icons/bi'
import { CgPen } from 'react-icons/cg'
import { useFormik } from 'formik'
import router from 'next/router'
import Swal from 'sweetalert2'

export default function Home() {
 
  const { data: session } = useSession()
console.log(session)
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
  const formik = useFormik({
    initialValues: {
      firstname: session.user.firstname,
      lastname: session.user.lastname,
      email: session.user.email,
      location: session.user.location,
 password : session.user.password
    },
    onSubmit
})

 async function onSubmit(values){
  console.log(values)
    const options = {
        method: "put",
       headers : { 'Content-Type': 'application/json'},
    body: JSON.stringify({...values})
     }

     await fetch('http://localhost:3000/api/auth/update', options)
        .then(res => res.json())
       .then((data) => {
    console.log(data)
            if(data) {
              Swal.fire(
                'Good job!',
                'You clicked the button!',
                'success'
              )
            }
         })
}

  return(
    
<div style={{ display: 'flex' }}>
  <SideNavbar />
  <main className="container mx-auto text-center py-20 pl-50">

  <h3 className='text-4xl font-bold'>PERSONAL INFORMATIONS</h3>
  <Spacer y={2} />

<Container xs >
<form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>

<Card css={{ $$cardColor: 'white' }}>

<Card.Body>
  <Row justify="center" align="center">
  <Grid>
        <Badge
          content={<CgPen />}
          css={{ p: 0 }}
          shape="circle"
          placement="bottom-right"
          horizontalOffset="8%"
          verticalOffset="-10%"
          size="md"
        >
          <Avatar
            size="xl"
            src={session.user.image}
          />
        </Badge>
      </Grid>
        </Row>

<Row justify="center" align="center" >

        <Grid.Container gap={2} justify="center">
     
      <Grid>
        <Input
          clearable
          label="Firstname"
          placeholder="Enter your name"
          value={session.user.firstname}
          name="firstname"
          {...formik.getFieldProps('firstname')}

        />
      </Grid>
    <Grid>
         <Input
          clearable
          label="Firstname"
          placeholder="Enter your name"
          value={session.user.lastname}
          name="lastname"
          {...formik.getFieldProps('lastname')}
        />
      </Grid>
     
      <Grid>
        <Input
          
          type="Email"
          label="Email"
          placeholder="With regex validation"
          name="email"

          {...formik.getFieldProps('email')}
        />
      </Grid>
     
      <Grid>
      <Input
          clearable
          label="Location"
          placeholder="Enter your location"
          value={session.user.location}
          name="location"
          {...formik.getFieldProps('location')}
        />
      </Grid>
      <Grid>
      <Input.Password
          clearable
          initialValue={session.user.password}
          type="password"
          label="Password"
          placeholder="Enter your password "
          name="password"
          {...formik.getFieldProps('password')}
        />
      </Grid>
     
     
    </Grid.Container>
    
</Row>
</Card.Body>
<Spacer y={1} />

<Button onClick={() => onSubmit(formik.values)} color="primary" auto>
          UPDATE
        </Button>
</Card>
</form>

</Container>
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
  if(session.user.role =="admin"){
    return {
      redirect :{
        destination:'/admin_user_pages',
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