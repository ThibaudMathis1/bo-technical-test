import React from 'react';
import VideoEditForm from '../../Forms/VideoEditForm/index.js';
import { CircularProgress } from '@material-ui/core';

function VideoEditView({ isLoading, data }) {
  return <>{!isLoading ? <VideoEditForm data={data} /> : <CircularProgress />}</>;
}

export default VideoEditView;
