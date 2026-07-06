import React from 'react';
import { SpaceFilled } from '@universe-design/icons-react';
import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.content}>
      <div className={styles.frame2147229951}>
        <div className={styles.frame2053140079}>
          <SpaceFilled className={styles.iconSpaceFilled} />
        </div>
        <p className={styles.title}>Docs</p>
      </div>
      <div className={styles.group2147229844}>
        <img
          src="../image/mqgd6f3w-jpfnynu.png"
          className={styles.unsplashCkh9F7Wjn9U}
        />
        <p className={styles.aSecondLevelSubpa}>weekly report</p>
        <p className={styles.aSecondLevelSubpa2}>2026 Q3</p>
      </div>
      <div className={styles.frame2147229952}>
        <p className={styles.popoverDescription}>Overall Status: On track</p>
        <div className={styles.rectangle279337088} />
        <div className={styles.rectangle279337090} />
        <div className={styles.rectangle279337089} />
      </div>
    </div>
  );
}

export default Component;
