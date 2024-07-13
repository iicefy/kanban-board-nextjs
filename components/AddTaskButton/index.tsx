"use client";

const AddTaskButton = () => {
  function addColumn() {
    console.log("Add Column");
  }

  return (
    <div
      className="bg-white rounded-lg p-4 shadow-md min-w-80 cursor-pointer h-24 flex items-center"
      onClick={addColumn}
    >
      <h2 className="text-xl font-semibold">Add Column</h2>
    </div>
  );
};

export default AddTaskButton;
