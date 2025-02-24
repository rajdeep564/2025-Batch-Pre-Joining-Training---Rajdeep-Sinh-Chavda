import "bootstrap/dist/css/bootstrap.min.css"; 
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import ProfileCard from "./ProfileCard";
import Swal from "sweetalert2";
const ProfileForm = () => {

    const [passwordVisible, setPasswordVisible] = useState(false); 

    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };

    type ProfileFormValues = {
        firstName: string;
        lastName: string;
        email: string;
        phone: string; 
        dob: string; 
        gender?: "Male" | "Female" | "Other"; 
        country: string;
        hobbies: string[];
        skills: string[]; 
        bio: string;
        profilePic: string;
        password: string;

        terms: boolean; 
      }
      

      const defaultProfileValues: ProfileFormValues = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: "",
        gender: undefined, 
        country: "",
        hobbies: [],
        skills: [],
        bio: "",
        profilePic: "", 
        password: "",
        terms: false, 
      };

      const [profileData,setProfileData] = useState<ProfileFormValues>(defaultProfileValues);

      const formatPhoneNumber = (value: string): string => {
        
        const numbers = value.replace(/\D/g, "");
    
     
        if (numbers.length > 6) {
            return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
        } else if (numbers.length > 3) {
            return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
        } else {
            return numbers;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name , value , type} = e.target;
        setProfileData((prev)=>({
            ...prev,
            [name]: name === "phone" ? formatPhoneNumber(value) : type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }))
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedPhone = formatPhoneNumber(e.target.value);
        setProfileData((prev) => ({ ...prev, phone: formattedPhone }));
      };

      const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, options } = e.target;
        const selectedValues = Array.from(options)
          .filter((option) => option.selected)
          .map((option) => option.value);
    
          setProfileData((prev) => ({
          ...prev,
          [name]: selectedValues,
        }));
      };

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          setProfileData((prev) => ({
            ...prev,
            profilePic: URL.createObjectURL(file), 
          }));
        }
      };
      
      

      const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
      
        setProfileData((prev) => ({
          ...prev,
          skills: checked
            ? [...prev.skills, value] 
            : prev.skills.filter((skill) => skill !== value), 
        }));
      };
      

      

      console.log(profileData);

      const resetForm = () => {
        setProfileData(defaultProfileValues);
      };

      const [submittedProfile, setSubmittedProfile] = useState<ProfileFormValues | null>(null);
      
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
      
        const normalizedPhone = profileData.phone.replace(/[^0-9]/g, "");
      
        const birthDate = new Date(profileData.dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const isBirthdayPassed =
          today.getMonth() > birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
      
        const finalAge = isBirthdayPassed ? age : age - 1;
      
        const newErrors: { [key: string]: boolean } = {};
      
        if (!profileData.firstName) newErrors.firstName = true;
        if (!profileData.lastName) newErrors.lastName = true;
        if (!profileData.email) newErrors.email = true;
        if (!profileData.dob) newErrors.dob = true;
      
        if (isNaN(finalAge) || finalAge <= 12) newErrors.age = true;
      
        setErrors(newErrors);
      
        if (Object.keys(newErrors).length === 0) {
          setSubmittedProfile({
            ...profileData,
            phone: normalizedPhone,
            age: finalAge,
          });
      
          Swal.fire({
            icon: "success",
            title: "Profile Submitted!",
            text: "Your profile has been successfully submitted.",
            confirmButtonColor: "#6f42c1",
          });
      
        } else {
          Swal.fire({
            icon: "error",
            title: "Validation Failed!",
            text: isNaN(finalAge) || finalAge <= 12 
              ? "Age must be greater than 12 years!" 
              : "Please fill all required fields correctly.",
            confirmButtonColor: "#dc3545",
          });
        }
      };
      

      const [errors, setErrors] = useState({
        firstName: false,
        phone: false,
        password: false,
      });
    
      const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value, pattern } = e.target;
        const regex = new RegExp(pattern);
    
        setErrors({
          ...errors,
          [name]: !regex.test(value), 
        });
      };

      
      
    
      

  return (
    <div className="container mt-4 mb-4">
     
      <div className="card border-1 rounded-3 p-4">
    
        <h2
          className="text-center mb-3 text-primary"
          style={{ color: "#ced4da !important", fontWeight: "normal" }}
        >
          Profile Form
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="row g-2">
            
            <div className="col-md-6">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                className={`form-control ${errors.firstName ? "is-invalid" : profileData.firstName ? "is-valid" : ""}`}
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                aria-label="First name"
                pattern="^[A-Za-z]{2,}$"
                onInput={handleBlur}
                value={profileData.firstName}
                onChange={handleChange}
              />
            </div>
        
            <div className="col-md-6">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                className={`form-control ${errors.lastName ? "is-invalid" : profileData.lastName ? "is-valid" : ""}`}
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                aria-label="Last name"
                pattern="^[A-Za-z]{2,}$"
                onInput={handleBlur}
                value={profileData.lastName}
                onChange={handleChange}
              />
            </div>
            
            <div className="col-12">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="input-group">
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : profileData.email ? "is-valid" : ""}`}
                  id="email"
                  name="email"
                  placeholder="Your email address"
                  aria-label="Email"
                  value={profileData.email}
                onChange={handleChange}
                />
              </div>
            </div>
           
            <div className="col-12">
              <label htmlFor="phone" className="form-label">
                Phone Number <span className="text-muted">(Optional)</span>
              </label>
             
              <div className="input-group">
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? "is-invalid" : profileData.phone ? "is-valid" : ""}`}

                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  aria-label="Phone Number"
                value={profileData.phone}
                onChange={handlePhoneChange}
                />
              </div>
            </div>
       
            <div className="col-md-6">
              <label htmlFor="dob" className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                className={`form-control ${errors.dob ? "is-invalid" : profileData.dob ? "is-valid" : ""}`}
                id="dob"
                name="dob"
                aria-label="Date of Birth"
                value={profileData.dob}
                onChange={handleChange}
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <div className="d-flex gap-3">
                
                <div className="form-check">
                  <input
                    type="radio"
                    className={`form-check-input ${errors.gender ? "is-invalid" : profileData.gender ? "is-valid" : ""}`}
                    id="male"
                    name="gender"
                    value="Male"
                    aria-label="Male Gender"
                   
                    checked={profileData.gender === "Male"}
                    onChange={handleChange}
                  />
                  <label htmlFor="male" className="form-check-label">
                    Male
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className={`form-check-input ${errors.gender ? "is-invalid" : profileData.gender ? "is-valid" : ""}`}
                    id="female"
                    name="gender"
                    value="Female"
                    aria-label="Female Gender"
                 
                    checked={profileData.gender === "Female"}
                    onChange={handleChange}
                  />
                  <label htmlFor="female" className="form-check-label">
                    Female
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className={`form-check-input ${errors.gender ? "is-invalid" : profileData.gender ? "is-valid" : ""}`}

                    id="other"
                    name="gender"
                    value="Other"
                    aria-label="Other Gender"
                    
                    checked={profileData.gender === "Other"}
                    onChange={handleChange}
                  />
                  <label htmlFor="other" className="form-check-label">
                    Other
                  </label>
                </div>
              </div>
            </div>
           
            <div className="col-md-6">
              <label htmlFor="country" className="form-label">
                Country
              </label>
              <select
                className={`form-select rounded-2 ${errors.country ? "is-invalid" : profileData.country ? "is-valid" : ""}`}

                id="country"
                name="country"
                aria-label="Country selection"
              
                value={profileData.country}
                onChange={handleChange}
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
                <option value="Germany">Germany</option>
              
              </select>
            </div>
          
            <div className="col-md-6">
              <label htmlFor="hobbies" className="form-label">
                Hobbies
              </label>
             
              <select
                className={`form-select rounded-2 ${errors.hobbies ? "is-invalid" : profileData.hobbies.length ? "is-valid" : ""}`}

                id="hobbies"
                name="hobbies"
                multiple
                aria-label="Hobbies selection"
               
                value={profileData.hobbies}
                onChange={handleMultiSelect}
              >
                <option value="Reading">Reading</option>
                <option value="Gaming">Gaming</option>
                <option value="Traveling">Traveling</option>
                <option value="Sports">Sports</option>
                <option value="Music">Music</option>
                
              </select>
              <small className="form-text text-muted">
                Select multiple if you have more than one.
              </small>
            </div>
            
            <div className="col-12">
              <label className="form-label">Skills</label>
              <div className="d-flex flex-wrap gap-3">
                
                {[
                  "React",
                  "Node.js",
                  "JavaScript",
                  "Python",
                  "HTML",
                  "CSS",
                  "Bootstrap",
                  "SQL",
                ].map((skill) => (
                  <div key={skill} className="form-check">
                    <input
                      type="checkbox"
                      className={`form-check-input ${errors.skills ? "is-invalid" : profileData.skills.length ? "is-valid" : ""}`}

                      id={skill}
                      name={skill}
                      value={skill}
                      aria-label={`${skill} skill`}
                      
                      checked={profileData.skills.includes(skill)} 
                        onChange={handleSkillChange} 
                    />{" "}
                    
                    <label htmlFor={skill} className="form-check-label">
                      {skill}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-12">
              <label htmlFor="bio" className="form-label">
                Bio
              </label>
              <textarea
                className={`form-control rounded-2 ${errors.bio ? "is-invalid" : profileData.bio ? "is-valid" : ""}`}

                id="bio"
                name="bio"
                rows="3"
                placeholder="Tell us a bit about yourself..."
                aria-label="Bio"
                
                value={profileData.bio} 
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="col-12">
              <label htmlFor="profilePic" className="form-label">
                Profile Picture
              </label>
              <input
                type="file"
                className={`form-control rounded-2 ${errors.profilePic ? "is-invalid" : profileData.profilePic ? "is-valid" : ""}`}

                id="profilePic"
                name="profilePic"
                accept="image/*"
                aria-label="Profile Picture Upload"
                
                
                onChange={handleFileChange}
              />
              <small className="form-text text-muted">
                Optional, but a picture makes your profile stand out!
              </small>
            </div>
            
            <div className="col-md-12 ">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group"> 
                <input
                  type={passwordVisible ? "text" : "password"} 
                  className={`form-control rounded-2 ${errors.password ? "is-invalid" : profileData.password ? "is-valid" : ""}`}
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$"
                  id="password"
                  name="password"
                  placeholder="Choose a strong password"
                  aria-label="Password"
                  onChange={handleChange}
                  onInput={handleBlur}
                  required
                />
                 <div className="invalid-feedback">Password must be 8+ characters with at least 1 letter and 1 number.</div>
                <button
                  className="btn btn-outline-secondary rounded-2" 
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{ boxShadow: 'none' }} 
                  onFocus={(e) => e.target.style.boxShadow = 'none'} 
                  onBlur={(e) => e.target.style.boxShadow = 'none'}  
                >
                  <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} /> 
                </button>
              </div>
            </div>

           
            
            <div className="col-12">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="terms"
                  name="terms"
                  aria-label="Agree to terms and conditions"
                  style={{
                    borderColor: "#6f42c1",
                    boxShadow: "none",
                  }}
                  checked = {profileData.terms}
                  onChange={handleChange}
                />
                <label htmlFor="terms" className="form-check-label">
                  I agree to the
                  <a
                    href="#"
                    className="text-primary"
                    style={{ color: "#6f42c1 !important" }}
                  >
                    Terms & Conditions
                  </a>
                </label>
              </div>
            </div>
            <div className="col-12 mt-3">      
              <button
                type="submit"
                className="btn btn-primary w-100 rounded-2 py-2" 
                style={{
                  backgroundColor: "#6f42c1",
                  borderColor: "#6f42c1",
                  boxShadow: "none",
                  fontWeight: "normal",
                }} 
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#3d2b56";
                  e.target.style.borderColor = "#3d2b56";
                  e.target.style.boxShadow = "none";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#6f42c1";
                  e.target.style.borderColor = "#6f42c1";
                  e.target.style.boxShadow = "none";
                }} 
              >
                Submit
              </button>
              <div className="col-12 mt-3">
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Reset Form
                </button>
              </div>
              
            </div>


          </div>
        </form>

        {submittedProfile && (
        <div className="mt-4 col-12 d-flex justify-content-center">
          <ProfileCard profile={submittedProfile} />
        </div>
      )}
      </div>
    </div>

  );
};

export default ProfileForm;
