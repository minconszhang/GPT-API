import styles from "../styles/Home.module.css";
import { Header } from "./components/Header";
import { ChatClient } from "./components/ChatClient";
import { ChatProvider } from "./context/ChatProvider";

export default async function Page() {
  return (
    <div className={styles.appContainer}>
      <ChatProvider>
        <Header />
        <ChatClient />
      </ChatProvider>
    </div>
  );
}
