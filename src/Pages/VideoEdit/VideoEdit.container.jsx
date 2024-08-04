import React, { useEffect, useState } from 'react';
import styles from './videoEdit.module.scss';
import { VideosAPI } from '../../utils/api/api.js';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min.js';
import useTranslate from '../../utils/hooks/useTranslate.js';
import texts from './videoEdit.text.js';
import VideoEditView from './VideoEdit.view.jsx';

function VideoEditContainer() {
  const { videoId } = useParams();
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(true);
  const { t } = useTranslate(texts);

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

  return (
    <div className={styles.container}>
      <h1>{t('videoEdit')}</h1>
      <VideoEditView data={data} isLoading={isLoading} />
    </div>
  );
}

export default VideoEditContainer;
