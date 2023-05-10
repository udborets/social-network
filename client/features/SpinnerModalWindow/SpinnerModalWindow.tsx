import React from 'react';

import styles from './styles.module.scss';

const SpinnerModalWindow = () => {
  return (
    <div className={`fixed w-screen h-screen left-0 top-0 grid place-items-center z-[10] bg-[#00000086]`}>
      <div className={`${styles.spinner}`} />
    </div>
  )
}

export default SpinnerModalWindow