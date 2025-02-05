import { useState } from "react";

import PropTypes from "prop-types";

const AddColumnModal = ({
  showAddColumnModal,
  setShowAddColumnModal,
  handleAddColumn,
}) => {
  const [columnName, setColumnName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddColumn(columnName);
    setColumnName("");
  };

  return (
    showAddColumnModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Add Column</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              placeholder="Column Name"
              className="border p-2 rounded-lg w-full mb-4"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Add Column
            </button>
            <button
              type="button"
              onClick={() => setShowAddColumnModal(false)}
              className="ml-2 bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    )
  );
};

AddColumnModal.propTypes = {
  showAddColumnModal: PropTypes.bool.isRequired,
  setShowAddColumnModal: PropTypes.func.isRequired,
  handleAddColumn: PropTypes.func.isRequired,
};

export default AddColumnModal;
