import React, { useState } from "react";

// Sample tree data
const treeData = {
  value: "/",
  children: [
    {
      value: "/1",
      children: [{ value: "/1/1" }, { value: "/1/2" }],
    },
    {
      value: "/2",
      children: [
        { value: "/2/1" },
        { value: "/2/2", children: [{ value: "/2/2/1" }] },
      ],
    },
  ],
};

const nodeFactory = (parent) => ({
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
    setValue(e.target.value);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onChange({ ...node, value });
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
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #ccc",
          }}
        >
          {node.value}
          <span style={{ marginLeft: "2em" }}>
            {node.value !== "/" ? (
              <button onClick={handleEdit}>Edit</button>
            ) : null}
            <button onClick={addChildren}>Add Children</button>
            {node.value !== "/" ? (
              <button onClick={removeSelf}>Remove Self</button>
            ) : null}
            {node.children?.length ? (
              <button onClick={emptyChildren}>Empty Children</button>
            ) : null}
          </span>
        </div>
      )}
      {node.children &&
        node.children.map((child, index) => (
          <ul key={index}>
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
        <ul>
          <TreeNode node={tree} onChange={handleNodeChange} />
        </ul>
        <pre>{JSON.stringify(tree, "", 1)}</pre>
      </div>
    </>
  );
};

// App component
const App = () => {
  return (
    <div>
      <Tree data={treeData} />
    </div>
  );
};

export default App;
