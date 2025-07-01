import React, { useEffect } from "react";
import { Table, Spin, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../features/Contact & Subscription/c&sSlice.js";

const Contact = () => {
  // Dispatch function to dispatch actions to Redux store
  const dispatch = useDispatch();

  // Access contacts from Redux store state
  const { contacts, loading, error } = useSelector((state) => state.data);

  // Fetch contacts when the component mounts
  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  // Columns configuration for the table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
  ];

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
          <p>Loading contacts...</p>
        </div>
    );
  }

  // Show error message if there is any issue fetching data
  if (error) {
    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p style={{ color: "red" }}>Failed to load contacts. Please try again.</p>
        </div>
    );
  }

  // Map through the contacts data and create a dataSource for the table
  const dataSource = contacts.map((contact) => ({
    key: contact._id,  // Assuming _id is available for unique keys
    name: contact.name,
    email: contact.email,
    mobile: contact.mobile,
    city: contact.city,
  }));

  return (
      <div>
        <h2>Contact List</h2>
        <Table dataSource={dataSource} columns={columns} />
      </div>
  );
};

export default Contact;
