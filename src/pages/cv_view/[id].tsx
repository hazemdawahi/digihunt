import React, { useEffect, useState } from 'react';
import styles from '../../styles/cv.module.css';
import { Button } from "@nextui-org/react";
import Swal from 'sweetalert2';
import { GetServerSideProps } from 'next';

function CVview({resume}) {
 


  return (    

  <><div className={styles.myclass}>
      <div className={styles.my_id}>


        <div className={styles.resumebox}>

          <div className={styles.leftsection}>

            <div className={styles.profile}>
              <img src={resume.image} className={styles.profileimg} />
              <div className={styles.bluebox}></div>
            </div>
            <h2 className={styles.name}>{resume.firstname} <br /><span>{resume.lastname}</span></h2>
            <p className={styles.np}><input className={styles.fname} type="text" id="job" name="job" defaultValue={resume.job} /></p>


            <div className={styles.info}>
              <p className={styles.heading}>Info</p>
              <p className={styles.p1}><span className={styles.span1}><img src="../image/location.png" /></span>Country<span> <br /><input className={styles.fname} type="text" id="country" name="contry" defaultValue={resume.country}/></span></p>
              <p className={styles.p1}><span className={styles.span1}><img src="../image/call.png" /></span>Phone<span> <br /><input className={styles.fname} type="text" id="phone" name="phone"defaultValue={resume.phone} /></span></p>
              <p className={styles.p1}><span className={styles.span1}><img src="../image/mail.png" /></span>Email<span> <br /><input className={styles.fname} type="text" id="email" name="email"  defaultValue={resume.email}/></span></p>
              <p className={styles.p1}><span className={styles.span1}><img src="../image/domain.png" /></span>Website<span> <br /><input className={styles.fname} type="text" id="website" name="website" defaultValue={resume.website} /></span></p>
            </div>

            <div className={styles.info}>
              <p className={styles.heading}>Social</p>
              <p className={styles.p1}><span className={styles.span1}><img src="../image/skype.png" /></span>Skype<span> <br /><input className={styles.fname} type="text" id="skype" name="skype" defaultValue={resume.skype} /></span></p>
              <p className={styles.p1}><span className={styles.span1}><img src="../image/twitter.png" /></span>Twitter<span> <br /><input className={styles.fname} type="text" id="twitter" name="twitter" defaultValue={resume.twitter} /></span></p>
              <p className={styles.p1}><span className={styles.span1}><img src="../image/linkedin.png" /></span>Linkdin<span> <br /><input className={styles.fname} type="text" id="linkedin" name="linkedin" defaultValue={resume.linkedin} /></span></p>
              <p className={styles.p1}><span className={styles.span1}><img src="../image/facebook.png" /></span>Facebook<span> <br /><input className={styles.fname} type="text" id="facebook" name="facebook" defaultValue={resume.facebook}/></span></p>
            </div>

          </div>

          <div className={styles.rightsection}>
            <div className={styles.rightheading}>
              <img src="../image/user.png" />
              <p className={styles.p2}>Profile</p>
            </div>
            <textarea className={styles.textarea} id="profile" name="profile" rows={3} cols={40} defaultValue={resume.profile}/>

            <div className={styles.clearfix}></div>
            <br />
            <div className={styles.rightheading}>
              <img src="../image/pencil.png" />
              <p className={styles.p2}>Work Experience</p>
            </div>
            <div className={styles.clearfix}></div>
            <div className={styles.lrbox}>
              <div className={styles.left}>
              <input className={styles.date} type="text" id="first_date_start" name="first_date_start" defaultValue={resume.first_date_start} /> -           
                 <input className={styles.date} type="text" id="first_date_end" name="first_date_end" defaultValue={resume.first_date_end} />      
     
                <input className={styles.company_loc} type="text" id="first_loc" name="first_loc" defaultValue={resume.first_loc} />      
                        </div>

              <div className={styles.right}>
              <input className={styles.work} type="text" id="first_company_work" name="first_company_work"defaultValue={resume.first_company_work} />      
                <input className={styles.company_loc} type="text" id="first_company_name" name="first_company_name" defaultValue={resume.first_company_name} />      
                <textarea className={styles.textarea} id="first_work" name="first_work" rows={3} cols={40} defaultValue={resume.first_work}>
                </textarea>
              </div>
              <div className={styles.clearfix}></div>
            </div>

            <div className={styles.lrbox}>
              <div className={styles.left}>
              <input className={styles.date} type="text" id="second_date_start" name="second_date_start"  defaultValue={resume.second_date_start}/> -           
                 <input className={styles.date} type="text" id="second_date_end" name="second_date_end" defaultValue={resume.second_date_end} />            
                         <input className={styles.company_loc} type="text" id="second_loc" name="second_loc" defaultValue={resume.second_loc}/>      
              </div>

              <div className={styles.right}>
              <input className={styles.work} type="text" id="second_company_work" name="second_company_work" defaultValue={resume.second_company_work}/>      
                <input className={styles.company_loc} type="text" id="second_company_name" name="second_company_name" defaultValue={resume.second_company_name} />      
                <textarea className={styles.textarea} id="second_work" name="second_work" rows={3} cols={40} defaultValue={resume.second_work}>
                </textarea>              </div>
              <div className={styles.clearfix}></div>
            </div>

            <div className={styles.lrbox}>
              <div className={styles.left}>
              <input className={styles.date} type="text" id="thrid_date_start" name="thrid_date_start"defaultValue={resume.third_date_start} /> -           
                 <input className={styles.date} type="text" id="third_date_end" name="third_date_end" defaultValue={resume.third_date_end}/>    
                               <input className={styles.company_loc} type="text" id="third_loc" name="third_loc"  defaultValue={resume.third_loc}/>      
              </div>

              <div className={styles.right}>
              <input className={styles.work} type="text" id="third_company_work" name="third_company_work" defaultValue={resume.third_company_work} />      
                <input className={styles.company_loc} type="text" id="third_company_name" name="third_company_name" defaultValue={resume.third_company_name}/>      
                <textarea className={styles.textarea} id="third_work" name="third_work" rows={3} cols={40} defaultValue={resume.third_work}>
                </textarea>                  </div>
              <div className={styles.clearfix}></div>
            </div>


            <br />
            <div className={styles.rightheading}>
              <img src="../image/edu.png" />
              <p className={styles.p2}>Education</p>
            </div>
            <div className={styles.clearfix}></div>
            <div className={styles.lrbox}>
              <div className={styles.left}>
              <input className={styles.date} type="text" id="first_date_start_edu" name="first_date_start_edu" defaultValue={resume.first_date_start_edu} /> -           
                 <input className={styles.date} type="text" id="first_date_end_edu" name="first_date_end_edu"defaultValue={resume.first_date_end_edu} />              
                     <input className={styles.company_loc} type="text" id="first_edu_loc" name="first_edu_loc" defaultValue={resume.first_edu_loc}/>      
              </div>

              <div className={styles.right}>
              <input className={styles.work} type="text" id="first_edu" name="first_edu" defaultValue={resume.first_edu}  />      
                <textarea className={styles.textarea} id="first_education" name="first_education" rows={3} cols={40} defaultValue={resume.first_education}>
                </textarea>                      </div>
              <div className={styles.clearfix}></div>
            </div>

            <div className={styles.lrbox}>
              <div className={styles.left}>
              <input className={styles.date} type="text" id="second_date_start_edu" name="second_date_start_edu" defaultValue={resume.second_date_start_edu} /> -           
                 <input className={styles.date} type="text" id="second_date_end_edu" name="second_date_end_edu" defaultValue={resume.second_date_end_edu}/>                  <input className={styles.company_loc} type="text" id="second_edu" name="second_edu" />      
              </div>

              <div className={styles.right}>
              <input className={styles.work} type="text" id="second_edu" name="second_edu" defaultValue={resume.second_edu}/>      
                <textarea className={styles.textarea} id="second_education" name="second_education" rows={3} cols={40} defaultValue={resume.second_education}>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry
                </textarea>                      </div>
              <div className={styles.clearfix}></div>
            </div>

            <br />
            <div className={styles.rightheading}>
              <img src="../image/edu.png" />
              <p className={styles.p2}>Skill and expertize</p>
            </div>
            <div className={styles.clearfix}></div>
            <div className={styles.sbox}>
            <input className={styles.skills} type="text" id="skill_1" name="skill_1" defaultValue={resume.skill_1} />      
              <input className={styles.slider} type="range" id="slider_1" name="slider_1" min="0" max="100" step="1"defaultValue={resume.slider_1} />
              <input className={styles.skills} type="text" id="skill_2" name="skill_2" defaultValue={resume.skill_2} />      
              <input className={styles.slider} type="range" id="slider_2" name="slider_2" min="0" max="100" step="1"defaultValue={resume.slider_2} />

            </div>
            <div className={styles.sbox}>
            <input className={styles.skills} type="text" id="skill_3" name="skill_3" defaultValue={resume.skill_3} />      
<input className={styles.slider} type="range" id="slider_3" name="slider_3" min="0" max="100" step="1" defaultValue={resume.slider_3} />
<input className={styles.skills} type="text" id="skill_4" name="skill_4" defaultValue={resume.skill_4} />      
              <input className={styles.slider} type="range" id="slider_4" name="slider_4" min="0" max="100" step="1" defaultValue={resume.slider_4} />
            </div>


            <div className={styles.clearfix}></div>


          </div>






        </div>
      </div>
      
    </div></>


);

  }
export default CVview;
export const getServerSideProps: GetServerSideProps = async (context) => {
    const userId = context.params.id
    const res = await fetch(`http://localhost:3000/api/auth/getcv/?id=${userId}`)
  
    // If the API route returns a 404 (Not Found), redirect to a 404 page
    if (res.status === 404) {
      return { notFound: true }
    }
  
    const resume = await res.json()
  
    return {
      props: { resume }
    }
  }
  