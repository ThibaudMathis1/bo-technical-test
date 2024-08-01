import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './videos.module.scss';
import { Virtuoso } from 'react-virtuoso';

const CustomHeader = () => {
  return (
    <tr className={styles.customHeader}>
      <tr>Nom</tr>
      <tr>Status</tr>
      <tr>Date de publication</tr>
    </tr>
  );
};

const CustomRow = ({ name, status, publicationDate, onClick }) => {
  return (
    <tr className={styles.customRow} onClick={onClick}>
      <tr>{name}</tr>
      <tr>{status}</tr>
      <tr>{publicationDate}</tr>
    </tr>
  );
};

const VideosView = ({ rows, loadMore }) => {
  const history = useHistory();
  return (
    <div style={{ height: 400, width: '900px' }}>
      <CustomHeader />
      <Virtuoso
        data={rows}
        endReached={loadMore}
        itemContent={(index, row) => (
          <CustomRow
            name={row.name}
            status={row.status}
            publicationDate={row.publicationDate}
            onClick={() => history.push(`/videos/${row.id}`)}
          />
        )}
      />
    </div>
  );
};

export default VideosView;
