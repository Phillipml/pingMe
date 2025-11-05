import { store } from "@/lib/store";
import { Provider } from "react-redux";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default AppProvider;
