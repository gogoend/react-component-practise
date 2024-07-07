import React, { useState } from "react";
import { Button, Input, Form } from "antd";
import { v4 as uuid } from "uuid";

const nodeFactory = (parent) => ({
  id: `${parent.id}/${uuid()}`,
  value: `${parent.value === "/" ? parent.value : parent.value + "/"}${
    (parent.children ?? []).length + 1
  }`,
  children: [],
});

// Node component
const TreeNode = ({ node, onChange, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(node.value);

  const handleInputChange = (e) => {
    setEditingState({
      ...node,
      value: e.target.value,
    });
  };

  const [editingState, setEditingState] = useState(null);
  const handleEdit = () => {
    setIsEditing(true);
    setEditingState({ ...node });
  };

  const handleSave = (values) => {
    setIsEditing(false);
    setEditingState(null);
    onChange({ ...node, value: values.value });
  };

  const addChildren = () => {
    const children = [...(node.children ?? [])];
    children.push(nodeFactory(node));
    onChange({ ...node, children });
  };

  const removeSelf = () => {
    onRemove();
  };

  const emptyChildren = () => {
    onChange({ ...node, children: [] });
  };

  return (
    <li>
      {isEditing ? (
        <Form
          initialValues={{ value: editingState.value }}
          onFinish={handleSave}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #ccc",
              alignItems: "center",
            }}
          >
            <Form.Item
              name="value"
              rules={[{ required: true, message: "Please enter a value" }]}
              style={{
                flex: 1,
              }}
            >
              <Input
                type="text"
                value={value}
                onChange={handleInputChange}
                autoFocus
              />
            </Form.Item>
            <div style={{ marginBottom: "24px" }}>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
              <Button
                htmlType="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingState(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Form>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #ccc",
            alignItems: "center",
          }}
        >
          {node.value}
          <span style={{ marginLeft: "2em" }}>
            {node.value !== "/" ? (
              <Button onClick={handleEdit}>Edit</Button>
            ) : null}
            <Button onClick={addChildren}>Add Children</Button>
            {node.value !== "/" ? (
              <Button onClick={removeSelf}>Remove Self</Button>
            ) : null}
            {node.children?.length ? (
              <Button onClick={emptyChildren}>Empty Children</Button>
            ) : null}
          </span>
        </div>
      )}
      {node.children &&
        node.children.map((child, index) => (
          <ul key={child.id}>
            <TreeNode
              node={child}
              onChange={(newNode) => {
                const updatedChildren = [...node.children];
                updatedChildren[index] = newNode;
                onChange({
                  ...node,
                  children: updatedChildren,
                });
              }}
              onRemove={() => {
                const updatedChildren = [...node.children].filter(
                  (it, i) => i !== index
                );
                onChange({
                  ...node,
                  children: updatedChildren,
                });
              }}
            />
          </ul>
        ))}
    </li>
  );
};

// Tree component
const Tree = ({ data }) => {
  const [tree, setTree] = useState(data);

  const handleNodeChange = (newNode) => {
    setTree(newNode);
  };

  return (
    <>
      <h2>Tree Editor</h2>
      <div style={{ display: "flex" }}>
        <ul style={{ flex: 1 }}>
          <TreeNode node={tree} onChange={handleNodeChange} />
        </ul>
        <pre style={{ width: '600px', overflow: 'auto' }}>{JSON.stringify(tree, "", 1)}</pre>
      </div>
    </>
  );
};

// Sample tree data
const treeData = {
  id: "95eec68e-6f94-4349-a4bd-196fd3b34409",
  value: "/",
  children: [
    {
      id: "95eec68e-6f94-4349-a4bd-196fd3b34409/fa91047f-8ec3-4c1c-a758-531988308a34",
      value: "/1",
      children: [
        { id: "95eec68e-6f94-4349-a4bd-196fd3b34409/fa91047f-8ec3-4c1c-a758-531988308a34/675469fd-c1c8-433a-9ea0-407ea2b8acc9", value: "/1/1" },
        { id: "95eec68e-6f94-4349-a4bd-196fd3b34409/fa91047f-8ec3-4c1c-a758-531988308a34/5361b0ae-b647-444c-8122-35dbfe25b144", value: "/1/2" },
      ],
    },
    {
      id: "95eec68e-6f94-4349-a4bd-196fd3b34409/34361a03-4b4c-4fa7-8834-f3b7474936e4",
      value: "/2",
      children: [
        { id: "95eec68e-6f94-4349-a4bd-196fd3b34409/34361a03-4b4c-4fa7-8834-f3b7474936e4/be4f6d10-16b8-41fb-80fa-cbd68a6b533b", value: "/2/1" },
        {
          id: "95eec68e-6f94-4349-a4bd-196fd3b34409/34361a03-4b4c-4fa7-8834-f3b7474936e4/47feed19-898a-4555-b845-38e4c4e7fbea",
          value: "/2/2",
          children: [{ id: "95eec68e-6f94-4349-a4bd-196fd3b34409/34361a03-4b4c-4fa7-8834-f3b7474936e4/47feed19-898a-4555-b845-38e4c4e7fbea/7125f541-09b0-48ac-9732-841caed13c49", value: "/2/2/1" }],
        },
      ],
    },
  ],
};

const TreeDemo = () => {
  return (
    <div>
      <Tree data={treeData} />
    </div>
  );
};

export default TreeDemo;
