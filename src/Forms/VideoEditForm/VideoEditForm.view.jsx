import React from 'react';
import { PrimaryButton } from '../../widgets/Buttons/Buttons.jsx';
import { Field, Form } from 'react-final-form';
import ReactPlayer from 'react-player';
import styles from './videoEditForm.module.scss';
import RenderTextInput from '../../Renderers/RenderTextInput';
import DateAndTimePickers from '../../Renderers/RenderDateTimePickers.jsx';
import { Button, Modal } from '@material-ui/core';

function VideoEditModal({ modalOpen, closeModal, value }) {
  return (
    <Modal open={modalOpen} onClose={closeModal} className={styles.modalContainer}>
      <div className={styles.modal}>
        <Button className={styles.closeButton} onClick={() => closeModal()}>
          Close
        </Button>
        <pre className={styles.modalOverflow}>{JSON.stringify(value, 0, 2)}</pre>
      </div>
    </Modal>
  );
}

function VideoEditFormView({ handleSubmit, data, modalOpen, closeModal, formValues }) {
  return (
    <>
      <Form
        onSubmit={handleSubmit}
        initialValues={{
          name: data.name,
          description: data.description,
          publicationDate: data.publicationDate,
          visibility: data.visibility,
          url: data.url,
        }}
        render={({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit} className={styles.container}>
            <Field
              name="name"
              label="Name"
              component={RenderTextInput}
              type="text"
              placeholder="Name"
            />
            <Field
              name="description"
              label="Description"
              component={RenderTextInput}
              type="text"
              placeholder="Description"
            />
            <Field
              label="Publication Date"
              name="publicationDate"
              component={DateAndTimePickers}
              type="date"
              disabled
            />
            <Field
              name="poster"
              label="Poster"
              component={RenderTextInput}
              type="text"
              placeholder="Poster"
            />
            <div>
              <label>Visibility</label>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label>
                  <Field name="visibility" component="input" type="radio" value="public" />
                  Public
                </label>
                <label>
                  <Field name="visibility" component="input" type="radio" value="private" />
                  Private
                </label>
              </div>
            </div>
            <ReactPlayer
              className={styles.player}
              url="https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8"
              width="90%"
              height="1900%"
            />
            <Field
              name="url"
              label="Url"
              component={RenderTextInput}
              type="text"
              placeholder="Url"
            />
            <div className="buttons">
              <PrimaryButton type="submit" disabled={submitting}>
                Submit
              </PrimaryButton>
            </div>
          </form>
        )}
      />
      <VideoEditModal closeModal={closeModal} modalOpen={modalOpen} value={formValues} />
    </>
  );
}

export default VideoEditFormView;
