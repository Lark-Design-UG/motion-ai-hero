import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.keyframe3}>
      <div className={styles.autoWrapper}>
        <div className={styles.aContainerReminder} />
        <div className={styles.aContainerDashboard} />
        <div className={styles.aContainerGantt} />
      </div>
      <div className={styles.autoWrapper6}>
        <div className={styles.autoWrapper2}>
          <div className={styles.aContainerDoc} />
          <div className={styles.aContainerIm} />
        </div>
        <div className={styles.autoWrapper5}>
          <div className={styles.autoWrapper3}>
            <div className={styles.input} />
            <div className={styles.aContainerWorkflow} />
          </div>
          <div className={styles.autoWrapper4}>
            <div className={styles.aContainerTask} />
            <div className={styles.aContainerFlow} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
