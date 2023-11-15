import React, { useState } from 'react';
import './App.css'
import { debugData } from "../utils/debugData";
import { useNuiEvent } from '../hooks/useNuiEvent';
import uiStore from '../stores/uis';
import { ConfigProvider, theme } from 'antd';
import { renderElements } from '../utils/renderElement';

debugData([
  {
    action: 'setVisible',
    data: true,
  }
])

const App: React.FC = () => {
  const [currentUI, setCurrentUI] = useState<string | null>(null);
  const [curUIMakeup, setCurUIMakeup] = useState<any>({});

  useNuiEvent<any>("loadUI", (data) => {
    uiStore.dispatch({
      type: "ADD_TO_UI_LIST",
      payload: data
    });
  });

  useNuiEvent<{ active: boolean; id: string; }>("setActive", (data) => {
    if (data.active) {
      const curState = uiStore.getState();
      const currentKeys = Object.keys(curState.uiList);

      if (currentKeys.includes(data.id)) {
        setCurrentUI(data.id);
        setCurUIMakeup((curState.uiList as any)[data.id]);

        uiStore.dispatch({
          type: "SET_CURRENTLY_DISPLAYING",
          payload: data.id
        });
      } else {
        console.error(`UI with name ${data.id} has not been loaded yet!`);
      }
    } else {
      setCurrentUI(null);
      setCurUIMakeup({});

      uiStore.dispatch({
        type: "SET_CURRENTLY_DISPLAYING",
        payload: null
      });
    }
  });

  useNuiEvent<any>("updateUiById", (data) => {
    uiStore.dispatch({
      type: "UPDATE_UI_BY_ID",
      payload: data
    });

    if (currentUI == data.name) {
      setCurUIMakeup((uiStore.getState().uiList as any)[data.name]);
    }
  });

  useNuiEvent<any>("updateChildren", (data) => {
    uiStore.dispatch({
      type: "UPDATE_UI_CHILDREN_BY_ID",
      payload: data
    });

    if (currentUI == data.name) {
      setCurUIMakeup((uiStore.getState().uiList as any)[data.name]);
    }
  });

  return (
    <div className="nui-wrapper">
      {currentUI && (
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm // todo: make this configurable by the creator?
          }}
        >
          {renderElements([curUIMakeup], currentUI)}
        </ConfigProvider>
      )}
    </div>
  );
}

export default App;
