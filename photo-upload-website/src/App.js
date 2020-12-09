import React from "react";
import FilePreview from "./components/FilesPreview";
import FileUpload from "./components/FileUpload";

export default () => (
  <div>
    <h1>Welcome to this S3 file upload boi!</h1>
    <FileUpload/>
      <FilePreview/>
  </div>
);
