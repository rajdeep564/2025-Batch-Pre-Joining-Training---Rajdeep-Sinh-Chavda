import React from "react";
import pfpimg from "../assets/profileimage.png";

interface ProfileCardProps {
  profile: {
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
    age :number
  };
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <div className="card border-1 rounded-3 p-3" style={{ maxWidth: "100%", boxShadow: "none", borderColor:"#513481"}}>
      {/* Profile Image & Name */}
      <div className="text-center">
        <img
          src={profile.profilePic || pfpimg}
          alt="Profile"
          className="rounded-circle border border-1"
          style={{
            width: "90px",
            height: "90px",
            objectFit: "cover",
            borderColor: "#a29bfe",
          }}
        />
        <h4 className="mt-2 fw-normal" style={{ fontSize: "1.1rem" }}>
          {profile.firstName} {profile.lastName}
        </h4>
        <p className="text-muted" style={{ fontSize: "0.85rem" }}>{profile.email}</p>
      </div>

      {/* Profile Details */}
      <div className="card-body pt-2 pb-1">
        <ProfileDetail label="Phone" value={profile.phone} />
        <ProfileDetail label="DOB" value={profile.dob} />
        {profile.age !== undefined && <ProfileDetail label="Age" value={profile.age + " years"}/>}
        <ProfileDetail label="Gender" value={profile.gender} />
        <ProfileDetail label="Country" value={profile.country} />
        <ProfileDetail label="Hobbies" value={profile.hobbies.length ? profile.hobbies.join(", ") : "None"} />
        <ProfileDetail label="Skills" value={profile.skills.length ? profile.skills.join(", ") : "None"} />
        <ProfileDetail label="Bio" value={profile.bio} />
      </div>
    </div>
  );
};

const ProfileDetail: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <p className="mb-1" style={{ fontSize: "0.9rem" }}>
    <span className="fw-bold">{label}:</span> <span className="text-muted">{value || "N/A"}</span>
  </p>
);

export default ProfileCard;
