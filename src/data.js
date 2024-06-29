import React from "react";
import { useParams } from "react-router-dom";

function DataPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Data Page</h1>
      <p>Displaying information for item with Sr No: {id}</p>
      {/* Add more detailed information here */}
    </div>
  );
}

export default DataPage;
