import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.keyframe25}>
      <div className={styles.autoWrapper}>
        <div className={styles.aContainerReminder} />
        <div className={styles.aContainerDashboard} />
        <div className={styles.aContainerGantt} />
      </div>
      <div className={styles.autoWrapper2}>
        <div className={styles.aContainerDoc} />
        <div className={styles.input} />
        <div className={styles.aContainerWorkflow} />
      </div>
      <div className={styles.autoWrapper3}>
        <div className={styles.aContainerIm} />
        <div className={styles.aContainerTask} />
      </div>
    </div>
  );
}

export default Component;
