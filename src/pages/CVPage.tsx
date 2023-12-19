/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getSession, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import styles from '../styles/cv.module.css';
import SideNavbar from '../components/SideNavbar';
import { Button } from "@nextui-org/react";
import Swal from 'sweetalert2';

function CVPage() {
  const { data: session } = useSession()
  console.log(session)

  const [resumeData, setResumeData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
const [uploadSuccess, setUploadSuccess] = useState(false);
const [uploadError, setUploadError] = useState(null);
const [hasUploadedData, setHasUploadedData] = useState(false);
useEffect(() => {
  console.log("resumeData", resumeData);
}, [resumeData]);

const handleFileChange = async (e) => {
  setSelectedFile(e.target.files[0]);

  const formData = new FormData();
  formData.append('file', e.target.files[0]);

  setUploading(true);
  setUploadError(null);

  try {
      const uploadResponse = await fetch('http://localhost:3000/api/auth/upload_pdf', {
          method: 'POST',
          body: formData,
      });

      if (!uploadResponse.ok) {
          const responseBody = await uploadResponse.text();
          console.error('Server responded with:', uploadResponse.status, responseBody);
          throw new Error(`Server error: ${uploadResponse.status}`);
      }

      const uploadData = await uploadResponse.json();
      console.log('File uploaded and can be accessed at:', uploadData.filePath);
      setUploadSuccess(true);

      // Now that we have the URL of the uploaded file, we can use it to fetch the extracted resume data
      const extractionResponse = await fetch(`http://localhost:3000/api/auth/parse_pdf`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              pdfUrl: uploadData.filePath,
          }),
      });

      const extractedData = await extractionResponse.json();
      console.log("extractedData",extractedData)
      setResumeData({
        ...defaultCV,
        ...extractedData
      });
      setHasUploadedData(true);
      
      console.log("resumeData",resumeData)
  } catch (error) {
      console.error('There was a problem:', error);
      setUploadError(error.message);
  } finally {
      setUploading(false);
  }
};
function Spinner() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column', // To arrange spinner and text vertically
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <div style={{
        border: '16px solid #f3f3f3',
        borderRadius: '50%',
        borderTop: '16px solid #3498db',
        width: '120px',
        height: '120px',
        animation: 'spin 2s linear infinite',
        marginBottom: '20px'  // A little space between the spinner and the text
      }}></div>
      <div>Processing your PDF...</div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

      const defaultCV = {
        id: 'No id information',
        job: 'No job information',
        country: 'No country information',
        phone: 'No phone information',
        email: 'No email information',
        website: 'No website information',
        skype: 'No skype information',
        twitter: 'No twitter information',
        linkedin: 'No linkedin information',
        facebook: 'No facebook information',
        profile: 'No profile information',
        first_date_start: 'No first_date_start information',
        first_date_end: 'No first_date_end information',
        first_loc: 'No first_loc information',
        first_company_work: 'No first_company_work information',
        first_work: 'No first_work information',
        second_date_start: 'No second_date_start information',
        second_date_end: 'No second_date_end information',
        second_company_work: 'No second_company_work information',
        second_company_name: 'No second_company_name information',
        second_work: 'No second_work information',
        third_date_start: 'No third_date_start information',
        third_date_end: 'No third_date_end information',
        third_company_work: 'No third_company_work information',
        third_company_name: 'No third_company_name information',
        third_work: 'No third_work information',
        first_date_start_edu: 'No first_date_start_edu information',
        first_date_end_edu: 'No first_date_end_edu information',
        first_edu: 'No first_edu information',
        first_education: 'No first_education information',
        second_date_start_edu: 'No second_date_start_edu information',
        second_date_end_edu: 'No second_date_end_edu information',
        second_edu: 'No second_edu information',
        skill_1: 'No skill_1 information',
        slider_1: 'No slider_1 information',
        skill_2: 'No skill_2 information',
        slider_2: 'No slider_2 information',
        skill_3: 'No skill_3 information',
        slider_3: 'No slider_3 information',
        skill_4: 'No skill_4 information',
        slider_4: 'No slider_4 information',
    };

    useEffect(() => {
      if (hasUploadedData) return;

      async function fetchResumeData() {
        console.log("hi")
        try {
          const userId = session.user.id; // replace with the actual user ID
          console.log("userId",userId)
          const response = await fetch(`http://localhost:3000/api/auth/getcv?userId=${userId}`);
          const data = await response.json();
          console.log(data)
  
          // Check if the response data contains an error key
          if (data.error) {
            console.error("An error occurred while fetching the resume data:", data.error);
            setResumeData(defaultCV);
          } else if (!data || Object.keys(data).length === 0) {
            setResumeData(defaultCV);
          } else {
            setResumeData(data);
          }
    
        } catch (error) {
          console.error("An error occurred while fetching the resume data:", error);
          setResumeData(defaultCV);
        }
      }
    
      fetchResumeData();
    }, [hasUploadedData, session.user.id]);  // Add dependencies to useEffect
  
    if (uploading) {
      return <Spinner />;
    }
    
    if (!resumeData) {
      return <div>Loading...</div>;
    }
    
  
   const getFormValues = async () => {
    const user= session.user.id;
    const job = (document.getElementById('job') as HTMLInputElement).value;
    const image = session.user.image;
    const firstname = session.user.firstname;
    const lastname = session.user.lastname;
    const country = (document.getElementById('country') as HTMLInputElement).value;
    const phone = (document.getElementById('phone') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const website = (document.getElementById('website') as HTMLInputElement).value;
    const skype = (document.getElementById('skype') as HTMLInputElement).value;
    const twitter = (document.getElementById('twitter') as HTMLInputElement).value;
    const linkedin = (document.getElementById('linkedin') as HTMLInputElement).value;
    const facebook = (document.getElementById('facebook') as HTMLInputElement).value;
    const profile = (document.getElementById('profile') as HTMLInputElement).value;
    const first_date_start = (document.getElementById('first_date_start') as HTMLInputElement).value;
    const first_date_end = (document.getElementById('first_date_end') as HTMLInputElement).value;
    const first_loc = (document.getElementById('first_loc') as HTMLInputElement).value;
    const first_company_work = (document.getElementById('first_company_work') as HTMLInputElement).value;
    const first_work = (document.getElementById('first_work') as HTMLInputElement).value;
    const second_date_start = (document.getElementById('second_date_start') as HTMLInputElement).value;
    const second_date_end = (document.getElementById('second_date_end') as HTMLInputElement).value;
    const second_company_work = (document.getElementById('second_company_work') as HTMLInputElement).value;
    const second_company_name = (document.getElementById('second_company_name') as HTMLInputElement).value;
    const second_work = (document.getElementById('second_work') as HTMLInputElement).value;
    const third_date_start = (document.getElementById('thrid_date_start') as HTMLInputElement).value;
    const third_date_end = (document.getElementById('third_date_end') as HTMLInputElement).value;
    const third_company_work = (document.getElementById('third_company_work') as HTMLInputElement).value;
    const third_company_name = (document.getElementById('third_company_name') as HTMLInputElement).value;
    const third_work = (document.getElementById('third_work') as HTMLInputElement).value;
    const first_date_start_edu = (document.getElementById('first_date_start_edu') as HTMLInputElement).value;
    const first_date_end_edu = (document.getElementById('first_date_end_edu') as HTMLInputElement).value;
    const first_edu = (document.getElementById('first_edu') as HTMLInputElement).value;
    const first_education = (document.getElementById('first_education') as HTMLInputElement).value;
    const second_date_start_edu = (document.getElementById('second_date_start_edu') as HTMLInputElement).value;
    const second_date_end_edu = (document.getElementById('second_date_end_edu') as HTMLInputElement).value;
    const second_edu = (document.getElementById('second_edu') as HTMLInputElement).value;
   const skill_1 = (document.getElementById('skill_1') as HTMLInputElement).value;
   const slider_1 = (document.getElementById('slider_1') as HTMLInputElement).value;
   const skill_2 = (document.getElementById('skill_2') as HTMLInputElement).value;
   const slider_2 = (document.getElementById('slider_2') as HTMLInputElement).value;
   const skill_3 = (document.getElementById('skill_3') as HTMLInputElement).value;
   const slider_3 = (document.getElementById('slider_3') as HTMLInputElement).value;
   const skill_4 = (document.getElementById('skill_4') as HTMLInputElement).value;
   const slider_4 = (document.getElementById('slider_4') as HTMLInputElement).value;
   const data = {
    user,
    image,
    firstname,
    lastname,
    job,
    country,
    phone,
    email,
    website,
    skype,
    twitter,
    linkedin,
    facebook,
    profile,
    first_date_start,
    first_date_end,
    first_loc,
    first_company_work,
    first_work,
    second_date_start,
    second_date_end,
    second_company_work,
    second_company_name,
    second_work,
    third_date_start,
    third_date_end,
    third_company_work,
    third_company_name,
    third_work,
    first_date_start_edu,
    first_date_end_edu,
    first_edu,
    first_education,
    second_date_start_edu,
    second_date_end_edu,
    second_edu,
    skill_1,
    slider_1,
    skill_2,
    slider_2,
    skill_3,
    slider_3,
    skill_4,
    slider_4,

  };
   try {
    console.log('hi')
    const response = await fetch('http://localhost:3000/api/auth/insertcv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log('result:',result)
    Swal.fire(
      'Good job!',
      'You clicked the button!',
      'success'
    )
  } catch (error) {
    console.error(error);
  }
  
    
  }

  console.log("resume_data",resumeData)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prevState => ({ ...prevState, [name]: value }));
  };
  return (    

  <><SideNavbar /><div className={styles.myclass}>
      <div className={styles.my_id}>


        <div className={styles.resumebox}>

          <div className={styles.leftsection}>

            <div className={styles.profile}>
              <img src={session.user.image} className={styles.profileimg}    />
              <div className={styles.bluebox}></div>
            </div>
            <h2 className={styles.name}>{session.user.firstname} 
             <br />
            <span>{session.user.lastname}</span></h2>
            <p className={styles.np}><input className={styles.fname} type="text" id="job" name="job" value={resumeData.job} onChange={handleInputChange}/></p>


            <div className={styles.info}>
              <p className={styles.heading}>Info</p>
              <p className={styles.p1}><span className={styles.span1}><img src="image/location.png" /></span>Country<span> <br /><input className={styles.fname} type="text" id="country" name="contry" value={resumeData.country} onChange={handleInputChange}/></span></p>
              <p className={styles.p1}><span className={styles.span1}><img src="image/call.png" /></span>Phone<span> <br /><input className={styles.fname} type="text" id="phone" name="phone"value={resumeData.phone} onChange={handleInputChange} /></span></p>
              <p className={styles.p1}><span className={styles.span1}><img src="image/mail.png" /></span>Email<span> <br /><input className={styles.fname} type="text" id="email" name="email"  value={resumeData.email} onChange={handleInputChange}/></span></p>
              <p className={styles.p1}><span className={styles.span1}><img src="image/domain.png" /></span>Website<span> <br /><input className={styles.fname} type="text" id="website" name="website" value={resumeData.website} onChange={handleInputChange}/></span></p>
            </div>

            <div className={styles.info}>
              <p className={styles.heading}>Social</p>
              <p className={styles.p1}><span className={styles.span1}><img src="image/skype.png" /></span>Skype<span> <br /><input className={styles.fname} type="text" id="skype" name="skype" value={resumeData.skype} onChange={handleInputChange}/></span></p>
              <p className={styles.p1}><span className={styles.span1}><img src="image/twitter.png" /></span>Twitter<span> <br /><input className={styles.fname} type="text" id="twitter" name="twitter" value={resumeData.twitter} onChange={handleInputChange} /></span></p>
              <p className={styles.p1}><span className={styles.span1}><img src="image/linkedin.png" /></span>Linkdin<span> <br /><input className={styles.fname} type="text" id="linkedin" name="linkedin" value={resumeData.linkedin}  onChange={handleInputChange}/></span></p>
              <p className={styles.p1}><span className={styles.span1}><img src="image/facebook.png" /></span>Facebook<span> <br /><input className={styles.fname} type="text" id="facebook" name="facebook" value={resumeData.facebook} onChange={handleInputChange}/></span></p>
            </div>

          </div>

          <div className={styles.rightsection}>
            <div className={styles.rightheading}>
              <img src="image/user.png" />
              <p className={styles.p2}>Profile</p>
            </div>
            <textarea className={styles.textarea} id="profile" name="profile" rows={3} cols={40} value={resumeData.profile} onChange={handleInputChange}/>

            <div className={styles.clearfix}></div>
            <br />
            <div className={styles.rightheading}>
              <img src="image/pencil.png" />
              <p className={styles.p2}>Work Experience</p>
            </div>
            <div className={styles.clearfix}></div>
            <div className={styles.lrbox}>
              <div className={styles.left}>
              <input className={styles.date} type="text" id="first_date_start" name="first_date_start" value={resumeData.first_date_start} onChange={handleInputChange} /> -           
                 <input className={styles.date} type="text" id="first_date_end" name="first_date_end" value={resumeData.first_date_end} onChange={handleInputChange} />      
     
                <input className={styles.company_loc} type="text" id="first_loc" name="first_loc" value={resumeData.first_loc} onChange={handleInputChange} />      
                        </div>

              <div className={styles.right}>
              <input className={styles.work} type="text" id="first_company_work" name="first_company_work"value={resumeData.first_company_work} onChange={handleInputChange} />      
                <input className={styles.company_loc} type="text" id="first_company_name" name="first_company_name" value={resumeData.first_company_name} onChange={handleInputChange} />      
                <textarea className={styles.textarea} id="first_work" name="first_work" rows={3} cols={40} value={resumeData.first_work} onChange={handleInputChange}>
                </textarea>
              </div>
              <div className={styles.clearfix}></div>
            </div>

            <div className={styles.lrbox}>
              <div className={styles.left}>
              <input className={styles.date} type="text" id="second_date_start" name="second_date_start"  value={resumeData.second_date_start} onChange={handleInputChange}/> -           
                 <input className={styles.date} type="text" id="second_date_end" name="second_date_end" value={resumeData.second_date_end} onChange={handleInputChange} />            
                         <input className={styles.company_loc} type="text" id="second_loc" name="second_loc" value={resumeData.second_loc} onChange={handleInputChange}/>      
              </div>

              <div className={styles.right}>
              <input className={styles.work} type="text" id="second_company_work" name="second_company_work" value={resumeData.second_company_work} onChange={handleInputChange}/>      
                <input className={styles.company_loc} type="text" id="second_company_name" name="second_company_name" value={resumeData.second_company_name} onChange={handleInputChange} />      
                <textarea className={styles.textarea} id="second_work" name="second_work" rows={3} cols={40} value={resumeData.second_work} onChange={handleInputChange}>
                </textarea>              </div>
              <div className={styles.clearfix}></div>
            </div>

            <div className={styles.lrbox}>
              <div className={styles.left}>
              <input className={styles.date} type="text" id="thrid_date_start" name="thrid_date_start"value={resumeData.third_date_start} onChange={handleInputChange} /> -           
                 <input className={styles.date} type="text" id="third_date_end" name="third_date_end" value={resumeData.third_date_end} onChange={handleInputChange}/>    
                               <input className={styles.company_loc} type="text" id="third_loc" name="third_loc"  value={resumeData.third_loc} onChange={handleInputChange}/>      
              </div>

              <div className={styles.right}>
              <input className={styles.work} type="text" id="third_company_work" name="third_company_work" value={resumeData.third_company_work} onChange={handleInputChange}/>      
                <input className={styles.company_loc} type="text" id="third_company_name" name="third_company_name" value={resumeData.third_company_name} onChange={handleInputChange}/>      
                <textarea className={styles.textarea} id="third_work" name="third_work" rows={3} cols={40} value={resumeData.third_work} onChange={handleInputChange}>
                </textarea>                  </div>
              <div className={styles.clearfix}></div>
            </div>


            <br />
            <div className={styles.rightheading}>
              <img src="image/edu.png" />
              <p className={styles.p2}>Education</p>
            </div>
            <div className={styles.clearfix}></div>
            <div className={styles.lrbox}>
              <div className={styles.left}>
              <input className={styles.date} type="text" id="first_date_start_edu" name="first_date_start_edu" value={resumeData.first_date_start_edu} onChange={handleInputChange} /> -           
                 <input className={styles.date} type="text" id="first_date_end_edu" name="first_date_end_edu"value={resumeData.first_date_end_edu} onChange={handleInputChange} />              
                     <input className={styles.company_loc} type="text" id="first_edu_loc" name="first_edu_loc" value={resumeData.first_edu_loc} onChange={handleInputChange}/>      
              </div>

              <div className={styles.right}>
              <input className={styles.work} type="text" id="first_edu" name="first_edu" value={resumeData.first_edu} onChange={handleInputChange} />      
                <textarea className={styles.textarea} id="first_education" name="first_education" rows={3} cols={40} value={resumeData.first_education} onChange={handleInputChange}>
                </textarea>                      </div>
              <div className={styles.clearfix}></div>
            </div>

            <div className={styles.lrbox}>
              <div className={styles.left}>
              <input className={styles.date} type="text" id="second_date_start_edu" name="second_date_start_edu" value={resumeData.second_date_start_edu} onChange={handleInputChange}/> -           
                 <input className={styles.date} type="text" id="second_date_end_edu" name="second_date_end_edu" value={resumeData.second_date_end_edu}onChange={handleInputChange}/>              
                     <input className={styles.company_loc} type="text" id="second_edu" name="second_edu" onChange={handleInputChange}/>      
              </div>

              <div className={styles.right}>
              <input className={styles.work} type="text" id="second_edu" name="second_edu" value={resumeData.second_edu} onChange={handleInputChange}/>      
                <textarea className={styles.textarea} id="second_education" name="second_education" rows={3} cols={40} value={resumeData.second_education} onChange={handleInputChange}>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry
                </textarea>                      </div>
              <div className={styles.clearfix}></div>
            </div>

            <br />
            <div className={styles.rightheading}>
              <img src="image/edu.png" />
              <p className={styles.p2}>Skill and expertize</p>
            </div>
            <div className={styles.clearfix}></div>
            <div className={styles.sbox}>
            <input className={styles.skills} type="text" id="skill_1" name="skill_1" value={resumeData.skill_1} onChange={handleInputChange} />      
              <input className={styles.slider} type="range" id="slider_1" name="slider_1" min="0" max="100" step="1"value={resumeData.slider_1} onChange={handleInputChange} />
              <input className={styles.skills} type="text" id="skill_2" name="skill_2" value={resumeData.skill_2} />      
              <input className={styles.slider} type="range" id="slider_2" name="slider_2" min="0" max="100" step="1"value={resumeData.slider_2} onChange={handleInputChange}/>

            </div>
            <div className={styles.sbox}>
            <input className={styles.skills} type="text" id="skill_3" name="skill_3" value={resumeData.skill_3} onChange={handleInputChange} />      
<input className={styles.slider} type="range" id="slider_3" name="slider_3" min="0" max="100" step="1" value={resumeData.slider_3} onChange={handleInputChange}/>
<input className={styles.skills} type="text" id="skill_4" name="skill_4" value={resumeData.skill_4} />      
              <input className={styles.slider} type="range" id="slider_4" name="slider_4" min="0" max="100" step="1" value={resumeData.slider_4}  onChange={handleInputChange}/>
            </div>


            <div className={styles.clearfix}></div>


          </div>

      
<div className={styles.buttons_row}>
    <div className={styles.upload_btn_wrapper}>
        <label htmlFor="fileUpload" className={styles.button_style}>Upload</label>
        <input type="file" id="fileUpload" onChange={handleFileChange} />
    </div>
    <div onClick={getFormValues} className={styles.button_style}>Save</div>
</div>

        </div>
      </div>
      
    </div></>


);

  }
export default CVPage;
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
