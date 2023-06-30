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
    async function fetchResumeData() {
      try {
        const userId = session.user.id; // replace with the actual user ID
        console.log("userId",userId)
        const response = await fetch(`http://localhost:3000/api/auth/getcv?userId=${userId}`);
        const data = await response.json();
  console.log(data)
        if (!data || Object.keys(data).length === 0) {
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
  }, []);
  
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
    const response = await fetch('http://localhost:3000/api/auth/insertcv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
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

  return (    

  <><SideNavbar /><div className={styles.myclass}>
      <div className={styles.my_id}>


        <div className={styles.resumebox}>

          <div className={styles.leftsection}>

            <div className={styles.profile}>
              <img src={session.user.image} className={styles.profileimg}   />
              <div className={styles.bluebox}></div>
            </div>
            <h2 className={styles.name}>{session.user.firstname}
             <br />
            <span>{session.user.lastname}</span></h2>
            <p className={styles.np}><input className={styles.fname} type="text" id="job" name="job" defaultValue={resumeData.job} /></p>


            <div className={styles.info}>
              <p className={styles.heading}>Info</p>
              <p className={styles.p1}><span className={styles.span1}><img src="image/location.png" /></span>Country<span> <br /><input className={styles.fname} type="text" id="country" name="contry" defaultValue={resumeData.country}/></span></p>
              <p className={styles.p1}><span className={styles.span1}><img src="image/call.png" /></span>Phone<span> <br /><input className={styles.fname} type="text" id="phone" name="phone"defaultValue={resumeData.phone} /></span></p>
              <p className={styles.p1}><span className={styles.span1}><img src="image/mail.png" /></span>Email<span> <br /><input className={styles.fname} type="text" id="email" name="email"  defaultValue={resumeData.email}/></span></p>
              <p className={styles.p1}><span className={styles.span1}><img src="image/domain.png" /></span>Website<span> <br /><input className={styles.fname} type="text" id="website" name="website" defaultValue={resumeData.website} /></span></p>
            </div>

            <div className={styles.info}>
              <p className={styles.heading}>Social</p>
              <p className={styles.p1}><span className={styles.span1}><img src="image/skype.png" /></span>Skype<span> <br /><input className={styles.fname} type="text" id="skype" name="skype" defaultValue={resumeData.skype} /></span></p>
              <p className={styles.p1}><span className={styles.span1}><img src="image/twitter.png" /></span>Twitter<span> <br /><input className={styles.fname} type="text" id="twitter" name="twitter" defaultValue={resumeData.twitter} /></span></p>
              <p className={styles.p1}><span className={styles.span1}><img src="image/linkedin.png" /></span>Linkdin<span> <br /><input className={styles.fname} type="text" id="linkedin" name="linkedin" defaultValue={resumeData.linkedin} /></span></p>
              <p className={styles.p1}><span className={styles.span1}><img src="image/facebook.png" /></span>Facebook<span> <br /><input className={styles.fname} type="text" id="facebook" name="facebook" defaultValue={resumeData.facebook}/></span></p>
            </div>

          </div>

          <div className={styles.rightsection}>
            <div className={styles.rightheading}>
              <img src="image/user.png" />
              <p className={styles.p2}>Profile</p>
            </div>
            <textarea className={styles.textarea} id="profile" name="profile" rows={3} cols={40} defaultValue={resumeData.profile}/>

            <div className={styles.clearfix}></div>
            <br />
            <div className={styles.rightheading}>
              <img src="image/pencil.png" />
              <p className={styles.p2}>Work Experience</p>
            </div>
            <div className={styles.clearfix}></div>
            <div className={styles.lrbox}>
              <div className={styles.left}>
              <input className={styles.date} type="text" id="first_date_start" name="first_date_start" defaultValue={resumeData.first_date_start} /> -           
                 <input className={styles.date} type="text" id="first_date_end" name="first_date_end" defaultValue={resumeData.first_date_end} />      
     
                <input className={styles.company_loc} type="text" id="first_loc" name="first_loc" defaultValue={resumeData.first_loc} />      
                        </div>

              <div className={styles.right}>
              <input className={styles.work} type="text" id="first_company_work" name="first_company_work"defaultValue={resumeData.first_company_work} />      
                <input className={styles.company_loc} type="text" id="first_company_name" name="first_company_name" defaultValue={resumeData.first_company_name} />      
                <textarea className={styles.textarea} id="first_work" name="first_work" rows={3} cols={40} defaultValue={resumeData.first_work}>
                </textarea>
              </div>
              <div className={styles.clearfix}></div>
            </div>

            <div className={styles.lrbox}>
              <div className={styles.left}>
              <input className={styles.date} type="text" id="second_date_start" name="second_date_start"  defaultValue={resumeData.second_date_start}/> -           
                 <input className={styles.date} type="text" id="second_date_end" name="second_date_end" defaultValue={resumeData.second_date_end} />            
                         <input className={styles.company_loc} type="text" id="second_loc" name="second_loc" defaultValue={resumeData.second_loc}/>      
              </div>

              <div className={styles.right}>
              <input className={styles.work} type="text" id="second_company_work" name="second_company_work" defaultValue={resumeData.second_company_work}/>      
                <input className={styles.company_loc} type="text" id="second_company_name" name="second_company_name" defaultValue={resumeData.second_company_name} />      
                <textarea className={styles.textarea} id="second_work" name="second_work" rows={3} cols={40} defaultValue={resumeData.second_work}>
                </textarea>              </div>
              <div className={styles.clearfix}></div>
            </div>

            <div className={styles.lrbox}>
              <div className={styles.left}>
              <input className={styles.date} type="text" id="thrid_date_start" name="thrid_date_start"defaultValue={resumeData.third_date_start} /> -           
                 <input className={styles.date} type="text" id="third_date_end" name="third_date_end" defaultValue={resumeData.third_date_end}/>    
                               <input className={styles.company_loc} type="text" id="third_loc" name="third_loc"  defaultValue={resumeData.third_loc}/>      
              </div>

              <div className={styles.right}>
              <input className={styles.work} type="text" id="third_company_work" name="third_company_work" defaultValue={resumeData.third_company_work} />      
                <input className={styles.company_loc} type="text" id="third_company_name" name="third_company_name" defaultValue={resumeData.third_company_name}/>      
                <textarea className={styles.textarea} id="third_work" name="third_work" rows={3} cols={40} defaultValue={resumeData.third_work}>
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
              <input className={styles.date} type="text" id="first_date_start_edu" name="first_date_start_edu" defaultValue={resumeData.first_date_start_edu} /> -           
                 <input className={styles.date} type="text" id="first_date_end_edu" name="first_date_end_edu"defaultValue={resumeData.first_date_end_edu} />              
                     <input className={styles.company_loc} type="text" id="first_edu_loc" name="first_edu_loc" defaultValue={resumeData.first_edu_loc}/>      
              </div>

              <div className={styles.right}>
              <input className={styles.work} type="text" id="first_edu" name="first_edu" defaultValue={resumeData.first_edu}  />      
                <textarea className={styles.textarea} id="first_education" name="first_education" rows={3} cols={40} defaultValue={resumeData.first_education}>
                </textarea>                      </div>
              <div className={styles.clearfix}></div>
            </div>

            <div className={styles.lrbox}>
              <div className={styles.left}>
              <input className={styles.date} type="text" id="second_date_start_edu" name="second_date_start_edu" defaultValue={resumeData.second_date_start_edu} /> -           
                 <input className={styles.date} type="text" id="second_date_end_edu" name="second_date_end_edu" defaultValue={resumeData.second_date_end_edu}/>                  <input className={styles.company_loc} type="text" id="second_edu" name="second_edu" />      
              </div>

              <div className={styles.right}>
              <input className={styles.work} type="text" id="second_edu" name="second_edu" defaultValue={resumeData.second_edu}/>      
                <textarea className={styles.textarea} id="second_education" name="second_education" rows={3} cols={40} defaultValue={resumeData.second_education}>
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
            <input className={styles.skills} type="text" id="skill_1" name="skill_1" defaultValue={resumeData.skill_1} />      
              <input className={styles.slider} type="range" id="slider_1" name="slider_1" min="0" max="100" step="1"defaultValue={resumeData.slider_1} />
              <input className={styles.skills} type="text" id="skill_2" name="skill_2" defaultValue={resumeData.skill_2} />      
              <input className={styles.slider} type="range" id="slider_2" name="slider_2" min="0" max="100" step="1"defaultValue={resumeData.slider_2} />

            </div>
            <div className={styles.sbox}>
            <input className={styles.skills} type="text" id="skill_3" name="skill_3" defaultValue={resumeData.skill_3} />      
<input className={styles.slider} type="range" id="slider_3" name="slider_3" min="0" max="100" step="1" defaultValue={resumeData.slider_3} />
<input className={styles.skills} type="text" id="skill_4" name="skill_4" defaultValue={resumeData.skill_4} />      
              <input className={styles.slider} type="range" id="slider_4" name="slider_4" min="0" max="100" step="1" defaultValue={resumeData.slider_4} />
            </div>


            <div className={styles.clearfix}></div>


          </div>




         <center> <Button shadow color="primary" auto  onClick={getFormValues}>Save</Button></center>


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
