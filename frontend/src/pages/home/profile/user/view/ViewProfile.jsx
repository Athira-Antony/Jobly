import React, { useEffect, useState } from "react";
import "./viewprofile.css";
import axios from "axios";
import { useUser } from "../../../../../contexts/userContext";
import { useNavigate } from "react-router-dom";

const ViewProfile = () => {
  // const [user, setUser] = useState(null);
  const [workexp, setWorkexp] = useState([]);
  const [qualification, setQualification] = useState([]);
  const [interest, setInterest] = useState([]);
  const [skill, setSkill] = useState([]);
  const [desc, setDesc] = useState("");
  const [post, setPost] = useState([]);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate("/home/profile/user/edit");
  };

  useEffect(() => {
    const fetchUserAndDetails = async () => {
      try {
        const token = user.token;
        console.log(user);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userData = res.data;
        console.log(userData);
        console.log(user);
        setUser((prevUser) => ({ ...prevUser, ...userData }));

        const endpoint =
          user.role === "Employee"
            ? `/workexperience/${user.id}`
            : `/jobdetails/${user.id}`;
        const link = `${import.meta.env.VITE_API_URL}/api/metadata${endpoint}`;

        try {
          const exp = await axios.get(link, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setWorkexp(exp.data.exp);
        } catch (err) {
          console.error(
            "Error fetching work experience:",
            err.response?.data || err.message
          );
        }

        try {
          const des = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/metadata/description/${
              userData.id
            }`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log(des.data);
          setDesc(des.data.exp?.[0]?.description || "");
        } catch (err) {
          console.error(
            "Error fetching description:",
            err.response?.data || err.message
          );
        }

        try {
          const quaRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/metadata/qualification/${
              userData.id
            }`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("quaRes.data:", quaRes.data);

          setQualification(quaRes.data.qualifications);
        } catch (err) {
          console.error(
            "Error fetching qualification:",
            err.response?.data || err.message
          );
        }

        try {
          const intRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/metadata/interest/${
              userData.id
            }`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setInterest(intRes.data.interests);
        } catch (err) {
          console.error(
            "Error fetching interest:",
            err.response?.data || err.message
          );
        }

        try {
          const skillRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/metadata/skill/${userData.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("skillRes.data:", skillRes.data);
          setSkill(skillRes.data.skills);
        } catch (err) {
          console.error(
            "Error fetching skill:",
            err.response?.data || err.message
          );
        }

        try {
          const postRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/post/user/${userData.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("postRes.data:", postRes.data);
          setPost(postRes.data);
        } catch (err) {
          console.error(
            "Error fetching post:",
            err.response?.data || err.message
          );
        }
      } catch (err) {
        console.error(
          "Error fetching user profile:",
          err.response?.data || err.message
        );
      }
    };

    fetchUserAndDetails();
  }, []);

  if (!user) return <p>Loading user profile...</p>;

  return (
    <div className="outerbox">
      <div className="innerbox">
        <h3>Hi! {user.firstname.toUpperCase()},</h3>

        <div className="detailsBox">
          <img
            src={user?.image ? user.image : "/girl.png"}
            alt="Profile"
            className="profile-image"
          />

          <h2 className="name">
            {user.firstname} {user.lastname}
          </h2>
          <p className="email">{user.email}</p>
          <p className="role">{user.role}</p>
          <button onClick={() => handleEdit()}>✏️</button>
        </div>
      </div>

      <div className="infoRow grid-row">
        <h3>Description</h3>
        <p>{desc}</p>

        <div className="infoRow grid-card">
          <label>Graduation</label>
          <div>
            {(qualification?.length ?? 0) === 0 ? (
              <div>
                <p>No Records Found</p>
              </div>
            ) : (
              (qualification ?? []).map((item, index) => (
                <div className="experienceCard" key={index}>
                  <h4>{item.name}</h4>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="infoRow grid-card">
          <label>Posts</label>
          <div>
            {(post?.length ?? 0) === 0 ? (
              <div>
                <p>No Records Found</p>
              </div>
            ) : (
              post.map((item, index) => (
                <div className="experienceCard" key={index}>
                  <h4>{item.blog || "Untitled Post"}</h4>
                  <p>
                    {item.blog?.substring(0, 100) || "No content available."}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="infoRow grid-card">
          <label>Experience</label>
          <h3>
            {user?.role === "Employee" ? "Work Experience" : "Job Details"}
          </h3>
          {(workexp?.length ?? 0) === 0 ? (
            <div>
              <p>No records available.</p>
            </div>
          ) : (
            (workexp || [])?.map((item, index) => (
              <div key={index}>
                <h3>{item.designation || "designation not specified"}</h3>
                <h4>{item.company_name || "company name not specified"}</h4>
                <h4>{item.location || "location not specified"}</h4>
                {item.start_date && (
                  <>
                    <h4>{item.start_date}</h4>
                    <h4>{item.end_date || "Currently Working"}</h4>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        <div className="infoRow grid-card">
          <label>Skills</label>
          <div>
            {skill.map((item, i) => (
              <span key={i} className="skill-pill">
                {item.name}
              </span>
            ))}
          </div>
        </div>

        <div className="infoRow grid-card">
          <label>Interests</label>
          <div>
            {interest.map((item, i) => (
              <span key={i} className="skill-pill">
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
