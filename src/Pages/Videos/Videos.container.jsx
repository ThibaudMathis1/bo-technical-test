import React from 'react';
import useTranslate from '../../utils/hooks/useTranslate';

import texts from './videos.text';
import styles from './videos.module.scss';
import useLazy from '../../utils/hooks/useLazy.js';
import { VideosAPI } from '../../utils/api/api.js';
import VideosView from './Videos.view.jsx';

function Videos() {
  const { t } = useTranslate(texts);
  const { isLoading, data, fetchMoreData } = useLazy(VideosAPI, 10, VideosAPI, {}, []);

  return (
    <div className={styles.container}>
      <h1>{t('videos')}</h1>
      {!isLoading ? (
        <VideosView rows={data} loadMore={fetchMoreData} isLoading={isLoading} />
      ) : (
        <h1>{t('loading')}</h1>
      )}
    </div>
  );
}

export default Videos;
