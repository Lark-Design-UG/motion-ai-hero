import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.desktopBlockCardSche}>
      <div className={styles.cardBackgroundColor}>
        <p className={styles.summaryOfH5Design}>⏰&nbsp;&nbsp;Risk reminder</p>
      </div>
      <div className={styles.frame2147229955}>
        <p className={styles.hiThereIsATaskDueTod}>
          Hi, there is a task due today. <br />
          Please complete it as soon as possible.
        </p>
        <div className={styles.frame}>
          <p className={styles.text}>Follow up now</p>
        </div>
      </div>
    </div>
  );
}

export default Component;
