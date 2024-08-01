import React, { useEffect, useState } from 'react';
import styles from './videoEdit.module.scss';
import { VideosAPI } from '../../utils/api/api.js';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min.js';
import useTranslate from '../../utils/hooks/useTranslate.js';
import texts from './videoEdit.text.js';
import { Field, Form } from 'react-final-form';
import DateAndTimePickers from '../../widgets/DatePickers/';
import RenderTextInput from '../../Renderers/RenderTextInput.jsx';
import ReactPlayer from 'react-player';
import { Modal } from '@material-ui/core';

function VideoEditContainer() {
  const { videoId } = useParams();
  const [data, setData] = useState();
  const [formValues, setFormValues] = useState({});
  const [isLoading, setLoading] = useState(true);
  const { t } = useTranslate(texts);
  const [modalOpen, setModalOpen] = useState(false);
  const fetchVideo = async () => {
    try {
      const res = await VideosAPI.find(videoId);
      setData(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  const handleSubmit = (values) => {
    setFormValues(values);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <h1>{t('videoEdit')}</h1>
      {!isLoading && (
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
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
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
                url="https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8"
                width="40%"
                height={'40%'}
              />
              <Field
                name="url"
                label="Url"
                component={RenderTextInput}
                type="text"
                placeholder="Url"
              />
              <div className="buttons">
                <button type="submit" disabled={submitting}>
                  Submit
                </button>
              </div>
              {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
            </form>
          )}
        />
      )}
      <Modal open={modalOpen} onClose={closeModal}>
        <div style={{ width: '500px', height: '500px', zIndex: '999', background: 'white' }}>
          <pre>{JSON.stringify(formValues, 0, 2)}</pre>
          <button onClick={() => closeModal()}>Close</button>
        </div>
      </Modal>
    </div>
  );
}

export default VideoEditContainer;
