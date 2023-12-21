import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { useState } from 'react';
import { getSession, useSession, signIn } from 'next-auth/react';
import SideNavbar from '../components/SideNavbar';
import {
  Container,
  Card,
  Row,
  Text,
  Avatar,
  Grid,
  Input,
  Button,
  Spacer,
  Badge,
} from '@nextui-org/react';
import { FaEdit } from 'react-icons/fa';
import { BiPen } from 'react-icons/bi';
import { CgPen } from 'react-icons/cg';
import { useFormik } from 'formik';
import router from 'next/router';
import Swal from 'sweetalert2';

export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div className={styles.container}>
      <User session={session} />
    </div>
  );
}

function User({ session }) {
  const { data: sessionData } = useSession();

  const formik = useFormik({
    initialValues: {
      firstname: session?.user?.firstname || '',
      lastname: session?.user?.lastname || '',
      email: session?.user?.email || '',
      location: session?.user?.location || '',
      password: '',
      company: session?.user?.company_name || '',
      industry: session?.user?.industry || '',
      role: session?.user?.role || '',
    },
    onSubmit: async (values) => {
      const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      };

      try {
        const response = await fetch('http://localhost:3000/api/auth/update', options);
        const data = await response.json();
        if (data && response.ok) {
          await Swal.fire('Update Successful', 'Your information has been updated.', 'success');
          
          // Refresh session data
          console.log("data",data);
          
          let result;
          if (session?.user.role=== 'company') {
            result = await signIn('credentials', {
              email: data.company.email,
              password: "test123",
              redirect: false,
            });
          } else {
            result = await signIn('credentials', {
              email: data.user.email,
              password: "test123",
              redirect: false,
            });
          }
          console.log("result", result);
          
          // Check if signIn was successful
          if (result?.error === null) {
            // Reload the page
            window.location.reload();
          } else {
            console.error("Failed to refresh the session after sign-in.");
          }
        } else {
          throw new Error(data.message || 'An error occurred');
        }
      } catch (error) {
        Swal.fire('Update Failed', error.message, 'error');
      }
      
      
    },
  });

  return (
    <div style={{ display: 'flex' }}>
      <SideNavbar />
      <main className="container mx-auto text-center py-20 pl-50">
        <h3 className="text-4xl font-bold">PERSONAL INFORMATION</h3>
        <Spacer y={2} />
        <Container xs>
          <form onSubmit={formik.handleSubmit}>
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
                      <Avatar size="xl" src={session?.user?.image} />
                    </Badge>
                  </Grid>
                </Row>
                <Row justify="center" align="center">
                  <Grid.Container gap={2} justify="center">
                    {formik.values.role === 'company' ? (
                      <>
                        <Grid>
                          <Input
                            clearable
                            label="Company Name"
                            placeholder="Enter your company name"
                            name="company"
                            {...formik.getFieldProps('company')}
                          />
                        </Grid>
                        <Grid>
                          <Input
                            clearable
                            label="Industry"
                            placeholder="Enter your industry"
                            name="industry"
                            {...formik.getFieldProps('industry')}
                          />
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid>
                          <Input
                            clearable
                            label="First Name"
                            placeholder="Enter your first name"
                            name="firstname"
                            {...formik.getFieldProps('firstname')}
                          />
                        </Grid>
                        <Grid>
                          <Input
                            clearable
                            label="Last Name"
                            placeholder="Enter your last name"
                            name="lastname"
                            {...formik.getFieldProps('lastname')}
                          />
                        </Grid>
                      </>
                    )}
                    <Grid>
                      <Input
                        type="email"
                        label="Email"
                        placeholder="Enter your email"
                        name="email"
                        {...formik.getFieldProps('email')}
                      />
                    </Grid>
                    <Grid>
                      <Input
                        clearable
                        label="Location"
                        placeholder="Enter your location"
                        name="location"
                        {...formik.getFieldProps('location')}
                      />
                    </Grid>
                    <Grid>
                      <Input.Password
                        clearable
                        label="Password"
                        placeholder="Enter new password (leave blank if unchanged)"
                        name="password"
                        {...formik.getFieldProps('password')}
                      />
                    </Grid>
                  </Grid.Container>
                </Row>
              </Card.Body>
              <Spacer y={1} />
              <Button type="submit" color="primary" auto>
                UPDATE
              </Button>
            </Card>
          </form>
        </Container>
      </main>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  if (session.user.role === 'admin') {
    return {
      redirect: {
        destination: '/admin_user_pages',
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
