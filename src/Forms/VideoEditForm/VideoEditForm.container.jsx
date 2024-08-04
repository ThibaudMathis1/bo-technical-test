import React from 'react';
import { useState } from 'react';
import VideoEditFormView from './VideoEditForm.view.jsx';

function VideoEditFormContainer({ data }) {
  const [formValues, setFormValues] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = (values) => {
    setFormValues(values);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <VideoEditFormView
        handleSubmit={handleSubmit}
        closeModal={closeModal}
        data={data}
        formValues={formValues}
        modalOpen={modalOpen}
      />
    </>
  );
}

export default VideoEditFormContainer;
