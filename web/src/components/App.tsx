import React, { useEffect, useState } from 'react';
import './App.css'
import { debugData } from "../utils/debugData";
import { useNuiEvent } from '../hooks/useNuiEvent';
import uiStore from '../stores/uis';
import { ConfigProvider, notification, theme } from 'antd';
import { renderElements } from '../utils/renderElement';
import { fetchNui } from '../utils/fetchNui';
import { NotificationPlacement } from 'antd/es/notification/interface';

interface INotificationEvent {
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  placement?: NotificationPlacement;
  duration?: number;
}

const App: React.FC = () => {
  const [currentUI, setCurrentUI] = useState<string | null>(null);
  const [curUIMakeup, setCurUIMakeup] = useState<IFoactElement | undefined>();
  const [api, contextHolder] = notification.useNotification({
    stack: false,
  });

  useNuiEvent<ILoadUIData>("loadUI", (data) => {
    uiStore.dispatch({
      type: "ADD_TO_UI_LIST",
      payload: data
    });

    if (data.name == currentUI) { // in case we're restarting the UI, we need to update the makeup
      setCurUIMakeup(uiStore.getState().uiList[data.name]);
    }
  });

  useNuiEvent<{ active: boolean; id: string; }>("setActive", (data) => {
    if (data.active) {
      const curState = uiStore.getState();
      const currentKeys = Object.keys(curState.uiList);

      if (currentKeys.includes(data.id)) {
        setCurrentUI(data.id);
        setCurUIMakeup(curState.uiList[data.id]);

        uiStore.dispatch({
          type: "SET_CURRENTLY_DISPLAYING",
          payload: data.id
        });
      } else {
        console.error(`UI with name ${data.id} has not been loaded yet!`);
      }
    } else {
      setCurrentUI(null);
      setCurUIMakeup(undefined);

      uiStore.dispatch({
        type: "SET_CURRENTLY_DISPLAYING",
        payload: null
      });
    }
  });

  useNuiEvent<IUpdatePropertiesEvent>("updateUiById", (data) => {
    uiStore.dispatch({
      type: "UPDATE_UI_BY_ID",
      payload: data
    });

    if (currentUI == data.name) {
      setCurUIMakeup(uiStore.getState().uiList[data.name]);
    }
  });

  useNuiEvent<IUpdateChildrenEvent>("updateChildren", (data) => {
    uiStore.dispatch({
      type: "UPDATE_UI_CHILDREN_BY_ID",
      payload: data
    });

    if (currentUI == data.name) {
      setCurUIMakeup(uiStore.getState().uiList[data.name]);
    }
  });

  useNuiEvent<INotificationEvent>("notification", (data) => {
    api[data.type]({
      message: data.title,
      description: data.message,
      duration: data.duration || 5,
      placement: data.placement || "topRight"
    });
  });

  useNuiEvent("clearNotifications", () => {
    notification.destroy();
  })

  useEffect(() => {
    fetchNui("nuiReady", {});
  }, []);

  return (
    <div className="nui-wrapper">
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm
        }}
      >
        {contextHolder}

        {currentUI && (
          renderElements([curUIMakeup], currentUI)
        )}
      </ConfigProvider>
    </div>
  );
}

export default App;
