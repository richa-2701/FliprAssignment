import React, { useState, useCallback } from "react";
import { Form, Input, Button, Upload, message, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/getCroppedImg.js";
import { useDispatch } from "react-redux";
import { createNewProject } from "../features/Projects/projectSlice.js";

const AddProject = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

  const aspect = 450 / 350; // Crop aspect ratio

  // Handle image selection
  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setCropModalVisible(true);
      };
      reader.readAsDataURL(file);
    } else {
      setImageSrc(null);
    }
  };

  // Handle crop completion
  const onCropComplete = useCallback(
      async (_, croppedAreaPixels) => {
        try {
          const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
          setCroppedImage(croppedBlob);
        } catch (error) {
          console.error("Error cropping the image: ", error);
        }
      },
      [imageSrc]
  );

  // Handle crop confirmation
  const handleCropDone = () => {
    if (!croppedImage) {
      message.warning("Please crop the image before proceeding!");
      return;
    }
    setCropModalVisible(false); // Close crop modal
    message.success("Image cropped successfully!");
  };

  // Submit the form data
  const handleSubmit = (values) => {
    if (!croppedImage) {
      message.error("Please crop the image before submitting the form!");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);

    // Convert Blob to File if necessary (e.g., for proper form submission)
    const file = new File([croppedImage], "cropped-image.jpg", { type: "image/jpeg" });
    formData.append("image", file);

    setLoading(true);

    dispatch(createNewProject(formData))
        .unwrap()
        .then(() => {
          message.success("Project created successfully!");
          form.resetFields();
          setCroppedImage(null);
          setImageSrc(null);
          window.location.reload();
        })
        .catch((error) => {
          message.error(`Error creating project: ${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
  };

  return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
        <h2>Create Project</h2>
        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item
              label="Project Name"
              name="name"
              rules={[{ required: true, message: "Please enter the project name" }]}
          >
            <Input placeholder="Enter project name" />
          </Form.Item>

          <Form.Item
              label="Project Description"
              name="description"
              rules={[{ required: true, message: "Please enter the project description" }]}
          >
            <Input.TextArea placeholder="Enter description" rows={4} />
          </Form.Item>

          <Form.Item
              label="Upload Image"
              name="image"
              rules={[{ required: true, message: "Please upload an image" }]}
          >
            <Upload
                listType="picture"
                fileList={fileList}
                beforeUpload={() => false}
                onChange={handleImageChange}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>

          {croppedImage && (
              <div style={{ marginBottom: "20px", textAlign: "center" }}>
                <img
                    src={URL.createObjectURL(croppedImage)}
                    alt="Cropped Preview"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Form.Item>
        </Form>

        {/* Cropping Modal */}
        <Modal
            open={cropModalVisible}
            onCancel={() => setCropModalVisible(false)}
            title="Crop Image"
            footer={[
              <Button key="cancel" onClick={() => setCropModalVisible(false)}>
                Cancel
              </Button>,
              <Button key="ok" type="primary" onClick={handleCropDone}>
                Done
              </Button>,
            ]}
        >
          {imageSrc && (
              <div style={{ position: "relative", width: "100%", height: 400 }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
              </div>
          )}
        </Modal>
      </div>
  );
};

export default AddProject;
