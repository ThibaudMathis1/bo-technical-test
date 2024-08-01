import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dropzone from 'react-dropzone';
import PdfViewer from '../PdfViewer';

import styles from './dropzone.module.scss';

const Preview = ({ value, fileType = '', style, height }) => {
  if (fileType.toLowerCase().includes('pdf')) {
    return <PdfViewer file={value} height={height} />;
  } else {
    return <img src={value} alt="news" style={style} />;
  }
};

function DropzoneView({ files, addFile, inputMessage, fileType, height, width, value, progress }) {
  const thumbsContainer = {
    width: width || '400px',
    height: height || '600px',
    objectFit: 'contain',
    objectPosition: 'center',
    cursor: 'pointer',
    color: 'rgba(0, 0, 0, 0.23)',
  };

  const dropzoneStyle = {
    ...thumbsContainer,
    border: value ? 'none' : '1px dashed rgba(0, 0, 0, 0.23)',
  };

  const onDrop = (accepted, rejected) => {
    if (Object.keys(rejected).length === 0) {
      addFile(accepted);
      // eslint-disable-next-line no-unused-vars
      const blobPromise = new Promise((resolve, reject) => {
        const reader = new window.FileReader();
        reader.readAsDataURL(accepted[0]);
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
        };
      });
      blobPromise.then(() => {});
    }
  };

  return (
    <div>
      <Dropzone
        multiple={false}
        accept={fileType}
        onDrop={(accepted, rejected) => onDrop(accepted, rejected)}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} style={dropzoneStyle}>
            <input {...getInputProps()} />
            {Object.keys(files).length !== 0 ? (
              files.map((file, i) => {
                const isPdf = fileType === 'application/pdf';
                if (isPdf) {
                  return <PdfViewer key={i} file={file} style={thumbsContainer} />;
                } else {
                  return (
                    <img
                      key={i}
                      style={thumbsContainer}
                      src={value ? value : file.preview}
                      alt="profile"
                    />
                  );
                }
              })
            ) : (
              <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
                {!!value ? (
                  <Preview
                    style={thumbsContainer}
                    value={value}
                    fileType={fileType}
                    height={height}
                  />
                ) : (
                  <>{inputMessage ? inputMessage : 'click or drop your file here'}</>
                )}
              </div>
            )}
          </div>
        )}
      </Dropzone>
      <div className={styles.progressWrapper}>
        {progress?.isUploading && (
          <>
            <LinearProgress
              variant="determinate"
              value={progress?.percent || 0}
              className={styles.progressBar}
            />
            <span className={styles.progressPct}>{`${progress?.percent || 0} %`}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default DropzoneView;
