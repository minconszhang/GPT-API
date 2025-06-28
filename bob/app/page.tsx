import styles from "../styles/Home.module.css";
import { Header } from "./components/Header";
import { ChatClient } from "./components/ChatClient";
import { ChatProvider } from "./context/ChatProvider";
import { getModelList } from "./api/getModelList";

export const dynamic = "force-dynamic";

export default async function Page() {
  const modelsName = await getModelList();

  return (
    <div className={styles.appContainer}>
      <ChatProvider>
        <Header modelList={modelsName} />
        <ChatClient />
      </ChatProvider>
    </div>
  );
}
