import React, { useEffect } from "react";
import { Table, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getClients, deleteClient } from "../features/Clients/clientSlice";

const ViewClients = () => {
  const dispatch = useDispatch();
  const { clients, loading } = useSelector((state) => state.clients);

  // Fetch clients on component mount
  useEffect(() => {
    dispatch(getClients())
        .unwrap()
        .catch((error) => message.error(`Failed to fetch clients: ${error}`));
  }, [dispatch]);

  // Handle client deletion
  const handleDelete = (id) => {
    dispatch(deleteClient(id))
        .unwrap()
        .then(() => {
          message.success("Client deleted successfully!");
          dispatch(getClients());
        })
        .catch((error) => message.error(`Failed to delete client: ${error}`));
  };

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "image",
      render: (text) => (
          <img
              src={text}
              alt="Client Avatar"
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
          <a
              onClick={() => handleDelete(record._id)}
              style={{ color: "red", cursor: "pointer" }}
          >
            Delete
          </a>
      ),
    },
  ];

  return (
      <div style={{ padding: "20px" }}>
        <h2>Client List</h2>
        <Table
            dataSource={clients} // Use data from Redux store
            columns={columns}
            rowKey={(record) => record._id} // Use a unique key for each row
            loading={loading} // Show loading spinner while data is being fetched
        />
      </div>
  );
};

export default ViewClients;
