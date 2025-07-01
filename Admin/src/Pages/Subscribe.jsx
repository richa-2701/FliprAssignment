import React, { useEffect } from "react";
import { Table, Spin, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscriptions } from "../features/Contact & Subscription/c&sSlice.js";

const Subscibe = () => {
  // Dispatch function to dispatch actions to Redux store
  const dispatch = useDispatch();

  // Access subscriptions from Redux store state
  const { subscriptions, loading, error } = useSelector((state) => state.data);

  // Fetch subscriptions when the component mounts
  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  // Columns configuration for the table
  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
          <p>Loading subscriptions...</p>
        </div>
    );
  }

  // Show error message if there is any issue fetching data
  if (error) {
    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p style={{ color: "red" }}>Failed to load subscriptions. Please try again.</p>
        </div>
    );
  }

  // Map through the subscriptions data and create a dataSource for the table
  const dataSource = subscriptions.map((subscription) => ({
    key: subscription._id, // Assuming _id is available for unique keys
    email: subscription.email,
  }));

  return (
      <div>
        <h2>Subscriptions</h2>
        <Table dataSource={dataSource} columns={columns} />
      </div>
  );
};

export default Subscibe;
