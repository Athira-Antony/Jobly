import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getInterestedEmployees,
  getSelectedEmployeesForJob,
} from "../../../../../services/jobService";
import "./interestedemployees.css";
import { useUser } from "../../../../../contexts/userContext";
import socket from "../../../../../socket";
const InterestedEmployee = () => {
  const { id } = useParams();
  const [interestedEmployees, setInterestedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [accepted, setAccept] = useState([]);

  useEffect(() => {
    const fetchInterestedEmployees = async () => {
      try {
        const acc = await getSelectedEmployeesForJob(id, user.token);
        const acceptedIds = acc?.map((emp) => emp.id) || [];
        setAccept(acceptedIds);
        const res = await getInterestedEmployees(id, user.token);

        setInterestedEmployees(res || []);
      } catch (err) {
        console.error("Error fetching interested employees:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id && user?.token) fetchInterestedEmployees();
  }, [id, user]);

  useEffect(() => {
    console.log(interestedEmployees);
    const handleReplydToJob = ({ job_id, id: employee_id, message }) => {
      console.log("someone replyed to job", job_id, employee_id, message);
      // re render the tiles using the data got
    };
    socket.on("replyd_to_job", handleReplydToJob);

    return () => {
      socket.off("replyd_to_job", handleReplydToJob);
    };
  }, []);

  const handleAccept = (employeeId) => {
    if (!user || !user.id) {
      console.warn("User or user.is not available");
      return;
    }

    console.log("Accepted employee:", employeeId, "for job:", id);

    socket.emit("accept_job_request", {
      employerId: user._id,
      jobId: id,
      employeeId: employeeId,
    });
    setAccept((prev) => [...prev, employeeId]);
  };

  useEffect(() => {
    const replyJob = ({ job_id, message, employee }) => {
      console.log("notification received", job_id, message);
      console.log(employee);
      setInterestedEmployees((prev) => [employee, ...prev]);
    };
    socket.on("replyd_to_job", replyJob);

    return () => {
      socket.off("replyd_to_job", replyJob);
    };
  });
  return (
    <div className="interested-employee-page">
      <h2>Interested Employees for Job #{id}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : interestedEmployees.length === 0 ? (
        <p>No interested employees found.</p>
      ) : (
        <div className="employee-list">
          {interestedEmployees.map((emp) => (
            <div key={emp.id} className="employee-card">
              <img
                src={emp.image || "/boy.png"}
                alt="Employee"
                className="employee-avatar"
              />
              <div className="employee-info">
                <h3>
                  {emp.firstname} {emp.lastname}
                </h3>
                <p>Email: {emp.email}</p>
                <div className="action-buttons">
                  <button
                    className="accept-btn"
                    onClick={() => handleAccept(emp.id)}
                  >
                    {accepted.includes(emp.id) ? "Accepted" : "Accept"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterestedEmployee;
