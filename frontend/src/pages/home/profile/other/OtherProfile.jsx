import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OtherProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [workexp, setWorkexp] = useState([]);
  const [qualification, setQualification] = useState([]);
  const [desc, setDesc] = useState("");
  const [interest, setInterest] = useState([]);
  const [skill, setSkill] = useState([]);
  const [post, setPost] = useState([]);

  useEffect(() => {
    const fetchUserAndDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userData = res.data;
        setUser(userData);

        const endpoint =
          userData.role === "Employee"
            ? `/workexperience/${userData.id}`
            : `/jobdetails/${userData.id}`;
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
          setDesc(des.data.exp?.description || "");
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
        <h3>HII {user.firstname.toUpperCase()},</h3>
        <div className="detailsBox">
          <img src="./avatar.png" className="profilePic" />
          <h2 className="name">
            {user.firstname} {user.lastname}
          </h2>
          <p className="email">{user.email}</p>
          <p className="role">{user.role}</p>
        </div>
      </div>

      <div className="info">
        <h3>Description</h3>
        <p>{desc}</p>

        <div className="infoRow">
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

        <div className="infoRow">
          <label>Posts</label>
          <div>
            {(post?.length ?? 0) === 0 ? (
              <div>
                <p>No Records Found</p>
              </div>
            ) : (
              (post ?? []).map((item, index) => (
                <div className="experienceCard" key={index}>
                  <h4>{item.name}</h4>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="infoRow">
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

        <div className="infoRow">
          <label>Skills</label>
          <div>
            {skill.map((item, i) => (
              <span key={i} className="skill-pill">
                {item.name}
              </span>
            ))}
          </div>
        </div>

        <div className="infoRow">
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

export default OtherProfile;
