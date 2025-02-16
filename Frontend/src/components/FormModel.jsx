/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Button, Divider, Form, Input, Modal, Select, Upload } from "antd";
import React from "react";

function FormModel({ open, onSubmit, setOpen }) {
  return (
    <div>
      <Modal open={open} footer={null} onCancel={() => setOpen(false)}>
        <Divider variant="dashed">Add individual Job</Divider>
        <Form onFinish={onSubmit}>
          <label>TaskName</label>
          <Form.Item
            name="TaskName"
            rules={[
              {
                required: true,
                message: "Please input your Task Name!",
              },
            ]}
          >
            <Input type="text"></Input>
          </Form.Item>
          <label>Task Description</label>
          <Form.Item
            name="TaskDescription"
            rules={[
              {
                required: true,
                message: "Please input your Task Description!",
              },
            ]}
          >
            <Input type="text"></Input>
          </Form.Item>
          <label>Type</label>
          <Form.Item
            name="Type"
            rules={[
              {
                required: true,
                message: "Please input your Task Type!",
              },
            ]}
          >
            <Input type="text"></Input>
          </Form.Item>
          <label>Task Status</label>
          <Form.Item
            name="status"
            rules={[
              {
                required: true,
                message: "Please select your Task Status!",
              },
            ]}
          >
            <Select>
              <Select.Option value="waiting">waiting</Select.Option>
              <Select.Option value="active">active</Select.Option>
              <Select.Option value="completed">completed</Select.Option>
              <Select.Option value="delayed">delayed</Select.Option>
              <Select.Option value="failed">failed</Select.Option>
            </Select>
          </Form.Item>
          <Button color="primary" variant="solid" htmlType="submit">
            Add
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default FormModel;
