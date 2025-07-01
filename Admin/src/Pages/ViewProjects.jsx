import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, message, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, removeProject } from "../features/Projects/projectSlice.js";

const { Meta } = Card;

const ViewProjects = () => {
    const dispatch = useDispatch();
    const { projects, loading, error } = useSelector((state) => state.projects);

    // State to track loading status of delete buttons
    const [deletingProject, setDeletingProject] = useState(null);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    // Handle delete action
    const handleDelete = async (id) => {
        setDeletingProject(id); // Set the project ID being deleted
        try {
            await dispatch(removeProject(id));
            message.success("Project deleted successfully!");
            window.location.reload();
        } catch (err) {
            message.error("Failed to delete project. Please try again.");
        } finally {
            setDeletingProject(null); // Reset the loading state
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
                <p>Loading Projects...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <p style={{ color: "red" }}>Failed to load projects. Please try again.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Projects</h2>
            <Row gutter={[16, 16]} justify="space-around">
                {projects.map((project) => (
                    <Col key={project._id} xs={24} sm={12} md={8} lg={6}>
                        <Card
                            hoverable
                            cover={<img alt={project.name} src={project.imageUrl} />}
                            actions={[
                                <Button
                                    type="danger"
                                    loading={deletingProject === project._id} // Show loading spinner
                                    onClick={() => handleDelete(project._id)}
                                    className="delete-btn"
                                >
                                    {deletingProject === project._id ? "Deleting..." : "Delete"}
                                </Button>,
                            ]}
                            className="card-style card-hover"
                        >
                            <Meta
                                title={<span style={{ fontSize: "18px", fontWeight: "bold" }}>{project.name}</span>}
                                description={
                                    <span style={{ color: "#555" }}>
                                        {project.description.length > 100
                                            ? project.description.substring(0, 100) + "..."
                                            : project.description}
                                    </span>
                                }
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ViewProjects;
