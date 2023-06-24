import React, { useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
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
  Modal,
  Checkbox,
  Dropdown,
  Textarea,
  Radio,
} from '@nextui-org/react';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { BiPen } from 'react-icons/bi';
import { CgPen } from 'react-icons/cg';
import { useFormik } from 'formik';
import router from 'next/router';
import Swal from 'sweetalert2';
import CVViewer from './CVPage';
export default function cv_offeres() {
  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);


  const handleAccept = () => {
    // Handle accept logic here
    console.log('CV accepted');
  };

  const handleReject = () => {
    // Handle reject logic here
    console.log('CV rejected');
  };

  return (
    <div>
      <h1>Your Component</h1>
      <CVViewer  />
    </div>
  );
};

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
