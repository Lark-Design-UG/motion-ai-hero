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
      <div className={styles.frame2147223628}>
        <div className={styles.frame13213161312}>
          <div className={styles.frame1321316131}>
            <div className={styles.ellipse270} />
          </div>
          <p className={styles.siteSetupStaffingAnd}>
            Site setup, staffing, and launch prep are progressing as scheduled. No
            major issues flagged this week.
          </p>
        </div>
        <div className={styles.frame1321316132}>
          <div className={styles.frame13213161313}>
            <div className={styles.ellipse270} />
          </div>
          <img
            src="../image/mqhqg1oa-t4jale1.svg"
            className={styles.frame2147223626}
          />
        </div>
      </div>
    </div>
  );
}

export default Component;
