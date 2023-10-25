import styles from '../styles/Layout.module.css';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-blue-400">
      <div className="mx-auto mt-10 bg-slate-50 rounded-md w-3/5 h-3/4 grid lg:grid-cols-2 overflow-hidden">
        <div className={styles.imgStyle} style={{maxHeight: "100%"}}>
          <div className={styles.cartoonImg}></div>
          <div className={styles.cloud_one}></div>
          <div className={styles.cloud_two}></div>
        </div>
        <div className="right flex flex-col p-6 overflow-y-auto"> 
          <div className="text-center py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
